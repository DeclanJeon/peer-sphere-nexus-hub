// src/pages/EventCreate.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { eventApi } from '@/services/event.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import EventForm from '@/components/common/event/EventForm';

const EventCreate = () => {
  const navigate = useNavigate();
  const { url } = useParams<{ url: string }>();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
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
      // 새로운 FormData 객체 생성
      const payload = new FormData();
      
      // 기존 FormData의 모든 필드를 복사
      formData.forEach((value, key) => {
        payload.append(key, value);
      });
      
      // peermall_id 추가
      payload.append('peermall_id', currentPeermall.id);
      payload.append('url', url);

      const result = await eventApi.createEvent(payload);
      console.log('Event created:', result);

      toast({
        title: '이벤트 생성 완료',
        description: '새로운 이벤트가 성공적으로 등록되었습니다!',
      });
      
      navigate(`/home/${url}/events`);
      
    } catch (error: any) {
      console.error('이벤트 생성 오류:', error);
      
      // 에러 메시지 개선
      const errorMessage = error.response?.data?.message || '이벤트 생성에 실패했습니다. 입력 내용을 확인해주세요.';
      
      toast({
        title: '오류',
        description: errorMessage,
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