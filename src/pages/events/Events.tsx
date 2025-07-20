import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift, Plus, Users } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: '신규 피어몰 오픈 기념 할인 이벤트',
      description: '새로 오픈한 피어몰들의 특별한 할인 혜택을 만나보세요!',
      startDate: '2024-01-15',
      endDate: '2024-01-31',
      status: '진행중',
      participants: 234,
      discount: '최대 50%'
    },
    {
      id: 2,
      title: '베스트 셀러 상품 페스티벌',
      description: '인기 상품들만 모은 특별 페스티벌입니다.',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      status: '진행중',
      participants: 567,
      discount: '30% 할인'
    },
    {
      id: 3,
      title: '한정판 콜라보 상품 출시',
      description: '유명 브랜드와의 콜라보레이션 상품 한정 판매',
      startDate: '2024-01-20',
      endDate: '2024-02-05',
      status: '예정',
      participants: 0,
      discount: '선착순 100명'
    },
  ];

  const categories = [
    { name: '전체', count: 12 },
    { name: '할인', count: 8 },
    { name: '신상품', count: 3 },
    { name: '한정판', count: 1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">피어몰 이벤트</h1>
          <p className="text-muted-foreground">다양한 이벤트와 특별 혜택을 확인해보세요</p>
        </div>
        <Button asChild>
          <Link to="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            이벤트 등록
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>카테고리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer">
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Event Cards Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant={event.status === '진행중' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive" className="text-white">
                      D-{event.status === '진행중' ? '2' : '4'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                    <p className="text-sm opacity-90">{event.startDate} ~ {event.endDate}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.participants}명 참여</span>
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/events/${event.id}`}>
                        참여하기
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* More Events Button */}
          <div className="flex justify-center mt-8">
            <Button variant="outline">더 보기</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;