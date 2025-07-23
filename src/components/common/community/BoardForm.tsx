import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Post } from '@/types/post';

interface BoardFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Post>;
  onSubmit: (data: {
    title: string;
    category: string;
    content: string;
    is_notice?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const BoardForm = ({ mode, initialData, onSubmit, onCancel, loading = false }: BoardFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    is_notice: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        content: initialData.content || '',
        is_notice: initialData.is_notice || false,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const categories = ['공지사항', '일반', '질문', '정보', '운영팁', '자유'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? '새 게시글' : '게시글 수정'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
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

          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              placeholder="게시글 내용을 작성해주세요"
              required
              disabled={loading}
              className="min-h-[400px]"
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
              disabled={loading || !formData.title.trim() || !formData.category || !formData.content.trim()}
            >
              {loading ? (mode === 'create' ? '등록 중...' : '수정 중...') : (mode === 'create' ? '게시글 등록' : '게시글 수정')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BoardForm;