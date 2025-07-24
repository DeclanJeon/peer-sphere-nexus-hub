// Frontend/src/components/common/product/reviews/ProductDetailTabs.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductReviews } from './ProductReviews';
import { RecommendedProducts } from '../RecommendedProducts';

interface ProductDetailTabsProps {
  productId: string;
  peermallId: string;
  averageRating: number;
  totalReviews: number;
}

const ProductDetailTabs = ({ 
  productId, 
  peermallId,
  averageRating,
  totalReviews
}: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState('reviews');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="reviews">
          리뷰 ({totalReviews})
        </TabsTrigger>
        <TabsTrigger value="recommended">
          추천 상품
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="reviews" className="mt-6">
        <ProductReviews 
          productId={productId}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </TabsContent>
      
      <TabsContent value="recommended" className="mt-6">
        <RecommendedProducts 
          currentProductId={productId}
          peermallId={peermallId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailTabs;