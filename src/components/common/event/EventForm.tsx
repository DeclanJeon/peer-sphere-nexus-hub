// src/components/common/event/EventForm.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RichEditor } from '@/components/ui/rich-editor';
import { EventBase, CreateEventPayload, UpdateEventPayload } from '@/types/event';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {mode === 'create' ? '새 이벤트 등록' : '이벤트 정보 수정'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === 'create' ? '새로운 이벤트를 등록하여 고객들에게 알려보세요' : '이벤트 정보를 수정하세요'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                이벤트 제목 *
              </Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                disabled={loading} 
                placeholder="참여하고 싶은 매력적인 이벤트 제목을 입력하세요"
                className="text-lg py-6"
              />
            </div>

            {/* Category and Date Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold">카테고리</Label>
                <Select value={formData.category} onValueChange={handleSelectChange} disabled={loading}>
                  <SelectTrigger id="category" className="py-6">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <Badge variant="outline" className="text-xs">{cat}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="event_start_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  시작일
                </Label>
                <Input 
                  id="event_start_date" 
                  type="date" 
                  value={formData.event_start_date} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="py-6"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="event_end_date" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  종료일
                </Label>
                <Input 
                  id="event_end_date" 
                  type="date" 
                  value={formData.event_end_date} 
                  onChange={handleChange} 
                  disabled={loading}
                  className="py-6"
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-3">
              <Label htmlFor="image_url" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                대표 이미지
              </Label>
              <Input 
                id="image_url" 
                value={formData.image_url} 
                onChange={handleChange} 
                disabled={loading} 
                placeholder="https://example.com/image.jpg"
                className="py-6"
              />
              {formData.image_url && (
                <div className="mt-4 rounded-lg overflow-hidden border bg-muted/30">
                  <img 
                    src={formData.image_url} 
                    alt="미리보기" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">이벤트 상세 내용</Label>
              <div className="rounded-lg border bg-background">
                <RichEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="이벤트의 상세 내용을 작성해주세요. 참여 방법, 혜택, 주의사항 등을 포함해보세요."
                  disabled={loading}
                  className="border-0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                * 필수 입력 항목
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={loading}
                  className="px-8"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.title.trim()}
                  className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {loading ? '저장 중...' : (mode === 'create' ? '이벤트 등록' : '변경사항 저장')}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
