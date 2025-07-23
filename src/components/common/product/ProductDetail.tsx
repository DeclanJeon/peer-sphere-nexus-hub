import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { productApi } from '@/services/product.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/product';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Star, 
  Eye,
  Heart,
  Share2,
  MessageCircle,
  MoreVertical,
  ShoppingBag,
  Lock
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentPeermall } = usePeermall();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // 로그인 여부 확인
  const isLoggedIn = isAuthenticated && user;

  // 상품 등록자인지 확인 (피어몰 소유자 또는 상품 등록자)
  const isProductOwner = () => {
    if (!isLoggedIn || !product) return false;
    
    // 상품의 등록자 ID와 현재 사용자 ID 비교
    const isCreator = product.createdBy === user.id || 
                     product.created_by === user.id ||
                     product.userId === user.id ||
                     product.user_id === user.id;
    
    // 피어몰 소유자인지 확인
    const isPeermallOwner = currentPeermall?.ownerId === user?.email || 
                           currentPeermall?.owner_id === user?.id;
    
    return isCreator || isPeermallOwner;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        console.log("상품 상세 조회 : ", data);
        setProduct(data);
      } catch (error) {
        console.error('상품 조회 실패:', error);
        toast({
          title: '오류',
          description: '상품 정보를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleDelete = async () => {
    // 로그인 확인
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "상품을 삭제하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // 권한 확인
    if (!isProductOwner()) {
      toast({
        title: "권한 없음",
        description: "본인이 등록한 상품만 삭제할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!id) return;
      
      await productApi.deleteProduct(id);
      
      toast({
        title: "상품 삭제 완료",
        description: "상품이 성공적으로 삭제되었습니다."
      });
      
      navigate(`/home/${url}/products`);
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "상품 삭제 중 오류가 발생했습니다."
      });
    }
  };

  const handleEdit = () => {
    // 로그인 확인
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "상품을 수정하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // 권한 확인
    if (!isProductOwner()) {
      toast({
        title: "권한 없음",
        description: "본인이 등록한 상품만 수정할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/home/${url}/products/${product?.id}/edit`);
  };

  const handleStatusToggle = async () => {
    if (!product || !id) return;

    // 로그인 확인
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "상품 상태를 변경하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // 권한 확인
    if (!isProductOwner()) {
      toast({
        title: "권한 없음",
        description: "본인이 등록한 상품만 상태를 변경할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      const formData = new FormData();
      formData.append('status', newStatus);
      
      await productApi.updateProduct(id, formData);
      
      setProduct(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: "상태 변경 완료",
        description: `상품이 ${newStatus === 'active' ? '판매 중' : '판매 중단'} 상태로 변경되었습니다.`
      });
    } catch (error) {
      console.error('상태 변경 오류:', error);
      toast({
        variant: "destructive",
        title: "상태 변경 실패",
        description: "상품 상태 변경 중 오류가 발생했습니다."
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/home/${url}/product/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `${product?.name} - ${currentPeermall?.name}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('공유 취소 또는 오류:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: '링크 복사 완료',
          description: '상품 링크가 클립보드에 복사되었습니다.',
        });
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || !id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate(`/home/${url}`)}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
        
        {/* 로그인한 사용자이고 상품 등록자인 경우에만 관리 메뉴 표시 */}
        {isLoggedIn && isProductOwner() && (
          <div className="flex items-center gap-2 ml-auto">
            <Badge 
              variant={product.status === 'active' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {product.status === 'active' ? '판매중' : '판매중단'}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleStatusToggle}>
                  {product.status === 'active' ? '판매 중단' : '판매 재개'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 왼쪽: 상품 이미지 */}
        <div className="lg:col-span-5">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 상품 정보 및 테이블 */}
        <div className="lg:col-span-7 space-y-6">
          {/* 상품 기본 정보 */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                조회 {(product.views || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                좋아요 {product.likes || 0}
              </span>
              <span>등록일 {new Date(product.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {product.category && (
                <Badge variant="outline">{product.category}</Badge>
              )}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              {product.price && product.price !== product.selling_price && (
                <p className="text-lg text-muted-foreground line-through">
                  {Number(product.price).toLocaleString()}원
                </p>
              )}
              <p className="text-3xl font-bold text-primary">
                {Number(product.selling_price || 0).toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 상품 정보 테이블 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">상품 정보</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 py-2 border-b">
                  <span className="font-medium text-muted-foreground">브랜드</span>
                  <span className="col-span-2">{product.brand || '정보 없음'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b">
                  <span className="font-medium text-muted-foreground">제조사</span>
                  <span className="col-span-2">{product.manufacturer || '정보 없음'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b">
                  <span className="font-medium text-muted-foreground">카테고리</span>
                  <span className="col-span-2">{product.category || '정보 없음'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b">
                  <span className="font-medium text-muted-foreground">상품 상태</span>
                  <span className="col-span-2">
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status === 'active' ? '판매중' : '판매중단'}
                    </Badge>
                  </span>
                </div>
                {product.shipping_fee && (
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <span className="font-medium text-muted-foreground">배송비</span>
                    <span className="col-span-2">{Number(product.shipping_fee).toLocaleString()}원</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          {isLoggedIn && isProductOwner() ? (
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleEdit}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                수정
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 상품이 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 로그인하지 않은 경우 */}
              {!isLoggedIn && (
                <div className="bg-muted/50 border rounded-lg p-4 text-center">
                  <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-3">
                    더 많은 기능을 이용하려면 로그인하세요
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    로그인
                  </Button>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  disabled={!isLoggedIn}
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast({
                        title: "로그인 필요",
                        description: "찜하기 기능은 로그인 후 이용 가능합니다.",
                      });
                      return;
                    }
                    // 찜하기 로직
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  찜하기
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  disabled={!isLoggedIn}
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast({
                        title: "로그인 필요",
                        description: "문의하기 기능은 로그인 후 이용 가능합니다.",
                      });
                      return;
                    }
                    // 문의하기 로직
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  문의하기
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
          </div>
        </div>
      </div>

      {/* 하단: 상세 설명 */}
      <div className="mt-12 space-y-8">
        {/* 상품 상세 설명 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">상품 상세 설명</h3>
            {product.description ? (
              <div 
                className="prose max-w-none text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-muted-foreground">상세 설명이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 상품 특징 */}
        {product.features && product.features.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">상품 특징</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 상품 사양 */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">상품 사양</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row gap-2">
                    <dt className="font-medium text-muted-foreground min-w-[120px]">
                      {key}
                    </dt>
                    <dd className="flex-1">{value}</dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;