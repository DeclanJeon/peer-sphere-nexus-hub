import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { productApi } from '@/services/product.api';
import ProductCard from '@/components/common/product/ProductCard';
import ProductCreateModal from '@/components/common/ProductCreateModal';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';

const ProductPage = () => {
  const { user } = useAuth();
  const { currentPeermall } = usePeermall();
  const [activeTab, setActiveTab] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // 피어몰 소유자인지 확인
  const isOwner = currentPeermall?.ownerId === user?.email || 
                  currentPeermall?.owner_id === user?.id;

  const categories = [
    { value: 'all', label: '전체' },
    { value: '패션', label: '패션' },
    { value: '전자제품', label: '전자제품' },
    { value: '뷰티', label: '뷰티' },
    { value: '식품', label: '식품' },
    { value: '생활용품', label: '생활용품' },
    { value: '스포츠', label: '스포츠' },
    { value: '도서', label: '도서' },
    { value: '기타', label: '기타' },
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'price-low', label: '가격 낮은순' },
    { value: 'price-high', label: '가격 높은순' },
    { value: 'popular', label: '인기순' },
    { value: 'rating', label: '평점순' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  useEffect(() => {
    filterAndSortProducts();
  }, [allProducts, bestProducts, newProducts, searchQuery, selectedCategory, sortBy, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data: Product[] = [];
      
      if (currentPeermall?.id) {
        // 특정 피어몰의 상품만 가져오기
        data = await productApi.getProductsByPeermall(currentPeermall.id);
      } else {
        // 전체 상품 가져오기 (메인 페이지)
        data = await productApi.getProducts();
      }

      // 활성 상품만 필터링
      const activeProducts = data.filter(p => p.status === 'active');
      
      setAllProducts(activeProducts);
      
      // 베스트 상품 (조회수 기준)
      const sortedByViews = [...activeProducts].sort((a, b) => (b.views || 0) - (a.views || 0));
      setBestProducts(sortedByViews.slice(0, 20));
      
      // 신규 상품 (등록일 기준)
      const sortedByDate = [...activeProducts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNewProducts(sortedByDate.slice(0, 20));
      
    } catch (error) {
      console.error('상품 데이터 로드 실패:', error);
      toast({
        title: '오류',
        description: '상품 데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let products: Product[] = [];
    
    switch (activeTab) {
      case 'best':
        products = bestProducts;
        break;
      case 'new':
        products = newProducts;
        break;
      default:
        products = allProducts;
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      products = products.filter(product => product.category === selectedCategory);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // latest
        sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredProducts(sorted);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('latest');
  };

  const handleProductCreated = () => {
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 페이지 헤더 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          {currentPeermall ? `${currentPeermall.name} 상품` : '전체 상품'}
        </h1>
        <p className="text-muted-foreground">
          {currentPeermall 
            ? '피어몰의 다양한 상품을 만나보세요'
            : '모든 피어몰의 상품을 한곳에서 만나보세요'
          }
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="상품명, 브랜드로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 탭 컨텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">전체 상품</TabsTrigger>
            <TabsTrigger value="best">베스트 상품</TabsTrigger>
            <TabsTrigger value="new">신규 상품</TabsTrigger>
          </TabsList>
          
          {isOwner && currentPeermall && (
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              상품 등록
            </Button>
          )}
        </div>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <ShoppingBag className="inline-block h-6 w-6 mr-2" />
                전체 상품
              </CardTitle>
              <CardDescription>
                {currentPeermall ? '피어몰의 모든 상품' : '등록된 모든 상품'}
                {selectedCategory !== 'all' && (
                  <span className="text-primary ml-1">
                    ({categories.find(c => c.value === selectedCategory)?.label} 카테고리)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground">로딩 중...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg">조건에 맞는 상품이 없습니다.</p>
                      <p className="text-sm mt-2">
                        {searchQuery || selectedCategory !== 'all' 
                          ? '검색어나 필터를 변경해보세요.' 
                          : '아직 등록된 상품이 없습니다.'}
                      </p>
                      {isOwner && currentPeermall && !searchQuery && selectedCategory === 'all' && (
                        <Button 
                          onClick={() => setCreateModalOpen(true)} 
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          첫 상품 등록하기
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🏆 베스트 상품</CardTitle>
              <CardDescription>
                가장 인기있는 상품들을 만나보세요
                {selectedCategory !== 'all' && (
                  <span className="text-primary ml-1">
                    ({categories.find(c => c.value === selectedCategory)?.label} 카테고리)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground">로딩 중...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">조건에 맞는 베스트 상품이 없습니다.</p>
                      <p className="text-sm mt-2">다른 카테고리를 확인해보세요.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">✨ 신규 상품</CardTitle>
              <CardDescription>
                최근에 등록된 새로운 상품들을 확인해보세요
                {selectedCategory !== 'all' && (
                  <span className="text-primary ml-1">
                    ({categories.find(c => c.value === selectedCategory)?.label} 카테고리)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground">로딩 중...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg">조건에 맞는 신규 상품이 없습니다.</p>
                      <p className="text-sm mt-2">다른 카테고리를 확인해보세요.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 상품 등록 모달 */}
      <ProductCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleProductCreated}
      />
    </div>
  );
};

export default ProductPage;