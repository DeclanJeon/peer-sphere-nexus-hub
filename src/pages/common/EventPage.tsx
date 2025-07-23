import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('전체');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentPeermall?.id) {
        setLoading(true);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const rawEvents: EventBase[] = await eventApi.getEventsByPeermallId(currentPeermall.id);
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
  }, [currentPeermall?.id]);

  // 피어몰 소유주인지 확인
  const isPeermallOwner = user?.user_uid === currentPeermall?.owner_uid;

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                이벤트
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentPeermall?.name ? `${currentPeermall.name}의 ` : ''}
                다양한 이벤트와 특별 혜택을 확인해보세요
              </p>
            </div>
            {isPeermallOwner && (
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={`/home/${url}/events/create`}>
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
        />
      </div>
    </div>
  );
};

export default EventPage;