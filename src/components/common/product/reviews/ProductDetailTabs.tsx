// Frontend/src/components/common/product/ProductTabs.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductReviews } from '@/components/common/product/reviews/ProductReviews';
import { RecommendedProducts } from '@/components/common/product/RecommendedProducts';
import { Star, Package, MessageSquare } from 'lucide-react';

interface ProductTabsProps {
  productId: string;
  peermallId: string;
  averageRating: number;
  totalReviews: number;
}

type TabType = 'reviews' | 'recommended';

const ProductDetailTabs = ({ 
  productId, 
  peermallId, 
  averageRating, 
  totalReviews 
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('recommended');

  const tabs = [
    {
      id: 'recommended' as TabType,
      label: '추천 상품',
      icon: Package,
      content: (
        <RecommendedProducts 
          currentProductId={productId}
          peermallId={peermallId}
        />
      )
    },
    {
      id: 'reviews' as TabType,
      label: '상품 리뷰',
      icon: MessageSquare,
      badge: totalReviews,
      content: (
        <ProductReviews 
          productId={productId}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <nav className="flex space-x-8" aria-label="상품 정보 탭">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }
                `}
                aria-selected={isActive}
                role="tab"
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="ml-1 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
                {tab.id === 'reviews' && averageRating > 0 && (
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{averageRating}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]" role="tabpanel">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default ProductDetailTabs