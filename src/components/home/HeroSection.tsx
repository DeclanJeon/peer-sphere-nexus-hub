// components/HeroSection.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '@/services/event.api';
import { Event, EventBase } from '@/types/event';
import { processEventData } from '@/lib/dateUtils';

interface HeroSectionProps {
  categories: { name: string; icon: string; count: number }[];
}

const HeroSection = ({ categories }: HeroSectionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // 모든 이벤트를 가져와서 진행중인 이벤트만 필터링
        const allEvents: EventBase[] = await eventApi.getAllEvents();
        const processedEvents = allEvents
          .map(processEventData)
          .filter(event => event.status === 'ongoing' || event.status === 'upcoming')
          .sort((a, b) => {
            // 진행중인 이벤트를 먼저, 그 다음 예정된 이벤트
            if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
            if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
            // 같은 상태면 시작일 기준으로 정렬
            return new Date(b.event_start_date).getTime() - new Date(a.event_start_date).getTime();
          })
          .slice(0, 5); // 최대 5개만 표시
        
        setEvents(processedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // 에러 시 빈 배열로 설정
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  // 기본 배너 (이벤트가 없을 때 표시)
  const defaultBanners = [
    {
      id: 'default-1',
      title: '새로운 이벤트를 기다려주세요',
      description: '곧 흥미진진한 이벤트가 준비될 예정입니다. 조금만 기다려주세요!',
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
      event_start_date: new Date().toISOString(),
      event_end_date: new Date().toISOString(),
      category: '공지',
      registration_source: 'main'
    }
  ];

  const displayEvents = events.length > 0 ? events : defaultBanners;
  const currentEvent = displayEvents[currentBanner] || displayEvents[0];

  useEffect(() => {
    if (displayEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % displayEvents.length);
    }, 5000); // 5초마다 자동 전환

    return () => clearInterval(interval);
  }, [displayEvents.length]);

  const handleEventClick = () => {
    if (!currentEvent || currentEvent.id === 'default-1') return;
    
    // Type guard to check if it's an Event with peermall_url
    if ('peermall_url' in currentEvent && 
        currentEvent.registration_source !== 'main' && 
        currentEvent.peermall_url) {
      navigate(`/home/${currentEvent.peermall_url}/event/${currentEvent.id}`);
    } else {
      navigate(`/event/${currentEvent.id}`);
    }
  };

  const getEventTags = (event: Event | typeof defaultBanners[0]) => {
    const tags = [];
    if (event.category) tags.push(event.category);
    if ('status' in event && event.status === 'ongoing') tags.push('진행중');
    if ('status' in event && event.status === 'upcoming') tags.push('예정');
    if ('dDay' in event && event.dDay <= 3 && event.dDay >= 0) tags.push('마감임박');
    return tags;
  };

  if (loading) {
    return (
      <section className="relative bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 좌측: 이벤트/배너 이미지 */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img 
                src={currentEvent.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop'}
                alt={currentEvent.title}
                className="w-full h-full object-cover"
              />
              {'status' in currentEvent && currentEvent.status && (
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={currentEvent.status === 'ongoing' ? 'destructive' : 'secondary'}
                    className="text-sm font-semibold"
                  >
                    {currentEvent.status === 'ongoing' && currentEvent.dDay >= 0 
                      ? `D-${currentEvent.dDay}` 
                      : currentEvent.status === 'upcoming' 
                      ? `D-${currentEvent.dDay}`
                      : '종료'}
                  </Badge>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={handleEventClick}
                disabled={currentEvent.id === 'default-1'}
              >
                {currentEvent.id === 'default-1' ? '준비중' : '자세히 보기'}
              </Button>
            </div>
          </div>

          {/* 우측: 이벤트/배너 게시글 */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getEventTags(currentEvent).map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold text-foreground">
                {currentEvent.title}
              </h2>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(currentEvent.event_start_date).toLocaleDateString('ko-KR')} ~ 
                  {new Date(currentEvent.event_end_date).toLocaleDateString('ko-KR')}
                </span>
              </div>
              
              <p className="text-lg text-foreground leading-relaxed">
                {'content' in currentEvent 
                  ? currentEvent.content 
                  : currentEvent.description}
              </p>

              {'peermall_name' in currentEvent && currentEvent.peermall_name && (
                <div className="text-sm text-muted-foreground">
                  주최: {currentEvent.peermall_name}
                </div>
              )}
            </div>

            {/* 이벤트 네비게이션 */}
            {displayEvents.length > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="flex space-x-2">
                  {displayEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentBanner === index ? 'bg-primary scale-110' : 'bg-muted hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`이벤트 ${index + 1}`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentBanner((prev) => (prev - 1 + displayEvents.length) % displayEvents.length)}
                    aria-label="이전 이벤트"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentBanner((prev) => (prev + 1) % displayEvents.length)}
                    aria-label="다음 이벤트"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;