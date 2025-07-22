import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductGrid from '@/components/common/product/ProductGrid';
import ProductTabs from '@/components/common/product/ProductTabs';
import ProductFilters from '@/components/common/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  category: string;
  isNew?: boolean;
  isBest?: boolean;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

const ProductPage = () => {
  const location = useLocation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('최신순');
  const [products, setProducts] = useState<Product[]>([]);

  // 현재 경로가 메인 피어몰인지 유저 피어몰인지 판단
  const isUserPeermall = location.pathname.startsWith('/home/');
  const peermallUrl = params.url;

  // 목업 데이터
  const mockProducts: Product[] = [
    {
      id: 1,
      name: '프리미엄 무선 이어폰',
      price: 89000,
      originalPrice: 120000,
      image_url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop',
      category: '전자기기',
      isNew: true,
      isBest: true,
      discount: 26,
      rating: 4.8,
      reviewCount: 324
    },
    {
      id: 2,
      name: '스마트 워치 시리즈 X',
      price: 299000,
      image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop',
      category: '전자기기',
      isBest: true,
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: 3,
      name: '미니멀 백팩',
      price: 45000,
      originalPrice: 65000,
      image_url: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=300&h=300&fit=crop',
      category: '패션',
      isNew: true,
      discount: 31,
      rating: 4.4,
      reviewCount: 89
    },
    {
      id: 4,
      name: '홈카페 원두',
      price: 12000,
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop',
      category: '식품',
      rating: 4.7,
      reviewCount: 234
    },
    {
      id: 5,
      name: '아로마 디퓨저',
      price: 35000,
      originalPrice: 50000,
      image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop',
      category: '생활용품',
      discount: 30,
      rating: 4.5,
      reviewCount: 78
    },
    {
      id: 6,
      name: '운동화 스니커즈',
      price: 78000,
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop',
      category: '패션',
      isNew: true,
      rating: 4.3,
      reviewCount: 145
    }
  ];

  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져올 것
    // isUserPeermall과 peermallUrl에 따라 다른 데이터 로드
    setProducts(mockProducts);
  }, [isUserPeermall, peermallUrl, activeTab]);

  const filteredProducts = products.filter(product => {
    // 탭 필터
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

    // 카테고리 필터
    const categoryFilter = selectedCategory === '전체' || product.category === selectedCategory;

    return tabFilter && categoryFilter;
  });

  // 정렬
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case '가격낮은순':
        return a.price - b.price;
      case '가격높은순':
        return b.price - a.price;
      case '인기순':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case '평점순':
        return (b.rating || 0) - (a.rating || 0);
      default: // 최신순
        return b.id - a.id;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">상품</h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            상품 등록
          </Button>
        </div>

        {/* 탭 */}
        <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 필터 및 정렬 */}
        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 상품 그리드 */}
        <ProductGrid products={sortedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;