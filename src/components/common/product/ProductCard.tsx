import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react"; // Link 제거
import { Product } from "@/types/product";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/home/${url}/product/${product.id}`);
  };
  
  return (
    <Card 
      className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.png';
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {product.status === 'active' && (
              <Badge className="bg-green-500 hover:bg-green-600">판매중</Badge>
            )}
            {product.isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600">NEW</Badge>
            )}
            {product.isBest && (
              <Badge className="bg-orange-500 hover:bg-orange-600">BEST</Badge>
            )}
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          {product.category && (
            <Badge variant="outline" className="w-fit text-xs mb-2">
              {product.category}
            </Badge>
          )}
          
          <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h4>
          
          <div className="mt-auto space-y-1">
            {product.price && product.price !== product.selling_price && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground line-through">
                  {Number(product.price).toLocaleString()}원
                </p>
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((product.price - product.selling_price) / product.price) * 100)}%
                </Badge>
              </div>
            )}
            <p className="text-primary font-bold text-lg">
              {Number(product.selling_price || 0).toLocaleString()}원
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
