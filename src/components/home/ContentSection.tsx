import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, QrCode, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ContentSectionProps {
  activeTab: string;
  selectedCategory: string;
}

const ContentSection = ({ activeTab, selectedCategory }: ContentSectionProps) => {
  const [showQRCode, setShowQRCode] = useState<number | null>(null);

  // QR코드 생성 함수 (실제 구현에서는 QR 라이브러리 사용)
  const generateQRCodeURL = (mallId: number) => {
    const mallURL = `${window.location.origin}/peermalls/${mallId}`;
    // 실제로는 qrcode 라이브러리나 API를 사용하여 QR코드 생성
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mallURL)}`;
  };

  // 공유하기 함수
  const handleShare = async (mall: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const shareData = {
      title: mall.name,
      text: `${mall.name} - ${mall.category} 피어몰을 확인해보세요!`,
      url: `${window.location.origin}/peermalls/${mall.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "공유 완료",
          description: "피어몰 정보가 성공적으로 공유되었습니다.",
        });
      } else {
        // Web Share API를 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "링크 복사됨",
          description: "피어몰 링크가 클립보드에 복사되었습니다.",
        });
      }
    } catch (error) {
      console.error('공유 실패:', error);
      toast({
        title: "공유 실패",
        description: "공유 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // QR코드 토글 함수
  const handleQRCode = (mallId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShowQRCode(showQRCode === mallId ? null : mallId);
  };

  // Sample data - in real implementation, this would come from IndexedDB
  const newPeermalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', rating: 4.8, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop' },
    { id: 2, name: '스마트 라이프', category: '전자기기', rating: 4.9, image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
    { id: 3, name: '패션 스트리트', category: '패션', rating: 4.7, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' },
  ];

  const newProducts = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', mall: '코스메틱 파라다이스', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop' },
    { id: 2, name: '무선 이어폰 프로', price: '129,000원', mall: '스마트 라이프', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop' },
    { id: 3, name: '캐주얼 맨투맨', price: '45,000원', mall: '패션 스트리트', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop' },
  ];

  const bestPeermalls = [
    { id: 1, name: '럭셔리 브랜드 하우스', category: '명품', rating: 4.9, sales: '1,234', image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=300&h=200&fit=crop' },
    { id: 2, name: '헬스 앤 라이프', category: '건강', rating: 4.8, sales: '987', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
    { id: 3, name: '키즈 원더랜드', category: '유아용품', rating: 4.9, sales: '756', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=200&fit=crop' },
  ];

  const bestProducts = [
    { id: 1, name: '다이아몬드 반지', price: '2,890,000원', mall: '럭셔리 브랜드 하우스', rating: 4.9, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop' },
    { id: 2, name: '프로틴 파우더', price: '89,000원', mall: '헬스 앤 라이프', rating: 4.8, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=200&fit=crop' },
    { id: 3, name: '교육용 태블릿', price: '299,000원', mall: '키즈 원더랜드', rating: 4.9, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop' },
  ];

  const communityPosts = [
    { id: 1, title: '뷰티 제품 추천해주세요!', author: '뷰티러버', comments: 23, likes: 45 },
    { id: 2, title: '신규 피어몰 오픈 후기', author: '몰관리자', comments: 15, likes: 32 },
    { id: 3, title: '전자기기 할인 정보 공유', author: '테크매니아', comments: 8, likes: 18 },
  ];

  const events = [
    { id: 1, title: '신규 가입 이벤트', description: '첫 구매 시 20% 할인', period: '2024.01.01 ~ 01.31', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=300&h=200&fit=crop' },
    { id: 2, title: '베스트 피어몰 선정', description: '월간 베스트 피어몰을 선정합니다', period: '2024.01.15 ~ 01.30', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop' },
    { id: 3, title: '리뷰 작성 이벤트', description: '리뷰 작성 시 포인트 적립', period: '상시 진행', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop' },
  ];

  const getFilteredData = <T extends Record<string, unknown>>(data: T[], filterKey: keyof T) => {
    if (selectedCategory === 'all') return data;
    return data.filter(item => item[filterKey] === selectedCategory);
  };

  // 피어몰 카드 렌더링 함수
  const renderPeermallCard = (mall: any, showSales = false) => (
    <div key={mall.id} className="relative">
      <Link to={`/peermalls/${mall.id}`}>
        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <img src={mall.image} alt={mall.name} className="w-full h-full object-cover" />
              
              {/* QR코드와 공유하기 아이콘 */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => handleQRCode(mall.id, e)}
                  title="QR코드 보기"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => handleShare(mall, e)}
                  title="공유하기"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">{mall.name}</h4>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">{mall.category}</Badge>
                {showSales && (
                  <span className="text-sm text-muted-foreground">판매 {mall.sales}건</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{mall.rating}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      {/* QR코드 모달 */}
      {showQRCode === mall.id && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowQRCode(null)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">{mall.name}</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <img 
                  src={generateQRCodeURL(mall.id)} 
                  alt="QR Code" 
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                QR코드를 스캔하여 피어몰에 바로 접속하세요
              </p>
              <Button 
                onClick={() => setShowQRCode(null)}
                className="w-full"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return (
          <div className="space-y-12">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">신규 피어몰</CardTitle>
                  <CardDescription className="text-base">
                    새롭게 오픈한 피어몰들을 만나보세요
                    {selectedCategory !== 'all' && (
                      <span className="text-primary ml-1">({selectedCategory} 카테고리)</span>
                    )}
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/peermalls/new">전체보기</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredData(newPeermalls, 'category').map((mall) => 
                    renderPeermallCard(mall)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">신규 제품/상품</CardTitle>
                  <CardDescription className="text-base">새롭게 등록된 상품들을 확인해보세요</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/products/new">전체보기</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                        <CardContent className="p-3">
                          <div className="aspect-square overflow-hidden rounded-lg mb-3">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                          <p className="text-primary font-bold mb-1">{product.price}</p>
                          <p className="text-xs text-muted-foreground">{product.mall}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'best':
        return (
          <div className="space-y-12">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">베스트 피어몰</CardTitle>
                  <CardDescription className="text-base">인기 높은 베스트 피어몰들을 확인해보세요</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/peermalls/best">전체보기</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestPeermalls.map((mall) => 
                    renderPeermallCard(mall, true)
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">베스트 제품/상품</CardTitle>
                  <CardDescription className="text-base">인기 높은 베스트 상품들을 만나보세요</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/products/best">전체보기</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bestProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                        <CardContent className="p-3">
                          <div className="aspect-square overflow-hidden rounded-lg mb-3">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                          <p className="text-primary font-bold text-sm mb-2">{product.price}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{product.mall}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{product.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'community':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">커뮤니티 인기 게시글</CardTitle>
                <CardDescription className="text-base">피어몰 사용자들의 생생한 이야기를 만나보세요</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/community">전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <Link key={post.id} to={`/community/${post.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-3">{post.title}</h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>작성자: {post.author}</span>
                          <div className="flex items-center gap-4">
                            <span>💬 {post.comments}</span>
                            <span>❤️ {post.likes}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'events':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">진행중인 이벤트</CardTitle>
                <CardDescription className="text-base">다양한 혜택과 이벤트를 확인해보세요</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to="/events">전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <CardContent className="p-0">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          <Badge variant="outline">{event.period}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default: // 'all'
        return (
          <div className="space-y-12">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">신규 피어몰</CardTitle>
                  <CardDescription className="text-base">새롭게 오픈한 피어몰들을 만나보세요</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/peermalls/new">전체보기</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newPeermalls.slice(0, 3).map((mall) => 
                    renderPeermallCard(mall)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {renderContent()}
      </div>
    </section>
  );
};

export default ContentSection;