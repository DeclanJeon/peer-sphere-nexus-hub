import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
  image?: File;
  imageUrl?: string;
  features: string[];
  specifications: { [key: string]: string };
}

const UserProductEdit = () => {
  const { url, productId } = useParams<{ url: string; productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: '',
    features: [''],
    specifications: {}
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // 목업 카테고리 데이터
  const categories = [
    '패션',
    '뷰티',
    '식품',
    '가전제품',
    '전자제품',
    '주방용품',
    '생활용품',
    '스포츠/레저',
    '도서/문구',
    '반려동물용품'
  ];

  // 목업 데이터로 초기화 - 실제 API 연동 시 제거
  useEffect(() => {
    const mockProduct = {
      name: '프리미엄 스킨케어 세트',
      price: '89000',
      description: '자연 성분으로 만든 프리미엄 스킨케어 세트입니다. 민감한 피부에도 안전하게 사용할 수 있으며, 깊은 보습과 영양을 제공합니다.',
      category: '뷰티',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      features: [
        '100% 천연 성분 사용',
        '모든 피부 타입에 적합',
        '파라벤, 실리콘 무첨가',
        '동물실험 반대 제품'
      ],
      specifications: {
        '용량': '토너 150ml, 에센스 50ml, 크림 50ml',
        '사용법': '세안 후 토너 → 에센스 → 크림 순서로 사용',
        '보관방법': '직사광선을 피해 서늘한 곳에 보관',
        '제조국': '대한민국'
      }
    };

    setTimeout(() => {
      setFormData(mockProduct);
      setImagePreview(mockProduct.imageUrl);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined, imageUrl: undefined }));
    setImagePreview(null);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const updateSpecification = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "상품명을 입력해주세요."
      });
      return;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      toast({
        variant: "destructive",
        title: "입력 오류", 
        description: "올바른 가격을 입력해주세요."
      });
      return;
    }

    if (!formData.category) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "카테고리를 선택해주세요."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 API 연동
      // const result = await productService.updateProduct(productId, formData);
      
      // 목업 데이터 처리 (실제 구현 시 제거)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "상품 수정 완료",
        description: "상품 정보가 성공적으로 수정되었습니다! 🎉"
      });

      navigate(`/${url}/products/${productId}`);
      
    } catch (error) {
      console.error('상품 수정 오류:', error);
      toast({
        variant: "destructive",
        title: "수정 실패",
        description: "상품 수정 중 오류가 발생했습니다."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/${url}/products/${productId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          상세로
        </Button>
        <div>
          <h1 className="text-3xl font-bold">상품 수정</h1>
          <p className="text-muted-foreground">상품 정보를 수정하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">상품명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="상품명을 입력하세요"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">가격 (원) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="가격을 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">상품 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="상품에 대한 상세한 설명을 입력하세요"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 상품 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img 
                    src={imagePreview} 
                    alt="미리보기" 
                    className="w-full h-64 object-cover rounded-lg"
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
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <Label htmlFor="image" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80 font-medium">
                      클릭하여 이미지 업로드
                    </span>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG 파일만 업로드 가능합니다
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 상품 특징 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 특징</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="상품 특징을 입력하세요"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFeature}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              특징 추가
            </Button>
          </CardContent>
        </Card>

        {/* 상품 사양 */}
        <Card>
          <CardHeader>
            <CardTitle>상품 사양</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <Input
                  value={key}
                  onChange={(e) => {
                    const newSpecs = { ...formData.specifications };
                    delete newSpecs[key];
                    newSpecs[e.target.value] = value;
                    setFormData(prev => ({ ...prev, specifications: newSpecs }));
                  }}
                  placeholder="항목명"
                  className="w-1/3"
                />
                <Input
                  value={value}
                  onChange={(e) => updateSpecification(key, e.target.value)}
                  placeholder="내용"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSpecification(key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="새 항목명"
                  className="w-1/3"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="새 내용"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/${url}/products/${productId}`)}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "상품 수정"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProductEdit;