import {
  Project,
  BoardColumn,
  Issue,
  User,
  Label,
  Comment,
  ProjectMember,
  Epic,
  sequelize,
} from '../models';
import { AppError } from '../utils/app-error.util';
import { HTTP_STATUS, DEFAULT_COLUMNS } from '../constants/status.constants';
import { API_MESSAGES } from '../constants/messages.constants';

export class ProjectService {
  /**
   * List all projects with aggregated issue and member counts
   */
  static async getAllProjects() {
    const projects = await Project.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email', 'avatar_color'],
          through: { attributes: [] },
        },
        {
          model: Issue,
          as: 'issues',
          attributes: ['id'],
        },
      ],
    });

    return projects.map((p) => {
      const plain = p.get({ plain: true }) as any;
      return {
        id: plain.id,
        name: plain.name,
        key: plain.key,
        description: plain.description,
        members_count: plain.members?.length || 0,
        issues_count: plain.issues?.length || 0,
        members: plain.members,
        created_at: plain.created_at,
        updated_at: plain.updated_at,
      };
    });
  }

  /**
   * Create a new project and initialize default Kanban columns
   */
  static async createProject(data: {
    name: string;
    key: string;
    description?: string;
    memberIds?: string[];
  }) {
    const existing = await Project.findOne({ where: { key: data.key.toUpperCase() } });
    if (existing) {
      throw new AppError(
        API_MESSAGES.PROJECT.KEY_EXISTS,
        HTTP_STATUS.CONFLICT,
        'DUPLICATE_PROJECT_KEY'
      );
    }

    const transaction = await sequelize.transaction();

    try {
      const project = await Project.create(
        {
          name: data.name,
          key: data.key.toUpperCase(),
          description: data.description,
        },
        { transaction }
      );

      // Create standard default columns
      await BoardColumn.bulkCreate(
        DEFAULT_COLUMNS.map((col) => ({
          project_id: project.id,
          name: col.name,
          position: col.position,
        })),
        { transaction }
      );

      // Assign members: if provided use them; otherwise default to all existing users
      let memberIds = data.memberIds;
      if (!memberIds || memberIds.length === 0) {
        const allUsers = await User.findAll({ attributes: ['id'], transaction });
        memberIds = allUsers.map((u) => u.id);
      }

      if (memberIds && memberIds.length > 0) {
        await ProjectMember.bulkCreate(
          memberIds.map((userId) => ({
            project_id: project.id,
            user_id: userId,
          })),
          { transaction }
        );
      }

      await transaction.commit();

      return this.getProjectById(project.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get single project by ID with members and columns
   */
  static async getProjectById(projectId: string) {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email', 'avatar_color'],
          through: { attributes: [] },
        },
        {
          model: BoardColumn,
          as: 'columns',
          order: [['position', 'ASC']],
        },
      ],
    });

    if (!project) {
      throw new AppError(
        API_MESSAGES.PROJECT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'PROJECT_NOT_FOUND'
      );
    }

    // Auto-backfill members if project has no members assigned
    const plainProj = project.get({ plain: true }) as any;
    if (!plainProj.members || plainProj.members.length === 0) {
      const allUsers = await User.findAll({ attributes: ['id', 'name', 'email', 'avatar_color'] });
      if (allUsers.length > 0) {
        await ProjectMember.bulkCreate(
          allUsers.map((u) => ({
            project_id: project.id,
            user_id: u.id,
          })),
          { ignoreDuplicates: true }
        );
        (project as any).setDataValue('members', allUsers);
      }
    }

    return project;
  }

  /**
   * Update project metadata and member assignments
   */
  static async updateProject(
    projectId: string,
    data: { name?: string; description?: string; memberIds?: string[] }
  ) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(
        API_MESSAGES.PROJECT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'PROJECT_NOT_FOUND'
      );
    }

    const transaction = await sequelize.transaction();
    try {
      if (data.name !== undefined) project.name = data.name;
      if (data.description !== undefined) project.description = data.description;
      await project.save({ transaction });

      if (data.memberIds !== undefined) {
        // Reconcile members
        await ProjectMember.destroy({ where: { project_id: projectId }, transaction });
        if (data.memberIds.length > 0) {
          await ProjectMember.bulkCreate(
            data.memberIds.map((userId) => ({
              project_id: projectId,
              user_id: userId,
            })),
            { transaction }
          );
        }
      }

      await transaction.commit();
      return this.getProjectById(projectId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete a project and cascade its columns, issues, labels
   */
  static async deleteProject(projectId: string) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(
        API_MESSAGES.PROJECT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'PROJECT_NOT_FOUND'
      );
    }

    await project.destroy();
    return { id: projectId };
  }

  /**
   * Get full board data with columns and issues ordered by position
   */
  static async getProjectBoard(projectId: string) {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email', 'avatar_color'],
          through: { attributes: [] },
        },
        {
          model: BoardColumn,
          as: 'columns',
          include: [
            {
              model: Issue,
              as: 'issues',
              include: [
                {
                  model: User,
                  as: 'assignee',
                  attributes: ['id', 'name', 'email', 'avatar_color'],
                },
                {
                  model: User,
                  as: 'reporter',
                  attributes: ['id', 'name', 'email', 'avatar_color'],
                },
                {
                  model: Label,
                  as: 'labels',
                  attributes: ['id', 'name', 'color'],
                  through: { attributes: [] },
                },
                {
                  model: Comment,
                  as: 'comments',
                  attributes: ['id'],
                },
                {
                  model: Epic,
                  as: 'epic',
                  attributes: ['id', 'name', 'color', 'status'],
                },
              ],
            },
          ],
        },
        {
          model: Epic,
          as: 'epics',
          attributes: ['id', 'name', 'description', 'color', 'status'],
        },
      ],
      order: [
        [{ model: BoardColumn, as: 'columns' }, 'position', 'ASC'],
        [{ model: BoardColumn, as: 'columns' }, { model: Issue, as: 'issues' }, 'position', 'ASC'],
      ],
    });

    if (!project) {
      throw new AppError(
        API_MESSAGES.PROJECT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'PROJECT_NOT_FOUND'
      );
    }

    const plain = project.get({ plain: true }) as any;

    // Auto-backfill members if project has no members assigned
    if (!plain.members || plain.members.length === 0) {
      const allUsers = await User.findAll({ attributes: ['id', 'name', 'email', 'avatar_color'] });
      if (allUsers.length > 0) {
        await ProjectMember.bulkCreate(
          allUsers.map((u) => ({
            project_id: project.id,
            user_id: u.id,
          })),
          { ignoreDuplicates: true }
        );
        plain.members = allUsers.map((u) => u.get({ plain: true }));
      }
    }

    // Format issues with comment count and issue_key
    const columnsWithFormattedIssues = plain.columns.map((col: any) => ({
      ...col,
      issues: col.issues.map((iss: any) => ({
        ...iss,
        issue_key: `${plain.key}-${iss.issue_number}`,
        comments_count: iss.comments?.length || 0,
      })),
    }));

    return {
      ...plain,
      columns: columnsWithFormattedIssues,
    };
  }

  /**
   * Calculate project statistics
   */
  static async getProjectStatistics(projectId: string) {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: BoardColumn,
          as: 'columns',
          include: [{ model: Issue, as: 'issues', attributes: ['id'] }],
        },
      ],
    });

    if (!project) {
      throw new AppError(
        API_MESSAGES.PROJECT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'PROJECT_NOT_FOUND'
      );
    }

    const plain = project.get({ plain: true }) as any;
    let totalIssues = 0;
    let openIssues = 0;
    let inProgressIssues = 0;
    let completedIssues = 0;

    for (const col of plain.columns) {
      const count = col.issues?.length || 0;
      totalIssues += count;

      const colName = col.name.toLowerCase();
      if (colName.includes('backlog') || colName.includes('to do') || colName.includes('todo')) {
        openIssues += count;
      } else if (colName.includes('progress') || colName.includes('review')) {
        inProgressIssues += count;
      } else if (colName.includes('done') || colName.includes('completed')) {
        completedIssues += count;
      } else {
        openIssues += count;
      }
    }

    return {
      projectId,
      projectKey: plain.key,
      projectName: plain.name,
      totalIssues,
      openIssues,
      inProgressIssues,
      completedIssues,
    };
  }
}
