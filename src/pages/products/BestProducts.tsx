import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestProducts = () => {
  // ========== 목업 데이터 START ==========
  // 실제 API 연동 시 제거 예정인 더미 데이터입니다.
  const products = [
    { 
      id: 1, 
      name: '다이아몬드 반지', 
      price: '2,890,000원', 
      mall: '럭셔리 브랜드 하우스', 
      rating: 4.9, 
      likes: '2,341',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
      category: '럭셔리',
      sales: 234
    },
    { 
      id: 2, 
      name: '무선 게이밍 키보드', 
      price: '189,000원', 
      mall: '테크 이노베이션', 
      rating: 4.8, 
      likes: '1,987',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      category: '게이밍',
      sales: 567
    },
    { 
      id: 3, 
      name: '키즈 교육용 태블릿', 
      price: '329,000원', 
      mall: '키즈 원더랜드', 
      rating: 4.9, 
      likes: '1,756',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop',
      category: '교육',
      sales: 432
    },
    { 
      id: 4, 
      name: '프리미엄 프로틴 파우더', 
      price: '129,000원', 
      mall: '헬스 앤 뷰티', 
      rating: 4.8, 
      likes: '1,654',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
      category: '헬스',
      sales: 789
    },
    { 
      id: 5, 
      name: '유기농 티백 컬렉션', 
      price: '65,000원', 
      mall: '에코 라이프', 
      rating: 4.7, 
      likes: '1,543',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
      category: '유기농',
      sales: 891
    },
    { 
      id: 6, 
      name: '아티스트 리미티드 시계', 
      price: '1,450,000원', 
      mall: '아트 갤러리', 
      rating: 4.9, 
      likes: '1,432',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop',
      category: '예술',
      sales: 156
    },
    { 
      id: 7, 
      name: '스포츠 러닝화', 
      price: '159,000원', 
      mall: '스포츠 월드', 
      rating: 4.8, 
      likes: '1,321',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
      category: '스포츠',
      sales: 623
    },
    { 
      id: 8, 
      name: '스마트 홈 디퓨저', 
      price: '89,000원', 
      mall: '홈 데코', 
      rating: 4.6, 
      likes: '1,234',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      category: '인테리어',
      sales: 445
    }
  ];
  // ========== 목업 데이터 END ==========

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
                <div className="aspect-square bg-muted rounded-lg mb-3 relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
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