// components/common/community/CommentSection.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Clock, User, Trash2 } from 'lucide-react';
import { Comment } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentSubmit: (content: string) => Promise<void>;
  onCommentDelete: (commentId: string) => Promise<void>;
}

const CommentSection = ({ postId, comments, onCommentSubmit, onCommentDelete }: CommentSectionProps) => {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userDatas = user ? Object.values(user) : [];
  const userUid = userDatas.length > 1 ? Object.values(userDatas[1])[0] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(commentContent);
      setCommentContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">댓글 {comments.length}개</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              rows={3}
              className="mb-3"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={!commentContent.trim() || isSubmitting}
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </Button>
          </form>
        ) : (
          <p className="mb-6 text-sm text-muted-foreground">
            댓글을 작성하려면 로그인해주세요.
          </p>
        )}

        {/* Comments List */}
        <CommentList 
          comments={comments}
          currentUserUid={userUid}
          onDelete={onCommentDelete}
        />
      </CardContent>
    </Card>
  );
};

// 댓글 목록 컴포넌트
interface CommentListProps {
  comments: Comment[];
  currentUserUid: string | null;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentList = ({ comments, currentUserUid, onDelete }: CommentListProps) => {
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setDeletingCommentId(commentId);
      try {
        await onDelete(commentId);
      } finally {
        setDeletingCommentId(null);
      }
    }
  };

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={currentUserUid === comment.user_uid}
          onDelete={() => handleDelete(comment.id.toString())}
          isDeleting={deletingCommentId === comment.id.toString()}
        />
      ))}
    </div>
  );
};

// 개별 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

const CommentItem = ({ comment, isOwner, onDelete, isDeleting }: CommentItemProps) => {
  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="font-medium text-sm">{comment.author_name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true, 
                locale: ko 
              })}
            </span>
          </div>
        </div>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive"
          >
            {isDeleting ? (
              <span className="text-xs">삭제 중...</span>
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <p className="text-sm">{comment.content}</p>
    </div>
  );
};

export default CommentSection;