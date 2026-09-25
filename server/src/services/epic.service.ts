import { Epic, Project, Issue, BoardColumn, User } from '../models';
import { AppError } from '../utils/app-error.util';
import { API_MESSAGES } from '../constants/messages.constants';
import { HTTP_STATUS, EpicStatus } from '../constants/status.constants';

export interface CreateEpicDto {
  name: string;
  description?: string | null;
  color?: string;
  status?: EpicStatus;
}

export interface UpdateEpicDto {
  name?: string;
  description?: string | null;
  color?: string;
  status?: EpicStatus;
}

export class EpicService {
  /**
   * List all epics for a project with aggregated completion metrics
   */
  static async getEpicsByProject(projectId: string) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(API_MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'PROJECT_NOT_FOUND');
    }

    const epics = await Epic.findAll({
      where: { project_id: projectId },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: Issue,
          as: 'issues',
          attributes: ['id', 'title', 'column_id', 'priority', 'issue_number'],
          include: [
            {
              model: BoardColumn,
              as: 'column',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return epics.map((epic) => {
      const plain = epic.get({ plain: true }) as any;
      const issues = plain.issues || [];
      const totalIssues = issues.length;
      const completedIssues = issues.filter(
        (iss: any) => iss.column?.name?.toLowerCase() === 'done'
      ).length;
      const progressPercent = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

      return {
        id: plain.id,
        project_id: plain.project_id,
        name: plain.name,
        description: plain.description,
        color: plain.color,
        status: plain.status,
        issues_count: totalIssues,
        completed_count: completedIssues,
        progress_percent: progressPercent,
        issues: plain.issues,
        created_at: plain.created_at,
        updated_at: plain.updated_at,
      };
    });
  }

  /**
   * Get single epic by ID with child issues
   */
  static async getEpicById(epicId: string) {
    const epic = await Epic.findByPk(epicId, {
      include: [
        {
          model: Issue,
          as: 'issues',
          include: [
            {
              model: BoardColumn,
              as: 'column',
              attributes: ['id', 'name'],
            },
            {
              model: User,
              as: 'assignee',
              attributes: ['id', 'name', 'avatar_color'],
            },
          ],
        },
      ],
    });

    if (!epic) {
      throw new AppError(API_MESSAGES.EPIC.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'EPIC_NOT_FOUND');
    }

    const plain = epic.get({ plain: true }) as any;
    const issues = plain.issues || [];
    const totalIssues = issues.length;
    const completedIssues = issues.filter(
      (iss: any) => iss.column?.name?.toLowerCase() === 'done'
    ).length;
    const progressPercent = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    return {
      ...plain,
      issues_count: totalIssues,
      completed_count: completedIssues,
      progress_percent: progressPercent,
    };
  }

  /**
   * Create a new epic for a project
   */
  static async createEpic(projectId: string, data: CreateEpicDto) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(API_MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'PROJECT_NOT_FOUND');
    }

    const epic = await Epic.create({
      project_id: projectId,
      name: data.name,
      description: data.description || null,
      color: data.color || '#8b5cf6',
      status: data.status || EpicStatus.TODO,
    });

    return {
      ...epic.get({ plain: true }),
      issues_count: 0,
      completed_count: 0,
      progress_percent: 0,
      issues: [],
    };
  }

  /**
   * Update epic metadata
   */
  static async updateEpic(epicId: string, data: UpdateEpicDto) {
    const epic = await Epic.findByPk(epicId);
    if (!epic) {
      throw new AppError(API_MESSAGES.EPIC.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'EPIC_NOT_FOUND');
    }

    if (data.name !== undefined) epic.name = data.name;
    if (data.description !== undefined) epic.description = data.description;
    if (data.color !== undefined) epic.color = data.color;
    if (data.status !== undefined) epic.status = data.status;

    await epic.save();
    return this.getEpicById(epicId);
  }

  /**
   * Delete an epic (unlinks child issues via ON DELETE SET NULL)
   */
  static async deleteEpic(epicId: string) {
    const epic = await Epic.findByPk(epicId);
    if (!epic) {
      throw new AppError(API_MESSAGES.EPIC.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'EPIC_NOT_FOUND');
    }

    // Explicitly unassociate child issues as well to guarantee state consistency
    await Issue.update({ epic_id: null }, { where: { epic_id: epicId } });
    await epic.destroy();

    return { id: epicId };
  }
}
