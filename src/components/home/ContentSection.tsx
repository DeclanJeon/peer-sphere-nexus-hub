import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import PeermallCard from '@/components/shared/PeermallCard';
import { Peermall } from '@/types/peermall';

interface ContentSectionProps {
  activeTab: string;
  selectedCategory: string;
  isMainPeermall?: boolean; // 메인 피어몰인지 유저 피어몰인지 구분
}

const ContentSection = ({ activeTab, selectedCategory, isMainPeermall = true }: ContentSectionProps) => {
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);

  useEffect(() => {
    const fetchPeermalls = async () => {
      try {
        if (isMainPeermall) {
          // 메인 피어몰에서는 신규 및 베스트 피어몰 가져오기
          const [newMalls, bestMalls] = await Promise.all([
            peermallApi.getNewPeermalls(6),
            peermallApi.getBestPeermalls(6)
          ]);
          
          setNewPeermalls(newMalls);
          setBestPeermalls(bestMalls);
        } else {
          // 유저 피어몰에서는 전체 피어몰에서 일부만 보여주기 (추후 유저별 필터링 추가 가능)
          const allMalls = await peermallApi.getAllPeermalls();
          setNewPeermalls(allMalls.slice(0, 6));
          setBestPeermalls([...allMalls].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6));
        }
      } catch (error) {
        console.error('피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };

    fetchPeermalls();
  }, [isMainPeermall]);

  const getFilteredPeermalls = (peermalls: Peermall[]) => {
    if (selectedCategory === 'all') return peermalls;
    return peermalls.filter(mall => 
      (mall.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const newProducts = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', mall: '코스메틱 파라다이스', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop' },
    { id: 2, name: '무선 이어폰 프로', price: '129,000원', mall: '스마트 라이프', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop' },
    { id: 3, name: '캐주얼 맨투맨', price: '45,000원', mall: '패션 스트리트', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop' },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return (
          <div className="space-y-12">
            {/* 메인 피어몰에서만 피어몰 카드 섹션 표시 */}
            {isMainPeermall && (
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
                    {getFilteredPeermalls(newPeermalls).map((mall) => (
                      <PeermallCard key={mall.id} peermall={mall} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
            {/* 메인 피어몰에서만 피어몰 카드 섹션 표시 */}
            {isMainPeermall && (
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
                    {getFilteredPeermalls(bestPeermalls).map((mall) => (
                      <PeermallCard key={mall.id} peermall={mall} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                          <span className="text-sm bg-muted px-2 py-1 rounded">{event.period}</span>
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
            {/* 메인 피어몰에서만 피어몰 카드 섹션 표시 */}
            {isMainPeermall && (
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
                    {getFilteredPeermalls(newPeermalls).slice(0, 3).map((mall) => (
                      <PeermallCard key={mall.id} peermall={mall} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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