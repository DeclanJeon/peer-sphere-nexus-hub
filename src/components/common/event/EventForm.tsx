// src/components/common/event/EventForm.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventBase, CreateEventPayload, UpdateEventPayload } from '@/types/event';
import { toast } from '@/hooks/use-toast';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<EventBase>;
  onSubmit: (data: any) => Promise<void>; // Use 'any' to accommodate both payload types
  onCancel: () => void;
  loading?: boolean;
}

const EventForm = ({ mode, initialData, onSubmit, onCancel, loading = false }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    event_start_date: '',
    event_end_date: '',
    image_url: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        event_start_date: initialData.event_start_date?.split('T')[0] || '', // 날짜 형식에 맞게 파싱
        event_end_date: initialData.event_end_date?.split('T')[0] || '',
        image_url: initialData.image_url || '',
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 날짜 유효성 검사
    if (formData.event_start_date && formData.event_end_date && formData.event_start_date > formData.event_end_date) {
      toast({
        title: '입력 오류',
        description: '종료일은 시작일보다 빠를 수 없습니다.',
        variant: 'destructive',
      });
      return;
    }
    
    // onSubmit에 전달할 데이터 정제
    const payload = {
      ...formData,
      image_url: formData.image_url || undefined,
      category: formData.category || undefined,
      content: formData.content || undefined,
      event_start_date: formData.event_start_date || undefined,
      event_end_date: formData.event_end_date || undefined,
    };
    
    await onSubmit(payload);
  };

  const categories = ['할인', '신상품', '이벤트', '프로모션', '특가', '기타'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? '새 이벤트 등록' : '이벤트 정보 수정'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">이벤트 제목 *</Label>
            <Input id="title" value={formData.title} onChange={handleChange} required disabled={loading} placeholder="이벤트 제목을 입력하세요" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={formData.category} onValueChange={handleSelectChange} disabled={loading}>
              <SelectTrigger id="category"><SelectValue placeholder="카테고리를 선택하세요" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_start_date">시작일</Label>
              <Input id="event_start_date" type="date" value={formData.event_start_date} onChange={handleChange} disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_end_date">종료일</Label>
              <Input id="event_end_date" type="date" value={formData.event_end_date} onChange={handleChange} disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">이미지 URL</Label>
            <Input id="image_url" value={formData.image_url} onChange={handleChange} disabled={loading} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">이벤트 내용</Label>
            <Textarea id="content" value={formData.content} onChange={handleChange} rows={10} placeholder="이벤트 상세 내용을 마크다운 형식으로 작성할 수 있습니다." disabled={loading} className="min-h-[200px]" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>취소</Button>
            <Button type="submit" disabled={loading || !formData.title.trim()}>
              {loading ? '저장 중...' : (mode === 'create' ? '등록하기' : '수정하기')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
