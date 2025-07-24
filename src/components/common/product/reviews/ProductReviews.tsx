// Frontend/src/components/common/product/reviews/ProductReviews.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Image as ImageIcon
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// 타입 정의
interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
  likes?: number;
  isLiked?: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

// Mock 데이터
const mockReviews: Review[] = [
  {
    id: 'review-1',
    author: '김리뷰',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    rating: 5,
    content: '정말 좋은 상품이에요! 품질도 만족스럽고 배송도 빨랐습니다. 강력 추천합니다! 특히 디자인이 세련되고 실용적이어서 매우 만족하고 있어요.',
    createdAt: '2024-07-20T10:00:00Z',
    images: ['/placeholder-product.png', '/placeholder-product.png'],
    likes: 12,
    isLiked: false,
    comments: [
      {
        id: 'comment-1-1',
        author: '판매자',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        content: '소중한 리뷰 감사합니다! 앞으로도 좋은 상품으로 보답하겠습니다.',
        createdAt: '2024-07-20T11:00:00Z',
      },
    ],
  },
  {
    id: 'review-2',
    author: '박코멘트',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    rating: 4,
    content: '디자인이 예쁘고 마음에 들어요. 다만, 사이즈가 조금 작은 것 같네요. 그래도 전반적으로 만족합니다.',
    createdAt: '2024-07-19T15:30:00Z',
    likes: 8,
    isLiked: true,
    comments: [
      {
        id: 'comment-2-1',
        author: '이구매자',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g',
        content: '저도 같은 생각이에요. 사이즈 표를 더 자세히 봤으면 좋았을 것 같아요.',
        createdAt: '2024-07-19T16:00:00Z',
      },
    ],
  },
  {
    id: 'review-3',
    author: 'CurrentUser',
    avatar: 'https://github.com/shadcn.png',
    rating: 5,
    content: '내가 쓴 리뷰입니다. 수정과 삭제가 가능해야 합니다. 상품 품질이 정말 좋네요!',
    createdAt: '2024-07-21T09:00:00Z',
    likes: 3,
    isLiked: false,
    comments: [],
  },
];

// 별점 컴포넌트
const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false 
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readonly?: boolean; 
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// 리뷰 작성 폼 컴포넌트
const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '리뷰를 작성하려면 로그인이 필요합니다.',
        variant: 'destructive'
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: '별점을 선택해주세요',
        description: '상품에 대한 별점을 선택해주세요.',
        variant: 'destructive'
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: '리뷰 내용을 작성해주세요',
        description: '상품에 대한 후기를 작성해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // [검증되지 않음] 실제 API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      
      toast({
        title: '리뷰 작성 완료',
        description: '소중한 리뷰를 남겨주셔서 감사합니다!'
      });
      
      // 폼 초기화
      setRating(0);
      setContent('');
      setImages([]);
      
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      toast({
        title: '리뷰 작성 실패',
        description: '리뷰 작성 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files].slice(0, 5)); // 최대 5장
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">리뷰를 작성해보세요</h3>
        <p className="text-muted-foreground mb-4">
          로그인하고 이 상품에 대한 솔직한 후기를 남겨주세요.
        </p>
        <Button variant="outline">로그인하기</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">별점</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">리뷰 내용</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상품에 대한 솔직한 후기를 작성해주세요..."
          className="min-h-[100px]"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {content.length}/1000자
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">사진 첨부 (선택)</label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('review-images')?.click()}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            사진 추가 ({images.length}/5)
          </Button>
          <input
            id="review-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        {images.length > 0 && (
          <div className="flex gap-2 mt-2">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>작성 중...</>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            리뷰 작성하기
          </>
        )}
      </Button>
    </form>
  );
};

// 개별 리뷰 컴포넌트
const ReviewItem = ({ review }: { review: Review }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(review.isLiked || false);
  const [likes, setLikes] = useState(review.likes || 0);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const isOwner = user?.name === review.author || user?.email === review.author;

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '좋아요 기능은 로그인 후 이용 가능합니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '댓글 작성은 로그인 후 이용 가능합니다.',
        variant: 'destructive'
      });
      return;
    }

    if (!newComment.trim()) return;

    // [검증되지 않음] 실제 댓글 추가 로직
    toast({
      title: '댓글 작성 완료',
      description: '댓글이 성공적으로 작성되었습니다.'
    });
    setNewComment('');
  };

  const handleEdit = () => {
    toast({
      title: '준비 중',
      description: '리뷰 수정 기능이 준비 중입니다.'
    });
  };

  const handleDelete = () => {
    toast({
      title: '리뷰 삭제 완료',
      description: '리뷰가 성공적으로 삭제되었습니다.'
    });
  };

  return (
    <div className="border-b border-border pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.avatar} alt={review.author} />
          <AvatarFallback>{review.author[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">{review.author}</span>
              <StarRating rating={review.rating} readonly />
              <span className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          삭제된 리뷰는 복구할 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <p className="text-foreground leading-relaxed">{review.content}</p>
          
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`리뷰 이미지 ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              좋아요 {likes > 0 && `(${likes})`}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-1 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              댓글 {review.comments.length > 0 && `(${review.comments.length})`}
            </Button>
          </div>
          
          {showComments && (
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              {review.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해주세요..."
                    className="flex-1 min-h-[60px] text-sm"
                    maxLength={500}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    작성
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [reviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'likes'>('latest');

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 헤더 */}
      <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            고객 리뷰 ({totalReviews})
          </h3>
          <p className="text-muted-foreground">
            다른 고객들의 솔직한 후기를 확인해보세요
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{averageRating}</span>
            <span className="text-muted-foreground">/ 5.0</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalReviews}개의 리뷰
          </p>
        </div>
      </div>

      {/* 리뷰 작성 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">리뷰 작성하기</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm />
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
                <option value="likes">좋아요순</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedReviews.length > 0 ? (
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
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