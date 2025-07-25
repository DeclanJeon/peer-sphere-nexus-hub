// Frontend/src/pages/user-peermall/products/reviews/ReviewItem.tsx
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Star, MoreVertical, Edit, Trash2, Heart, AlertTriangle, Loader2, ImageIcon, X, ThumbsUp, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Review } from '@/types/review';
import { reviewApi } from '@/services/review.api';
import { useAuth } from '@/hooks/useAuth';
import { formatEmailToId } from '@/lib/utils';

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

export const ReviewItem = ({ 
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

  const isOwner = user?.user_uid === review.user_uid;

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

      const userId = formatEmailToId(user.user_email);

      // API 호출
      const response = await reviewApi.createComment(userId, review.id, newComment);
      
      // 응답 데이터 보완
      const newCommentData = {
        ...response,
        id: String(response.id), // id를 문자열로 보장
        author_name: response.author_name || user.user_name || user.user_email || '사용자',
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
          <AvatarFallback>{review.author_name || 'Pre'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">{review?.author_name || review.user_id || '알 수 없는 사용자'}</span>
              <StarRating rating={review.rating} readonly />
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
                          <span className="font-medium text-sm">{comment?.user_id}</span>
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
