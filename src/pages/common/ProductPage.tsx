import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductList from '@/components/common/product/ProductList';


import ProductTabs from '@/components/common/product/ProductTabs';
import ProductFilters from '@/components/common/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { productApi } from '@/services/product.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useToast } from '@/hooks/use-toast';

const ProductPage = () => {
  const location = useLocation();
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('최신순');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isUserPeermall = location.pathname.startsWith('/home/');
  const peermallUrl = params.url;

  useEffect(() => {
    const fetchProducts = async () => {
      // 피어몰 ID가 없으면 종료
      if (!currentPeermall?.id && isUserPeermall) {
        setLoading(false);
        setError('피어몰 정보를 찾을 수 없습니다.');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        let response: Product[] = [];
        
        if (isUserPeermall && currentPeermall?.id) {
          // 유저 피어몰인 경우 currentPeermall.id 사용
          response = await productApi.getProductsByPeermall(currentPeermall.id);
        } else {
          // 메인 페이지인 경우 전체 상품 조회 (API가 있다면)
          // response = await productApi.getAllProducts();
          // 또는 특정 피어몰 ID로 조회
        //   console.log('메인 페이지 상품 조회');
        }
        
        // 활성 상품만 필터링
        const activeProducts = response.filter(p => p.status === 'active');
        setProducts(activeProducts);
        
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
        setError('상품 목록을 불러오는데 실패했습니다.');
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
  }, [currentPeermall?.id, isUserPeermall, peermallUrl, toast]);

  // 카테고리 목록 추출
  const categories = ['전체', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    let tabFilter = true;
    switch (activeTab) {
      case '신상품':
        tabFilter = product.isNew || false;
        break;
      case '베스트':
        tabFilter = product.isBest || false;
        break;
      case '할인':
        tabFilter = (product.discount || 0) > 0;
        break;
    }

    const categoryFilter = selectedCategory === '전체' || product.category === selectedCategory;
    return tabFilter && categoryFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case '가격낮은순':
        return (a.sellingPrice || 0) - (b.sellingPrice || 0);
      case '가격높은순':
        return (b.sellingPrice || 0) - (a.sellingPrice || 0);
      case '인기순':
        return (b.views || 0) - (a.views || 0); // reviewCount 대신 views 사용
      case '평점순':
        return (b.rating || 0) - (a.rating || 0);
      default: // 최신순
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            상품 {filteredProducts.length > 0 && `(${filteredProducts.length})`}
          </h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            상품 등록
          </Button>
        </div>

        <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">
              {activeTab !== '전체' 
                ? `${activeTab} 상품이 없습니다` 
                : '등록된 상품이 없습니다'}
            </h3>
            <p className="text-muted-foreground">
              {isUserPeermall ? '첫 번째 상품을 등록해보세요!' : '곧 새로운 상품이 등록될 예정입니다.'}
            </p>
          </div>
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
