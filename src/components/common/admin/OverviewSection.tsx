import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Store, 
  ShoppingBag, 
  MessageCircle, 
  Calendar
} from 'lucide-react';

export function OverviewSection() {
  const stats = [
    { title: '내 피어몰', value: '1개', icon: Store },
    { title: '내 상품', value: '12개', icon: ShoppingBag },
    { title: '내 게시글', value: '8개', icon: MessageCircle },
    { title: '내 이벤트', value: '3개', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">관리 현황</h2>
        <p className="text-muted-foreground">
          등록하신 콘텐츠들의 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded border">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 상품이 등록되었습니다</p>
                <p className="text-sm text-muted-foreground">
                  프리미엄 스킨케어 세트 - 2시간 전
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 댓글이 달렸습니다</p>
                <p className="text-sm text-muted-foreground">
                  피어몰 운영 꿀팁 게시글 - 4시간 전
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded border">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">새 이벤트가 시작되었습니다</p>
                <p className="text-sm text-muted-foreground">
                  신제품 런칭 이벤트 - 1일 전
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}