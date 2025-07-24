// Frontend/src/pages/user-peermall/products/reviews/ReviewItem.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Star, MoreVertical, Edit, Trash2, Heart, AlertTriangle, Loader2, ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Review } from './types';
import { ReviewComments } from './ReviewComments';
import { reviewApi } from '@/services/review.api';

interface ReviewItemProps {
  review: Review;
  isOwner: boolean;
  onUpdate?: () => void; // 리뷰 업데이트 후 콜백
  onDelete?: () => void; // 리뷰 삭제 후 콜백
}

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
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewItem = ({ review, isOwner, onUpdate, onDelete }: ReviewItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // 수정 모드 상태
  const [editRating, setEditRating] = useState(review.rating);
  const [editContent, setEditContent] = useState(review.content);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(review.images || []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      // API 호출
      await reviewApi.toggleLike(review.id);
    } catch (error) {
      setIsLiked(!isLiked); // 실패시 원복
      toast({
        title: '오류',
        description: '좋아요 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleReport = () => {
    toast({
      title: '신고하기',
      description: '신고가 접수되었습니다. 검토 후 조치하겠습니다.'
    });
  };

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
      onUpdate?.(); // 리뷰 목록 새로고침
      
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await reviewApi.deleteReview(review.id);
      toast({
        title: '리뷰 삭제 완료',
        description: '리뷰가 성공적으로 삭제되었습니다.'
      });
      onDelete?.();
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      toast({
        title: '리뷰 삭제 실패',
        description: '리뷰 삭제 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
  };

  // 수정 모드 UI
  if (isEditMode) {
    return (
      <div className="py-4 border-b last:border-b-0">
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
                onChange={handleImageUpload}
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

  // 일반 모드 (기존 UI)
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
                <StarRating rating={review.rating} readonly />
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
                    <DropdownMenuItem onClick={handleEditToggle}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => setIsDeleteOpen(true)}
                    >
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
                  className="h-20 w-20 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
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

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제된 리뷰는 복구할 수 없습니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
