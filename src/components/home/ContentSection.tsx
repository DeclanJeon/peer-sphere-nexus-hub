import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import PeermallCard from '@/components/shared/PeermallCard';
import { Peermall } from '@/types/peermall';
import { Plus } from 'lucide-react';
import { productService, Product, communityService, eventService, Post } from '@/lib/indexeddb';

interface ContentSectionProps {
  activeTab: string;
  selectedCategory: string;
  isMainPeermall?: boolean; // 메인 피어몰인지 유저 피어몰인지 구분
  peermallId?: string; // 유저 피어몰의 ID (유저 피어몰인 경우)
}

const ContentSection = ({ activeTab, selectedCategory, isMainPeermall = true, peermallId }: ContentSectionProps) => {
  const params = useParams();
  const currentPeermallId = peermallId || params.peermallName; // URL에서 피어몰 이름 추출
  
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isMainPeermall) {
          // 메인 피어몰에서는 신규 및 베스트 피어몰 가져오기
          const [newMalls, bestMalls] = await Promise.all([
            peermallApi.getNewPeermalls(6),
            peermallApi.getBestPeermalls(6)
          ]);
          
          setNewPeermalls(newMalls);
          setBestPeermalls(bestMalls);

          // 메인에서는 모든 신규/베스트 제품 표시
          const newProds = await productService.getNewProducts(8);
          const bestProds = await productService.getBestProducts(8);
          setNewProducts(newProds);
          setBestProducts(bestProds);

          // 메인에서는 모든 커뮤니티/이벤트 표시
          const communityData = await communityService.getPopularPosts(6);
          const eventData = await eventService.getRecentEvents(6);
          setCommunityPosts(communityData);
          setEvents(eventData);
        } else {

          // 유저 피어몰에서는 해당 피어몰의 데이터만 표시
          if (currentPeermallId) {
            const newProds = await productService.getProductsByPeermallId(currentPeermallId);
            const sortedNewProds = newProds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
            const sortedBestProds = newProds.sort((a, b) => b.rating - a.rating).slice(0, 8);
            
            setNewProducts(sortedNewProds);
            setBestProducts(sortedBestProds);

            const communityData = await communityService.getPostsByPeermallId(currentPeermallId);
            const eventData = await eventService.getEventsByPeermallId(currentPeermallId);
            
            setCommunityPosts(communityData.slice(0, 6));
            setEvents(eventData.slice(0, 6));
          }
        }
      } catch (error) {
        console.error('피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '데이터를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [isMainPeermall, currentPeermallId]);

  const getFilteredPeermalls = (peermalls: Peermall[]) => {
    if (selectedCategory === 'all') return peermalls;
    return peermalls.filter(mall => 
      (mall.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  };

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
                <div className="flex gap-2">
                  {!isMainPeermall && (
                    <Button variant="default" asChild>
                      <Link to="/products/create">
                        <Plus className="h-4 w-4 mr-2" />
                        제품 등록
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to="/products/new">전체보기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newProducts.length > 0 ? newProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                        <CardContent className="p-3">
                          <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                          <p className="text-primary font-bold mb-1">₩{product.price.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      등록된 제품이 없습니다.
                      {!isMainPeermall && (
                        <div className="mt-2">
                          <Button asChild>
                            <Link to="/products/create">제품 등록하기</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
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
                <div className="flex gap-2">
                  {!isMainPeermall && (
                    <Button variant="default" asChild>
                      <Link to="/products/create">
                        <Plus className="h-4 w-4 mr-2" />
                        제품 등록
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to="/products/best">전체보기</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bestProducts.length > 0 ? bestProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                        <CardContent className="p-3">
                          <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-muted">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                          <p className="text-primary font-bold text-sm mb-2">₩{product.price.toLocaleString()}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium">★ {product.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      베스트 제품이 없습니다.
                    </div>
                  )}
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
              <div className="flex gap-2">
                {!isMainPeermall && (
                  <Button variant="default" asChild>
                    <Link to="/community/create">
                      <Plus className="h-4 w-4 mr-2" />
                      글쓰기
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/community">전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityPosts.length > 0 ? communityPosts.map((post) => (
                  <Link key={post.id} to={`/community/${post.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-3">{post.title}</h4>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>작성자: {post.authorName || '익명'}</span>
                          <div className="flex items-center gap-4">
                            <span>💬 {post.comments}</span>
                            <span>❤️ {post.likes}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    등록된 게시글이 없습니다.
                    {!isMainPeermall && (
                      <div className="mt-2">
                        <Button asChild>
                          <Link to="/community/create">첫 번째 글 작성하기</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
              <div className="flex gap-2">
                {!isMainPeermall && (
                  <Button variant="default" asChild>
                    <Link to="/events/create">
                      <Plus className="h-4 w-4 mr-2" />
                      이벤트 등록
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/events">전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? events.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
                      <CardContent className="p-0">
                        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                          {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              이벤트 이미지
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{event.content}</p>
                          {event.eventPeriod && (
                            <span className="text-sm bg-muted px-2 py-1 rounded">{event.eventPeriod}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    진행중인 이벤트가 없습니다.
                    {!isMainPeermall && (
                      <div className="mt-2">
                        <Button asChild>
                          <Link to="/events/create">이벤트 등록하기</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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