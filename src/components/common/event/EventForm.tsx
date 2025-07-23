import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Event } from '@/types/event';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Event>;
  onSubmit: (data: {
    title: string;
    content?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    image?: string;
    category?: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EventForm = ({ mode, initialData, onSubmit, onCancel, loading = false }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    eventStartDate: '',
    eventEndDate: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        eventStartDate: initialData.eventStartDate || '',
        eventEndDate: initialData.eventEndDate || '',
        image: initialData.image || '',
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const categories = ['할인', '신상품', '이벤트', '프로모션', '특가', '기타'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? '새 이벤트' : '이벤트 수정'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">이벤트 제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
                placeholder="이벤트 제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventStartDate">시작일</Label>
              <Input
                id="eventStartDate"
                type="date"
                value={formData.eventStartDate}
                onChange={(e) => setFormData({ ...formData, eventStartDate: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventEndDate">종료일</Label>
              <Input
                id="eventEndDate"
                type="date"
                value={formData.eventEndDate}
                onChange={(e) => setFormData({ ...formData, eventEndDate: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">이미지 URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              disabled={loading}
              placeholder="이벤트 이미지 URL을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">이벤트 내용</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              placeholder="이벤트 상세 내용을 작성해주세요"
              disabled={loading}
              className="min-h-[300px]"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1"
              disabled={loading}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? (mode === 'create' ? '등록 중...' : '수정 중...') : (mode === 'create' ? '이벤트 등록' : '이벤트 수정')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;