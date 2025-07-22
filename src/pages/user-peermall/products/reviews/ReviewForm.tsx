// Frontend/src/pages/user-peermall/products/reviews/ReviewForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ImagePlus } from 'lucide-react';

export const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');

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
          <div>
            <Button variant="outline" size="sm">
              <ImagePlus className="h-4 w-4 mr-2" />
              사진 추가
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>리뷰 등록</Button>
      </CardFooter>
    </Card>
  );
};
