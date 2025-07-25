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
import CommentList from './CommentList';

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
              <AvatarImage src={user.photoURL} alt={user.user_name || 'User'} />
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

export default CommentSection;