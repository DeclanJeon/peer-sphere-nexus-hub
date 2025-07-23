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
import { AlertCircle, CheckCircle, Loader2, ExternalLink, Upload, X } from 'lucide-react';

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
    ownerEmail: user?.email || '',
    ownerPhone: '',
    familyCompany: '',
    referrerCode: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 주소 중복 확인
  const handleAddressCheck = async () => {
    if (!formData.url.trim()) {
      toast({
        title: '오류',
        description: '피어몰 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // URL 유효성 검사 (영문, 숫자, 하이픈만 허용)
    const urlPattern = /^[a-zA-Z0-9-]+$/;
    if (!urlPattern.test(formData.url)) {
      toast({
        title: '잘못된 형식',
        description: '영문, 숫자, 하이픈(-)만 사용할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    
    try {
      const isValid = await peermallApi.checkUrlAvailability(formData.url);
      setIsAddressValid(isValid);

      if (isValid) {
        toast({
          title: '✨ 사용 가능',
          description: '해당 주소를 사용할 수 있습니다!',
        });
      } else {
        toast({
          title: '⚠️ 사용 불가',
          description: '이미 사용 중인 주소입니다. 다른 주소를 시도해보세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('주소 확인 실패:', error);
      toast({
        title: '확인 실패',
        description: '주소 확인 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  // 이미지 파일 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const processImageFile = (file: File | null) => {
    if (!file) return;

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '파일 크기 초과',
        description: '이미지 파일은 5MB 이하로 업로드해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 이미지 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      toast({
        title: '잘못된 파일 형식',
        description: '이미지 파일만 업로드할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  // 드래그 앤 드롭 처리
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  }, []);

  // 이미지 제거
  const removeImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드만 검증 (이름, 주소, 추천인 코드)
    const requiredFields = {
      name: '피어몰 이름',
      url: '피어몰 주소',
      referrerCode: '추천인 코드',
      category: '카테고리'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        toast({
          title: '필수 항목 누락',
          description: `${label}을(를) 입력해주세요.`,
          variant: 'destructive',
        });
        return;
      }
    }

    // 주소 검증 확인
    if (isAddressValid !== true) {
      toast({
        title: '주소 확인 필요',
        description: '피어몰 주소 중복 확인을 완료해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 선택적 필드 검증 (입력된 경우만)
    if (formData.ownerEmail && formData.ownerEmail.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.ownerEmail)) {
        toast({
          title: '이메일 형식 오류',
          description: '올바른 이메일 주소를 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (formData.ownerPhone && formData.ownerPhone.trim()) {
      const phonePattern = /^[0-9-+\s()]+$/;
      if (!phonePattern.test(formData.ownerPhone)) {
        toast({
          title: '전화번호 형식 오류',
          description: '올바른 전화번호를 입력해주세요.',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      await createPeermall(formData, imageFile);
      toast({
        title: '🎉 생성 완료!',
        description: '피어몰이 성공적으로 생성되었습니다.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('피어몰 생성 실패:', error);
      toast({
        title: '생성 실패',
        description: '피어몰 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  // 주소 변경 처리
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
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
          <CardTitle className="text-2xl font-bold text-center">새 피어몰 만들기</CardTitle>
          <p className="text-gray-600 text-center">나만의 온라인 쇼핑몰을 만들어보세요! 🚀</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 필수 입력 섹션 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-4 flex items-center gap-2">
                ⭐ 필수 입력 정보
              </h3>

              {/* 피어몰 주소 */}
              <div className="space-y-3 mb-4">
                <Label htmlFor="url" className="text-sm font-medium text-gray-700">
                  피어몰 사이트 주소 *
                </Label>
                
                <div className="relative">
                  <div className="flex items-center gap-0">
                    <div className="flex items-center bg-gray-50 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-600">
                      peermall.com/home/
                    </div>
                    
                    <div className="relative flex-1">
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={handleAddressChange}
                        placeholder="example-mall"
                        className={`
                          pr-10 transition-all duration-200 rounded-r-md rounded-l-none bg-white
                          ${isAddressValid === true ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
                          ${isAddressValid === false ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                          ${isChecking ? 'border-blue-500' : ''}
                        `}
                        required
                      />
                      
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isChecking && (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        )}
                        {!isChecking && isAddressValid === true && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {!isChecking && isAddressValid === false && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddressCheck}
                    disabled={!formData.url || isChecking}
                    className={`
                      mt-2 w-full transition-all duration-200 hover:scale-[1.02]
                      ${isAddressValid === true ? 'border-green-500 text-green-700 hover:bg-green-50' : ''}
                      ${isAddressValid === false ? 'border-red-500 text-red-700 hover:bg-red-50' : ''}
                    `}
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        확인 중...
                      </>
                    ) : (
                      '중복 확인'
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.url && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md border border-blue-200 transition-all duration-300">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">
                        미리보기: <code className="bg-blue-100 px-1 rounded">https://peermall.com/home/{formData.url}</code>
                      </span>
                    </div>
                  )}
                  
                  {isAddressValid !== null && (
                    <div className={`
                      p-3 rounded-md border transition-all duration-300 transform
                      ${isAddressValid 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                      }
                    `}>
                      <div className="flex items-center gap-2">
                        {isAddressValid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          {isAddressValid ? '✨ 사용 가능한 주소입니다!' : '⚠️ 사용할 수 없는 주소입니다.'}
                        </span>
                      </div>
                      
                      {isAddressValid && (
                        <div className="mt-2 text-xs text-green-600">
                          이 주소로 멋진 피어몰을 만들어보세요!
                        </div>
                      )}
                      
                      {!isAddressValid && (
                        <div className="mt-2 text-xs text-red-600">
                          다른 주소를 시도해보거나 숫자나 하이픈을 추가해보세요.
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>💡 <strong>팁:</strong> 영문, 숫자, 하이픈(-)만 사용 가능합니다.</p>
                    <p>🚀 좋은 예시: my-store, tech-mall-2024, awesome-shop</p>
                    <p>🔗 최종 URL: peermall.com/home/your-store-name</p>
                  </div>
                </div>
              </div>

              {/* 피어몰 이름 */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="name">피어몰 이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="피어몰 이름을 입력해주세요"
                  className="transition-all duration-200 focus:scale-[1.01] bg-white"
                  required
                />
              </div>

              {/* 카테고리 */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="transition-all duration-200 focus:scale-[1.01] bg-white">
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
                  className="bg-white"
                  required
                />
                <p className="text-xs text-blue-600">추천인 코드를 입력하면 특별 혜택을 받을 수 있어요! 🎁</p>
              </div>
            </div>

            {/* 선택 입력 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                📝 선택 입력 정보
                <span className="text-sm text-gray-500 font-normal">(입력하지 않아도 됩니다)</span>
              </h3>

              {/* 설명 */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="description">피어몰 소개글</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="피어몰에 대한 매력적인 설명을 작성해주세요 (선택사항)"
                  rows={4}
                  className="transition-all duration-200 focus:scale-[1.01] resize-none bg-white"
                />
                <div className="text-xs text-gray-500 text-right">
                  {formData.description.length}/500자
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="image">대표 이미지</Label>
                
                {!formData.image ? (
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 bg-white
                      ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      이미지를 드래그하거나 <span className="text-blue-600 font-medium">클릭해서 업로드</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (최대 5MB) - 선택사항</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={formData.image} 
                      alt="미리보기" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              {/* 소유자 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">소유자 정보</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">소유자 이름</Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      placeholder="소유자 이름 (선택사항)"
                      className="bg-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">이메일 주소</Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                      placeholder="example@email.com (선택사항)"
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">연락처</Label>
                  <Input
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                    placeholder="010-1234-5678 (선택사항)"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                disabled={loading || isChecking} 
                className="flex-1 h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  '🚀 피어몰 만들기'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="px-8 h-12 transition-all duration-200 hover:scale-[1.02]"
              >
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