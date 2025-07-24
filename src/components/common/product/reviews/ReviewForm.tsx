// Frontend/src/pages/user-peermall/products/reviews/ReviewForm.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ImagePlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: '이미지 제한',
        description: '최대 5개의 이미지만 업로드 가능합니다.',
        variant: 'destructive'
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0 || !content.trim()) {
      toast({
        title: '입력 오류',
        description: '별점과 리뷰 내용을 모두 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: API 호출로 리뷰 등록
      toast({
        title: '리뷰 등록 완료',
        description: '소중한 리뷰 감사합니다!'
      });
      
      // 폼 초기화
      setRating(0);
      setContent('');
      setImages([]);
    } catch (error) {
      toast({
        title: '등록 실패',
        description: '리뷰 등록 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 작성하기</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="font-medium">별점:</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    (hoverRating || rating) >= star
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          <Textarea
            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 5}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                사진 추가 ({images.length}/5)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !content.trim()}
        >
          {isSubmitting ? '등록 중...' : '리뷰 등록'}
        </Button>
      </CardFooter>
      
      {/* 헬퍼 함수들 */}
      {handleImageSelect && removeImage && handleSubmit && null}
    </Card>
  );
};
