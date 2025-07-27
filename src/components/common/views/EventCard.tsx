import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  peermallId: number;
  discount: number;
  badge: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[2/1] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* EVENT 배지 */}
        <Badge 
          className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1"
        >
          EVENT
        </Badge>

        {/* 할인율 배지 */}
        {event.discount > 0 && (
          <Badge 
            className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1"
          >
            {event.discount}% OFF
          </Badge>
        )}

        {/* 컨텐츠 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-white/90 line-clamp-2">
            {event.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              {event.badge}
            </Badge>
            <span className="text-xs text-white/80">
              {new Date(event.endDate).toLocaleDateString()} 까지
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;