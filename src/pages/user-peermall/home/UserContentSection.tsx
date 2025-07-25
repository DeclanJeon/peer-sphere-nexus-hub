// src/components/common/layout/UserContentSection.tsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import ProductList from '@/components/common/product/ProductList';
import BoardList from '@/components/common/community/BoardList';
import EventList from '@/components/common/event/EventList';
import { productApi } from '@/services/product.api'; // [추가] Product API import
import { Product } from '@/types/product'; // [추가] Product 타입 import

interface UserContentSectionProps {
  activeTab: string;
  selectedCategory: string;
  searchQuery: string;
}

const UserContentSection = ({ activeTab, selectedCategory, searchQuery }: UserContentSectionProps) => {
  const params = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();

  // [추가] 상품 데이터를 위한 상태
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentPeermallId = currentPeermall?.id.toString();

  // 권한 체크: 피어몰 소유주이며 로그인한 유저만 버튼 표시
  const isPeermallOwner = user?.user_uid === currentPeermall?.owner_uid;
  const canCreateEvent = user && isPeermallOwner;

  // [추가] 상품 데이터를 가져오는 useEffect
  useEffect(() => {
    // 상품 관련 탭이 아니거나, 피어몰 ID가 없으면 데이터를 가져오지 않음
    if (!['all', 'new', 'best'].includes(activeTab) || !currentPeermallId) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // [수정] Promise.all을 사용하여 신규/베스트 상품을 병렬로 요청하여 성능 최적화
        const [fetchedNewProducts, fetchedBestProducts] = await Promise.all([
          // 신규 상품 API 호출 (항상 4개 제한)
          productApi.getProducts({
            peermallId: currentPeermallId,
            tab: 'new',
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            // limit: 4 // 백엔드에서 limit 파라미터를 지원해야 함. 현재는 클라이언트에서 자름
          }),
          // 베스트 상품 API 호출 (항상 4개 제한)
          productApi.getProducts({
            peermallId: currentPeermallId,
            tab: 'best',
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            // limit: 4 // 백엔드에서 limit 파라미터를 지원해야 함. 현재는 클라이언트에서 자름
          }),
        ]);

        // [수정] 백엔드에서 limit을 지원하지 않을 경우를 대비해 클라이언트에서 슬라이스
        setNewProducts((fetchedNewProducts || []).slice(0, activeTab === 'new' ? 8 : 4));
        setBestProducts((fetchedBestProducts || []).slice(0, activeTab === 'best' ? 8 : 4));

      } catch (err) {
        console.error("UserContentSection 상품 조회 실패:", err);
        setError("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab, selectedCategory, currentPeermallId]);


  // [추가] 로딩 및 에러 상태 UI
  const renderLoadingOrError = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">상품 정보를 불러오는 중...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center py-16 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-4" />
          <p>{error}</p>
        </div>
      );
    }
    return null;
  };

  // 상품 섹션 렌더링
  const renderProductSection = (filteredNewProducts, filteredBestProducts) => {
    // [수정] 로딩/에러 상태를 먼저 체크
    const loadingOrErrorUI = renderLoadingOrError();
    if (loadingOrErrorUI) {
      return <Card className="shadow-lg"><CardContent>{loadingOrErrorUI}</CardContent></Card>;
    }

    if (!['all', 'new', 'best'].includes(activeTab)) {
      return null;
    }

    return (
      <div className="space-y-8">
        {/* 신규 상품 섹션 */}
        {(activeTab === 'all' || activeTab === 'new') && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">신규 상품</CardTitle>
                <CardDescription className="text-base">
                  최근에 등록된 상품들을 확인해보세요
                  {selectedCategory !== 'all' && ` (${selectedCategory})`}
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/home/${params.url}/products?tab=신상품`}>전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {/* [수정] 직접 fetching한 데이터를 products prop으로 전달 */}
              <ProductList 
                products={filteredNewProducts}
                mode="full" // 미리보기 모드는 ProductList에서 제거하거나, CSS로 처리하는 것을 권장
              />
            </CardContent>
          </Card>
        )}

        {/* 베스트 상품 섹션 */}
        {(activeTab === 'all' || activeTab === 'best') && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">베스트 상품</CardTitle>
                <CardDescription className="text-base">
                  인기 있는 상품들을 만나보세요
                  {selectedCategory !== 'all' && ` (${selectedCategory})`}
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/home/${params.url}/products?tab=베스트`}>전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {/* [수정] 직접 fetching한 데이터를 products prop으로 전달 */}
              <ProductList 
                products={filteredBestProducts}
                mode="full"
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // 검색 및 카테고리 필터링 함수
  const getFilteredProducts = (newProducts: Product[], bestProducts: Product[]) => {
    let filteredNewProducts = [];
    let filteredBestProducts = [];

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filteredNewProducts = newProducts.filter(product => 
        (product.category || product.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
      );

      filteredBestProducts = bestProducts.filter(product => 
        (product.category || product.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      filteredNewProducts = newProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        (product.category || '').toLowerCase().includes(query) ||
        (product.brand || '').toLowerCase().includes(query)
      );

      filteredBestProducts = bestProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        (product.category || '').toLowerCase().includes(query) ||
        (product.brand || '').toLowerCase().includes(query)
      );
    }

    return { filteredNewProducts, filteredBestProducts };
  };

  const renderContent = () => {
    // 검색어가 있을 때
    if (searchQuery.trim()) {
      const { filteredNewProducts, filteredBestProducts } = getFilteredProducts(newProducts, bestProducts);
      
      if (filteredNewProducts.length === 0 && filteredBestProducts.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">''{searchQuery}''에 대한 검색 결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 검색어를 시도해보세요.</p>
          </div>
        );
      }

      return renderProductSection(filteredNewProducts, filteredBestProducts);
    }

    if (!currentPeermallId) {
      return (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>피어몰 정보를 불러오는 중입니다...</p>
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case 'community':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">커뮤니티</CardTitle>
                <CardDescription className="text-base">피어몰 사용자들의 생생한 이야기를 만나보세요</CardDescription>
              </div>
              <Button variant="default" asChild>
                <Link to={`/home/${params.url}/community/create`}>
                  <Plus className="h-4 w-4 mr-2" />
                  글쓰기
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <BoardList 
                peermallId={Number(currentPeermallId)} // BoardList가 number를 기대한다면 변환
                onPostClick={(postId) => navigate(`/home/${params.url}/community/${postId}`)}
              />
            </CardContent>
          </Card>
        );

      case 'events':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">진행중인 이벤트</CardTitle>
                <CardDescription className="text-base">다양한 혜택과 이벤트를 확인해보세요</CardDescription>
              </div>
              <div className="flex gap-2">
                {canCreateEvent && (
                  <Button variant="default" asChild>
                    <Link to={`/home/${params.url}/event/create`}>
                      <Plus className="h-4 w-4 mr-2" />
                      이벤트 등록
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to={`/home/${params.url}/events`}>전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EventList peermallId={currentPeermallId} />
            </CardContent>
          </Card>
        );

      default:
        // 'all', 'new', 'best' 탭에서는 상품 섹션을 렌더링
        return renderProductSection(newProducts, bestProducts);
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {renderContent()}
      </div>
    </section>
  );
};

export default UserContentSection;
