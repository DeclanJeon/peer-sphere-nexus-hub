import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UpdateCommentRequest } from "@/types/comment";
import { Comment } from "@/types/comment";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const currentUserId = user?.user_email;
  
  let extractedId = '';

  if (currentUserId) {
    const atIndex = currentUserId.indexOf('@');
    if (atIndex !== -1) {
      // '@'가 포함되어 있다면 '@' 왼쪽 부분만 추출
      extractedId = currentUserId.substring(0, atIndex);
    } else {
      // '@'가 포함되어 있지 않다면 전체를 아이디로 간주
      extractedId = currentUserId;
    }
  }

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
        <AvatarFallback>{comment.author_name}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.author_name || extractedId}</span>
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

export default CommentItem;