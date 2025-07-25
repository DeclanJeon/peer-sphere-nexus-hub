import CommentItem from "./CommentItem";
import { Comment } from "@/types/comment";
import { UpdateCommentRequest } from "@/types/comment";

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

export default CommentList;