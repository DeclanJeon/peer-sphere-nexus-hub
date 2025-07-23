import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { eventApi } from '@/services/event.api';
import { Event } from '@/types/event';
import { Skeleton } from '@/components/ui/skeleton';

interface EventListProps {
  peermallId: string;
}

const EventList = ({ peermallId }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventApi.getEventsByPeermallId(peermallId);
        setEvents(data);
      } catch (err) {
        setError('이벤트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [peermallId]);

  const getDDayBadge = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.eventStartDate || now);
    const endDate = new Date(event.eventEndDate || now);
    let status: 'ongoing' | 'upcoming' | 'ended' = 'ongoing';
    let dDay = 0;

    if (now < startDate) {
      status = 'upcoming';
      dDay = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    } else if (now > endDate) {
      status = 'ended';
    } else {
      dDay = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    if (status === 'ended') {
      return <Badge variant="secondary" className="bg-gray-500 text-white">종료</Badge>;
    }
    if (status === 'upcoming') {
      return <Badge variant="secondary" className="bg-blue-500 text-white">D-{dDay}</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-500 text-white">D-{dDay}</Badge>;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative">
            <img
              src={event.image || '/placeholder.svg'}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              {getDDayBadge(event)}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-2">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.content}
              </p>
              <div className="text-xs text-muted-foreground">
                {event.eventStartDate ? new Date(event.eventStartDate).toLocaleDateString() : ''} ~ {event.eventEndDate ? new Date(event.eventEndDate).toLocaleDateString() : ''}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t">
              <button className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                더 보기
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;