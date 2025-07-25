// Frontend/src/pages/user-peermall/products/reviews/ReviewForm.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ImagePlus, X, MessageCircle, ImageIcon, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { reviewApi } from '@/services/review.api';
import StarRating from './StarRating';

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
      
    } catch (error: any) {
      console.error('리뷰 작성 실패:', error);
      
      // 🎯 개선된 에러 처리
      let errorTitle = '리뷰 작성 실패';
      let errorDescription = '리뷰 작성 중 오류가 발생했습니다.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 409: // Conflict - 중복 리뷰
            errorTitle = '이미 리뷰를 작성하셨습니다';
            errorDescription = '한 상품에 하나의 리뷰만 작성 가능합니다. 기존 리뷰를 수정해주세요.';
            break;
            
          case 400: // Bad Request - 유효성 검사 실패
            errorTitle = '입력 정보를 확인해주세요';
            errorDescription = data.message || '올바른 정보를 입력해주세요.';
            break;
            
          case 401: // Unauthorized
            errorTitle = '인증 실패';
            errorDescription = '로그인이 필요하거나 세션이 만료되었습니다.';
            break;
            
          case 403: // Forbidden
            errorTitle = '권한 없음';
            errorDescription = '리뷰를 작성할 권한이 없습니다.';
            break;
            
          case 413: // Payload Too Large
            errorTitle = '파일 크기 초과';
            errorDescription = '업로드한 이미지의 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.';
            break;
            
          case 500: // Internal Server Error
            errorTitle = '서버 오류';
            errorDescription = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
            
          default:
            if (data?.error === 'REVIEW_ALREADY_EXISTS') {
              errorTitle = '중복 리뷰';
              errorDescription = data.message || '이미 이 상품에 대한 리뷰를 작성하셨습니다.';
            } else if (data?.message) {
              errorDescription = data.message;
            }
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        errorTitle = '네트워크 오류';
        errorDescription = '서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
      } else {
        // 요청 설정 중 오류 발생
        errorDescription = error.message || '알 수 없는 오류가 발생했습니다.';
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
        duration: 5000 // 에러 메시지는 좀 더 오래 표시
      });
      
      // 중복 리뷰인 경우 수정 모드로 유도
      if (error.response?.status === 409 || error.response?.data?.error === 'REVIEW_ALREADY_EXISTS') {
        // 기존 리뷰 조회 후 수정 모드로 전환하는 로직 추가 가능
        // 예: navigateToEditMode();
      }
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

export default ReviewForm;