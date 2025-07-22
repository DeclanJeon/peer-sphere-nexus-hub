// Frontend/src/pages/user-peermall/products/reviews/ProductReviews.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';
import { Review } from './types';

// Mock data for demonstration
const mockReviews: Review[] = [
  {
    id: 'review-1',
    author: '김리뷰',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    rating: 5,
    content: '정말 좋은 상품이에요! 품질도 만족스럽고 배송도 빨랐습니다. 강력 추천합니다!',
    createdAt: '2024-07-20T10:00:00Z',
    images: ['/placeholder-product.png', '/placeholder-product.png'],
    comments: [
      {
        id: 'comment-1-1',
        author: '판매자',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        content: '소중한 리뷰 감사합니다!',
        createdAt: '2024-07-20T11:00:00Z',
      },
    ],
  },
  {
    id: 'review-2',
    author: '박코멘트',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    rating: 4,
    content: '디자인이 예쁘고 마음에 들어요. 다만, 사이즈가 조금 작은 것 같네요.',
    createdAt: '2024-07-19T15:30:00Z',
    comments: [],
  },
  {
    id: 'review-3',
    author: 'CurrentUser', // For testing owner controls
    avatar: 'https://github.com/shadcn.png',
    rating: 5,
    content: '내가 쓴 리뷰. 수정/삭제가 가능해야 합니다.',
    createdAt: '2024-07-21T09:00:00Z',
    comments: [],
  },
];

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export const ProductReviews = ({ productId, averageRating, totalReviews }: ProductReviewsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            상품 리뷰 ({totalReviews})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ReviewForm />
        <ReviewList reviews={mockReviews} />
      </CardContent>
    </Card>
  );
};
