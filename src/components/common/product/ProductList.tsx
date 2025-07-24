import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface ProductListProps {
  products: Product[];
  showPeermallInfo?: boolean;
  mode?: 'full' | 'list';
}

const ProductList = ({ products, showPeermallInfo = false, mode = 'full' }: ProductListProps) => {
  // products가 없거나 배열이 아닌 경우 처리
  if (!products || !Array.isArray(products)) {
    console.warn('ProductList: products가 유효하지 않습니다.', products);
    return (
      <div className="text-center py-8 text-muted-foreground">
        상품 목록을 불러올 수 없습니다.
      </div>
    );
  }

  // 유효한 상품만 필터링
  const validProducts = products.filter((product) => {
    if (!product || typeof product !== 'object') {
      console.warn('ProductList: 유효하지 않은 상품 데이터:', product);
      return false;
    }
    
    // 필수 속성 확인
    if (!product.id) {
      console.warn('ProductList: 상품 ID가 없습니다:', product);
      return false;
    }
    
    return true;
  });

  // 유효한 상품이 없는 경우
  if (validProducts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        표시할 상품이 없습니다.
      </div>
    );
  }

  // 리스트 모드일 때의 레이아웃
  if (mode === 'list') {
    return (
      <div className="space-y-4">
        {validProducts.map((product, index) => {
          // 키 생성 시 안전하게 처리
          const key = product.id ? String(product.id) : `product-${index}`;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
            >
              <ProductCard 
                product={product} 
                showPeermallInfo={showPeermallInfo}
                mode={mode}
              />
            </motion.div>
          );
        })}
      </div>
    );
  }

  // 그리드 모드 (기본)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {validProducts.map((product, index) => {
        // 키 생성 시 안전하게 처리
        const key = product.id ? String(product.id) : `product-${index}`;
        
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
          >
            <ProductCard 
              product={product} 
              showPeermallInfo={showPeermallInfo}
              mode={mode}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductList;
