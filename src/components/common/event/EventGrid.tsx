import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface EventGridProps {
  events: Event[];
}

const EventGrid = ({ events }: EventGridProps) => {
  const getDDayBadge = (dDay: number, status: string) => {
    if (status === 'ended') {
      return <Badge variant="secondary" className="bg-gray-500 text-white">종료</Badge>;
    }
    if (status === 'upcoming') {
      return <Badge variant="secondary" className="bg-blue-500 text-white">D{dDay}</Badge>;
    }
    return <Badge variant="destructive" className="bg-red-500 text-white">D{dDay}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              {getDDayBadge(event.dDay, event.status)}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-2">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
              <div className="text-xs text-muted-foreground">
                {event.startDate} ~ {event.endDate}
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

export default EventGrid;