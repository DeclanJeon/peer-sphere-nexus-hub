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

// 별점 컴포넌트
const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'default'
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readonly?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

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
            className={`${sizeClasses[size]} ${
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
const ReviewForm = ({ productId, onSuccess }: { productId: string; onSuccess: () => void }) => {
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
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating.toString());
      formData.append('content', content);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      await reviewApi.createReview(formData);
      
      toast({
        title: '리뷰 작성 완료',
        description: '소중한 리뷰를 남겨주셔서 감사합니다!'
      });
      
      // 폼 초기화
      setRating(0);
      setContent('');
      setImages([]);
      
      // 리뷰 목록 새로고침
      onSuccess();
      
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
            사진 추가 ({images.length}/1)
          </Button>
          <input
            id="review-images"
            type="file"
            accept="image/*"
            // multiple
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
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            작성 중...
          </>
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
const ReviewItem = ({ 
  review, 
  onUpdate, 
  onDelete 
}: { 
  review: Review; 
  onUpdate: () => void;
  onDelete: () => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(review.is_liked);
  const [likes, setLikes] = useState(review.like_count || 0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(review.images || []);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // 댓글 로컬 상태 추가
  const [comments, setComments] = useState(review.comments || []);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const isOwner = user?.id === review.user_id;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '좋아요 기능은 로그인 후 이용 가능합니다.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await reviewApi.toggleLike(review.id);
      setIsLiked(result.isLiked);
      setLikes(prev => result.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('좋아요 실패:', error);
      toast({
        title: '오류',
        description: '좋아요 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleAddComment = async () => {
  if (!isAuthenticated || !user) {
    toast({
      title: '로그인 필요',
      description: '댓글 작성은 로그인 후 이용 가능합니다.',
      variant: 'destructive'
    });
    return;
  }

  if (!newComment.trim()) return;

    try {
      // 임시 댓글 객체 생성 (낙관적 업데이트)
      const tempComment = {
        id: `temp-${Date.now()}`, // 문자열로 보장
        review_id: review.id,
        user_id: user.id,
        content: newComment,
        author_name: user.name || user.email || '사용자',
        author_avatar: user.avatar || user.profile_image,
        created_at: new Date().toISOString(),
        is_seller_reply: false
      };

      // 즉시 UI 업데이트
      setComments(prev => [...prev, tempComment]);
      setNewComment('');

      // API 호출
      const response = await reviewApi.createComment(review.id, newComment);
      
      // 응답 데이터 보완
      const newCommentData = {
        ...response,
        id: String(response.id), // id를 문자열로 보장
        author_name: response.author_name || user.name || user.email || '사용자',
        author_avatar: response.author_avatar || user.avatar || user.profile_image
      };
      
      // 성공 시 임시 댓글을 실제 댓글로 교체
      setComments(prev => 
        prev.map(comment => 
          String(comment.id) === tempComment.id 
            ? newCommentData
            : comment
        )
      );

      toast({
        title: '댓글 작성 완료',
        description: '댓글이 성공적으로 작성되었습니다.'
      });
      
    } catch (error) {
      // 실패 시 임시 댓글 제거 - String()으로 안전하게 처리
      setComments(prev => prev.filter(c => {
        const commentId = String(c.id || '');
        return !commentId.startsWith('temp-');
      }));
      
      console.error('댓글 작성 실패:', error);
      toast({
        title: '댓글 작성 실패',
        description: '댓글 작성 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await reviewApi.deleteReview(review.id);
      toast({
        title: '리뷰 삭제 완료',
        description: '리뷰가 성공적으로 삭제되었습니다.'
      });
      onDelete();
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      toast({
        title: '리뷰 삭제 실패',
        description: '리뷰 삭제 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  // 수정 모드 토글
  const handleEditToggle = () => {
    if (!isEditMode) {
      // 수정 모드 진입시 초기값 설정
      setEditRating(review.rating);
      setEditContent(review.content);
      setExistingImages(review.images || []);
      setEditImages([]);
    }
    setIsEditMode(!isEditMode);
  };

  // 리뷰 수정 처리
  const handleUpdate = async () => {
    if (!editContent.trim()) {
      toast({
        title: '리뷰 내용을 입력해주세요',
        description: '리뷰 내용은 필수입니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      formData.append('rating', editRating.toString());
      formData.append('content', editContent);
      
      // 기존 이미지 URL들
      existingImages.forEach((imageUrl) => {
        formData.append('existingImages', imageUrl);
      });
      
      // 새로 추가된 이미지들
      editImages.forEach((image) => {
        formData.append('images', image);
      });

      await reviewApi.updateReview(review.id, formData);
      
      toast({
        title: '리뷰 수정 완료',
        description: '리뷰가 성공적으로 수정되었습니다.'
      });
      
      setIsEditMode(false);
      onUpdate(); // 리뷰 목록 새로고침
      
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
      toast({
        title: '리뷰 수정 실패',
        description: '리뷰 수정 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // 이미지 업로드 핸들러
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + editImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: '이미지 제한',
        description: '최대 5장까지만 업로드 가능합니다.',
        variant: 'destructive'
      });
      return;
    }
    
    setEditImages(prev => [...prev, ...files]);
  };

  // 기존 이미지 삭제
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // 새 이미지 삭제
  const removeNewImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  // 수정 모드 UI
  if (isEditMode) {
    return (
      <div className="border-b border-border pb-6 last:border-b-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">리뷰 수정하기</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditToggle}
              disabled={isUpdating}
            >
              취소
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">별점</label>
            <StarRating 
              rating={editRating} 
              onRatingChange={setEditRating} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">리뷰 내용</label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="상품에 대한 솔직한 후기를 작성해주세요..."
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {editContent.length}/1000자
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">사진 첨부</label>
            
            {/* 기존 이미지 */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">기존 이미지</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`기존 이미지 ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 새 이미지 추가 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('edit-images')?.click()}
                disabled={existingImages.length + editImages.length >= 5}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                사진 추가 ({existingImages.length + editImages.length}/5)
              </Button>
              <input
                id="edit-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleEditImageUpload}
              />
            </div>
            
            {/* 새로 추가된 이미지 */}
            {editImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">새 이미지</p>
                <div className="flex gap-2 flex-wrap">
                  {editImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`새 이미지 ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleEditToggle}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || editRating === 0 || !editContent.trim()}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  수정 중...
                </>
              ) : (
                '수정 완료'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 일반 모드
  return (
    <div className="border-b border-border pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.author_avatar} alt={review.author_name} />
          <AvatarFallback>{review.author_name?.[0] || '?'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">{review.author_name || '알 수 없는 사용자'}</span>
              <StarRating rating={review.rating} readonly size="small" />
              <span className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
              {review.is_verified_purchase && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  구매 인증
                </span>
              )}
            </div>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditToggle}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
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
              도움이 돼요 {likes > 0 && `(${likes})`}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-1 text-muted-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              댓글 {comments.length > 0 && `(${comments.length})`}
            </Button>
          </div>
          
          {showComments && (
            <div className="space-y-3 pl-4 border-l-2 border-muted">
              {comments.length > 0 ? (
                comments.map((comment) => {
                  const authorName = comment?.author_name || '알 수 없는 사용자';
                  const authorInitial = authorName ? authorName[0].toUpperCase() : '?';
                  
                  return (
                    <div key={comment.id} className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment?.author_avatar} alt={authorName} />
                        <AvatarFallback>{authorInitial}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{authorName}</span>
                          {comment?.is_seller_reply && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              판매자
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {comment?.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment?.content || ''}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                </p>
              )}
              
              {isAuthenticated && (
                <div className="flex gap-2 mt-3">
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
 
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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