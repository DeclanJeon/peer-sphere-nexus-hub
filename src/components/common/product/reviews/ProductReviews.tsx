// Frontend/src/components/common/product/reviews/ProductReviews.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { reviewApi } from '@/services/review.api';
import { Review, ReviewStats } from '@/types/review';

import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { ReviewItem } from './ReviewItem';
import ReviewForm from './ReviewForm';

// 메인 ProductReviews 컴포넌트
interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export const ProductReviews = ({ 
  productId, 
  averageRating, 
  totalReviews 
}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'helpful'>('latest');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId, sortBy, refreshKey]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getReviews({
        productId,
        sortBy,
        limit: 20
      });

      setReviews(data);
    } catch (error) {
      console.error('리뷰 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await reviewApi.getReviewStats(productId);
      setStats(data);
    } catch (error) {
      console.error('리뷰 통계 조회 실패:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 헤더 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/50 rounded-lg">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              고객 리뷰 ({totalReviews})
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold">{averageRating}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              {totalReviews}개의 리뷰 기준
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">5점</span>
              <Progress value={(stats.five_star / stats.total_count) * 100} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.five_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">4점</span>
              <Progress value={(stats.four_star / stats.total_count) * 100} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.four_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">3점</span>
              <Progress value={(stats.three_star / stats.total_count) * 100} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.three_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">2점</span>
              <Progress value={(stats.two_star / stats.total_count) * 100} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.two_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">1점</span>
              <Progress value={(stats.one_star / stats.total_count) * 100} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.one_star}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">리뷰 작성하기</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm productId={productId} onSuccess={handleRefresh} />
        </CardContent>
      </Card>

      {/* 리뷰 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">모든 리뷰</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="latest">최신순</option>
                <option value="rating">별점순</option>
                <option value="helpful">도움순</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewItem 
                  key={review.id} 
                  review={review} 
                  onUpdate={handleRefresh}
                  onDelete={handleRefresh}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">아직 리뷰가 없습니다</h3>
              <p className="text-muted-foreground">
                첫 번째 리뷰를 작성해보세요!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};