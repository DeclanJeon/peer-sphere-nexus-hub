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
  Heading2,
  Clipboard,
  Check,
  MousePointerClick
} from 'lucide-react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { cn } from '@/lib/utils';

export interface ProductFormData {
  name: string;
  sellingPrice: string;
  shippingFee: string;
  description: string;
  brand: string;
  productUrl: string;
  brandWebsite: string;
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
      description: '', brand: '', productUrl: '', brandWebsite: '', manufacturer: '', distributor: '', imageUrl: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isPasteMode, setIsPasteMode] = useState(false);
    const [pasteSuccess, setPasteSuccess] = useState(false);

    const editor = useEditor({
      extensions: [
        StarterKit, 
        Image,  // 이미지 익스텐션은 그대로 유지
        Link.configure({ openOnClick: false })
      ],
      content: '',
      editorProps: {
        attributes: { class: 'prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none' },
      },
    });

    const resetForm = useCallback(() => {
      setFormData({
        name: '', sellingPrice: '', shippingFee: '',
        description: '', brand: '', productUrl: '', brandWebsite: '', manufacturer: '', distributor: '', imageUrl: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setIsPasteMode(false);
      setPasteSuccess(false);
      editor?.commands.setContent('');
    }, [editor]);

    useImperativeHandle(ref, () => ({
      reset: resetForm,
    }));

    const processImageFile = useCallback((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ variant: "destructive", title: "파일 크기 초과", description: "이미지는 5MB 이하로 업로드해주세요." });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
        toast({
          title: "✅ 이미지 업로드 완료!",
          description: "이미지가 성공적으로 추가되었습니다.",
        });
      };
      reader.readAsDataURL(file);
    }, [toast]);

    // 붙여넣기 모드 활성화/비활성화 - 이벤트 전파 중지 추가
    const togglePasteMode = (e: React.MouseEvent) => {
      e.stopPropagation(); // 이벤트 버블링 방지
      setIsPasteMode(!isPasteMode);
      if (!isPasteMode) {
        toast({
          title: "📋 붙여넣기 모드 활성화",
          description: "이제 이미지를 복사한 후 Ctrl+V (또는 Cmd+V)로 붙여넣으세요!",
        });
      }
    };

    // 붙여넣기 이벤트 처리
    useEffect(() => {
      if (!isPasteMode) return;

      const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        // 에디터에 포커스가 있는지 확인
        const activeElement = document.activeElement;
        const isInEditor = activeElement?.closest('.ProseMirror') !== null;
        
        // 에디터에 포커스가 있으면 이미지 처리하지 않음
        if (isInEditor) return;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              event.preventDefault();
              processImageFile(file);
              setIsPasteMode(false); // 붙여넣기 후 모드 자동 해제
              break;
            }
          }
        }
      };

      window.addEventListener('paste', handlePaste);
      return () => {
        window.removeEventListener('paste', handlePaste);
      };
    }, [isPasteMode, processImageFile]);

    useEffect(() => {
      if (initialData) {
        const newFormData: ProductFormData = {
          name: initialData.name || '',
          sellingPrice: initialData.sellingPrice || '',
          shippingFee: initialData.shippingFee || '',
          description: initialData.description || '',
          brand: initialData.brand || '',
          productUrl: initialData.productUrl || '',
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processImageFile(file);
      }
    };
    
    const removeImage = () => {
      setImageFile(null);
      setImagePreview(null);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      setPasteSuccess(false);
    };

    // 업로드 영역 클릭 핸들러
    const handleUploadAreaClick = () => {
      if (!isPasteMode) {
        document.getElementById('image-upload')?.click();
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim()) {
        toast({ variant: "destructive", title: "입력 오류", description: "제품명을 입력해주세요." });
        return;
      }
      if (!formData.productUrl.trim()) {
        toast({ variant: "destructive", title: "입력 오류", description: "제품 판매 링크를 입력해주세요." });
        return;
      }
      if (!formData.sellingPrice || isNaN(Number(formData.sellingPrice))) {
        toast({ variant: "destructive", title: "입력 오류", description: "판매가격을 올바른 숫자로 입력해주세요." });
        return;
      }
      
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
            <Label htmlFor="productUrl">제품 판매 링크 <span className="text-red-500">*</span></Label>
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

        {/* 이미지 업로드 */}
        <div className="space-y-2">
          <Label>이미지 업로드</Label>
          {imagePreview ? (
            <div className="relative w-full">
              <img src={imagePreview} alt="상품 이미지" className="w-full max-h-96 object-contain rounded-lg border bg-slate-50" />
              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}><X className="h-4 w-4" /></Button>
              {formData.imageUrl && !imageFile && (
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">기존 이미지</div>
              )}
              {pasteSuccess && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                  <Check className="h-4 w-4" />
                  업로드 완료!
                </div>
              )}
            </div>
          ) : (
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-all",
                isPasteMode 
                  ? "border-primary bg-primary/5 animate-pulse" 
                  : "border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer"
              )}
              onClick={handleUploadAreaClick}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              
              <div className="space-y-3">
                {/* 클릭 업로드 버튼 */}
                <div>
                  <Label 
                    htmlFor="image-upload" 
                    className="cursor-pointer inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                  >
                    <MousePointerClick className="h-4 w-4" />
                    클릭하여 파일 선택
                  </Label>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </div>

                <div className="text-sm text-muted-foreground">또는</div>

                {/* 붙여넣기 모드 토글 버튼 */}
                <Button
                  type="button"
                  variant={isPasteMode ? "default" : "outline"}
                  size="sm"
                  onClick={togglePasteMode}
                  className={cn(
                    "gap-2",
                    isPasteMode && "animate-pulse"
                  )}
                >
                  <Clipboard className="h-4 w-4" />
                  {isPasteMode ? "붙여넣기 대기 중... (Ctrl+V)" : "이미지 붙여넣기 모드"}
                </Button>

                {isPasteMode && (
                  <div className="bg-primary/10 text-primary text-sm p-3 rounded-md space-y-1">
                    <p className="font-medium">📋 붙여넣기 모드 활성화됨!</p>
                    <p>1. 다른 곳에서 이미지를 복사하세요</p>
                    <p>2. 이 페이지에서 Ctrl+V (Mac: Cmd+V)를 누르세요</p>
                    <p className="text-xs text-muted-foreground mt-2">취소하려면 버튼을 다시 클릭하세요</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                지원 형식: JPG, PNG, GIF (최대 5MB)
              </p>
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
          {isPasteMode && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              ⚠️ 이미지 붙여넣기 모드가 활성화되어 있습니다. 에디터에는 텍스트만 입력해주세요.
            </p>
          )}
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

ProductForm.displayName = 'ProductForm';

export default ProductForm;