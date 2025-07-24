// src/components/common/product/ProductForm.tsx
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2
} from 'lucide-react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

// 폼 데이터 타입을 정의합니다.
export interface ProductFormData {
  name: string;
  price: string;
  sellingPrice: string;
  costPrice: string;
  shippingFee: string;
  description: string;
  brand: string;
  brandWebsite: string;
  manufacturer: string;
  distributor: string;
  imageUrl: string;
}

// 부모로부터 받을 Props 타입을 정의합니다.
interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: FormData) => void;
  formId: string; // 부모의 버튼과 연결하기 위한 ID
}

// 부모 컴포넌트에서 호출할 수 있는 함수들을 정의합니다.
export interface ProductFormRef {
  reset: () => void;
}

// Tiptap 에디터 툴바
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="border-b p-2 flex items-center gap-1 flex-wrap">
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-muted' : ''}><Bold className="h-4 w-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-muted' : ''}><Italic className="h-4 w-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}><Heading2 className="h-4 w-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-muted' : ''}><List className="h-4 w-4" /></Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-muted' : ''}><ListOrdered className="h-4 w-4" /></Button>
    </div>
  );
};

const ProductForm = forwardRef<ProductFormRef, ProductFormProps>(
  ({ initialData, onSubmit, formId }, ref) => {
    const { toast } = useToast();
    
    // 폼 상태 관리
    const [formData, setFormData] = useState<ProductFormData>({
      name: '', price: '', sellingPrice: '', costPrice: '', shippingFee: '',
      description: '', brand: '', brandWebsite: '', manufacturer: '', distributor: '', imageUrl: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Tiptap 에디터 설정
    const editor = useEditor({
      extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
      content: '',
      editorProps: {
        attributes: { class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none' },
      },
    });

    // 폼 초기화 로직
    const resetForm = () => {
      setFormData({
        name: '', price: '', sellingPrice: '', costPrice: '', shippingFee: '',
        description: '', brand: '', brandWebsite: '', manufacturer: '', distributor: '', imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      editor?.commands.setContent('');
    };

    // 부모가 reset 함수를 호출할 수 있도록 ref를 통해 노출
    useImperativeHandle(ref, () => ({
      reset: resetForm,
    }));

    // initialData가 변경되면 폼을 업데이트
    useEffect(() => {
      if (initialData) {
        // 모든 필드를 initialData로 업데이트
        const newFormData: ProductFormData = {
          name: initialData.name || '',
          price: initialData.price || '',
          sellingPrice: initialData.sellingPrice || '',
          costPrice: initialData.costPrice || '',
          shippingFee: initialData.shippingFee || '',
          description: initialData.description || '',
          brand: initialData.brand || '',
          brandWebsite: initialData.brandWebsite || '',
          manufacturer: initialData.manufacturer || '',
          distributor: initialData.distributor || '',
          imageUrl: initialData.imageUrl || '',
        };
        setFormData(newFormData);

        if (initialData.description && editor && editor.getHTML() !== initialData.description) {
          editor.commands.setContent(initialData.description);
        }
        if (initialData.imageUrl) {
          setImagePreview(initialData.imageUrl);
          setImageFile(null); // URL 이미지를 받았으므로 파일은 초기화
        } else {
          setImagePreview(null);
        }
      } else {
        resetForm();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, editor]);

    // 입력 값 변경 핸들러
    const handleInputChange = (field: keyof ProductFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 이미지 파일 선택
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB 제한
          toast({ variant: "destructive", title: "파일 크기 초과", description: "이미지는 5MB 이하로 업로드해주세요." });
          return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
          setFormData(prev => ({ ...prev, imageUrl: '' })); // URL 이미지는 초기화
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

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // 유효성 검사
      if (!formData.name.trim()) {
        toast({ variant: "destructive", title: "입력 오류", description: "제품명을 입력해주세요." });
        return;
      }
      if (!formData.sellingPrice || isNaN(Number(formData.sellingPrice))) {
        toast({ variant: "destructive", title: "입력 오류", description: "판매가격을 올바른 숫자로 입력해주세요." });
        return;
      }
      
      // FormData 객체 생성
      const submitData = new FormData();
      
      // 모든 폼 데이터 추가
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'description') {
          submitData.append(key, editor?.getHTML() || '');
        } else if (key !== 'imageUrl' && value) { // imageUrl은 파일 처리 후 별도 관리
          submitData.append(key, value);
        }
      });
      
      // 가격(정가)이 비어있으면 판매가로 채움
      if (!formData.price) {
        submitData.set('price', formData.sellingPrice);
      }
      
      // 이미지 처리
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.imageUrl) {
        // 파일이 없고 URL만 있을 경우 imageUrl 필드로 전송
        submitData.append('imageUrl', formData.imageUrl);
      }
      
      // 부모 컴포넌트에 최종 데이터 전달
      onSubmit(submitData);
    };

    return (
      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
        {/* 제품 정보 입력 */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">제품 정보</h3>
          <div className="space-y-2">
            <Label htmlFor="name">제품/상품 명 <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">제품/상품 가격</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="할인 시 정가 입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">제품/상품 판매 가격 <span className="text-red-500">*</span></Label>
              <Input id="sellingPrice" type="number" value={formData.sellingPrice} onChange={(e) => handleInputChange('sellingPrice', e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">제품/상품 원가</Label>
              <Input id="costPrice" type="number" value={formData.costPrice} onChange={(e) => handleInputChange('costPrice', e.target.value)} placeholder="선택입력" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">제품/상품 배송비</Label>
              <Input id="shippingFee" type="number" value={formData.shippingFee} onChange={(e) => handleInputChange('shippingFee', e.target.value)} placeholder="선택입력" />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="space-y-2">
          <Label>이미지 업로드</Label>
          {imagePreview ? (
            <div className="relative w-full">
              <img src={imagePreview} alt="상품 이미지" className="w-full h-64 object-cover rounded-lg border" />
              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}><X className="h-4 w-4" /></Button>
              {formData.imageUrl && !imageFile && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">기존 이미지</div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <Label htmlFor="image-upload" className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                클릭하여 이미지 업로드
                <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG 파일 (최대 5MB)</p>
            </div>
          )}
        </div>

        {/* 상품 설명 - 리치 에디터 */}
        <div className="space-y-2">
          <Label>제품/상품 설명</Label>
          <div className="border rounded-lg overflow-hidden">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        </div>
        
        {/* 추가 정보 */}
        <div className="space-y-4">
          <h3 className="font-medium">추가 정보 (선택)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">브랜드 명</Label>
              <Input id="brand" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandWebsite">브랜드 홈페이지</Label>
              <Input id="brandWebsite" type="url" value={formData.brandWebsite} onChange={(e) => handleInputChange('brandWebsite', e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">제조사</Label>
              <Input id="manufacturer" value={formData.manufacturer} onChange={(e) => handleInputChange('manufacturer', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distributor">유통사</Label>
              <Input id="distributor" value={formData.distributor} onChange={(e) => handleInputChange('distributor', e.target.value)} />
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default ProductForm;