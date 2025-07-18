import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, ShoppingBag, MessageCircle, Heart } from 'lucide-react';

const PeermallDetail = () => {
  const { id } = useParams();

  const mall = {
    id,
    name: '코스메틱 파라다이스',
    category: '뷰티',
    rating: 4.8,
    sales: '234',
    followers: '1,234',
    description: '최고 품질의 코스메틱 제품들을 합리적인 가격에 만나보세요. 검증된 브랜드만을 엄선하여 고객님께 제공합니다.',
    products: [
      { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원' },
      { id: 2, name: '립스틱 컬렉션', price: '45,000원' },
      { id: 3, name: '아이섀도우 팔레트', price: '32,000원' },
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{mall.name}</h1>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{mall.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mall.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      팔로우
                    </Button>
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      문의하기
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">{mall.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                판매 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mall.products.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-primary font-bold">{product.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">총 거래</span>
                </div>
                <span className="font-semibold">{mall.sales}건</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">팔로워</span>
                </div>
                <span className="font-semibold">{mall.followers}명</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">평점</span>
                </div>
                <span className="font-semibold">{mall.rating}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>연락처</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                메시지 보내기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PeermallDetail;