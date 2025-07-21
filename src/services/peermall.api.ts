import { API_BASE_URL } from '@/lib/api/clients';
import axios from 'axios';
import { Peermall } from '@/types/peermall';

class PeermallApi {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/peermalls`,
    withCredentials: true,
  });

  // 피어몰 생성
  async createPeermall(
    peermallData: Omit<
      Peermall,
      'id' | 'rating' | 'sales' | 'createdAt' | 'updatedAt' | 'status'
    >
  ): Promise<Peermall> {
    const response = await this.api.post('/', peermallData);
    return response.data.data;
  }

  // URL로 피어몰 조회
  async getPeermallByUrl(url: string): Promise<Peermall> {
    const response = await this.api.get(`/${url}`);
    return response.data.data;
  }

  // ID로 피어몰 조회
  async getPeermallById(id: string): Promise<Peermall> {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  // 사용자의 피어몰 목록 조회
  async getPeermallsByOwner(ownerId: string): Promise<Peermall[]> {
    const response = await this.api.get(`/owner/${ownerId}`);
    return response.data.data;
  }

  // 모든 피어몰 조회
  async getAllPeermalls(): Promise<Peermall[]> {
    const response = await this.api.get('/');
    return response.data.data;
  }

  // 카테고리별 피어몰 조회
  async getPeermallsByCategory(category: string): Promise<Peermall[]> {
    const response = await this.api.get(`/category/${category}`);
    return response.data.data;
  }

  // 신규 피어몰 조회
  async getNewPeermalls(limit: number = 10): Promise<Peermall[]> {
    const response = await this.api.get('/new', { params: { limit } });
    return response.data.data;
  }

  // 베스트 피어몰 조회
  async getBestPeermalls(limit: number = 10): Promise<Peermall[]> {
    const response = await this.api.get('/best', { params: { limit } });
    return response.data.data;
  }

  // 피어몰 정보 업데이트
  async updatePeermall(
    id: string,
    updates: Partial<Peermall>
  ): Promise<Peermall> {
    const response = await this.api.patch(`/${id}`, updates);
    return response.data.data;
  }

  // 피어몰 삭제
  async deletePeermall(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }

  // URL 사용 가능 여부 확인
  async checkUrlAvailability(url: string): Promise<boolean> {
    try {
      const response = await this.api.get('/check-url', { params: { url } });
      return response.data.available;
    } catch (error) {
      if (error.response?.status === 400) {
        return false;
      }
      throw error;
    }
  }
}

export const peermallApi = new PeermallApi();
