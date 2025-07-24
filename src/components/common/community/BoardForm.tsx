import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Post } from '@/types/post';
import { RichEditor } from '@/components/ui/rich-editor';

interface BoardFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Post>;
  onSubmit: (data: {
    author_name: string;
    title: string;
    category: string;
    content: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const BoardForm = ({ mode, initialData, onSubmit, onCancel, loading = false }: BoardFormProps) => {
  const [formData, setFormData] = useState({
    author_name: '',
    title: '',
    category: '',
    content: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        author_name: initialData.author_name || '',
        title: initialData.title || '',
        category: initialData.category || '',
        content: initialData.content || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const categories = ['일반', '질문', '정보', '운영팁', '자유'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? '새 게시글' : '게시글 수정'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">작성자 *</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                required
                disabled={loading}
                placeholder="작성자 이름을 입력하세요"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
                placeholder="제목을 입력하세요"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={loading}
                required
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

            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <RichEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="게시글 내용을 작성해주세요."
                disabled={loading}
                className="min-h-[400px]"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
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
              disabled={loading || !formData.author_name.trim() || !formData.title.trim() || !formData.category || !formData.content.trim() || formData.content === '<p></p>'}
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