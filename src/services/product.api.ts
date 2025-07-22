// src/services/product.api.ts
import { API_BASE_URL } from '@/lib/api/clients';
import axios from 'axios';
import { Product, ProductCreationData } from '@/types/product';

class ProductApi {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/products`,
    withCredentials: true,
  });

  // 피어몰별 제품 목록 조회
  async getProductsByPeermall(
    peermallId: string,
    params?: {
      category?: string;
      search?: string;
      sort?: string;
    }
  ): Promise<Product[]> {
    const response = await this.api.get(`/peermall/${peermallId}`, { params });
    return response.data.data;
  }

  // 제품 생성
  async createProduct(productData: FormData): Promise<Product> {
    const response = await this.api.post('/create', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // 제품 상세 조회
  async getProductById(id: string): Promise<Product> {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  // 제품 정보 업데이트
  async updateProduct(id: string, productData: FormData): Promise<Product> {
    const response = await this.api.patch(`/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // 제품 삭제
  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }
}

export const productApi = new ProductApi();
