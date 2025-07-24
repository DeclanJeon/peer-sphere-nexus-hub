import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Store, ShoppingBag, MessageCircle, Star, QrCode } from 'lucide-react';

const MyPage = () => {
  const stats = [
    { title: '내 피어몰', value: '1개', icon: Store, link: '/mypage/mall' },
    { title: '내 상품', value: '12개', icon: ShoppingBag, link: '/mypage/products' },
    { title: '내 게시글', value: '8개', icon: MessageCircle, link: '/mypage/posts' },
    { title: '내 리뷰', value: '24개', icon: Star, link: '/mypage/reviews' },
  ];

  const quickActions = [
    { title: '피어몰 관리', description: '내 피어몰 정보를 관리하세요', icon: Store, link: '/mypage/mall' },
    { title: '상품 관리', description: '등록한 상품들을 관리하세요', icon: ShoppingBag, link: '/mypage/products' },
    { title: '게시글 관리', description: '작성한 게시글을 관리하세요', icon: MessageCircle, link: '/mypage/posts' },
    { title: 'QR 코드', description: 'QR 코드를 생성하고 관리하세요', icon: QrCode, link: '/qr' },
    { title: '관리 센터', description: '모든 콘텐츠를 한곳에서 관리하세요', icon: User, link: '/mypage/manage' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 실행</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-6 w-6 text-primary mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded border">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 상품이 등록되었습니다</p>
                <p className="text-sm text-muted-foreground">프리미엄 스킨케어 세트 - 2시간 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 댓글이 달렸습니다</p>
                <p className="text-sm text-muted-foreground">피어몰 운영 꿀팁 게시글 - 4시간 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <Star className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 리뷰가 작성되었습니다</p>
                <p className="text-sm text-muted-foreground">무선 이어폰 프로 - 1일 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPage;