import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProductMessageCreate = () => {
  const { url, productId } = useParams<{ url: string; productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: '맛집', label: '맛집/요리' },
    { value: '모임', label: '모임/만남' },
    { value: '후기', label: '후기/리뷰' },
    { value: '질문', label: '질문/문의' },
    { value: '정보', label: '정보공유' },
    { value: '기타', label: '기타' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "로그인 필요",
        description: "메시지 작성은 로그인 후 이용 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: API 호출하여 메시지 생성
      // const response = await productMessageApi.createMessage(productId, formData);
      
      toast({
        title: "메시지 생성 완료",
        description: "새로운 채널이 생성되었습니다."
      });
      
      // 생성된 채널로 이동 (임시로 ID 1 사용)
      navigate(`/home/${url}/product/${productId}/channel/1`);
    } catch (error) {
      console.error('메시지 생성 오류:', error);
      toast({
        title: "생성 실패",
        description: "메시지 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/home/${url}/product/${productId}`)} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          상품으로 돌아가기
        </Button>
      </div>

      {/* 메시지 생성 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            새 메시지 채널 만들기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">메시지 제목</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="메시지 채널의 제목을 입력하세요 (예: 맛있는 요리 먹고 싶어요)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">채널 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="이 채널에서 무엇을 이야기하고 싶은지 설명해주세요"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/home/${url}/product/${productId}`)}
                className="flex-1"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? '생성 중...' : '채널 만들기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductMessageCreate;