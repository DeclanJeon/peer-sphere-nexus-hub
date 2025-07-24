// Frontend/src/pages/user-peermall/products/reviews/ReviewComments.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Comment } from './types';
import { CommentForm } from './CommentForm';

interface ReviewCommentsProps {
  comments: Comment[];
}

export const ReviewComments = ({ comments: initialComments }: ReviewCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'CurrentUser', // Replace with actual user
      avatar: 'https://github.com/shadcn.png',
      content,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <div className="mt-4">
      <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
        <MessageSquare className="h-4 w-4 mr-2" />
        댓글 {comments.length}개 {showComments ? '숨기기' : '보기'}
      </Button>

      {showComments && (
        <div className="mt-2 pl-4 border-l-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 mt-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
          <CommentForm onSubmit={handleAddComment} />
        </div>
      )}
    </div>
  );
};