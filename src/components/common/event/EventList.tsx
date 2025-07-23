import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { eventApi } from '@/services/event.api';
import { Event, EventBase } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';
import { processEventData } from '@/lib/dateUtils';
import { useNavigate, useParams } from 'react-router-dom';

interface EventListProps {
  peermallId?: string;
  events?: Event[];  // 외부에서 이벤트 목록을 전달할 수 있도록 추가
  showLoading?: boolean;  // 외부에서 로딩 상태를 제어할 수 있도록 추가
  emptyMessage?: string;  // 빈 상태 메시지 커스터마이징
  isMainPeermall?: boolean; // 메인 피어몰 여부
}

const EventList = ({ 
  peermallId, 
  events: propEvents, 
  showLoading = false,
  emptyMessage = '진행중인 이벤트가 없습니다.',
  isMainPeermall = false // 추가
}: EventListProps) => {
  const [internalEvents, setInternalEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();

  const handleEventClick = (event: Event) => {

  // 메인 피어몰에서는 이벤트의 피어몰 URL로 이동
    if (isMainPeermall && event.peermall_url) {
      navigate(`/home/${event.peermall_url}/event/${event.id}`);
    } else {
      navigate(`/home/${url || peermallId}/event/${event.id}`);
    }
  };

  // props로 events가 전달되면 그것을 사용, 아니면 내부적으로 fetch
  const events = propEvents || internalEvents;
  const isControlled = !!propEvents;

  useEffect(() => {
    // 외부에서 events를 제공하면 fetch하지 않음
    if (isControlled || !peermallId) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: EventBase[] = await eventApi.getEventsByPeermallId(peermallId);

        console.log(data)

        setInternalEvents(data.map(processEventData));
      } catch (err) {
        setError('이벤트를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [peermallId, isControlled]);

  const getDDayBadge = (event: Event) => {
    if (event.status === 'ended') {
      return <Badge variant="secondary" className="bg-gray-500 text-white">종료</Badge>;
    }
    if (event.status === 'upcoming') {
      return <Badge variant="secondary" className="bg-blue-500 text-white">D-{event.dDay}</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-500 text-white">
      {event.dDay > 0 ? `D-${event.dDay}` : 'D-Day'}
    </Badge>;
  };

  // 외부에서 로딩 상태를 제어하는 경우
  if (showLoading || (!isControlled && loading)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!isControlled && error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }
  
  if (events.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
          onClick={() => handleEventClick(event)}
        >
          <div className="relative aspect-video overflow-hidden">
            <img
              src={event.image_url || 'https://via.placeholder.com/400x300?text=Event'}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              {getDDayBadge(event)}
            </div>
            {event.category && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {event.category}
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex-grow space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-2 min-h-[3rem]">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                {event.content}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 mt-2 border-t">
              <span>
                {new Date(event.event_start_date).toLocaleDateString('ko-KR')} ~ 
                {new Date(event.event_end_date).toLocaleDateString('ko-KR')}
              </span>
              {event.views !== undefined && (
                <span>조회 {event.views.toLocaleString()}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;