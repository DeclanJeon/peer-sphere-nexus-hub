import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { communityApi } from '@/services/community.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types/post';

const BoardCreate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    console.log(currentPeermall, formData)
    
    try {
      const newPost: Post = {
        id: 0,
        peermall_id: Number(currentPeermall.id),
        user_uid: user?.uid,
        author_name: user?.name,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        views: 0,
        likes: 0,
        is_notice: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await communityApi.createPost(newPost);
      console.log(result)

      toast({
        title: '게시글 작성 완료',
        description: '새로운 게시글이 성공적으로 등록되었습니다!',
      });
      
      // 커뮤니티 페이지로 이동
      navigate(`/home/${params.url}/community`);
      
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast({
        title: '오류',
        description: '게시글 작성에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['운영팁', '질문', '정보', '자유'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">게시글 작성</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>새 게시글</CardTitle>
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
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)} 
                className="flex-1"
                disabled={loading}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? '등록 중...' : '게시글 등록'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardCreate;