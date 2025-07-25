// components/common/community/CommentSection.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Clock, User, Trash2, Edit, Loader2, Send, CornerUpLeft } from 'lucide-react';
import { Comment, UpdateCommentRequest } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

// --- Props 인터페이스 정의 ---
interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  postAuthorUid?: string; // 게시글 작성자의 UID
  onCommentSubmit: (content: string) => Promise<void>;
  onCommentUpdate: (commentId: string, data: UpdateCommentRequest) => Promise<void>;
  onCommentDelete: (commentId: string) => Promise<void>;
}

// --- 메인 댓글 섹션 컴포넌트 ---
const CommentSection = ({ 
  postId, 
  comments, 
  postAuthorUid,
  onCommentSubmit, 
  onCommentUpdate,
  onCommentDelete 
}: CommentSectionProps) => {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // useAuth 훅에서 직접 user_uid를 가져오도록 수정 (더 안정적인 방법)
  const currentUserUid = user?.user_uid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(commentContent);
      setCommentContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">댓글 ({comments.length})</h3>
        </div>
      </CardHeader>
      <CardContent>
        {/* 댓글 목록 */}
        <CommentList 
          comments={comments}
          currentUserUid={currentUserUid}
          postAuthorUid={postAuthorUid}
          onUpdate={onCommentUpdate}
          onDelete={onCommentDelete}
        />
      </CardContent>
      <CardFooter>
        {/* 댓글 입력 폼 */}
        {user ? (
          <form onSubmit={handleSubmit} className="w-full flex items-start gap-4">
            <Avatar>
              {/* [추론] user 객체에 photoURL 속성이 있다고 가정합니다. 없다면 Fallback이 표시됩니다. */}
              <AvatarImage src={user.photoURL} alt={user.name || 'User'} />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="따뜻한 응원의 댓글을 남겨주세요!"
                rows={3}
                className="mb-2"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!commentContent.trim() || isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? '등록 중...' : '댓글 등록'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <p className="w-full text-center text-sm text-muted-foreground py-4">
            댓글을 작성하려면 <a href="/login" className="underline text-primary">로그인</a>이 필요합니다.
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

// --- 댓글 목록 컴포넌트 ---
interface CommentListProps {
  comments: Comment[];
  currentUserUid?: string;
  postAuthorUid?: string;
  onUpdate: (commentId: string, data: UpdateCommentRequest) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentList = ({ comments, currentUserUid, postAuthorUid, onUpdate, onDelete }: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 border-dashed border-2 rounded-lg">
        <p className="text-muted-foreground">아직 댓글이 없습니다.</p>
        <p className="text-sm text-muted-foreground/80">첫 번째 댓글의 주인공이 되어보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={currentUserUid === comment.user_uid}
          isPostAuthor={postAuthorUid === comment.user_uid}
          onUpdate={onUpdate}
          onDelete={() => onDelete(comment.id.toString())}
        />
      ))}
    </div>
  );
};

// --- 개별 댓글 아이템 컴포넌트 ---
interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  isPostAuthor: boolean;
  onUpdate: (commentId: string, data: UpdateCommentRequest) => Promise<void>;
  onDelete: () => Promise<void>;
}

const CommentItem = ({ comment, isOwner, isPostAuthor, onUpdate, onDelete }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async () => {
    if (!editedContent.trim() || editedContent === comment.content) {
      setIsEditing(false);
      return;
    }
    setIsProcessing(true);
    try {
      await onUpdate(comment.id.toString(), { content: editedContent });
      setIsEditing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setIsProcessing(true);
      try {
        await onDelete();
      } finally {
        // 컴포넌트가 사라지므로 상태 리셋은 불필요
      }
    }
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar>
         {/* [추론] comment 객체에 author_avatar_url 속성이 있다고 가정합니다. */}
        <AvatarImage src={comment?.author_avatar_url} alt={comment.author_name} />
        <AvatarFallback>{comment.author_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author_name}</span>
            {isPostAuthor && <Badge variant="secondary">작성자</Badge>}
          </div>
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={handleDelete} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
        </p>
        
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              className="mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditedContent(comment.content); }}>취소</Button>
              <Button size="sm" onClick={handleUpdate} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                수정 완료
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;