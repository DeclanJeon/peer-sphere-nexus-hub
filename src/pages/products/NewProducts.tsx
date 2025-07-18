import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewProducts = () => {
  const products = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', mall: '코스메틱 파라다이스', rating: 4.8, createdAt: '2024-01-15' },
    { id: 2, name: '무선 이어폰 프로', price: '129,000원', mall: '스마트 라이프', rating: 4.9, createdAt: '2024-01-14' },
    { id: 3, name: '캐주얼 맨투맨', price: '45,000원', mall: '패션 스트리트', rating: 4.7, createdAt: '2024-01-13' },
    { id: 4, name: '홈 카페 머신', price: '299,000원', mall: '라이프스타일', rating: 4.6, createdAt: '2024-01-12' },
    { id: 5, name: '반려동물 간식', price: '25,000원', mall: '펫샵 천국', rating: 4.8, createdAt: '2024-01-11' },
    { id: 6, name: '운동화 컬렉션', price: '89,000원', mall: '스포츠 월드', rating: 4.7, createdAt: '2024-01-10' },
  ];

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
                <div className="aspect-square bg-muted rounded-lg mb-3 relative">
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