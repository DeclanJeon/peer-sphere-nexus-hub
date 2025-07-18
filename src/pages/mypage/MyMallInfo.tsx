import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const MyMallInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '코스메틱 파라다이스',
    category: '뷰티',
    description: '최고 품질의 코스메틱 제품들을 합리적인 가격에 만나보세요.',
    phone: '010-1234-5678',
    email: 'cosmetic@paradise.com',
    address: '서울시 강남구 테헤란로 123',
    businessHours: '평일 09:00-18:00',
    returnPolicy: '단순 변심 시 7일 이내 교환/환불 가능 (배송비 고객 부담)',
    shippingInfo: '전국 무료배송 (5만원 이상 구매시)',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '정보 업데이트 완료',
      description: '피어몰 정보가 성공적으로 업데이트되었습니다!',
    });
    navigate('/mypage/mall');
  };

  const categories = [
    '뷰티', '패션', '전자기기', '홈인테리어', '식품', '스포츠', '유아용품', '반려동물', '도서', '기타'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">피어몰 정보 관리</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">피어몰 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="description">피어몰 소개</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>연락처 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessHours">운영시간</Label>
              <Input
                id="businessHours"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="예: 평일 09:00-18:00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>운영 정책</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="returnPolicy">교환/환불 정책</Label>
              <Textarea
                id="returnPolicy"
                value={formData.returnPolicy}
                onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingInfo">배송 정보</Label>
              <Textarea
                id="shippingInfo"
                value={formData.shippingInfo}
                onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
            취소
          </Button>
          <Button type="submit" className="flex-1">
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MyMallInfo;