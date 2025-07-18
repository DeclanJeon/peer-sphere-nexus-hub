import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestProducts = () => {
  const products = [
    { id: 1, name: '다이아몬드 반지', price: '2,890,000원', mall: '럭셔리 브랜드 하우스', rating: 4.9, likes: '1,234' },
    { id: 2, name: '프로틴 파우더', price: '89,000원', mall: '헬스 앤 라이프', rating: 4.8, likes: '987' },
    { id: 3, name: '교육용 태블릿', price: '299,000원', mall: '키즈 원더랜드', rating: 4.9, likes: '756' },
    { id: 4, name: '게이밍 키보드', price: '189,000원', mall: '테크 이노베이션', rating: 4.8, likes: '654' },
    { id: 5, name: '오가닉 티백 세트', price: '45,000원', mall: '오가닉 라이프', rating: 4.7, likes: '543' },
    { id: 6, name: '리미티드 에디션 시계', price: '1,200,000원', mall: '아트 갤러리', rating: 4.9, likes: '432' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">베스트 제품/상품</h1>
      </div>
      <p className="text-muted-foreground mb-8">가장 인기있고 사랑받는 제품들을 확인해보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3 relative">
                  {index < 3 && (
                    <Badge className={`absolute top-2 left-2 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      #{index + 1}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-primary font-bold mb-1">{product.price}</p>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{product.mall}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  <span>{product.likes} 좋아요</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestProducts;