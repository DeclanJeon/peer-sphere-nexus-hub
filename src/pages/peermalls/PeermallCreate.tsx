import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePeermall } from '@/contexts/PeermallContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { PeermallCreationData } from '@/types/peermall';
import { useAuth } from '@/hooks/useAuth';
import { peermallApi } from '@/services/peermall.api';

const PeermallCreate = () => {
  const navigate = useNavigate();
  const { createPeermall, loading } = usePeermall();
  const { user } = useAuth();
  const [formData, setFormData] = useState<PeermallCreationData>({
    name: '',
    url: '',
    address: '',
    category: '',
    description: '',
    image: '',
    ownerId: user?.email || '',
    ownerName: user?.name || '',
    familyCompany: '',
    referrerCode: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

  const handleAddressCheck = async () => {
    if (!formData.address) {
      toast({
        title: '오류',
        description: '피어몰 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    const isValid = await peermallApi.checkUrlAvailability(formData.url);
    setIsAddressValid(isValid);

    if (isValid) {
      toast({
        title: '사용 가능',
        description: '해당 주소를 사용할 수 있습니다.',
      });
    } else {
      toast({
        title: '사용 불가',
        description: '이미 사용 중인 주소입니다.',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData)

    // 유효성 검사
    if (!formData.name || !formData.address || !formData.category || !formData.description) {
      toast({
        title: '오류',
        description: '모든 필수 항목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (isAddressValid === false) {
      toast({
        title: '오류',
        description: '사용할 수 없는 주소입니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPeermall(formData, imageFile);
      toast({
        title: '성공',
        description: '피어몰이 성공적으로 생성되었습니다.',
      });
    } catch (error) {
      console.error('피어몰 생성 실패:', error);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setFormData(prev => ({ ...prev, address, url: address }));
    setIsAddressValid(null);
  };

  const categories = [
    '패션',
    '뷰티',
    '생활용품',
    '식품',
    '디지털',
    '스포츠',
    '도서',
    '기타'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>새 피어몰 만들기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 피어몰 주소 */}
            <div className="space-y-2">
              <Label htmlFor="address">피어몰 사이트 주소 *</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="example-mall"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddressCheck}
                  disabled={!formData.address}
                >
                  중복 확인
                </Button>
              </div>
              {isAddressValid !== null && (
                <p className={`text-sm ${isAddressValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isAddressValid ? '사용 가능한 주소입니다.' : '사용할 수 없는 주소입니다.'}
                </p>
              )}
            </div>

            {/* 피어몰 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">피어몰 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="피어몰 이름을 입력해주세요"
                required
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">피어몰 소개글 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="피어몰에 대한 설명을 입력해주세요"
                rows={4}
                required
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="image">대표 이미지</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image} alt="미리보기" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            
            {/* 소유자의 이름 */}
            <div className="space-y-2">
              <Label htmlFor="ownerName">소유자의 이름</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                placeholder="소유자의 이름을 입력해주세요"
                required
              />
            </div>
            
            {/* 소유자의 이메일 주소 */}
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">소유자의 이메일 주소</Label>
              <Input
                id="ownerEmail"
                value={formData.ownerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                placeholder="소유자의 이메일 주소를 입력해주세요"
                required
              />
            </div>
            {/* 소유자의 번호 */}
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">소유자의 번호</Label>
              <Input
                id="ownerPhone"
                value={formData.ownerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                placeholder="소유자의 번호를 입력해주세요"
                required
              />
            </div>
            
            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택해주세요" />
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

            {/* 추천인 코드 */}
            <div className="space-y-2">
              <Label htmlFor="referralCode">추천인 코드 *</Label>
              <Input
                id="referralCode"
                value={formData.referrerCode || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, referrerCode: e.target.value }))}
                placeholder="추천인 코드를 입력해주세요"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? '생성 중...' : '피어몰 만들기'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeermallCreate;