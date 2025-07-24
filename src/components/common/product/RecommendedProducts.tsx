import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productApi } from '@/services/product.api';
import { Product } from '@/types/product';
import { usePeermall } from '@/contexts/PeermallContext';
import { Star, ShoppingBag } from 'lucide-react';

interface RecommendedProductsProps {
  currentProductId: string;
  peermallId: string;
}

export const RecommendedProducts = ({ currentProductId, peermallId }: RecommendedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentPeermall } = usePeermall();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const allProducts = await productApi.getProducts({
          peermallId,
          status: 'active'
        });
        
        // 현재 상품 제외하고 최대 4개까지 추천
        const filtered = allProducts
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
        
        setProducts(filtered);
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [currentProductId, peermallId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>추천 상품</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-6 bg-muted rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>추천 상품</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer space-y-3"
              onClick={() => navigate(`/home/${currentPeermall?.url}/product/${product.id}`)}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                
                <div className="flex items-center gap-2">
                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  {product.price && product.price !== product.selling_price && (
                    <p className="text-sm text-muted-foreground line-through">
                      {Number(product.price).toLocaleString()}원
                    </p>
                  )}
                  <p className="font-bold text-primary">
                    {Number(product.selling_price || 0).toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};