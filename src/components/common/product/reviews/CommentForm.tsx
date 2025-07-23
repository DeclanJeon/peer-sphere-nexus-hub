// Frontend/src/pages/user-peermall/products/reviews/CommentForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export const CommentForm = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-1"
        rows={1}
      />
      <Button type="submit" size="icon" variant="ghost">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
