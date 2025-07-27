// src/services/sponsor.api.ts
import { Sponsor } from '@/types/sponsor';
import sponsorData from '@/seeds/sponsor.json';

class SponsorApi {
  // 모든 스폰서 목록 조회
  async getSponsors(): Promise<Sponsor[]> {
    // TODO: 백엔드 API 연동 필요
    // const response = await apiClient.get('/sponsors');
    // return response.data.data;
    
    // 더미 데이터 사용
    return sponsorData.sponsors as Sponsor[];
  }

  // 스폰서 선택
  async selectSponsor(sponsorId: number, userId: string): Promise<void> {
    // TODO: 백엔드 API 연동 필요
    // await apiClient.post('/users/sponsor', { sponsorId, userId });
    
    console.log(`User ${userId} selected sponsor ${sponsorId}`);
  }

  // 사용자의 선택된 스폰서 조회
  async getUserSponsor(userId: string): Promise<Sponsor | null> {
    // TODO: 백엔드 API 연동 필요
    // const response = await apiClient.get(`/users/${userId}/sponsor`);
    // return response.data.data;
    
    // 더미 데이터 - localStorage에서 조회
    const selectedSponsorId = localStorage.getItem('selectedSponsorId');
    if (selectedSponsorId) {
      const sponsors = sponsorData.sponsors as Sponsor[];
      return sponsors.find(s => s.id === parseInt(selectedSponsorId)) || null;
    }
    return null;
  }
}

export const sponsorApi = new SponsorApi();