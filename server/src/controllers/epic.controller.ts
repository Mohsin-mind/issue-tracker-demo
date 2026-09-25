import { Request, Response, NextFunction } from 'express';
import { EpicService } from '../services/epic.service';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

export class EpicController {
  static async getByProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = (req.params.projectId || req.query.projectId) as string;
      const epics = await EpicService.getEpicsByProject(projectId);
      return ApiResponse.success(res, epics);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { epicId } = req.params;
      const epic = await EpicService.getEpicById(epicId);
      return ApiResponse.success(res, epic);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId || req.body.projectId;
      const epic = await EpicService.createEpic(projectId, req.body);
      return ApiResponse.created(res, epic, API_MESSAGES.EPIC.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { epicId } = req.params;
      const epic = await EpicService.updateEpic(epicId, req.body);
      return ApiResponse.success(res, epic, API_MESSAGES.EPIC.UPDATED);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { epicId } = req.params;
      const result = await EpicService.deleteEpic(epicId);
      return ApiResponse.success(res, result, API_MESSAGES.EPIC.DELETED);
    } catch (error) {
      next(error);
    }
  }
}
