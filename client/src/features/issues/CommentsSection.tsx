import React, { useState } from 'react';
import { Trash2, MessageSquare, Send } from 'lucide-react';
import { useComments, useAddComment, useDeleteComment } from '../../hooks/useComments';
import { useUserStore } from '../../stores/userStore';
import { Avatar, Button, LoadingSkeleton } from '../../components/common';
import { formatRelativeTime } from '../../utils/formatters';

export interface CommentsSectionProps {
  issueId: string;
  projectId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ issueId, projectId }) => {
  const { currentUser } = useUserStore();
  const { data: comments, isLoading } = useComments(issueId);
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();

  const [commentBody, setCommentBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !currentUser) return;

    setError(null);
    try {
      await addCommentMutation.mutateAsync({
        issueId,
        projectId,
        userId: currentUser.id,
        body: commentBody.trim(),
      });
      setCommentBody('');
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId,
        issueId,
        projectId,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="flex flex-col gap-5 pt-4 border-t border-border-subtle">
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-900 tracking-wide">
          Activity & Comments ({comments?.length || 0})
        </h4>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        {currentUser && (
          <Avatar
            name={currentUser.name}
            color={currentUser.avatar_color}
            size="sm"
          />
        )}
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder={`Add a comment as ${currentUser?.name || 'anonymous'}...`}
            rows={2}
            className="w-full bg-slate-50 text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 rounded-xl p-[14px] text-xs resize-none transition-all outline-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send size={13} />}
              disabled={!commentBody.trim() || addCommentMutation.isPending}
              isLoading={addCommentMutation.isPending}
            >
              Comment
            </Button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <LoadingSkeleton height="60px" count={2} />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="flex flex-col gap-3 mt-1">
          {comments.map((comment) => {
            const isAuthor = currentUser?.id === comment.user_id;

            return (
              <div
                key={comment.id}
                className="group p-4 rounded-xl bg-slate-50/90 border border-slate-200 flex gap-[14px] items-start hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Avatar
                  name={comment.user?.name || 'User'}
                  color={comment.user?.avatar_color}
                  size="sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {comment.user?.name || 'Team Member'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>

                    {isAuthor && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteCommentMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition-all cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed break-words whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
          No comments yet. Start the conversation!
        </div>
      )}
    </div>
  );
};
