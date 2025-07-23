import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { eventApi } from '@/services/event.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Event } from '@/types/event';
import EventForm from './EventForm';

const EventCreate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: {
    title: string;
    content?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    image?: string;
    category?: string;
  }) => {
    if (!currentPeermall?.id) {
      toast({
        title: '오류',
        description: '피어몰 정보를 찾을 수 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: '오류',
        description: '로그인이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: API 연동 시 실제 이벤트 생성 API 호출
      const newEvent: Omit<Event, 'id'> = {
        title: formData.title,
        content: formData.content,
        eventStartDate: formData.eventStartDate,
        eventEndDate: formData.eventEndDate,
        image: formData.image,
        category: formData.category,
      };

      // 더미 데이터로 성공 시뮬레이션
      console.log('Creating event:', newEvent);
      
      // await eventApi.createEvent(newEvent);

      toast({
        title: '이벤트 생성 완료',
        description: '새로운 이벤트가 성공적으로 등록되었습니다!',
      });
      
      navigate(`/home/${params.url}/events`);
      
    } catch (error) {
      console.error('이벤트 생성 오류:', error);
      toast({
        title: '오류',
        description: '이벤트 생성에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">이벤트 등록</h1>
      <EventForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default EventCreate;