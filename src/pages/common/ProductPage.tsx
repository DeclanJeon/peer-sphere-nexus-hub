// src/pages/ProductPage.tsx
import { useState, useEffect, useRef } from 'react';
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

// 🎯 탭 매핑 추가
const TAB_MAPPING: { [key: string]: string } = {
  'new': '신상품',
  'best': '베스트',
  'discount': '할인',
  'all': '전체'
};

const REVERSE_TAB_MAPPING: { [key: string]: string } = {
  '신상품': 'new',
  '베스트': 'best',
  '할인': 'discount',
  '전체': 'all'
};

const ProductPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPeermall } = usePeermall();
  const { toast } = useToast();
  
  // 🎯 URL 쿼리 파라미터에서 상태 초기화 - 매핑 적용
  const tabParam = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(TAB_MAPPING[tabParam] || '전체');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '전체');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '최신순');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🎯 무한 루프 방지를 위한 ref
  const isUpdatingUrl = useRef(false);

  const isUserPeermall = location.pathname.startsWith('/home/');
  const isMainPage = location.pathname === '/products' || location.pathname === '/';

  // 🎯 URL 변경 감지 및 상태 업데이트
  useEffect(() => {
    if (isUpdatingUrl.current) return;
    
    const tabParam = searchParams.get('tab') || 'all';
    const newTab = TAB_MAPPING[tabParam] || '전체';
    const newCategory = searchParams.get('category') || '전체';
    const newSort = searchParams.get('sort') || '최신순';
    const newSearch = searchParams.get('search') || '';
    
    setActiveTab(newTab);
    setSelectedCategory(newCategory);
    setSortBy(newSort);
    setSearchQuery(newSearch);
  }, [searchParams]);

  // 🎯 상태 변경 시 URL 업데이트 (프로그래밍적 변경 시에만)
  const updateUrlParams = (updates: {
    tab?: string;
    category?: string;
    sort?: string;
    search?: string;
  }) => {
    isUpdatingUrl.current = true;
    
    const params = new URLSearchParams(searchParams);
    
    if (updates.tab !== undefined) {
      const tabValue = REVERSE_TAB_MAPPING[updates.tab] || 'all';
      if (tabValue === 'all') {
        params.delete('tab');
      } else {
        params.set('tab', tabValue);
      }
    }
    
    if (updates.category !== undefined) {
      if (updates.category === '전체') {
        params.delete('category');
      } else {
        params.set('category', updates.category);
      }
    }
    
    if (updates.sort !== undefined) {
      if (updates.sort === '최신순') {
        params.delete('sort');
      } else {
        params.set('sort', updates.sort);
      }
    }
    
    if (updates.search !== undefined) {
      if (updates.search === '') {
        params.delete('search');
      } else {
        params.set('search', updates.search);
      }
    }
    
    setSearchParams(params, { replace: true });
    
    // 다음 이벤트 루프에서 플래그 리셋
    setTimeout(() => {
      isUpdatingUrl.current = false;
    }, 0);
  };

  // 🎯 탭 변경 핸들러
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    updateUrlParams({ tab: newTab });
  };

  // 🎯 카테고리 변경 핸들러
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    updateUrlParams({ category: newCategory });
  };

  // 🎯 정렬 변경 핸들러
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateUrlParams({ sort: newSort });
  };

  // 🎯 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateUrlParams({ search: query });
  };

  // 데이터 페칭 로직
  useEffect(() => {
    const fetchProducts = async () => {
      if (isUserPeermall && !currentPeermall) {
        console.log('피어몰 정보 로딩을 기다립니다...');
        setLoading(true); 
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // API에 보낼 파라미터를 구성합니다.
        const params: any = {
          tab: REVERSE_TAB_MAPPING[activeTab] || 'all',
          category: selectedCategory === '전체' ? undefined : selectedCategory,
          sortBy: SORT_OPTIONS[sortBy] || 'latest',
          search: searchQuery || undefined,
        };

        if (isUserPeermall) {
          params.peermallId = currentPeermall?.id.toString();
          console.log(`[유저 피어몰] '${currentPeermall?.name}' (ID: ${params.peermallId}) 상품을 조회합니다.`);
        } else if (isMainPage) {
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
    
  }, [activeTab, selectedCategory, sortBy, searchQuery, currentPeermall, isUserPeermall, toast]);

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

        {isUserPeermall && (
          <ProductTabs activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        
        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
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
            showPeermallInfo={isMainPage}
            mode="full"
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;