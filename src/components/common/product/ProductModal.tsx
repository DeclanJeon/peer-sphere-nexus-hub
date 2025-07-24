// src/components/ProductModal.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon, CheckCircle, Globe } from 'lucide-react';
import { productApi } from '@/services/product.api';
import { ogParserApi } from '@/services/og-parser.api';
import { usePeermall } from '@/contexts/PeermallContext';
import ProductForm, { ProductFormData, ProductFormRef } from '@/components/common/product/ProductForm';
import { Product } from '@/types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
  productToEdit?: Product | null;
}

const ProductModal = ({ isOpen, onClose, onSuccess, mode, productToEdit }: ProductModalProps) => {
  const { toast } = useToast();
  const { currentPeermall } = usePeermall();
  const formRef = useRef<ProductFormRef>(null);
  const formId = "product-form"; // 폼과 버튼을 연결할 고유 ID

  const isEditMode = mode === 'edit';

  const [productUrl, setProductUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasImportedData, setHasImportedData] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<ProductFormData>>({});

  // 모달이 닫힐 때 모든 상태를 초기화
  const resetAll = () => {
    setProductUrl('');
    setIsParsing(false);
    setIsSubmitting(false);
    setHasImportedData(false);
    setInitialFormData({});
    formRef.current?.reset();
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetAll, 300); // 애니메이션 후 초기화
    } else if (isEditMode && productToEdit) {
      // 수정 모드일 때 기존 데이터로 폼 초기화
      const formDataFromProduct: Partial<ProductFormData> = {
        name: productToEdit.name || '',
        price: productToEdit.price?.toString() || '',
        sellingPrice: productToEdit.selling_price?.toString() || '',
        costPrice: productToEdit.cost_price?.toString() || '',
        shippingFee: productToEdit.shipping_fee?.toString() || '',
        description: productToEdit.description || '',
        brand: productToEdit.brand || '',
        brandWebsite: productToEdit.brand_website || '',
        manufacturer: productToEdit.manufacturer || '',
        distributor: productToEdit.distributor || '',
        imageUrl: productToEdit.image_url || '',
      };
      setInitialFormData(formDataFromProduct);
    }
  }, [isOpen, isEditMode, productToEdit]);

  // URL에서 Open Graph 데이터 가져오기
  const handleUrlImport = async () => {
    if (!productUrl.trim()) return;
    try {
      new URL(productUrl);
    } catch {
      toast({ variant: "destructive", title: "잘못된 URL", description: "올바른 URL 형식을 입력해주세요." });
      return;
    }

    setIsParsing(true);
    try {
      const ogData = await ogParserApi.parseUrl(productUrl);
      
      const parsedData: Partial<ProductFormData> = {
        name: ogData.title || '',
        price: ogData.price?.replace(/[^0-9]/g, '') || '',
        sellingPrice: ogData.price?.replace(/[^0-9]/g, '') || '',
        brand: ogData.brand || '',
        brandWebsite: ogData.url || '',
        manufacturer: ogData.manufacturer || '',
        description: ogData.description || '',
        imageUrl: ogData.image || '',
      };
      setInitialFormData(parsedData);
      setHasImportedData(true);
      toast({ title: "✨ 정보 가져오기 완료!", description: "상품 정보를 가져왔습니다." });
    } catch (error) {
      console.error('URL 파싱 오류:', error);
      toast({ variant: "destructive", title: "정보 가져오기 실패", description: "URL에서 정보를 가져올 수 없습니다. 직접 입력해주세요." });
    } finally {
      setIsParsing(false);
    }
  };

  // 폼 제출 (생성 또는 수정)
  const handleFormSubmit = async (submitData: FormData) => {
    if (!currentPeermall?.id) {
      toast({ variant: "destructive", title: "오류", description: "피어몰 정보를 찾을 수 없습니다." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // 수정 로직
        if (!productToEdit?.id) {
          throw new Error("수정할 상품의 ID가 없습니다.");
        }
        await productApi.updateProduct(productToEdit.id.toString(), submitData);
        toast({ title: "🎉 상품 수정 완료!", description: "상품 정보가 성공적으로 업데이트되었습니다." });
      } else {
        // 생성 로직
        submitData.append('peermallId', currentPeermall.id.toString());
        await productApi.createProduct(submitData);
        toast({ title: "🎉 상품 등록 완료!", description: "새로운 상품이 성공적으로 등록되었습니다." });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(`상품 ${isEditMode ? '수정' : '등록'} 오류:`, error);
      toast({ variant: "destructive", title: `${isEditMode ? '수정' : '등록'} 실패`, description: `상품 ${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? '제품/상품 수정' : '제품/상품 등록'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? '상품 정보를 수정하세요.' : '외부 URL로 정보를 가져오거나 직접 입력하세요.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto pr-6">
          {/* URL 입력 섹션 (생성 모드에서만 보임) */}
          {!isEditMode && (
            <>
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">URL로 상품 정보 가져오기</h3>
                </div>
                <div className="flex gap-2">
                  <Input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://www.example.com/product/..." disabled={isParsing} />
                  <Button type="button" onClick={handleUrlImport} disabled={isParsing || !productUrl.trim()} variant="secondary">
                    {isParsing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />가져오는 중...</> : <><LinkIcon className="mr-2 h-4 w-4" />가져오기</>}
                  </Button>
                </div>
                {hasImportedData && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>상품 정보를 가져왔습니다. 아래 내용을 확인하고 수정해주세요.</AlertDescription>
                  </Alert>
                )}
              </div>
              <Separator />
            </>
          )}

          {/* ProductForm 컴포넌트 렌더링 */}
          <ProductForm
            ref={formRef}
            initialData={initialFormData}
            onSubmit={handleFormSubmit}
            formId={formId}
          />
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>취소</Button>
            <Button
              type="submit"
              form={formId} // ProductForm 내부의 form 태그와 연결
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditMode ? '수정 중...' : '등록 중...'}</> 
                : (isEditMode ? '수정' : '등록')}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;