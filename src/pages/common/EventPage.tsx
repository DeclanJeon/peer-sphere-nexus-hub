import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import EventTabs from '@/components/common/event/EventTabs';
import EventList from '@/components/common/event/EventList';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Event, EventBase } from '@/types/event';
import { eventApi } from '@/services/event.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { processEventData } from '@/lib/dateUtils';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

const EventPage = () => {
  const { url } = useParams<{ url: string }>();
  const location = useLocation();
  const { currentPeermall } = usePeermall();
  const { user, isAuthenticated } = useAuth(); // ✨ isAuthenticated 추가

  const [activeTab, setActiveTab] = useState('전체');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 메인 피어몰인지 확인 (유저 피어몰이 아닌 경우)
  const isMainPeermall = location.pathname === '/events' || location.pathname === '/home/events';
  const isUserPeermall = location.pathname.startsWith('/home/') && url;

  useEffect(() => {
    const fetchEvents = async () => {
      // 메인 피어몰이 아니고 유저 피어몰인데 currentPeermall이 없으면 대기
      if (!isMainPeermall && isUserPeermall && !currentPeermall?.id) {
        setLoading(true);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        let rawEvents: EventBase[] = [];
        
        // 메인 피어몰이면 전체 이벤트 호출
        if (isMainPeermall) {
          rawEvents = await eventApi.getAllEvents();
        } else if (currentPeermall?.id) {
          // 유저 피어몰이면 해당 피어몰의 이벤트만 호출
          rawEvents = await eventApi.getEventsByPeermallId(currentPeermall.id);
        }

        const processedEvents = rawEvents.map(processEventData);

        // 최신순으로 정렬
        processedEvents.sort((a, b) => {
          const dateA = new Date(a.created_at || a.event_start_date).getTime();
          const dateB = new Date(b.created_at || b.event_start_date).getTime();
          return dateB - dateA;
        });
        
        setEvents(processedEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('이벤트를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPeermall?.id, isMainPeermall, isUserPeermall]);

  // ✨ [삭제] 피어몰 소유주 확인 로직 제거
  // const isPeermallOwner = !isMainPeermall && user?.user_uid === currentPeermall?.owner_uid;

  // 탭에 따른 이벤트 필터링
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

  // 통계 정보 계산
  const stats = {
    total: events.length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ended: events.filter(e => e.status === 'ended').length,
  };

  // 빈 상태 메시지 결정
  const getEmptyMessage = () => {
    if (error) return error;
    switch (activeTab) {
      case '진행중':
        return '진행중인 이벤트가 없습니다.';
      case '종료':
        return '종료된 이벤트가 없습니다.';
      case '예정':
        return '예정된 이벤트가 없습니다.';
      default:
        return '등록된 이벤트가 없습니다.';
    }
  };

  // 페이지 제목 결정
  const getPageTitle = () => {
    if (isMainPeermall) {
      return '전체 이벤트';
    }
    return currentPeermall?.name ? `${currentPeermall.name}의 이벤트` : '이벤트';
  };

  // 페이지 설명 결정
  const getPageDescription = () => {
    if (isMainPeermall) {
      return '피어몰에서 진행중인 모든 이벤트를 확인해보세요';
    }
    return '다양한 이벤트와 특별 혜택을 확인해보세요';
  };

  // ✨ [새로운 추가] 이벤트 등록 경로 결정
  const getEventCreatePath = () => {
    if (isMainPeermall) {
      return '/event/create';
    }
    return `/home/${url}/event/create`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                {getPageTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">
                {getPageDescription()}
              </p>
            </div>
            {/* ✨ [수정] 로그인한 모든 사용자가 이벤트 등록 가능 */}
            {isAuthenticated && (
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={getEventCreatePath()}>
                  <Plus className="w-5 h-5 mr-2" />
                  이벤트 등록
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* 탭 */}
        <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 통계 카드 - 로딩 중이 아니고 에러가 없을 때만 표시 */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">전체 이벤트</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">진행중</p>
                <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">예정</p>
                <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">종료</p>
                <p className="text-2xl font-bold text-gray-600">{stats.ended}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 이벤트 리스트 */}
        <EventList 
          events={filteredEvents}
          showLoading={loading}
          emptyMessage={getEmptyMessage()}
          isMainPeermall={isMainPeermall}
        />
      </div>
    </div>
  );
};

export default EventPage;