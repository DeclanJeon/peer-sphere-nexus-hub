import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

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

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && (
                <Badge variant="default" className="bg-green-500 text-white text-xs">
                  NEW
                </Badge>
              )}
              {product.isBest && (
                <Badge variant="default" className="bg-orange-500 text-white text-xs">
                  BEST
                </Badge>
              )}
              {product.discount && (
                <Badge variant="destructive" className="text-xs">
                  {product.discount}%
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground line-clamp-2 text-sm">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviewCount || 0})
                  </span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                {product.category}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;