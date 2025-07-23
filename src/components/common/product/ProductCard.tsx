import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  QrCode, 
  Share2, 
  Store,
  Eye,
  Star
} from "lucide-react";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from 'react-qr-code';

interface ProductCardProps {
  product: Product;
  showPeermallInfo?: boolean;
  mode?: 'full' | 'list';
}

const ProductCard = ({ product, showPeermallInfo = false, mode = 'full' }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showQRDialog, setShowQRDialog] = useState(false);

  console.log(product)

  // 제품 URL 생성 - 백엔드에서 제공하는 peermall 정보 활용
  const productUrl = `${window.location.origin}/home/${product.peermall?.url || 'unknown'}/product/${product.id}`;
  
  const handleClick = (e: React.MouseEvent) => {
    // QR코드나 공유 버튼 클릭 시 카드 클릭 이벤트 방지
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    navigate(`/home/${product.peermall_url || 'unknown'}/product/${product.id}`);
  };
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `${product.name} - ${product.peermall?.name || ''}`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        toast({
          title: "링크 복사됨",
          description: "제품 링크가 클립보드에 복사되었습니다.",
        });
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };
  
  const handleQRCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQRDialog(true);
  };
  
  return (
    <>
      <Card 
        className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] relative group"
        onClick={handleClick}
      >
        {/* 액션 버튼들 (좌측 상단) */}
        <div className="action-buttons absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={handleQRCode}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-0 h-full flex flex-col">
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
            
            {/* 우측 상단 배지들 - 백엔드에서 계산된 값 사용 */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.status === 'active' && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  판매중
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                  NEW
                </Badge>
              )}
              {product.isBest && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                  BEST
                </Badge>
              )}
              {product.discount && product.discount > 0 && (
                <Badge variant="destructive">
                  {product.discount}%
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-4 flex-1 flex flex-col">
            {/* 피어몰 정보 (메인 페이지에서만 표시) */}
            {showPeermallInfo && product.peermall && (
              <div 
                className="flex items-center gap-2 mb-2 cursor-pointer hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/home/${product.peermall.url}`);
                }}
              >
                <Store className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate hover:text-primary">
                  {product.peermall.name}
                </span>
              </div>
            )}
            
            {product.category && (
              <Badge variant="outline" className="w-fit text-xs mb-2">
                {product.category}
              </Badge>
            )}
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h4>
            
            {/* 조회수 및 평점 - views가 있을 때만 표시 */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              {product.views !== undefined && product.views > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views.toLocaleString()}</span>
                </div>
              )}
              {product.rating !== undefined && product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="mt-auto space-y-1">
              {/* 할인가격 표시 - 백엔드에서 계산된 discount 사용 */}
              {/* {product.discount && product.discount > 0 && product.price && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground line-through">
                    {Number(product.price).toLocaleString()}원
                  </p>
                  <Badge variant="destructive" className="text-xs">
                    {product.discount}% OFF
                  </Badge>
                </div>
              )} */}
              <p className="text-primary font-bold text-lg">
                {Number(product.selling_price || 0).toLocaleString()}원
              </p>
              
              {/* 배송비 정보가 있을 경우 표시 */}
              {product.shipping_fee !== undefined && product.shipping_fee > 0 && (
                <p className="text-xs text-muted-foreground">
                  배송비 {Number(product.shipping_fee).toLocaleString()}원
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR 코드 다이얼로그 */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>제품 QR 코드</DialogTitle>
            <DialogDescription>
              QR 코드를 스캔하여 제품 페이지로 이동하세요
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <QRCode 
                value={productUrl} 
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.peermall?.name}</p>
              {product.discount && product.discount > 0 && (
                <p className="text-sm font-medium text-destructive">
                  {product.discount}% 할인 중
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(productUrl);
                toast({
                  title: "링크 복사됨",
                  description: "제품 링크가 클립보드에 복사되었습니다.",
                });
              }}
              variant="outline"
              className="w-full"
            >
              링크 복사
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;