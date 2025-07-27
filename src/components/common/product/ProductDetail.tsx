import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { productApi } from '@/services/product.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Product, SellerLink } from '@/types/product';
import SellerLinks from './SellerLinks';
import sellerLinksData from '@/seeds/sellerLinks.json';
import { eventApi } from '@/services/event.api';
import ProductDetailTabs from '@/components/common/product/reviews/ProductDetailTabs';
import BoardList from '@/components/common/community/BoardList';
import {
  ArrowLeft,
  Star,
  Eye,
  Heart,
  Share2,
  MoreVertical,
  ShoppingBag,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Plus,
  Globe,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import ProductModal from '@/components/common/product/ProductModal';
import { id } from 'date-fns/locale';

const ProductDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentPeermall } = usePeermall();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // 판매점 링크를 위한 상태 추가
  const [sellerLinks, setSellerLinks] = useState<SellerLink[]>([]);
  const [applyingEvent, setApplyingEvent] = useState(false);
  const [productMessages] = useState([
    { id: 1, title: "맛있는 요리 먹고 싶어요", author: "김푸드", created_at: "2024-01-15", views: 45, likes: 8, category: "맛집", comment_count: 12 },
    { id: 2, title: "저랑 만나실 분", author: "이만남", created_at: "2024-01-14", views: 67, likes: 15, category: "모임", comment_count: 25 },
    { id: 3, title: "이 상품 후기 궁금해요", author: "박궁금", created_at: "2024-01-13", views: 89, likes: 22, category: "후기", comment_count: 18 }
  ]);

  // 로그인 여부 확인
  const isLoggedIn = isAuthenticated && user;

  // 상품 등록자인지 확인
  const isProductOwner = () => {
    if (!isLoggedIn || !product) return false;
    const isCreator = product.createdBy === user.id || 
                     product.created_by === user.id ||
                     product.userId === user.id ||
                     product.user_id === user.id;
    const isPeermallOwner = currentPeermall?.ownerId === user?.email || 
                           currentPeermall?.owner_id === user?.id;
    return isCreator || isPeermallOwner;
  };

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const data = await productApi.getProductById(id);
      setProduct(data);
      
      // 더미 데이터에서 현재 상품 ID에 해당하는 판매점 링크를 찾습니다.
      const links = (sellerLinksData as any)[id] || [];
      setSellerLinks(links);
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
  }, [id, toast]);

  // 이벤트 신청 핸들러
  const handleEventApply = async () => {
    if (!user || !id) {
      toast({
        title: '로그인 필요',
        description: '이벤트 신청을 위해 로그인해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setApplyingEvent(true);
    try {
      const result = await eventApi.applyForEvent(id, user.user_uid);
      
      if (result.success) {
        toast({
          title: '신청 완료',
          description: result.message,
        });
      } else {
        toast({
          title: '신청 실패',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('이벤트 신청 실패:', error);
      toast({
        title: '오류',
        description: '이벤트 신청 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setApplyingEvent(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, [fetchProduct]);

  const handleDelete = async () => {
    if (!isLoggedIn || !isProductOwner()) {
      toast({ title: "권한 없음", description: "본인이 등록한 상품만 삭제할 수 있습니다.", variant: "destructive" });
      return;
    }

    try {
      if (!id) return;
      await productApi.deleteProduct(id);
      toast({ title: "상품 삭제 완료", description: "상품이 성공적으로 삭제되었습니다." });
      navigate(`/home/${url}/products`);
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      toast({ variant: "destructive", title: "삭제 실패", description: "상품 삭제 중 오류가 발생했습니다." });
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEdit = () => {
    if (!isLoggedIn || !isProductOwner()) {
      toast({ title: "권한 없음", description: "본인이 등록한 상품만 수정할 수 있습니다.", variant: "destructive" });
      return;
    }
    setIsEditModalOpen(true);
  };

  // 수정 성공 후 처리
  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    setLoading(true);
    fetchProduct();
  };

  const handleStatusToggle = async () => {
    if (!product || !id || !isLoggedIn || !isProductOwner()) {
      toast({ title: "권한 없음", description: "상품 상태를 변경할 권한이 없습니다.", variant: "destructive" });
      return;
    }
    
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const formData = new FormData();
      formData.append('status', newStatus);
      
      await productApi.updateProduct(id, formData);
      
      setProduct(prev => prev ? { ...prev, status: newStatus } : null);
      toast({ title: "상태 변경 완료", description: `상품이 ${newStatus === 'active' ? '판매 중' : '판매 중단'} 상태로 변경되었습니다.` });
    } catch (error) {
      console.error('상태 변경 오류:', error);
      toast({ variant: "destructive", title: "상태 변경 실패", description: "상품 상태 변경 중 오류가 발생했습니다." });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/home/${url}/product/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, text: `${product?.name} - ${currentPeermall?.name}`, url: shareUrl });
      } catch (error) { console.log('공유 취소 또는 오류:', error); }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: '링크 복사 완료', description: '상품 링크가 클립보드에 복사되었습니다.' });
      } catch (error) { console.error('클립보드 복사 실패:', error); }
    }
  };

  // ✨ [추가] 요구사항 6번: 신고하기 핸들러
  const handleReport = () => {
    if (!isLoggedIn) {
      toast({ title: "로그인 필요", description: "신고하기 기능은 로그인 후 이용 가능합니다.", variant: "destructive" });
      return;
    }
    // TODO: 신고하기 모달 또는 페이지로 이동
    toast({ title: "준비 중", description: "신고하기 기능이 준비 중입니다." });
  };

  // 메시지 클릭 핸들러
  const handleMessageClick = (messageId: number) => {
    navigate(`/home/${url}/product/${id}/channel/${messageId}`);
  };

  // 메시지 생성 핸들러
  const handleCreateMessage = () => {
    if (!isLoggedIn) {
      toast({ title: "로그인 필요", description: "메시지 작성은 로그인 후 이용 가능합니다.", variant: "destructive" });
      return;
    }
    navigate(`/home/${url}/product/${id}/message/create`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8"><Skeleton className="h-10 w-24" /><Skeleton className="h-8 w-64" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><Skeleton className="aspect-square w-full" /><div className="space-y-4"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 w-32" /><Skeleton className="h-20 w-full" /><Skeleton className="h-12 w-full" /></div></div>
      </div>
    );
  }

  if (!product || !id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center"><h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1><Button onClick={() => navigate(`/home/${url}`)}>홈으로 돌아가기</Button></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 상단 네비게이션 */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />뒤로가기</Button>

          {isLoggedIn && (
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm">판매점 등록</Button>
              <Button variant="outline" size="sm">이벤트 신청</Button>
            </div>
          )}
          
          {isLoggedIn && isProductOwner() && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>수정</Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>삭제</Button>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-sm">{product.status === 'active' ? '판매중' : '판매중단'}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStatusToggle}>{product.status === 'active' ? '판매 중단' : '판매 재개'}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 왼쪽: 상품 이미지 */}
          <div className="lg:col-span-5">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              {product.image_url ? (<img src={product.image_url} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder-product.png'; }} />) : (<div className="w-full h-full flex items-center justify-center"><ShoppingBag className="h-24 w-24 text-muted-foreground" /></div>)}
            </div>
            <Card className="mt-6">
              <CardContent className="p-6">
                {/* 🎯 변경사항 2: 메시지 리스트 제목 추가 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      상품 관련 커뮤니티
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCreateMessage}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      글쓰기
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    이 상품에 대한 질문, 후기, 모임 등을 자유롭게 나눠보세요
                  </p>
                </div>
                
                <div className="space-y-2">
                  {productMessages.map((message) => (
                    <div 
                      key={message.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleMessageClick(message.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.title}</span>
                          <Badge variant="outline" className="text-xs">{message.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {message.author} · {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {message.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {message.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {message.comment_count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 상품 정보 및 테이블 */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              {/* ✨ [수정] 요구사항 5번: 좋아요 제거 */}
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />조회 {(product.views || 0).toLocaleString()}</span>
                <span>등록일 {new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {product.category && (<Badge variant="outline">{product.category}</Badge>)}
                {product.rating && (<div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{product.rating}</span></div>)}
              </div>
              <div className="mb-6">
                {product.price && product.price !== product.selling_price && (<p className="text-lg text-muted-foreground line-through">{Number(product.price).toLocaleString()}원</p>)}
                <p className="text-3xl font-bold text-primary">{Number(product.selling_price || 0).toLocaleString()}원</p>
              </div>

              {/* SellerLinks 컴포넌트 렌더링 */}
              <SellerLinks links={sellerLinks} />

              {/* 이벤트 신청 버튼 */}
              <div className="mt-6">
                <Button 
                  onClick={handleEventApply}
                  disabled={!user || applyingEvent}
                  size="lg"
                  className="w-full"
                >
                  {applyingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  이벤트 신청하기
                </Button>
              </div>
            </div>

            {/* ✨ [추가] 요구사항 4번: 필수 표기 정보 표 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">상품 정보</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-medium text-muted-foreground">브랜드</span>
                    <span className="col-span-2 flex items-center gap-2">
                      {product.brand || '정보 없음'}
                      {/* ✨ [유지] 브랜드 홈페이지 버튼 */}
                      {product.brand_website && ( 
                        <Button asChild variant="ghost" size="sm" className="h-auto p-1">
                          <a href={product.brand_website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b"><span className="font-medium text-muted-foreground">제조사</span><span className="col-span-2">{product.manufacturer || '정보 없음'}</span></div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b"><span className="font-medium text-muted-foreground">유통사</span><span className="col-span-2">{product.distributor || '정보 없음'}</span></div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b"><span className="font-medium text-muted-foreground">카테고리</span><span className="col-span-2">{product.category || '정보 없음'}</span></div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b"><span className="font-medium text-muted-foreground">상품 상태</span><span className="col-span-2"><Badge variant={product.status === 'active' ? 'default' : 'secondary'}>{product.status === 'active' ? '판매중' : '판매중단'}</Badge></span></div>
                  {product.shipping_fee !== undefined && (<div className="grid grid-cols-3 gap-4 py-2"><span className="font-medium text-muted-foreground">배송비</span><span className="col-span-2">{Number(product.shipping_fee) === 0 ? '무료배송' : `${Number(product.shipping_fee).toLocaleString()}원`}</span></div>)}
                </div>
              </CardContent>
            </Card>

            {/* 구매/문의 버튼 영역 */}
            <div className="space-y-3">
              {product.product_url && (
                <Button asChild className="w-full" size="lg">
                  <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    바로 구매
                  </a>
                </Button>
              )}

              <div className="flex gap-3">
                {/* 🎯 변경사항 1: 브랜드 홈페이지 가기 버튼 추가 */}
                {product.brand_website && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={product.brand_website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      브랜드 홈페이지 가기
                    </a>
                  </Button>
                )}

                {/* ✨ [추가] 요구사항 3번: 고객센터 버튼 */}
                {currentPeermall?.url && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`https://peerterra.com/one/channel/${currentPeermall.url}`} target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      고객센터
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant={isLiked ? "default" : "outline"} 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  좋아요 {product.likes ? `(${product.likes})` : ''}
                </Button>

                <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </Button>
              </div>
            </div>
          </div>
        </div>

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

        {/* 상품 특징 (있는 경우만) */}
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

        {/* 상품 사양 (있는 경우만) */}
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
                    <dd className="flex-1">{String(value)}</dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* 탭 기반 리뷰/추천 상품 섹션 */}
        <ProductDetailTabs 
          productId={id}
          peermallId={product.peermall_id}
          averageRating={product.rating || 0}
          totalReviews={product.review_count || 0}
        />
      </div>
    </div>
    
    {/* 수정 모달 */}
    <ProductModal 
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSuccess={handleUpdateSuccess}
      mode="edit"
      productToEdit={product}
    />
    </>
  );
};

export default ProductDetail;