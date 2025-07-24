// src/pages/ProductPage.tsx
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductList from '@/components/common/product/ProductList';
import ProductTabs from '@/components/common/product/ProductTabs';
import ProductFilters from '@/components/common/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { productApi } from '@/services/product.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useToast } from '@/hooks/use-toast';

// 정렬 옵션을 영문 키로 매핑하여 API와 통신하기 용이하게 만듭니다.
const SORT_OPTIONS: { [key: string]: string } = {
  '최신순': 'latest',
  '인기순': 'popularity',
  '가격낮은순': 'priceAsc',
  '가격높은순': 'priceDesc',
  '평점순': 'rating',
};

const ProductPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPeermall } = usePeermall();
  const { toast } = useToast();
  
  // URL 쿼리 파라미터에서 상태 초기화
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || '전체');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '전체');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '최신순');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isUserPeermall = location.pathname.startsWith('/home/');
  const isMainPage = location.pathname === '/products' || location.pathname === '/';

  // 필터 상태가 변경될 때 URL 쿼리 파라미터를 업데이트하는 useEffect
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== '전체') params.set('tab', activeTab);
    if (selectedCategory !== '전체') params.set('category', selectedCategory);
    if (sortBy !== '최신순') params.set('sort', sortBy);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });
  }, [activeTab, selectedCategory, sortBy, searchQuery, setSearchParams]);

  // [수정됨] 데이터 페칭 로직을 명확하게 수정하여 요구사항을 반영합니다.
  useEffect(() => {
    const fetchProducts = async () => {
      // 유저 피어몰 페이지인데, currentPeermall 정보가 아직 로드되지 않았다면 API 호출을 잠시 보류합니다.
      if (isUserPeermall && !currentPeermall) {
        console.log('피어몰 정보 로딩을 기다립니다...');
        // 로딩 상태를 유지하여 사용자에게 대기 중임을 알릴 수 있습니다.
        setLoading(true); 
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // API에 보낼 파라미터를 구성합니다.
        const params: any = {
          // [수정됨] 탭 '전체'는 백엔드에서 'all'로 처리되므로, 이를 반영합니다.
          tab: activeTab === '전체' ? 'all' : activeTab === '신상품' ? 'new' : activeTab === '베스트' ? 'best' : activeTab === '할인' ? 'discount' : 'all',
          category: selectedCategory === '전체' ? undefined : selectedCategory,
          sortBy: SORT_OPTIONS[sortBy] || 'latest',
          search: searchQuery || undefined,
        };

        // [핵심 로직] 페이지의 컨텍스트에 따라 peermallId를 설정합니다.
        if (isUserPeermall) {
          // 유저 피어몰 페이지일 경우, 현재 피어몰의 ID를 파라미터에 추가합니다.
          params.peermallId = currentPeermall?.id.toString();
          console.log(`[유저 피어몰] '${currentPeermall?.name}' (ID: ${params.peermallId}) 상품을 조회합니다.`);
        } else if (isMainPage) {
          // 메인 페이지일 경우, peermallId를 설정하지 않아 전체 상품을 조회합니다.
          console.log('[메인 페이지] 모든 피어몰의 상품을 조회합니다.');
        }
        
        // API 호출
        const fetchedProducts = await productApi.getProducts(params);
        
        if (!fetchedProducts) {
          setProducts([]);
          setCategories(['전체']);
          return;
        }

        const validProducts = Array.isArray(fetchedProducts) 
            ? fetchedProducts.filter(p => p && typeof p === 'object' && p.id) 
            : [];

        console.log(`API로부터 ${validProducts.length}개의 상품을 성공적으로 받았습니다.`);
        console.log(validProducts)
        setProducts(validProducts);

        // 카테고리 목록 동적 생성
        const categorySet = new Set<string>(['전체']);
        validProducts.forEach((product) => {
          if (product?.category) {
            categorySet.add(product.category);
          }
        });
        setCategories(Array.from(categorySet));
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        setProducts([]);
        setCategories(['전체']);
        toast({
          title: '상품 조회 오류',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
  // [수정됨] 의존성 배열을 간결하게 유지합니다. isMainPage는 isUserPeermall에 따라 결정되므로 하나만 있어도 충분합니다.
  }, [activeTab, selectedCategory, sortBy, searchQuery, currentPeermall, isUserPeermall, toast]);

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 이하 렌더링 로직은 기존과 동일하게 유지됩니다.
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">상품을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              새로고침
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === '신상품' ? '신규 제품' : 
             activeTab === '베스트' ? '베스트 제품' : 
             activeTab === '할인' ? '할인 제품' : '전체 제품'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainPage 
              ? '모든 피어몰의 제품을 확인하세요' 
              : currentPeermall 
                ? `${currentPeermall.name}의 제품들` 
                : '피어몰 제품들'}
          </p>
        </div>

        {/* [설명] 유저 피어몰에서만 탭이 표시되는 로직은 이미 훌륭합니다. */}
        {isUserPeermall && (
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />

        {!products || products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery 
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                : activeTab !== '전체' 
                  ? `${activeTab} 상품이 없습니다` 
                  : '등록된 상품이 없습니다'}
            </h3>
            <p className="text-muted-foreground">
              {isUserPeermall && !searchQuery 
                ? '첫 번째 상품을 등록해보세요!' 
                : searchQuery 
                  ? '다른 검색어로 시도해보세요.'
                  : '곧 새로운 상품이 등록될 예정입니다.'}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                검색 초기화
              </Button>
            )}
          </div>
        ) : (
          <ProductList 
            products={products}
            showPeermallInfo={isMainPage} // [설명] 메인 페이지에서만 피어몰 정보를 보여주는 로직, 아주 좋습니다.
            mode="full"
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;