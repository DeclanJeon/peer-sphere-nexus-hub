import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import { Peermall } from '@/types/peermall';
import { Plus } from 'lucide-react';
import { productService, Product, communityService, eventService, Post } from '@/lib/indexeddb';
import PeermallCard from '@/components/home/PeermallCard';

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

  // ========== 목업 데이터 START ==========
  // 실제 API 연동 시 제거 예정인 더미 데이터입니다.
  const mockCommunityPosts: Post[] = [
    {
      id: '1',
      title: '공짜로 물품을 구매할 수 있는 정보의 창고!!!!!!!!!',
      content: '여러분! 정말 유용한 정보를 공유하고 싶어서 글 올려요. 다양한 할인 정보와 무료 샘플 받는 방법들을 모아두었어요.',
      authorName: '윤하',
      authorId: 'user1',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      likes: 256,
      comments: 89,
      type: 'community',
      peermallId: 'main'
    },
    {
      id: '2',
      title: '소금 추천 좀',
      content: '요리할 때 쓸 좋은 소금 추천해주세요~ 천일염이 좋을까요?',
      authorName: '요리초보',
      authorId: 'user2',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      likes: 25,
      comments: 34,
      type: 'community',
      peermallId: 'main'
    },
    {
      id: '3',
      title: '피어몰 운영 꿀팁 공유합니다!',
      content: '6개월간 피어몰을 운영하면서 얻은 노하우들을 공유해드릴게요.',
      authorName: '성공피어몰러',
      authorId: 'user3',
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      likes: 156,
      comments: 67,
      type: 'community',
      peermallId: 'main'
    },
    {
      id: '4',
      title: '신규 상품 홍보 방법이 궁금해요',
      content: '새로운 상품을 등록했는데 어떻게 홍보해야 효과적일까요?',
      authorName: '초보판매자',
      authorId: 'user4',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      likes: 43,
      comments: 28,
      type: 'community',
      peermallId: 'main'
    },
    {
      id: '5',
      title: '올해 트렌드 분석 자료',
      content: '2024년 소비 트렌드 분석 자료를 공유합니다. 피어몰 운영에 도움이 되길!',
      authorName: '마켓분석가',
      authorId: 'user5',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      likes: 89,
      comments: 45,
      type: 'community',
      peermallId: 'main'
    },
    {
      id: '6',
      title: '고객 서비스 개선 방안',
      content: '더 나은 고객 서비스를 제공하는 방법들에 대해 이야기해볼까요?',
      authorName: '서비스기획자',
      authorId: 'user6',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      likes: 76,
      comments: 52,
      type: 'community',
      peermallId: 'main'
    }
  ];

  const mockEvents: Post[] = [
    {
      id: '7',
      title: '신규 가입자 특별 혜택',
      content: '새로 가입하시는 분들께 특별한 혜택을 드립니다! 첫 구매 시 30% 할인! 이벤트 기간: 2024.01.20 ~ 2024.02.29',
      authorName: '피어몰 운영진',
      authorId: 'admin1',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      likes: 234,
      comments: 67,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.20 ~ 2024.02.29',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'
    },
    {
      id: '8',
      title: '겨울 세일 대축제',
      content: '모든 의류 상품 최대 50% 할인! 따뜻한 겨울 준비하세요. 이벤트 기간: 2024.01.15 ~ 2024.01.31',
      authorName: '패션 스토어',
      authorId: 'store1',
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
      likes: 189,
      comments: 45,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.15 ~ 2024.01.31',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
    },
    {
      id: '9',
      title: '건강식품 체험단 모집',
      content: '신제품 건강식품 체험단을 모집합니다. 무료 체험 후 리뷰만 작성해주세요! 이벤트 기간: 2024.01.18 ~ 2024.02.10',
      authorName: '헬스 앤 뷰티',
      authorId: 'store2',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      likes: 156,
      comments: 89,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.18 ~ 2024.02.10',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop'
    },
    {
      id: '10',
      title: '반려동물 용품 특가전',
      content: '사랑하는 반려동물을 위한 모든 용품이 특가! 지금 바로 확인하세요. 이벤트 기간: 2024.01.17 ~ 2024.01.30',
      authorName: '펫 케어',
      authorId: 'store3',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      likes: 123,
      comments: 34,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.17 ~ 2024.01.30',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop'
    },
    {
      id: '11',
      title: '홈 인테리어 컨테스트',
      content: '여러분의 멋진 인테리어 사진을 공유하고 상품을 받아가세요! 이벤트 기간: 2024.01.16 ~ 2024.02.15',
      authorName: '홈 데코',
      authorId: 'store4',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      likes: 98,
      comments: 56,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.16 ~ 2024.02.15',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
    },
    {
      id: '12',
      title: '스마트폰 액세서리 런칭 기념',
      content: '새로운 스마트폰 액세서리 출시를 기념하여 특별가로 만나보세요! 이벤트 기간: 2024.01.15 ~ 2024.01.25',
      authorName: '테크 이노베이션',
      authorId: 'store5',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      likes: 87,
      comments: 23,
      type: 'event',
      peermallId: 'main',
      eventPeriod: '2024.01.15 ~ 2024.01.25',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'
    }
  ];
  // ========== 목업 데이터 END ==========

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

          // 메인에서는 모든 커뮤니티/이벤트 표시 (목업 데이터 사용)
          setCommunityPosts(mockCommunityPosts);
          setEvents(mockEvents);
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
