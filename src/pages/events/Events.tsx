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

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={event.status === '진행중' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline">{event.discount}</Badge>
                    </div>
                    <Link to={`/events/${event.id}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                  </div>
                  <Gift className="h-8 w-8 text-primary ml-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>시작: {event.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>종료: {event.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>참여: {event.participants}명</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Button asChild>
                    <Link to={`/events/${event.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;