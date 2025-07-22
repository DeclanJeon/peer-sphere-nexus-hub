import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const Events = () => {
  const [selectedTab, setSelectedTab] = useState('전체');
  
  const tabs = ['전체', '진행중', '종료', '예정'];

  const events = [
    {
      id: 1,
      title: '[인기순위] 담터울 날렵터링?',
      subtitle: '인기순위수',
      description: '담터울의 놀라운 이벤트에 참여하세요!',
      startDate: '2025.07.15',
      endDate: '2025.07.20',
      dDay: 'D-2',
      status: '진행중',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=200&fit=crop',
      color: 'from-pink-400 to-purple-500'
    },
    {
      id: 2,
      title: '[STAR] 7월의 스타 투표하기',
      subtitle: '이달의 스타 투표하기!',
      description: '7월의 스타를 투표로 선정해보세요!',
      startDate: '2025.07.14',
      endDate: '2025.07.23',
      dDay: 'D-4',
      status: '진행중',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      color: 'from-purple-400 to-blue-500'
    },
    {
      id: 3,
      title: '[한님멤] 15주년 런닝맨 WEEK',
      subtitle: '런닝맨',
      description: '런닝맨 15주년 기념 특별 이벤트!',
      startDate: '2025.07.11',
      endDate: '2025.07.25',
      dDay: 'D-2',
      status: '진행중',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 4,
      title: '여름 시즌 특가 세일',
      subtitle: '여름 대축제',
      description: '모든 여름 상품 최대 70% 할인!',
      startDate: '2025.07.20',
      endDate: '2025.08.05',
      dDay: 'D-7',
      status: '예정',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 5,
      title: '신규 회원 가입 이벤트',
      subtitle: '웰컴 보너스',
      description: '신규 가입하고 특별 혜택 받아가세요!',
      startDate: '2025.07.01',
      endDate: '2025.07.31',
      dDay: 'D-5',
      status: '진행중',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 6,
      title: '브랜드 콜라보 한정판',
      subtitle: '한정판 출시',
      description: '유명 브랜드와의 특별 콜라보 상품!',
      startDate: '2025.07.25',
      endDate: '2025.08.10',
      dDay: 'D-10',
      status: '예정',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  const filteredEvents = selectedTab === '전체' 
    ? events 
    : events.filter(event => event.status === selectedTab);

  const getDDayColor = (dDay: string) => {
    const day = parseInt(dDay.replace('D-', ''));
    if (day <= 2) return 'bg-red-500';
    if (day <= 5) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">이벤트</h1>
          <p className="text-muted-foreground">다양한 이벤트와 특별 혜택을 확인해보세요</p>
        </div>
        <Button asChild>
          <Link to="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            이벤트 등록
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "default" : "outline"}
            onClick={() => setSelectedTab(tab)}
            className={selectedTab === tab ? "bg-primary" : ""}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {/* Event Image with Gradient Overlay */}
              <div className={`h-48 bg-gradient-to-br ${event.color} relative overflow-hidden`}>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* D-Day Badge */}
                <div className={`absolute top-4 right-4 ${getDDayColor(event.dDay)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {event.dDay}
                </div>
                
                {/* Event Title Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm opacity-90">{event.subtitle}</p>
                </div>
              </div>
              
              {/* Event Details */}
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                <div className="text-xs text-muted-foreground mb-4">
                  <div>{event.startDate} ~ {event.endDate}</div>
                </div>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                >
                  <Link to={`/events/${event.id}`}>
                    더 보기
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" className="px-8">
          더 보기
        </Button>
      </div>
    </div>
  );
};

export default Events;