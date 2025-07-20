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
import { API_BASE_URL } from '@/lib/api/clients';


const PeermallCreate = () => {
  const navigate = useNavigate();
  const { createPeermall, loading } = usePeermall();
  const [formData, setFormData] = useState<PeermallCreationData>({
    name: '',
    url: '',
    description: '',
    imageUrl: '',
    creatorName: '',
    ownerEmail: '',
    ownerPhone: '',
    familyCompany: '',
    referrerCode: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);

  const checkUrlAvailability = useCallback(async (url: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/peermalls/check-url?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('URL 확인 중 오류 발생:', error);
      return false;
    }
  }, []);

  const handleUrlCheck = async () => {
    if (!formData.url) {
      toast({
        title: '오류',
        description: '피어몰 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const isAvailable = await checkUrlAvailability(formData.url);
      setIsUrlValid(isAvailable);

      if (isAvailable) {
        toast({
          title: '사용 가능한 주소입니다.',
          description: '해당 피어몰 주소를 사용할 수 있습니다.',
        });
      } else {
        toast({
          title: '이미 사용 중인 주소입니다.',
          description: '다른 주소를 입력해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '주소 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.referrerCode) {
      toast({
        title: '오류',
        description: '피어몰 이름, 주소, 추천인 코드는 필수 입력 항목입니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isUrlValid === false) {
      toast({
        title: '오류',
        description: '피어몰 주소 중복 확인을 해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newPeermall = await createPeermall(formData);
      if (newPeermall) {
        toast({
          title: '피어몰 생성 완료',
          description: `새로운 피어몰 "${newPeermall.name}"이 성공적으로 생성되었습니다!`,
        });
        // The navigation is now handled within the context
      }
    } catch (error: any) {
      toast({
        title: '오류',
        description: error.message || '피어몰 생성에 실패했습니다.',
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
              <Label htmlFor="url">피어몰 사이트 주소 *</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    setIsUrlValid(null);
                  }}
                  placeholder="peermall"
                  className="flex-1"
                  required
                />
                <Button 
                  type="button" 
                  onClick={handleUrlCheck}
                  variant={isUrlValid === true ? 'default' : 'outline'}
                  className="whitespace-nowrap"
                >
                  {isUrlValid === true ? '✓ 사용 가능' : '중복 확인'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                예시: https://peermall.com/peermall/{formData.url || 'your-peermall'}
              </p>
              {isUrlValid === false && (
                <p className="text-sm text-destructive">
                  이미 사용 중인 주소이거나 확인이 필요합니다.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">피어몰 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="피어몰 이름을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">피어몰 소개</Label>
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
              <Label htmlFor="creatorName">소유자 이름</Label>
              <Input
                id="creatorName"
                value={formData.creatorName}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                placeholder="피어몰을 생성하는 사람의 이름 (선택사항)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">소유자 이메일</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail || ''}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                placeholder="소유자 이메일을 입력하세요 (선택사항)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">소유자 전화번호</Label>
              <Input
                id="ownerPhone"
                value={formData.ownerPhone || ''}
                onChange={(e) => {
                  // 숫자와 하이픈만 허용
                  const value = e.target.value.replace(/[^0-9-]/g, '');
                  setFormData({ ...formData, ownerPhone: value });
                }}
                placeholder="예: 010-1234-5678 (선택사항)"
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="familyCompany">패밀리사</Label>
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
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="referrerCode">추천인 코드 *</Label>
              <Input
                id="referrerCode"
                value={formData.referrerCode}
                onChange={(e) => setFormData({ ...formData, referrerCode: e.target.value })}
                placeholder="추천인 코드를 입력하세요"
                required
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