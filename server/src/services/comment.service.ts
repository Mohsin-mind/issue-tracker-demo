import { Comment, Issue, User } from '../models';
import { AppError } from '../utils/app-error.util';
import { HTTP_STATUS } from '../constants/status.constants';
import { API_MESSAGES } from '../constants/messages.constants';

export class CommentService {
  /**
   * Get all comments for an issue chronologically
   */
  static async getCommentsByIssueId(issueId: string) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    return Comment.findAll({
      where: { issue_id: issueId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar_color'],
        },
      ],
      order: [['created_at', 'ASC']],
    });
  }

  /**
   * Add comment to an issue
   */
  static async createComment(issueId: string, userId: string, body: string) {
    const issue = await Issue.findByPk(issueId);
    if (!issue) {
      throw new AppError(API_MESSAGES.ISSUE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'ISSUE_NOT_FOUND');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }

    const comment = await Comment.create({
      issue_id: issueId,
      user_id: userId,
      body,
    });

    return Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar_color'],
        },
      ],
    });
  }

  /**
   * Delete a comment
   */
  static async deleteComment(commentId: string) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError(
        API_MESSAGES.COMMENT.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'COMMENT_NOT_FOUND'
      );
    }

    await comment.destroy();
    return { id: commentId };
  }
}
