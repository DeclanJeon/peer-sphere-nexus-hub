import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Gift, Users, Share, Heart } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();

  const event = {
    id,
    title: '신규 피어몰 오픈 기념 할인 이벤트',
    description: `새로 오픈한 피어몰들을 위한 특별한 할인 이벤트를 진행합니다!

🎉 이벤트 혜택:
- 신규 피어몰 상품 최대 50% 할인
- 무료배송 쿠폰 제공
- 첫 구매 고객 추가 10% 할인

📋 참여 방법:
1. 이벤트 참여 버튼 클릭
2. 원하는 신규 피어몰 선택
3. 상품 구매 시 자동 할인 적용

⚠️ 주의사항:
- 일부 상품 제외 (명품, 한정판 등)
- 중복 할인 불가
- 이벤트 기간 내 구매분에 한함`,
    startDate: '2024-01-15',
    endDate: '2024-01-31',
    status: '진행중',
    participants: 234,
    discount: '최대 50%',
    category: '할인',
    organizer: '피어몰 운영팀'
  };

  const participatingMalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', discount: '40%' },
    { id: 2, name: '스마트 라이프', category: '전자기기', discount: '30%' },
    { id: 3, name: '패션 스트리트', category: '의류', discount: '50%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={event.status === '진행중' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                    <Badge variant="outline">{event.category}</Badge>
                    <Badge variant="outline">{event.discount}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                </div>
                <Gift className="h-12 w-12 text-primary ml-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
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

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Gift className="h-4 w-4 mr-2" />
                  이벤트 참여하기
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event Description */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{event.description}</div>
              </div>
            </CardContent>
          </Card>

          {/* Participating Malls */}
          <Card>
            <CardHeader>
              <CardTitle>참여 피어몰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participatingMalls.map((mall) => (
                  <Card key={mall.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{mall.name}</h4>
                        <Badge variant="destructive">{mall.discount} 할인</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{mall.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">주최자</span>
                <span className="text-sm font-medium">{event.organizer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">카테고리</span>
                <span className="text-sm font-medium">{event.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">참여자</span>
                <span className="text-sm font-medium">{event.participants}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">할인 혜택</span>
                <span className="text-sm font-medium">{event.discount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <Button className="w-full mb-3">
                <Gift className="h-4 w-4 mr-2" />
                이벤트 참여
              </Button>
              <Button variant="outline" className="w-full mb-3">
                <Share className="h-4 w-4 mr-2" />
                공유하기
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                관심 이벤트 추가
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;