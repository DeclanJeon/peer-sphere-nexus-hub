// Frontend/src/pages/user-peermall/products/reviews/ReviewItem.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Star, MoreVertical, Edit, Trash2, Heart, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Review } from './types';
import { ReviewComments } from './ReviewComments';

interface ReviewItemProps {
  review: Review;
  isOwner: boolean; // Assuming we can check if the current user is the author
}

export const ReviewItem = ({ review, isOwner }: ReviewItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: API 호출
  };

  const handleReport = () => {
    toast({
      title: '신고하기',
      description: '신고가 접수되었습니다. 검토 후 조치하겠습니다.'
    });
  };

  return (
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={review.avatar} alt={review.author} />
          <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{review.author}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1">{review.rating}.0</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">{review.content}</p>
          {review.images && review.images.length > 0 && (
            <div className="mt-2 flex gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`review image ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-md"
                />
              ))}
            </div>
          )}

          {/* 리뷰 액션 버튼 */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Button 
              variant={isLiked ? "default" : "ghost"} 
              size="sm"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              좋아요 {review.helpful || 0}
            </Button>
            
            {!isOwner && (
              <Button variant="ghost" size="sm" onClick={handleReport}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                신고하기
              </Button>
            )}
          </div>

          <ReviewComments comments={review.comments} />
        </div>
      </div>
    </div>
  );
};
