import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { createPeermall, PeermallCreateData } from '@/lib/api';

const PeermallCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    imageUrl: '',
    creatorName: '',
    familyCompany: '',
    referrerCode: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.creatorName) {
      toast({
        title: '오류',
        description: '피어몰 이름, 주소, 생성자 이름은 필수입니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const peermallData: PeermallCreateData = {
        name: formData.name,
        url: formData.url,
        creatorName: formData.creatorName,
        description: formData.description,
        imageUrl: formData.imageUrl,
        familyCompany: formData.familyCompany,
        referrerCode: formData.referrerCode,
      };

      const response = await createPeermall(peermallData);

      if (response.success) {
        toast({
          title: '피어몰 생성 완료',
          description: `새로운 피어몰 "${response.data.name}"이 성공적으로 생성되었습니다!`,
        });
        navigate(`/peermall/${response.data.url}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: '오류',
        description: error.message || '피어몰 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  

  const familyCompanies = [
    '클레오파트라솔트', '대한물산', '메리밀스', '퓨어펌', '벤투즈', '솔트넬'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">피어몰 생성</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>새 피어몰 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="url">피어몰 주소 *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="피어몰 주소를 입력하세요 (영문, 숫자, 하이픈만 가능)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">피어몰 소개 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="피어몰에 대한 간단한 소개를 작성해주세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">피어몰 대표 이미지</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
                            {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="미리보기" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

                        <div className="space-y-2">
              <Label htmlFor="creatorName">생성자 이름 *</Label>
              <Input
                id="creatorName"
                value={formData.creatorName}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                placeholder="피어몰을 생성하는 사람의 이름"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyCompany">패밀리사 *</Label>
              <Select value={formData.familyCompany} onValueChange={(value) => setFormData({ ...formData, familyCompany: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="패밀리사를 선택하세요 (선택하지 않으면 랜덤 배정)" />
                </SelectTrigger>
                <SelectContent>
                  {familyCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                        <div className="space-y-2">
              <Label htmlFor="referrerCode">추천인 코드</Label>
              <Input
                id="referrerCode"
                value={formData.referrerCode}
                onChange={(e) => setFormData({ ...formData, referrerCode: e.target.value })}
                placeholder="추천인 코드 (선택사항)"
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                취소
              </Button>
              <Button type="submit" className="flex-1">
                피어몰 생성
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeermallCreate;