import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Users, ShoppingBag, Star, Settings, Plus, TrendingUp } from 'lucide-react';
import { peermallService } from '@/lib/indexeddb';
import { authService } from '@/lib/indexeddb/authService';

const MyMall = () => {
  const [userPeermalls, setUserPeermalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPeermalls = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const peermalls = await peermallService.getPeermallsByOwnerId(currentUser.id);
          setUserPeermalls(peermalls);
        }
      } catch (error) {
        console.error('Failed to load user peermalls:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPeermalls();
  }, []);

  // 기본 몰 데이터 (피어몰이 없을 때 표시)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">마이몰 관리</h1>
        </div>
        <div className="flex gap-2">
          {userPeermalls.length > 0 && (
            <Button variant="outline" asChild>
              <Link to="/mypage/mall-info">
                <Settings className="h-4 w-4 mr-2" />
                설정
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link to="/peermalls/create">
              <Plus className="h-4 w-4 mr-2" />
              {userPeermalls.length > 0 ? '새 피어몰 생성' : '피어몰 생성'}
            </Link>
          </Button>
        </div>
      </div>

      {userPeermalls.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">아직 생성된 피어몰이 없습니다</h2>
          <p className="text-muted-foreground mb-6">첫 번째 피어몰을 생성해보세요!</p>
          <Button asChild size="lg">
            <Link to="/peermalls/create">
              <Plus className="h-4 w-4 mr-2" />
              피어몰 생성하기
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {userPeermalls.map((peermall) => (
            <div key={peermall.id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{peermall.name}</h2>
                <Button variant="outline" asChild>
                  <Link to={`/peermalls/${peermall.id}/manage`}>관리하기</Link>
                </Button>
              </div>

              {/* Mall Overview */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">{peermall.name}</h3>
                        <Badge variant="secondary">{peermall.category}</Badge>
                        <Badge variant={peermall.status === 'active' ? 'default' : 'secondary'}>
                          {peermall.status === 'active' ? '운영중' : '중단'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{peermall.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{peermall.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          생성일: {new Date(peermall.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="aspect-square w-24 bg-muted rounded-lg">
                      {peermall.image && (
                        <img src={peermall.image} alt={peermall.name} className="w-full h-full object-cover rounded-lg" />
                      )}
                    </div>
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
                            <p className="text-xs text-green-600">{stat.change}</p>
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
                    <Link to={`/peermalls/${peermall.id}/products/create`}>상품 등록</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-2" />
                    <p>아직 등록된 상품이 없습니다</p>
                    <p className="text-sm">첫 번째 상품을 등록해보세요!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMall;