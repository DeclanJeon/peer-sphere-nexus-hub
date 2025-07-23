import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Edit, Share } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { eventApi } from '@/services/event.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import EventForm from './EventForm';

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

  // 더미 이벤트 데이터
  const mockEvent: Event = {
    id: id || '1',
    title: '신년 맞이 특가 이벤트',
    content: `신년을 맞아 특별한 할인 이벤트를 진행합니다!

🎉 이벤트 혜택:
- 전 상품 20% 할인
- 5만원 이상 구매 시 무료배송
- 첫 구매 고객 추가 10% 할인

📅 이벤트 기간:
2024년 1월 1일 ~ 2024년 1월 31일

🎁 추가 혜택:
매일 선착순 10명에게 특별 쿠폰 증정!

많은 참여 부탁드립니다.`,
    eventStartDate: '2024-01-01',
    eventEndDate: '2024-01-31',
    image: '/placeholder.svg',
    category: '할인',
  };

  const fetchEvent = async () => {
    if (!url || !id) {
      setError('피어몰 정보 또는 이벤트 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: API 연동 시 실제 이벤트 조회 API 호출
      // const eventData = await eventApi.getEventById(id);
      // setEvent(eventData);
      
      // 더미 데이터 사용
      setEvent(mockEvent);
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
  }, [url, id]);

  if (!user) return null;

  const userDatas = Object.values(user);
  const userUid = Object.values(userDatas[1])[0];
  
  // 피어몰 소유주인지 확인
  const isPeermallOwner = userUid === currentPeermall?.owner_uid;
  const canEditEvent = user && isPeermallOwner;
  const canDeleteEvent = user && isPeermallOwner;

  const handleEditSubmit = async (formData: {
    title: string;
    content?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    image?: string;
    category?: string;
  }) => {
    if (!event || !canEditEvent) return;

    try {
      // TODO: API 연동 시 실제 이벤트 수정 API 호출
      // await eventApi.updateEvent(event.id, formData);
      
      console.log('Updating event:', formData);
      
      toast({
        title: '수정 완료',
        description: '이벤트가 성공적으로 수정되었습니다.',
      });
      
      setIsEditMode(false);
      fetchEvent();
    } catch (error) {
      toast({
        title: '오류',
        description: '이벤트 수정에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteEvent = async () => {
    if (!event || !canDeleteEvent) return;

    if (window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      try {
        // TODO: API 연동 시 실제 이벤트 삭제 API 호출
        // await eventApi.deleteEvent(event.id);
        
        console.log('Deleting event:', event.id);
        
        toast({
          title: '이벤트 삭제 완료',
          description: '이벤트가 성공적으로 삭제되었습니다.',
        });
        navigate(`/home/${url}/events`);
      } catch (error) {
        toast({
          title: '오류',
          description: '이벤트 삭제에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

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

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">{error || '이벤트를 찾을 수 없습니다.'}</p>
          </CardContent>
        </Card>
      </div>
    );
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
        <>
          {/* Event Content */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {event.category && <Badge variant="outline">{event.category}</Badge>}
                  {getDDayBadge(event)}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {event.eventStartDate ? new Date(event.eventStartDate).toLocaleDateString('ko-KR') : ''} ~ {event.eventEndDate ? new Date(event.eventEndDate).toLocaleDateString('ko-KR') : ''}
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
            </CardHeader>
            
            {event.image && (
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover"
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
                {canEditEvent && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                )}
                {canDeleteEvent && (
                  <Button variant="destructive" size="sm" onClick={handleDeleteEvent}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EventDetail;