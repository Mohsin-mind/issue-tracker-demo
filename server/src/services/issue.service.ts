import { Op } from 'sequelize';
import {
  Issue,
  Project,
  BoardColumn,
  User,
  Label,
  Comment,
  ProjectMember,
  IssueLabel,
  Epic,
  sequelize,
} from '../models';
import { AppError } from '../utils/app-error.util';
import { HTTP_STATUS, IssuePriority, IssueType } from '../constants/status.constants';
import { API_MESSAGES } from '../constants/messages.constants';

export interface CreateIssueDto {
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  epicId?: string | null;
  assigneeId?: string | null;
  reporterId: string;
  labelIds?: string[];
  dueDate?: string | null;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string | null;
  type?: IssueType;
  priority?: IssuePriority;
  columnId?: string;
  epicId?: string | null;
  assigneeId?: string | null;
  labelIds?: string[];
  dueDate?: string | null;
  position?: number;
}

export interface IssueFilterDto {
  projectId?: string;
  columnId?: string;
  search?: string;
  type?: string;
  priority?: string;
  assigneeId?: string;
  epicId?: string;
  labelId?: string;
}

export class IssueService {
  /**
   * Search and filter issues across projects or specific project
   */
  static async getAllIssues(filters: IssueFilterDto) {
    const where: any = {};
    const include: any[] = [
      {
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'key'],
      },
      {
        model: BoardColumn,
        as: 'column',
        attributes: ['id', 'name', 'position'],
      },
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
    ];

    if (filters.projectId) {
      where.project_id = filters.projectId;
    }

    if (filters.columnId) {
      where.column_id = filters.columnId;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.assigneeId) {
      if (filters.assigneeId === 'unassigned') {
        where.assignee_id = { [Op.is]: null };
      } else {
        where.assignee_id = filters.assigneeId;
      }
    }

    if (filters.epicId) {
      if (filters.epicId === 'none') {
        where.epic_id = { [Op.is]: null };
      } else {
        where.epic_id = filters.epicId;
      }
    }

    if (filters.search) {
      const searchTrimmed = filters.search.trim();
      const numMatch = searchTrimmed.match(/\d+$/);
      const searchNum = numMatch ? parseInt(numMatch[0], 10) : null;

      where[Op.or] = [
        { title: { [Op.iLike]: `%${searchTrimmed}%` } },
        ...(searchNum !== null ? [{ issue_number: searchNum }] : []),
      ];
    }

    if (filters.labelId) {
      include.push({
        model: Label,
        as: 'filter_label',
        attributes: [],
        where: { id: filters.labelId },
        through: { attributes: [] },
      });
    }

    const issues = await Issue.findAll({
      where,
      include,
      order: [
        ['column_id', 'ASC'],
        ['position', 'ASC'],
      ],
    });

    return issues.map((iss) => {
      const plain = iss.get({ plain: true }) as any;
      return {
        ...plain,
        issue_key: plain.project ? `${plain.project.key}-${plain.issue_number}` : undefined,
        comments_count: plain.comments?.length || 0,
      };
    });
  }

  /**
   * Create a new issue with atomic issue_number generation
   */
  static async createIssue(data: CreateIssueDto) {
    const project = await Project.findByPk(data.projectId);
    if (!project) {
      throw new AppError(API_MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'PROJECT_NOT_FOUND');
    }

    const column = await BoardColumn.findOne({
      where: { id: data.columnId, project_id: data.projectId },
    });
    if (!column) {
      throw new AppError(
        'Column does not belong to the selected project',
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_COLUMN'
      );
    }

    // Verify Assignee is project member if provided
    if (data.assigneeId) {
      let isMember = await ProjectMember.findOne({
        where: { project_id: data.projectId, user_id: data.assigneeId },
      });
      if (!isMember) {
        const totalMembers = await ProjectMember.count({ where: { project_id: data.projectId } });
        if (totalMembers === 0) {
          const userExists = await User.findByPk(data.assigneeId);
          if (userExists) {
            await ProjectMember.create({ project_id: data.projectId, user_id: data.assigneeId });
            isMember = true as any;
          }
        }
      }
      if (!isMember) {
        throw new AppError(
          API_MESSAGES.ISSUE.INVALID_ASSIGNEE,
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_ASSIGNEE'
        );
      }
    }

    // Verify Epic exists in project if provided
    if (data.epicId) {
      const epic = await Epic.findOne({
        where: { id: data.epicId, project_id: data.projectId },
      });
      if (!epic) {
        throw new AppError(
          'Selected epic does not belong to this project',
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_EPIC'
        );
      }
    }

    const transaction = await sequelize.transaction();

    try {
      // Find max issue_number in project within transaction
      const maxIssue = await Issue.findOne({
        where: { project_id: data.projectId },
        order: [['issue_number', 'DESC']],
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const nextIssueNumber = maxIssue ? maxIssue.issue_number + 1 : 1;

      // Find max position in column to append
      const maxPosIssue = await Issue.findOne({
        where: { column_id: data.columnId },
        order: [['position', 'DESC']],
        transaction,
      });
      const nextPosition = maxPosIssue ? maxPosIssue.position + 1000 : 1000;

      const issue = await Issue.create(
        {
          project_id: data.projectId,
          column_id: data.columnId,
          issue_number: nextIssueNumber,
          title: data.title,
          description: data.description || null,
          type: data.type || IssueType.TASK,
          priority: data.priority || IssuePriority.MEDIUM,
          epic_id: data.epicId || null,
          assignee_id: data.assigneeId || null,
          reporter_id: data.reporterId,
          position: nextPosition,
          due_date: data.dueDate || null,
        },
        { transaction }
      );

      // Attach labels if provided
      if (data.labelIds && data.labelIds.length > 0) {
        await IssueLabel.bulkCreate(
          data.labelIds.map((labelId) => ({
            issue_id: issue.id,
            label_id: labelId,
          })),
          { transaction }
        );
      }

      await transaction.commit();

      return this.getIssueById(issue.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get single issue with full details, comments, and members
   */
  static async getIssueById(issueId: string) {
    const issue = await Issue.findByPk(issueId, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'key'],
        },
        {
          model: BoardColumn,
          as: 'column',
          attributes: ['id', 'name', 'position'],
        },
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
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'email', 'avatar_color'],
            },
          ],
        },
        {
          model: Epic,
          as: 'epic',
          attributes: ['id', 'name', 'color', 'status'],
        },
      ],
      order: [[{ model: Comment, as: 'comments' }, 'created_at', 'ASC']],
    });

    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    const plain = issue.get({ plain: true }) as any;
    return {
      ...plain,
      issue_key: plain.project ? `${plain.project.key}-${plain.issue_number}` : undefined,
      comments_count: plain.comments?.length || 0,
    };
  }

  /**
   * Update issue fields
   */
  static async updateIssue(issueId: string, data: UpdateIssueDto) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    // If changing assignee, verify membership in project
    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      let isMember = await ProjectMember.findOne({
        where: { project_id: issue.project_id, user_id: data.assigneeId },
      });
      if (!isMember) {
        const totalMembers = await ProjectMember.count({ where: { project_id: issue.project_id } });
        if (totalMembers === 0) {
          const userExists = await User.findByPk(data.assigneeId);
          if (userExists) {
            await ProjectMember.create({ project_id: issue.project_id, user_id: data.assigneeId });
            isMember = true as any;
          }
        }
      }
      if (!isMember) {
        throw new AppError(
          API_MESSAGES.ISSUE.INVALID_ASSIGNEE,
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_ASSIGNEE'
        );
      }
    }

    // Verify Epic if provided
    if (data.epicId !== undefined && data.epicId !== null) {
      const epic = await Epic.findOne({
        where: { id: data.epicId, project_id: issue.project_id },
      });
      if (!epic) {
        throw new AppError(
          'Selected epic does not belong to this project',
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_EPIC'
        );
      }
    }

    const transaction = await sequelize.transaction();

    try {
      if (data.title !== undefined) issue.title = data.title;
      if (data.description !== undefined) issue.description = data.description;
      if (data.type !== undefined) issue.type = data.type;
      if (data.priority !== undefined) issue.priority = data.priority;
      if (data.columnId !== undefined) issue.column_id = data.columnId;
      if (data.epicId !== undefined) issue.epic_id = data.epicId;
      if (data.assigneeId !== undefined) issue.assignee_id = data.assigneeId;
      if (data.dueDate !== undefined) issue.due_date = data.dueDate;
      if (data.position !== undefined) issue.position = data.position;

      await issue.save({ transaction });

      // Update labels if provided
      if (data.labelIds !== undefined) {
        await IssueLabel.destroy({ where: { issue_id: issueId }, transaction });
        if (data.labelIds.length > 0) {
          await IssueLabel.bulkCreate(
            data.labelIds.map((labelId) => ({
              issue_id: issueId,
              label_id: labelId,
            })),
            { transaction }
          );
        }
      }

      await transaction.commit();
      return this.getIssueById(issueId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete an issue
   */
  static async deleteIssue(issueId: string) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    await issue.destroy();
    return { id: issueId };
  }

  /**
   * Move issue to a new column and position (Kanban Drag-and-Drop)
   */
  static async moveIssue(issueId: string, targetColumnId: string, newPosition: number) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    const column = await BoardColumn.findOne({
      where: { id: targetColumnId, project_id: issue.project_id },
    });
    if (!column) {
      throw new AppError(
        'Target column does not exist in this project',
        HTTP_STATUS.NOT_FOUND,
        'TARGET_COLUMN_NOT_FOUND'
      );
    }

    const transaction = await sequelize.transaction();

    try {
      issue.column_id = targetColumnId;
      issue.position = newPosition;
      await issue.save({ transaction });

      await transaction.commit();

      return {
        id: issue.id,
        columnId: issue.column_id,
        position: issue.position,
        updated_at: issue.updated_at,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
