// src/components/common/product/ProductForm.tsx

import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
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

export interface ProductFormData {
  name: string;
  sellingPrice: string;
  shippingFee: string;
  description: string;
  brand: string;
  brandWebsite: string; // ✨ [복원] 브랜드 홈페이지 필드 인터페이스에 다시 추가
  productUrl: string;
  manufacturer: string;
  distributor: string;
  imageUrl: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: FormData) => void;
  formId: string;
}

export interface ProductFormRef {
  reset: () => void;
}

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
    
    const [formData, setFormData] = useState<ProductFormData>({
      name: '', sellingPrice: '', shippingFee: '',
      description: '', brand: '', brandWebsite: '', productUrl: '', manufacturer: '', distributor: '', imageUrl: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const editor = useEditor({
      extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
      content: '',
      editorProps: {
        attributes: { class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none' },
      },
    });

    const resetForm = useCallback(() => {
      setFormData({
        name: '', sellingPrice: '', shippingFee: '',
        description: '', brand: '', brandWebsite: '', productUrl: '', manufacturer: '', distributor: '', imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      editor?.commands.setContent('');
    }, [editor]);

    useImperativeHandle(ref, () => ({
      reset: resetForm,
    }));

    // ... (이미지 처리 및 붙여넣기 관련 로직은 이전과 동일하게 유지)

    useEffect(() => {
      if (initialData) {
        const newFormData: ProductFormData = {
          name: initialData.name || '',
          sellingPrice: initialData.sellingPrice || '',
          shippingFee: initialData.shippingFee || '',
          description: initialData.description || '',
          brand: initialData.brand || '',
          brandWebsite: initialData.brandWebsite || '', // ✨ [복원] brandWebsite 초기화
          productUrl: initialData.productUrl || '',
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
          setImageFile(null);
        } else {
          setImagePreview(null);
        }
      } else {
        resetForm();
      }
    }, [initialData, editor, resetForm]);

    const handleInputChange = (field: keyof ProductFormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumericInputChange = (field: keyof ProductFormData, value: string) => {
      const numericValue = value.replace(/[^0-9]/g, '');
      handleInputChange(field, numericValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // ... 유효성 검사 로직 ...

        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'description') {
                submitData.append(key, editor?.getHTML() || '');
            } else if (key !== 'imageUrl' && value) {
                submitData.append(key, value);
            }
        });
        
        if (imageFile) {
            submitData.append('image', imageFile);
        } else if (formData.imageUrl) {
            submitData.append('imageUrl', formData.imageUrl);
        }
        
        onSubmit(submitData);
    };

    return (
      <form id={formId} onSubmit={handleSubmit} className="space-y-6 p-3">
        {/* 제품 정보 입력 */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">제품 정보</h3>
          <div className="space-y-2">
            <Label htmlFor="name">제품/상품 명 <span className="text-red-500">*</span></Label>
            <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productUrl">제품 판매 링크</Label>
            <Input id="productUrl" type="url" value={formData.productUrl} onChange={(e) => handleInputChange('productUrl', e.target.value)} placeholder="https://example.com/product/123" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">제품/상품 판매 가격 <span className="text-red-500">*</span></Label>
              <Input id="sellingPrice" type="text" inputMode="numeric" value={formData.sellingPrice} onChange={(e) => handleNumericInputChange('sellingPrice', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFee">제품/상품 배송비</Label>
              <Input id="shippingFee" type="text" inputMode="numeric" value={formData.shippingFee} onChange={(e) => handleNumericInputChange('shippingFee', e.target.value)} placeholder="선택입력" />
            </div>
          </div>
        </div>

        {/* 이미지 업로드 (생략) */}

        {/* 상품 설명 - 리치 에디터 (생략) */}
        
        {/* 추가 정보 */}
        <div className="space-y-4">
          <h3 className="font-medium">추가 정보 (선택)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">브랜드 명</Label>
              <Input id="brand" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} />
            </div>
            {/* ✨ [복원] 브랜드 홈페이지 입력 필드 JSX 복원 */}
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