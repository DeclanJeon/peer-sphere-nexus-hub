// src/components/common/layout/UserContentSection.tsx
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Plus } from 'lucide-react';
import ProductList from '@/components/common/product/ProductList';
import BoardList from '@/components/common/community/BoardList';
import EventList from '@/components/common/event/EventList';

interface UserContentSectionProps {
  activeTab: string;
  selectedCategory: string;
}

const UserContentSection = ({ activeTab, selectedCategory }: UserContentSectionProps) => {
  const params = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  
  const currentPeermallId = currentPeermall?.id;

  // 권한 체크: 피어몰 소유주이며 로그인한 유저만 버튼 표시
  const isPeermallOwner = user?.user_uid === currentPeermall?.owner_uid;
  const canCreateEvent = user && isPeermallOwner;

  // 상품 섹션 렌더링
  const renderProductSection = () => {
    if (!['all', 'new', 'best'].includes(activeTab)) {
      return null;
    }

    return (
      <div className="space-y-8">
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
    if (!currentPeermallId) {
      // 피어몰 정보 로딩 중 표시
      return (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>피어몰 정보를 불러오는 중입니다...</p>
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case 'community':
        return (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">커뮤니티</CardTitle>
                <CardDescription className="text-base">피어몰 사용자들의 생생한 이야기를 만나보세요</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="default" asChild>
                  <Link to={`/home/${params.url}/community/create`}>
                    <Plus className="h-4 w-4 mr-2" />
                    글쓰기
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <BoardList 
                peermallId={currentPeermallId}
                onPostClick={(postId) => navigate(`/home/${params.url}/community/${postId}`)}
              />
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
                {canCreateEvent && (
                  <Button variant="default" asChild>
                    <Link to={`/home/${params.url}/event/create`}>
                      <Plus className="h-4 w-4 mr-2" />
                      이벤트 등록
                    </Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to={`/home/${params.url}/events`}>전체보기</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <EventList peermallId={currentPeermallId} />
            </CardContent>
          </Card>
        );

      default:
        // 'all', 'new', 'best' 탭에서는 상품 섹션을 렌더링
        return renderProductSection();
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

export default UserContentSection;