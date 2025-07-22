import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import EventGrid from '@/components/common/event/EventGrid';
import EventTabs from '@/components/common/event/EventTabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  dDay: number;
  category: string;
}

const EventPage = () => {
  const location = useLocation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('전체');
  const [events, setEvents] = useState<Event[]>([]);

  // 현재 경로가 메인 피어몰인지 유저 피어몰인지 판단
  const isUserPeermall = location.pathname.startsWith('/home/');
  const peermallUrl = params.url;

  // 목업 데이터
  const mockEvents: Event[] = [
    {
      id: 1,
      title: '[인기순위] 닭터름 닭터림?',
      description: '닭터름의 놀라운 이벤트에 참여하세요!',
      startDate: '2025.07.15',
      endDate: '2025.07.20',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
      status: 'ongoing',
      dDay: -2,
      category: '인기순위'
    },
    {
      id: 2,
      title: '[STAR] 7월의 스타 투표하기',
      description: '이달의 스타 투표하기!',
      startDate: '2025.07.14',
      endDate: '2025.07.23',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
      status: 'ongoing',
      dDay: -4,
      category: '투표'
    },
    {
      id: 3,
      title: '[한남빵] 15주년 런닝맨 WEEK',
      description: '한남빵 15주년 기념 특별 이벤트!',
      startDate: '2025.07.11',
      endDate: '2025.07.25',
      image: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop',
      status: 'ongoing',
      dDay: -2,
      category: '기념'
    },
    {
      id: 4,
      title: '여름 시즌 특가 세일',
      description: '모든 여름 상품 최대 70% 할인!',
      startDate: '2025.07.20',
      endDate: '2025.08.05',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
      status: 'ongoing',
      dDay: -7,
      category: '할인'
    },
    {
      id: 5,
      title: '신규 회원 가입 이벤트',
      description: '신규 가입하고 특별 혜택 받아가세요!',
      startDate: '2025.07.01',
      endDate: '2025.07.31',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      status: 'ongoing',
      dDay: -5,
      category: '가입'
    },
    {
      id: 6,
      title: '브랜드 콜라보 한정판',
      description: '유명 브랜드와의 특별 콜라보 상품!',
      startDate: '2025.07.25',
      endDate: '2025.08.10',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      status: 'upcoming',
      dDay: -10,
      category: '콜라보'
    }
  ];

  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져올 것
    // isUserPeermall과 peermallUrl에 따라 다른 데이터 로드
    setEvents(mockEvents);
  }, [isUserPeermall, peermallUrl, activeTab]);

  const filteredEvents = events.filter(event => {
    switch (activeTab) {
      case '진행중':
        return event.status === 'ongoing';
      case '종료':
        return event.status === 'ended';
      case '예정':
        return event.status === 'upcoming';
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">이벤트</h1>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              이벤트 등록
            </Button>
          </div>
          <p className="text-muted-foreground">다양한 이벤트와 특별 혜택을 확인해보세요</p>
        </div>

        {/* 탭 */}
        <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 이벤트 그리드 */}
        <EventGrid events={filteredEvents} />
      </div>
    </div>
  );
};

export default EventPage;