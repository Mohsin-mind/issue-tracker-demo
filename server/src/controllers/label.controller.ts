import { Request, Response, NextFunction } from 'express';
import { LabelService } from '../services/label.service';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

export class LabelController {
  static async getByProject(req: Request, res: Response, next: NextFunction) {
    try {
      const labels = await LabelService.getLabelsByProject(req.query.projectId as string);
      return ApiResponse.success(res, labels);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, name, color } = req.body;
      const label = await LabelService.createLabel(projectId, name, color);
      return ApiResponse.created(res, label, API_MESSAGES.LABEL.CREATED);
    } catch (error) {
      next(error);
    }
  }
}
