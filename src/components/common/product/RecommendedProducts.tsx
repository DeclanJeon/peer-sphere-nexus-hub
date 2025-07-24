// Frontend/src/components/common/product/RecommendedProducts.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { productApi } from '@/services/product.api';
import { Product } from '@/types/product';
import { usePeermall } from '@/contexts/PeermallContext';
import { 
  Star, 
  ShoppingBag, 
  Package, 
  Heart,
  ExternalLink,
  Eye,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RecommendedProductsProps {
  currentProductId: string;
  peermallId: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'price_low' | 'price_high' | 'rating' | 'popular';

export const RecommendedProducts = ({ 
  currentProductId, 
  peermallId 
}: RecommendedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const { currentPeermall } = usePeermall();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await productApi.getProducts({
          peermallId,
          status: 'active'
        });
        
        // 현재 상품 제외
        const filtered = allProducts.filter(p => p.id !== currentProductId);
        
        // 카테고리 추출
        const uniqueCategories = Array.from(
          new Set(filtered.map(p => p.category).filter(Boolean))
        );
        setCategories(uniqueCategories);
        
        setProducts(filtered);
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
        toast({
          title: '오류',
          description: '추천 상품을 불러오는데 실패했습니다.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [currentProductId, peermallId, toast]);

  // 필터링 및 정렬
  const filteredAndSortedProducts = products
    .filter(product => {
      if (selectedCategory === 'all') return true;
      return product.category === selectedCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.selling_price || 0) - (b.selling_price || 0);
        case 'price_high':
          return (b.selling_price || 0) - (a.selling_price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        default: // latest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleProductClick = (product: Product) => {
    navigate(`/home/${currentPeermall?.url}/product/${product.id}`);
  };

  const handleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    // [검증되지 않음] 찜하기 기능 구현
    toast({
      title: '찜 목록에 추가',
      description: '상품이 찜 목록에 추가되었습니다.'
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-6 bg-muted/50 rounded-lg">
          <Package className="h-6 w-6 text-muted-foreground animate-pulse" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-6 bg-muted/50 rounded-lg">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">추천 상품</h3>
            <p className="text-muted-foreground">
              {currentPeermall?.name}의 다른 인기 상품들
            </p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {selectedCategory === 'all' 
              ? '추천 상품이 없습니다' 
              : '해당 카테고리에 상품이 없습니다'
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === 'all'
              ? '현재 이 피어몰에서 추천할 수 있는 다른 상품이 없습니다.'
              : '다른 카테고리의 상품들을 둘러보세요.'
            }
          </p>
          {selectedCategory !== 'all' && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory('all')}
            >
              전체 상품 보기
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 그리드 뷰 상품 카드
  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-md"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* 할인 배지 */}
        {/* {product.price && product.price !== product.selling_price && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            {Math.round(((product.price - (product.selling_price || 0)) / product.price) * 100)}% OFF
          </Badge>
        )} */}
        
        {/* 찜하기 버튼 */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-muted-foreground hover:text-destructive"
          onClick={(e) => handleWishlist(e, product.id)}
        >
          <Heart className="h-4 w-4" />
        </Button> */}
        
        {/* 바로구매 버튼 (호버 시 표시) */}
        {product.product_url && (
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              asChild
              size="sm"
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                바로구매
              </a>
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors leading-5">
          {product.name}
        </h4>
        
        <div className="flex items-center gap-2 flex-wrap">
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground font-medium">
                {product.rating}
              </span>
            </div>
          )}
          {product.views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {product.views.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          {product.price && product.price !== product.selling_price && (
            <p className="text-sm text-muted-foreground line-through">
              {Number(product.price).toLocaleString()}원
            </p>
          )}
          <p className="font-bold text-primary text-lg">
            {Number(product.selling_price || 0).toLocaleString()}원
          </p>
          {product.shipping_fee !== undefined && (
            <p className="text-xs text-muted-foreground">
              {Number(product.shipping_fee) === 0 ? '무료배송' : `배송비 ${Number(product.shipping_fee).toLocaleString()}원`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // 리스트 뷰 상품 카드
  const ProductListItem = ({ product }: { product: Product }) => (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-all duration-300 border-0 shadow-sm"
      onClick={() => handleProductClick(product)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded bg-muted">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => handleWishlist(e, product.id)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              )}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground font-medium">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                {product.price && product.price !== product.selling_price && (
                  <p className="text-sm text-muted-foreground line-through">
                    {Number(product.price).toLocaleString()}원
                  </p>
                )}
                <p className="font-bold text-primary text-lg">
                  {Number(product.selling_price || 0).toLocaleString()}원
                </p>
              </div>
              
              {product.product_url && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    구매
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 p-6 bg-muted/50 rounded-lg">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold">
            추천 상품 ({filteredAndSortedProducts.length})
          </h3>
          <p className="text-muted-foreground">
            {currentPeermall?.name}의 다른 인기 상품들
          </p>
        </div>
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="price_low">낮은 가격순</SelectItem>
              <SelectItem value="price_high">높은 가격순</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};