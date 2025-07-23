// src/pages/EventCreate.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { eventApi } from '@/services/event.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { CreateEventPayload } from '@/types/event';
import EventForm from '@/components/common/event/EventForm';

const EventCreate = () => {
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: CreateEventPayload) => {
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
      const payload: CreateEventPayload = {
        ...formData,
        peermall_id: currentPeermall.id,
      };

      const result = await eventApi.createEvent(payload);
      console.log(result);

      toast({
        title: '이벤트 생성 완료',
        description: '새로운 이벤트가 성공적으로 등록되었습니다!',
      });
      
      navigate(`/home/${url}/events`);
      
    } catch (error) {
      console.error('이벤트 생성 오류:', error);
      toast({
        title: '오류',
        description: '이벤트 생성에 실패했습니다. 입력 내용을 확인해주세요.',
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
