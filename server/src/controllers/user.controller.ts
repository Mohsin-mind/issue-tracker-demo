import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../helpers/api-response.helper';

export class UserController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      return ApiResponse.success(res, users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.userId);
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}
