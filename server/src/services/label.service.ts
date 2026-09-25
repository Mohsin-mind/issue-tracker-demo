import { Label, Project } from '../models';
import { AppError } from '../utils/app-error.util';
import { HTTP_STATUS } from '../constants/status.constants';
import { API_MESSAGES } from '../constants/messages.constants';

export class LabelService {
  /**
   * Get all labels scoped to a project
   */
  static async getLabelsByProject(projectId: string) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(API_MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'PROJECT_NOT_FOUND');
    }

    return Label.findAll({
      where: { project_id: projectId },
      order: [['name', 'ASC']],
    });
  }

  /**
   * Create a new label for a project
   */
  static async createLabel(projectId: string, name: string, color: string) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(API_MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'PROJECT_NOT_FOUND');
    }

    const existing = await Label.findOne({
      where: { project_id: projectId, name: name.trim() },
    });

    if (existing) {
      throw new AppError(
        API_MESSAGES.LABEL.ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
        'DUPLICATE_LABEL'
      );
    }

    return Label.create({
      project_id: projectId,
      name: name.trim(),
      color: color.trim(),
    });
  }
}
