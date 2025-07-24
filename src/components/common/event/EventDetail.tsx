// src/pages/EventDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Trash2, Edit, Share, Clock, MapPin, Users, Eye, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Event, EventBase } from '@/types/event';
import { eventApi } from '@/services/event.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import EventForm from '@/components/common/event/EventForm';
import { processEventData } from '@/lib/dateUtils';
import { UpdateEventPayload } from '@/types/event';

const EventDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeermall } = usePeermall();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchEvent = async () => {
    if (!id) {
      setError('이벤트 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const eventData = await eventApi.getEventById(id);
      console.log(eventData)
      setEvent(processEventData(eventData));
    } catch (err) {
      console.error('이벤트 조회 오류:', err);
      setError('이벤트를 불러오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '이벤트를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const isPeermallOwner = user?.user_uid === currentPeermall?.owner_uid;
  const canEditOrDelete = user && isPeermallOwner;

  const handleEditSubmit = async (formData: UpdateEventPayload) => {
    if (!event || !canEditOrDelete) return;
    setLoading(true);
    try {
      const updatedEventData = await eventApi.updateEvent(event.id, formData);
      setEvent(processEventData(updatedEventData));
      
      toast({
        title: '수정 완료',
        description: '이벤트가 성공적으로 수정되었습니다.',
      });
      
      setIsEditMode(false);
    } catch (error) {
      console.error('이벤트 수정 오류:', error);
      toast({
        title: '오류',
        description: '이벤트 수정에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteEvent = async () => {
    if (!event || !canEditOrDelete) return;

    if (window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      try {
        await eventApi.deleteEvent(event.id);
        toast({
          title: '이벤트 삭제 완료',
          description: '이벤트가 성공적으로 삭제되었습니다.',
        });
        navigate(`/home/${url}/events`);
      } catch (error) {
        console.error('이벤트 삭제 오류:', error);
        toast({
          title: '오류',
          description: '이벤트 삭제에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  const getDDayBadge = (event: Event) => {
    if (event.status === 'ended') {
      return <Badge variant="secondary" className="bg-gray-500 text-white">종료</Badge>;
    }
    if (event.status === 'upcoming') {
      return <Badge variant="secondary" className="bg-blue-500 text-white">D-{event.dDay}</Badge>;
    }
    // 진행중일 경우 남은 날짜 표시 (D-0은 D-Day로 표시)
    return <Badge variant="destructive" className="bg-red-500 text-white">{event.dDay > 0 ? `D-${event.dDay}` : 'D-Day'}</Badge>;
  };

  if (loading && !isEditMode) {
    return <div className="container mx-auto px-4 py-8 max-w-4xl">로딩 중...</div>;
  }

  if (error || !event) {
    return <div className="container mx-auto px-4 py-8 max-w-4xl text-destructive">{error || '이벤트를 찾을 수 없습니다.'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {isEditMode ? (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={handleCancelEdit} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
          <EventForm
            mode="edit"
            initialData={event}
            onSubmit={(data) => handleEditSubmit(data as any)}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            이벤트 목록으로
          </Button>

          {/* Main Event Card */}
          <Card className="border-0 shadow-xl overflow-hidden">
            {/* Hero Image */}
            {event.image_url && (
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-4">
                    {event.category && (
                      <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        {event.category}
                      </Badge>
                    )}
                    {getDDayBadge(event)}
                  </div>
                </div>
              </div>
            )}

            <CardHeader className="space-y-4">
              {/* Title and Status */}
              <div className="space-y-4">
                {!event.image_url && (
                  <div className="flex items-center gap-3 mb-4">
                    {event.category && <Badge variant="outline">{event.category}</Badge>}
                    {getDDayBadge(event)}
                  </div>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{event.title}</h1>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 bg-muted/30 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">이벤트 기간</p>
                    <p className="font-semibold">
                      {new Date(event.event_start_date).toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ~ {new Date(event.event_end_date).toLocaleDateString('ko-KR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">상태</p>
                    <p className="font-semibold capitalize">
                      {event.status === 'ongoing' && '진행중'}
                      {event.status === 'upcoming' && '진행 예정'}
                      {event.status === 'ended' && '종료됨'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">조회수</p>
                    <p className="font-semibold">{event.views?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Event Content */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  이벤트 상세 정보
                </h2>
                <Separator />
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    공유하기
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    참여하기
                  </Button>
                </div>
                
                {canEditOrDelete && (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditMode(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      수정
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteEvent}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
