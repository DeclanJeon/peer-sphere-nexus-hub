import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Users, ShoppingBag, Star, Settings, Plus, TrendingUp } from 'lucide-react';

const MyMall = () => {
  const mallData = {
    name: '코스메틱 파라다이스',
    category: '뷰티',
    rating: 4.8,
    followers: 1234,
    products: 12,
    sales: 89,
    revenue: '2,450,000원',
    description: '최고 품질의 코스메틱 제품들을 합리적인 가격에 만나보세요.',
    status: '운영중'
  };

  const recentProducts = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', status: '판매중' },
    { id: 2, name: '립스틱 컬렉션', price: '45,000원', status: '판매중' },
    { id: 3, name: '아이섀도우 팔레트', price: '32,000원', status: '품절' },
  ];

  const stats = [
    { title: '총 매출', value: mallData.revenue, icon: TrendingUp, change: '+12%' },
    { title: '팔로워', value: mallData.followers.toLocaleString(), icon: Users, change: '+8%' },
    { title: '등록 상품', value: mallData.products, icon: ShoppingBag, change: '+3개' },
    { title: '총 거래', value: mallData.sales, icon: Star, change: '+15%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">마이몰 관리</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/mypage/mall-info">
              <Settings className="h-4 w-4 mr-2" />
              설정
            </Link>
          </Button>
          <Button asChild>
            <Link to="/products/create">
              <Plus className="h-4 w-4 mr-2" />
              상품 등록
            </Link>
          </Button>
        </div>
      </div>

      {/* Mall Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">{mallData.name}</h2>
                <Badge variant="secondary">{mallData.category}</Badge>
                <Badge variant={mallData.status === '운영중' ? 'default' : 'secondary'}>
                  {mallData.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{mallData.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mallData.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{mallData.followers} 팔로워</span>
                </div>
              </div>
            </div>
            <div className="aspect-square w-24 bg-muted rounded-lg"></div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Recent Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>최근 등록 상품</CardTitle>
          <Button variant="outline" asChild>
            <Link to="/mypage/products">전체보기</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded"></div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-primary font-semibold">{product.price}</p>
                  </div>
                </div>
                <Badge variant={product.status === '판매중' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyMall;