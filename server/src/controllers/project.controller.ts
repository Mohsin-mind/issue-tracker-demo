import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

export class ProjectController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getAllProjects();
      return ApiResponse.success(res, projects);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.body);
      return ApiResponse.created(res, project, API_MESSAGES.PROJECT.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(req.params.projectId);
      return ApiResponse.success(res, project);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.updateProject(req.params.projectId, req.body);
      return ApiResponse.success(res, project, API_MESSAGES.PROJECT.UPDATED);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProjectService.deleteProject(req.params.projectId);
      return ApiResponse.success(res, result, API_MESSAGES.PROJECT.DELETED);
    } catch (error) {
      next(error);
    }
  }

  static async getBoard(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await ProjectService.getProjectBoard(req.params.projectId);
      return ApiResponse.success(res, board);
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await ProjectService.getProjectStatistics(req.params.projectId);
      return ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }
}
