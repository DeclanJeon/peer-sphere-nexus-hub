import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 목업 데이터 - 실제 API 연동 시 제거
const mockProducts = [
  {
    id: '1',
    name: '프리미엄 스킨케어 세트',
    price: 89000,
    description: '자연 성분으로 만든 프리미엄 스킨케어 세트입니다.',
    category: '뷰티',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    rating: 4.8,
    status: 'active' as const,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: '무선 이어폰 프로',
    price: 129000,
    description: '고품질 사운드와 뛰어난 배터리 성능을 자랑하는 무선 이어폰입니다.',
    category: '전자제품',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    rating: 4.9,
    status: 'active' as const,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: '캐주얼 맨투맨',
    price: 45000,
    description: '부드러운 원단으로 제작된 편안한 캐주얼 맨투맨입니다.',
    category: '패션',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    rating: 4.7,
    status: 'active' as const,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '4',
    name: '홈 카페 머신',
    price: 299000,
    description: '집에서 즐기는 전문가급 커피를 위한 홈 카페 머신입니다.',
    category: '가전제품',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    rating: 4.6,
    status: 'active' as const,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

const UserProductList = () => {
  const { url } = useParams<{ url: string }>();
  const [products, setProducts] = useState(mockProducts); // 목업 데이터 사용
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = products;

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 정렬
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  // 카테고리 목록 생성
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">내 상품 관리</h1>
          <p className="text-muted-foreground mt-2">
            총 {filteredProducts.length}개의 상품
          </p>
        </div>
        <Link to={`/${url}/products/create`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            상품 등록
          </Button>
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="상품명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            {categories.filter(cat => cat !== 'all').map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="price-low">가격 낮은순</SelectItem>
            <SelectItem value="price-high">가격 높은순</SelectItem>
            <SelectItem value="rating">평점순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 상품 목록 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">등록된 상품이 없습니다</h3>
          <p className="text-muted-foreground mb-6">
            첫 번째 상품을 등록하여 판매를 시작해보세요!
          </p>
          <Link to={`/${url}/products/create`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              상품 등록하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/${url}/products/${product.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    <Badge 
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                      className="absolute top-3 right-3"
                    >
                      {product.status === 'active' ? '판매중' : '판매중단'}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-primary font-bold text-lg">
                        {product.price.toLocaleString()}원
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProductList;