// UserProductList.tsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Plus, Search, Filter, Loader2, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi } from '@/services/product.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

interface UserProductListProps {
  mode?: 'full' | 'preview'; // 전체보기 or 미리보기
  filter?: 'all' | 'new' | 'best'; // 필터 타입
  category?: string; // 카테고리 필터
  limit?: number; // 미리보기 개수
  onProductsLoaded?: (products: Product[]) => void; // 상품 로드 콜백
}

const UserProductList = ({ 
  mode = 'full', 
  filter = 'all',
  category = 'all',
  limit = 8,
  onProductsLoaded
}: UserProductListProps) => {
  const { url } = useParams<{ url: string }>();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);

  // 피어몰 소유자인지 확인
  const isOwner = currentPeermall?.ownerId === user?.email || 
                  currentPeermall?.owner_id === user?.id;

  // 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentPeermall?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await productApi.getProductsByPeermall(currentPeermall.id);
        
        // 활성 상품만 필터링
        const activeProducts = data.filter(p => p.status === 'active');
        
        // 필터에 따른 정렬
        let sortedProducts = [...activeProducts];
        
        if (filter === 'new') {
          sortedProducts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (filter === 'best') {
          sortedProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
        }
        
        // 미리보기 모드일 경우 limit 적용
        if (mode === 'preview') {
          sortedProducts = sortedProducts.slice(0, limit);
        }

        console.log(sortedProducts)
        
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
        
        // 콜백 실행
        if (onProductsLoaded) {
          onProductsLoaded(sortedProducts);
        }
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
        toast({
          title: '오류',
          description: '상품 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPeermall?.id, filter, mode, limit]);

  // 카테고리 필터링
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // 검색 및 정렬 (전체보기 모드에서만)
  useEffect(() => {
    if (mode === 'full') {
      let filtered = [...products];

      if (searchQuery) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      switch (sortBy) {
        case 'latest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'price-low':
          filtered.sort((a, b) => (a.sellingPrice || a.price) - (b.sellingPrice || b.price));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.sellingPrice || b.price) - (a.sellingPrice || a.price));
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, sortBy, mode]);

  // 상품 카드 컴포넌트
  const ProductCard = ({ product }: { product: Product }) => (
    <Link to={`/home/${url}/product/${product.id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.png';
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {product.status === 'active' && (
              <Badge className="absolute top-2 right-2 bg-green-500">판매중</Badge>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            {product.category && (
              <Badge variant="outline" className="w-fit text-xs mb-2">
                {product.category}
              </Badge>
            )}
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2">
              {product.name}
            </h4>
            
            <div className="mt-auto">
              {product.price && product.price !== product.sellingPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {Number(product.price).toLocaleString()}원
                </p>
              )}
              <p className="text-primary font-bold">
                {Number(product.sellingPrice || 0).toLocaleString()}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  // 로딩 상태
  if (loading) {
    return mode === 'preview' ? (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 미리보기 모드
  if (mode === 'preview') {
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg">
            {selectedCategory !== 'all' 
              ? `${selectedCategory} 카테고리에 등록된 상품이 없습니다.`
              : '아직 등록된 상품이 없습니다.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  // 전체보기 모드
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isOwner ? '내 상품 관리' : '상품 목록'}
          </h1>
          <p className="text-muted-foreground mt-2">
            총 {filteredProducts.length}개의 상품
          </p>
        </div>
        {isOwner && (
          <Link to={`/home/${url}/products/create`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              상품 등록
            </Button>
          </Link>
        )}
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
            {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="w-full md:w-auto"
        >
          <Loader2 className="h-4 w-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 상품 목록 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? '검색 결과가 없습니다' : '등록된 상품이 없습니다'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? '다른 검색어로 시도해보세요.' 
              : isOwner 
                ? '첫 번째 상품을 등록하여 판매를 시작해보세요!'
                : '곧 새로운 상품이 등록될 예정입니다.'
            }
          </p>
          {isOwner && !searchQuery && (
            <Link to={`/home/${url}/products/create`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                상품 등록하기
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProductList;