// Frontend/src/pages/user-peermall/products/reviews/ReviewList.tsx
import { Review } from './types';
import { ReviewItem } from './ReviewItem';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  // Assuming current user's ID is 'CurrentUser' for demo
  const currentUserId = 'CurrentUser';

  return (
    <div className="mt-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} isOwner={review.author === currentUserId} />
      ))}
    </div>
  );
};
