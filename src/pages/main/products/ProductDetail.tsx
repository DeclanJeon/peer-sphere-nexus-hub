import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, ShoppingCart, MessageCircle, Share } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();

  const product = {
    id,
    name: '프리미엄 스킨케어 세트',
    price: '89,000원',
    originalPrice: '120,000원',
    mall: '코스메틱 파라다이스',
    rating: 4.8,
    reviews: 128,
    likes: 456,
    description: '자연 성분으로 만든 프리미엄 스킨케어 세트입니다. 민감한 피부에도 안전하게 사용할 수 있으며, 깊은 보습과 영양 공급을 동시에 해결합니다.',
    features: [
      '천연 성분 100%',
      '파라벤 프리',
      '피부 자극 테스트 완료',
      '3단계 스킨케어 시스템'
    ],
    specifications: {
      '제조사': '코스메틱 파라다이스',
      '용량': '150ml x 3개',
      '유통기한': '제조일로부터 36개월',
      '원산지': '대한민국'
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded border cursor-pointer"></div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.mall}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews}개 리뷰)</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{product.likes}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
              <Badge variant="destructive">26% 할인</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Button className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                장바구니
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              판매자 문의
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">주요 특징:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;