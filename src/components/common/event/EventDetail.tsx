// src/pages/EventDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Edit, Share } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isEditMode ? (
        <>
          <h1 className="text-3xl font-bold mb-8">이벤트 수정</h1>
          <EventForm
            mode="edit"
            initialData={event}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </>
      ) : (
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {event.category && <Badge variant="outline">{event.category}</Badge>}
                {getDDayBadge(event)}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(event.event_start_date).toLocaleDateString('ko-KR')} ~ {new Date(event.event_end_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </CardHeader>
          
          {event.image_url && (
            <div className="relative">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{event.content}</div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                공유하기
              </Button>
              {canEditOrDelete && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteEvent}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventDetail;
