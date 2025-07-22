// src/components/ProductCreateModal.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Loader2, 
  Link as LinkIcon, 
  AlertCircle,
  CheckCircle,
  Globe,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2
} from 'lucide-react';
import { productApi } from '@/services/product.api';
import { ogParserApi } from '@/services/og-parser.api';
import { usePeermall } from '@/contexts/PeermallContext';

// Tiptap 에디터 imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProductCreateModal = ({ isOpen, onClose, onSuccess }: ProductCreateModalProps) => {
  const { toast } = useToast();
  const { currentPeermall } = usePeermall();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sellingPrice: '',
    costPrice: '',
    shippingFee: '',
    description: '',
    brand: '',
    brandWebsite: '',
    manufacturer: '',
    distributor: '',
    imageUrl: ''
  });
  
  const [productUrl, setProductUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [hasImportedData, setHasImportedData] = useState(false);

  // 리치 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none',
      },
    },
  });

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      sellingPrice: '',
      costPrice: '',
      shippingFee: '',
      description: '',
      brand: '',
      brandWebsite: '',
      manufacturer: '',
      distributor: '',
      imageUrl: ''
    });
    setProductUrl('');
    setImageFile(null);
    setImagePreview(null);
    setHasImportedData(false);
    editor?.commands.setContent('');
  };

  // 모달 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // URL에서 Open Graph 데이터 가져오기
  const handleUrlImport = async () => {
    if (!productUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL 입력 필요",
        description: "상품 URL을 입력해주세요."
      });
      return;
    }

    // URL 유효성 검사
    try {
      new URL(productUrl);
    } catch {
      toast({
        variant: "destructive",
        title: "잘못된 URL",
        description: "올바른 URL 형식을 입력해주세요."
      });
      return;
    }

    setIsParsing(true);

    try {
      const ogData = await ogParserApi.parseUrl(productUrl);
      
      // Open Graph 데이터로 폼 자동 채우기
      setFormData(prev => ({
        ...prev,
        name: ogData.title || prev.name,
        price: ogData.price?.replace(/[^0-9]/g, '') || prev.price,
        sellingPrice: ogData.price?.replace(/[^0-9]/g, '') || prev.sellingPrice,
        brand: ogData.brand || prev.brand,
        brandWebsite: ogData.url || prev.brandWebsite,
        manufacturer: ogData.manufacturer || prev.manufacturer,
        imageUrl: ogData.image || prev.imageUrl
      }));

      // 설명을 리치 에디터에 설정
      if (ogData.description && editor) {
        editor.commands.setContent(ogData.description);
      }

      // 이미지 미리보기 설정
      if (ogData.image) {
        setImagePreview(ogData.image);
        setFormData(prev => ({ ...prev, imageUrl: ogData.image }));
      }

      setHasImportedData(true);

      toast({
        title: "✨ 정보 가져오기 완료!",
        description: "상품 정보를 가져왔습니다. 필요한 부분을 수정해주세요."
      });
      
    } catch (error) {
      console.error('URL 파싱 오류:', error);
      toast({
        variant: "destructive",
        title: "정보 가져오기 실패",
        description: "URL에서 정보를 가져올 수 없습니다. 직접 입력해주세요."
      });
    } finally {
      setIsParsing(false);
    }
  };

  // 입력 값 변경 핸들러
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 이미지 파일 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "파일 크기 초과",
          description: "이미지는 5MB 이하로 업로드해주세요."
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "제품명을 입력해주세요."
      });
      return;
    }

    if (!formData.sellingPrice || isNaN(Number(formData.sellingPrice))) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "판매가격을 입력해주세요."
      });
      return;
    }

    if (!currentPeermall?.id) {
      toast({
        variant: "destructive",
        title: "오류",
        description: "피어몰 정보를 찾을 수 없습니다."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData 생성
      const submitData = new FormData();
      submitData.append('peermallId', currentPeermall.id);
      submitData.append('name', formData.name);
      submitData.append('price', formData.price || formData.sellingPrice);
      submitData.append('sellingPrice', formData.sellingPrice);
      
      // 리치 에디터의 HTML 내용을 description으로 저장
      const descriptionHtml = editor?.getHTML() || '';
      submitData.append('description', descriptionHtml);
      
      if (formData.costPrice) {
        submitData.append('costPrice', formData.costPrice);
      }
      
      if (formData.shippingFee) {
        submitData.append('shippingFee', formData.shippingFee);
      }
      
      if (formData.brand) {
        submitData.append('brand', formData.brand);
      }
      
      if (formData.brandWebsite) {
        submitData.append('brandWebsite', formData.brandWebsite);
      }
      
      if (formData.manufacturer) {
        submitData.append('manufacturer', formData.manufacturer);
      }
      
      if (formData.distributor) {
        submitData.append('distributor', formData.distributor);
      }
      
      // 이미지 처리
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
      }

      await productApi.createProduct(submitData);
      
      toast({
        title: "🎉 상품 등록 완료!",
        description: "새로운 상품이 성공적으로 등록되었습니다."
      });

      resetForm();
      onSuccess?.();
      onClose();
      
    } catch (error) {
      console.error('상품 등록 오류:', error);
      toast({
        variant: "destructive",
        title: "등록 실패",
        description: "상품 등록 중 오류가 발생했습니다."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 에디터 툴바 버튼
  const EditorToolbar = () => {
    if (!editor) return null;

    return (
      <div className="border-b p-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>제품/상품 등록</DialogTitle>
          <DialogDescription>
            외부 URL로 정보를 가져오거나 직접 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL 입력 섹션 */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">URL로 상품 정보 가져오기</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://www.example.com/product/..."
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlImport}
                disabled={isParsing || !productUrl.trim()}
                variant="secondary"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    가져오는 중...
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    가져오기
                  </>
                )}
              </Button>
            </div>

            {hasImportedData && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  상품 정보와 이미지를 가져왔습니다. 아래 내용을 확인하고 수정해주세요.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* 제품 정보 입력 */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              제품 정보
              {hasImportedData && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  자동 입력됨
                </span>
              )}
            </h3>

            {/* 제품명 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                제품/상품 명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="필수입력"
                required
              />
            </div>

            {/* 가격 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">제품/상품 가격</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="필수입력"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">
                  제품/상품 판매 가격 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  placeholder="필수입력"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">제품/상품 원가</Label>
                <Input
                  id="costPrice"
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  placeholder="선택입력"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shippingFee">제품/상품 배송비</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  value={formData.shippingFee}
                  onChange={(e) => handleInputChange('shippingFee', e.target.value)}
                  placeholder="선택입력"
                />
              </div>
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-4">
            <Label>이미지 업로드</Label>
            
            {imagePreview ? (
              <div className="relative w-full">
                <img 
                  src={imagePreview} 
                  alt="상품 이미지" 
                  className="w-full h-64 object-cover rounded-lg border"
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
                {formData.imageUrl && !imageFile && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    URL에서 가져온 이미지
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
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
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG 파일 (최대 5MB)
                </p>
              </div>
            )}
          </div>

          {/* 상품 설명 - 리치 에디터 */}
          <div className="space-y-2">
            <Label>제품/상품 설명</Label>
            <div className="border rounded-lg overflow-hidden">
              <EditorToolbar />
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">브랜드 명</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="선택입력"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandWebsite">브랜드 홈페이지</Label>
                <Input
                  id="brandWebsite"
                  type="url"
                  value={formData.brandWebsite}
                  onChange={(e) => handleInputChange('brandWebsite', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">제조사</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="선택입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributor">유통사</Label>
                <Input
                  id="distributor"
                  value={formData.distributor}
                  onChange={(e) => handleInputChange('distributor', e.target.value)}
                  placeholder="선택입력"
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-center gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-32"
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-32"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                '등록'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreateModal;