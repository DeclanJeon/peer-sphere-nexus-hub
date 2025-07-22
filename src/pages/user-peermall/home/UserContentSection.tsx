// UserContentSection.tsx
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePeermall } from '@/contexts/PeermallContext';
import { Plus } from 'lucide-react';
import { communityService, eventService, Post } from '@/lib/indexeddb';
import { Skeleton } from '@/components/ui/skeleton';
import ProductList from '@/components/common/product/ProductList';

interface UserContentSectionProps {
  activeTab: string;
  selectedCategory: string;
}

const UserContentSection = ({ activeTab, selectedCategory }: UserContentSectionProps) => {
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const currentPeermallId = currentPeermall?.id;
    
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 커뮤니티와 이벤트 데이터 로드
  useEffect(() => {
    const fetchOtherData = async () => {
      if (!currentPeermallId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 커뮤니티 탭일 때
        if (activeTab === 'community') {
          const communityData = await communityService.getPostsByPeermallId(currentPeermallId);
          setCommunityPosts(communityData.slice(0, 6));
        }

        // 이벤트 탭일 때
        if (activeTab === 'events') {
          const eventData = await eventService.getEventsByPeermallId(currentPeermallId);
          setEvents(eventData.slice(0, 6));
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        toast({
          title: '오류',
          description: '데이터를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOtherData();
  }, [currentPeermallId, activeTab]);

  // 상품 섹션 렌더링
  const renderProductSection = () => {
    if (!['all', 'new', 'best'].includes(activeTab)) {
      return null;
    }

    return (
      <div className="space-y-8 mb-8">
        {/* 신규 상품 섹션 */}
        {(activeTab === 'all' || activeTab === 'new') && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">신규 상품</CardTitle>
                <CardDescription className="text-base">
                  최근에 등록된 상품들을 확인해보세요
                  {selectedCategory !== 'all' && ` (${selectedCategory})`}
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/home/${params.url}/products?filter=new`}>전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ProductList 
                mode="preview"
                filter="new"
                category={selectedCategory}
                limit={activeTab === 'new' ? 8 : 4}
              />
            </CardContent>
          </Card>
        )}

        {/* 베스트 상품 섹션 */}
        {(activeTab === 'all' || activeTab === 'best') && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">베스트 상품</CardTitle>
                <CardDescription className="text-base">
                  인기 있는 상품들을 만나보세요
                  {selectedCategory !== 'all' && ` (${selectedCategory})`}
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link to={`/home/${params.url}/products?filter=best`}>전체보기</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ProductList 
                mode="preview"
                filter="best"
                category={selectedCategory}
                limit={activeTab === 'best' ? 8 : 4}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'community':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">커뮤니티 인기 게시글</CardTitle>
                <CardDescription className="text-base">피어몰 사용자들의 생생한 이야기를 만나보세요</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="default" asChild>
                  <Link to={`/home/${params.url}/community/create`}>
                    <Plus className="h-4 w-4 mr-2" />
                    글쓰기
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/home/${params.url}/community`}>전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {communityPosts.length > 0 ? communityPosts.map((post) => (
                    <Link key={post.id} to={`/home/${params.url}/community/${post.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <h4 className="font-bold text-lg mb-3">{post.title}</h4>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>작성자: {post.authorName || '익명'}</span>
                            <div className="flex items-center gap-4">
                              <span>💬 {post.comments || 0}</span>
                              <span>❤️ {post.likes || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      등록된 게시글이 없습니다.
                      <div className="mt-2">
                        <Button asChild>
                          <Link to={`/home/${params.url}/community/create`}>첫 번째 글 작성하기</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                <Button variant="default" asChild>
                  <Link to={`/home/${params.url}/events/create`}>
                    <Plus className="h-4 w-4 mr-2" />
                    이벤트 등록
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/home/${params.url}/events`}>전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <Skeleton className="aspect-video w-full" />
                        <div className="p-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.length > 0 ? events.map((event) => (
                    <Link key={event.id} to={`/home/${params.url}/events/${event.id}`}>
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
                      <div className="mt-2">
                        <Button asChild>
                          <Link to={`/home/${params.url}/events/create`}>이벤트 등록하기</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* 상품 섹션 */}
        {currentPeermallId && renderProductSection()}
        
        {/* 선택된 탭에 따른 컨텐츠 */}
        {currentPeermallId ? renderContent() : (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>피어몰 정보를 불러오는 중입니다...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default UserContentSection;