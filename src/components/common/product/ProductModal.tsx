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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe } from 'lucide-react';
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
  const formId = "product-form";

  const isEditMode = mode === 'edit';

  const [productUrl, setProductUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<ProductFormData>>({});

  const resetAll = () => {
    setProductUrl('');
    setIsParsing(false);
    setIsSubmitting(false);
    setInitialFormData({});
    formRef.current?.reset();
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetAll, 300);
    } else if (isEditMode && productToEdit) {
      const formDataFromProduct: Partial<ProductFormData> = {
        name: productToEdit.name || '',
        sellingPrice: productToEdit.selling_price?.toString() || '',
        shippingFee: productToEdit.shipping_fee?.toString() || '',
        description: productToEdit.description || '',
        brand: productToEdit.brand || '',
        brandWebsite: productToEdit.brand_website || '', // ✨ [복원] 수정 시 brand_website 데이터 로드
        productUrl: productToEdit.product_url || '',
        manufacturer: productToEdit.manufacturer || '',
        distributor: productToEdit.distributor || '',
        imageUrl: productToEdit.image_url || '',
      };
      setInitialFormData(formDataFromProduct);
    }
  }, [isOpen, isEditMode, productToEdit]);

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
        sellingPrice: ogData.price?.replace(/[^0-9]/g, '') || '',
        brand: ogData.brand || '',
        brandWebsite: ogData.url || '', // ✨ [수정] OG 파싱 시 brandWebsite 필드도 함께 채웁니다.
        productUrl: productUrl, // 사용자가 입력한 URL은 판매 링크로 설정
        manufacturer: ogData.manufacturer || '',
        description: ogData.description || '',
        imageUrl: ogData.image || '',
      };
      setInitialFormData(parsedData);
      toast({ title: "✨ 정보 가져오기 완료!", description: "상품 정보를 가져왔습니다." });
    } catch (error) {
      console.error('URL 파싱 오류:', error);
      toast({ variant: "destructive", title: "정보 가져오기 실패", description: "URL에서 정보를 가져올 수 없습니다. 직접 입력해주세요." });
    } finally {
      setIsParsing(false);
    }
  };

  const handleFormSubmit = async (submitData: FormData) => {
    // ... (제출 로직은 이전과 동일)
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
          {!isEditMode && (
            <>
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">판매 상품 주소를 입력 하세요</h3>
                </div>
                <div className="flex gap-2">
                  <Input type="url" value={productUrl} onChange={(e) => setProductUrl(e.target.value)} placeholder="https://www.example.com/product/..." disabled={isParsing} />
                  <Button onClick={handleUrlImport} disabled={isParsing || !productUrl.trim()}>
                    {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : '정보 가져오기'}
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

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
              form={formId}
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