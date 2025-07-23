// src/services/product.api.ts
import { apiClient } from '@/lib/api/clients';
import { Product } from '@/types/product';

// 서버로 보낼 파라미터 타입을 정의합니다.
interface GetProductsParams {
  peermallId?: string;
  tab?: string;
  category?: string;
  sortBy?: string;
  search?: string;
  status?: string;
}

class ProductApi {
  private basePath = '/products';

  /**
   * 통합된 상품 목록 조회 API
   * 메인 페이지, 피어몰 페이지의 모든 필터링/정렬을 담당합니다.
   */
  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
      // 파라미터 정리 - undefined 값 제거
      const cleanParams = Object.entries(params || {})
        .filter(([_, value]) => value !== undefined && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      console.log('API 요청 파라미터:', cleanParams);

      const response = await apiClient.get(this.basePath, {
        params: cleanParams,
      });

      // 응답 데이터 검증
      if (!response.data || !response.data.data) {
        console.warn('API 응답에 data가 없습니다:', response.data);
        return [];
      }

      return response.data.data;
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
      throw error;
    }
  }

  // 제품 생성
  async createProduct(productData: FormData): Promise<Product> {
    const response = await apiClient.post(
      `${this.basePath}/create`,
      productData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  // 제품 상세 조회
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data.data;
  }

  // 제품 정보 업데이트
  async updateProduct(id: string, productData: FormData): Promise<Product> {
    const response = await apiClient.patch(
      `${this.basePath}/${id}`,
      productData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  }

  // 제품 삭제
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const productApi = new ProductApi();
