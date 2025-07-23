import { apiClient } from '@/lib/api/clients';
import { Peermall } from '@/types/peermall';

class PeermallApi {
  // 피어몰 생성
  async createPeermall(peermallData: FormData): Promise<Peermall> {
    const response = await apiClient.post('/peermalls/create', peermallData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // URL로 피어몰 조회
  async getPeermallByUrl(url: string): Promise<Peermall> {
    const response = await apiClient.get(`/peermalls/${url}`);
    return response.data.data;
  }

  // ID로 피어몰 조회
  async getPeermallById(id: string): Promise<Peermall> {
    const response = await apiClient.get(`/peermalls/${id}`);
    return response.data.data;
  }

  // 사용자의 피어몰 목록 조회
  async getPeermallsByOwner(ownerId: string): Promise<Peermall[]> {
    const response = await apiClient.get(`/peermalls/owner/${ownerId}`);
    return response.data.data;
  }

  // 모든 피어몰 조회
  async getAllPeermalls(): Promise<Peermall[]> {
    const response = await apiClient.get('/peermalls');
    return response.data.data;
  }

  // 카테고리별 피어몰 조회
  async getPeermallsByCategory(category: string): Promise<Peermall[]> {
    const response = await apiClient.get(`/peermalls/category/${category}`);
    return response.data.data;
  }

  // 신규 피어몰 조회
  async getNewPeermalls(limit: number = 10): Promise<Peermall[]> {
    const response = await apiClient.get('/peermalls/new', {
      params: { limit },
    });
    return response.data.data;
  }

  // 베스트 피어몰 조회
  async getBestPeermalls(limit: number = 10): Promise<Peermall[]> {
    const response = await apiClient.get('/peermalls/best', {
      params: { limit },
    });
    return response.data.data;
  }

  // 피어몰 정보 업데이트
  async updatePeermall(
    id: string,
    updates: Partial<Peermall>
  ): Promise<Peermall> {
    const response = await apiClient.patch(`/peermalls/${id}`, updates);
    return response.data.data;
  }

  // 피어몰 삭제
  async deletePeermall(id: string): Promise<void> {
    await apiClient.delete(`/peermalls/${id}`);
  }

  // URL 사용 가능 여부 확인
  async checkUrlAvailability(url: string): Promise<boolean> {
    try {
      const response = await apiClient.get('/peermalls/check-url', {
        params: { url },
      });
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
