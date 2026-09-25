import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

export class CommentController {
  static async getByIssueId(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await CommentService.getCommentsByIssueId(req.params.issueId);
      return ApiResponse.success(res, comments);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, body } = req.body;
      const comment = await CommentService.createComment(
        req.params.issueId,
        userId,
        body
      );
      return ApiResponse.created(res, comment, API_MESSAGES.COMMENT.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CommentService.deleteComment(req.params.commentId);
      return ApiResponse.success(res, result, API_MESSAGES.COMMENT.DELETED);
    } catch (error) {
      next(error);
    }
  }
}
