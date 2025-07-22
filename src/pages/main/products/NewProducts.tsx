import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewProducts = () => {
  // ========== 목업 데이터 START ==========
  // 실제 API 연동 시 제거 예정인 더미 데이터입니다.
  const products = [
    { 
      id: 1, 
      name: '무선 블루투스 이어폰 Pro', 
      price: '159,000원', 
      mall: '테크 이노베이션', 
      rating: 4.9, 
      createdAt: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      category: '전자제품'
    },
    { 
      id: 2, 
      name: '유기농 스킨케어 3종 세트', 
      price: '89,000원', 
      mall: '헬스 앤 뷰티', 
      rating: 4.8, 
      createdAt: '2024-01-19',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
      category: '뷰티'
    },
    { 
      id: 3, 
      name: '미니멀 디자인 백팩', 
      price: '75,000원', 
      mall: '스타일 갤러리', 
      rating: 4.7, 
      createdAt: '2024-01-18',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop',
      category: '패션'
    },
    { 
      id: 4, 
      name: '자동 커피 머신', 
      price: '329,000원', 
      mall: '홈 데코', 
      rating: 4.6, 
      createdAt: '2024-01-17',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
      category: '가전'
    },
    { 
      id: 5, 
      name: '프리미엄 펫 간식 세트', 
      price: '45,000원', 
      mall: '펫 케어', 
      rating: 4.8, 
      createdAt: '2024-01-16',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
      category: '반려동물'
    },
    { 
      id: 6, 
      name: '러닝 전용 스니커즈', 
      price: '119,000원', 
      mall: '스포츠 월드', 
      rating: 4.7, 
      createdAt: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop',
      category: '스포츠'
    },
    { 
      id: 7, 
      name: '아로마 디퓨저', 
      price: '65,000원', 
      mall: '에코 라이프', 
      rating: 4.5, 
      createdAt: '2024-01-14',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop',
      category: '인테리어'
    },
    { 
      id: 8, 
      name: '키즈 교육용 태블릿', 
      price: '249,000원', 
      mall: '키즈 원더랜드', 
      rating: 4.9, 
      createdAt: '2024-01-13',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop',
      category: '교육'
    },
    { 
      id: 9, 
      name: '수제 도자기 머그컵', 
      price: '35,000원', 
      mall: '아트 갤러리', 
      rating: 4.6, 
      createdAt: '2024-01-12',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop',
      category: '예술'
    },
    { 
      id: 10, 
      name: '명품 손목시계', 
      price: '1,290,000원', 
      mall: '럭셔리 브랜드 하우스', 
      rating: 4.9, 
      createdAt: '2024-01-11',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      category: '럭셔리'
    }
  ];
  // ========== 목업 데이터 END ==========

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">신규 제품/상품</h1>
      </div>
      <p className="text-muted-foreground mb-8">최근에 새롭게 등록된 제품들을 만나보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
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
                  <Badge className="absolute top-2 left-2 bg-primary">NEW</Badge>
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
                <p className="text-xs text-muted-foreground">등록일: {product.createdAt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;