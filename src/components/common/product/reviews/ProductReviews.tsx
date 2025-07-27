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

  // 🎯 평균 평점 계산 함수
  const calculateAverageRating = () => {
  // 기본 조건 체크 - stats가 없거나 total_count가 0인 경우
  if (!stats || !stats.total_count || stats.total_count === 0) {
    return averageRating || 0;
  }
  
  // 각 별점 개수를 안전하게 숫자로 변환 (NaN 방지)
  const fiveStar = Number(stats.five_star) || 0;
  const fourStar = Number(stats.four_star) || 0;
  const threeStar = Number(stats.three_star) || 0;
  const twoStar = Number(stats.two_star) || 0;
  const oneStar = Number(stats.one_star) || 0;
  const totalCount = Number(stats.total_count) || 0;
  
  // 다시 한번 total_count 검증
  if (totalCount === 0) {
    return averageRating || 0;
  }
  
  const totalScore = (fiveStar * 5) + 
                    (fourStar * 4) + 
                    (threeStar * 3) + 
                    (twoStar * 2) + 
                    (oneStar * 1);
  
  const average = totalScore / totalCount;
  
  // NaN 체크 및 유효성 검증
  if (isNaN(average) || !isFinite(average)) {
    return averageRating || 0;
  }
  
  const roundedAverage = Math.round(average * 10) / 10;
  
  // 최종 결과도 한번 더 검증
  return isNaN(roundedAverage) ? (averageRating || 0) : roundedAverage;
};

  // 🎯 퍼센티지 계산 함수 (0으로 나누기 방지)
  const getPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return (count / total) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 🎯 실제 표시할 평균 평점과 총 리뷰 수
  const displayAverageRating = calculateAverageRating();
  const displayTotalReviews = stats?.total_count || totalReviews || 0;

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 헤더 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/50 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            고객 리뷰 ({displayTotalReviews})
          </h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-3xl font-bold">
                {displayAverageRating}
              </span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            {displayTotalReviews}개의 리뷰 기준
          </p>
        </div>
        
        {stats && stats.total_count > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">5점</span>
              <Progress 
                value={getPercentage(stats.five_star, stats.total_count)} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.five_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">4점</span>
              <Progress 
                value={getPercentage(stats.four_star, stats.total_count)} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.four_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">3점</span>
              <Progress 
                value={getPercentage(stats.three_star, stats.total_count)} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.three_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">2점</span>
              <Progress 
                value={getPercentage(stats.two_star, stats.total_count)} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.two_star}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm w-12">1점</span>
              <Progress 
                value={getPercentage(stats.one_star, stats.total_count)} 
                className="flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {stats.one_star}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              아직 평점 분포 데이터가 없습니다
            </p>
          </div>
        )}
      </div>

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