import { Request, Response, NextFunction } from 'express';
import { IssueService } from '../services/issue.service';
import { ApiResponse } from '../helpers/api-response.helper';
import { API_MESSAGES } from '../constants/messages.constants';

export class IssueController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const issues = await IssueService.getAllIssues(req.query);
      return ApiResponse.success(res, issues);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueService.createIssue(req.body);
      return ApiResponse.created(res, issue, API_MESSAGES.ISSUE.CREATED);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueService.getIssueById(req.params.issueId);
      return ApiResponse.success(res, issue);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const issue = await IssueService.updateIssue(req.params.issueId, req.body);
      return ApiResponse.success(res, issue, API_MESSAGES.ISSUE.UPDATED);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await IssueService.deleteIssue(req.params.issueId);
      return ApiResponse.success(res, result, API_MESSAGES.ISSUE.DELETED);
    } catch (error) {
      next(error);
    }
  }

  static async move(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetColumnId, newPosition } = req.body;
      const result = await IssueService.moveIssue(
        req.params.issueId,
        targetColumnId,
        newPosition
      );
      return ApiResponse.success(res, result, API_MESSAGES.ISSUE.MOVED);
    } catch (error) {
      next(error);
    }
  }
}
