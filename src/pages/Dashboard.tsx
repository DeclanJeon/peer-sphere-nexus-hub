import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const newPeermalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', rating: 4.8, image: '/placeholder.svg' },
    { id: 2, name: '스마트 라이프', category: '전자기기', rating: 4.9, image: '/placeholder.svg' },
    { id: 3, name: '패션 스트리트', category: '의류', rating: 4.7, image: '/placeholder.svg' },
  ];

  const newProducts = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', mall: '코스메틱 파라다이스', image: '/placeholder.svg' },
    { id: 2, name: '무선 이어폰 프로', price: '129,000원', mall: '스마트 라이프', image: '/placeholder.svg' },
    { id: 3, name: '캐주얼 맨투맨', price: '45,000원', mall: '패션 스트리트', image: '/placeholder.svg' },
  ];

  const bestPeermalls = [
    { id: 1, name: '럭셔리 브랜드 하우스', category: '명품', rating: 4.9, sales: '1,234', image: '/placeholder.svg' },
    { id: 2, name: '헬스 앤 라이프', category: '건강', rating: 4.8, sales: '987', image: '/placeholder.svg' },
    { id: 3, name: '키즈 원더랜드', category: '유아용품', rating: 4.9, sales: '756', image: '/placeholder.svg' },
  ];

  const bestProducts = [
    { id: 1, name: '다이아몬드 반지', price: '2,890,000원', mall: '럭셔리 브랜드 하우스', rating: 4.9, image: '/placeholder.svg' },
    { id: 2, name: '프로틴 파우더', price: '89,000원', mall: '헬스 앤 라이프', rating: 4.8, image: '/placeholder.svg' },
    { id: 3, name: '교육용 태블릿', price: '299,000원', mall: '키즈 원더랜드', rating: 4.9, image: '/placeholder.svg' },
  ];

  const stats = [
    { title: '전체 피어몰', value: '1,234', icon: Store, change: '+12%' },
    { title: '전체 상품', value: '45,678', icon: ShoppingBag, change: '+8%' },
    { title: '활성 사용자', value: '12,345', icon: Users, change: '+15%' },
    { title: '이번달 거래', value: '234', icon: TrendingUp, change: '+22%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">피어몰에 오신 것을 환영합니다! 🎉</h1>
        <p className="text-primary-foreground/80 mb-4">
          새로운 피어 투 피어 쇼핑몰 플랫폼에서 다양한 상품과 서비스를 만나보세요.
        </p>
        <Button variant="secondary" asChild>
          <Link to="/peermalls/create">
            <Plus className="h-4 w-4 mr-2" />
            피어몰 만들기
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-korean-green">{stat.change}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Peermalls Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              신규 피어몰
            </CardTitle>
            <CardDescription>최근에 개설된 피어몰들을 확인해보세요</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/peermalls/new">전체보기</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newPeermalls.map((mall) => (
              <Link key={mall.id} to={`/peermalls/${mall.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">{mall.name}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{mall.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{mall.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              신규 제품/상품
            </CardTitle>
            <CardDescription>새롭게 등록된 제품들을 만나보세요</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products/new">전체보기</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-primary font-bold mb-1">{product.price}</p>
                    <p className="text-sm text-muted-foreground">{product.mall}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Peermalls Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              베스트 피어몰
            </CardTitle>
            <CardDescription>인기가 많은 피어몰들을 확인해보세요</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/peermalls/best">전체보기</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestPeermalls.map((mall) => (
              <Link key={mall.id} to={`/peermalls/${mall.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">{mall.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{mall.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{mall.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">거래 {mall.sales}건</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              베스트 제품/상품
            </CardTitle>
            <CardDescription>가장 인기있는 제품들을 만나보세요</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products/best">전체보기</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-primary font-bold mb-1">{product.price}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{product.mall}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">커뮤니티 참여</h3>
            <p className="text-sm text-muted-foreground mb-4">다른 사용자들과 소통해보세요</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/community">커뮤니티 가기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">이벤트 확인</h3>
            <p className="text-sm text-muted-foreground mb-4">진행 중인 이벤트를 확인하세요</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/events">이벤트 보기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Store className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">내 피어몰 관리</h3>
            <p className="text-sm text-muted-foreground mb-4">내 피어몰을 관리하고 운영하세요</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/mypage">관리하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;