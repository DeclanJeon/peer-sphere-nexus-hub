import { User } from '@/contexts/AuthContext';
import apiClient from '@/lib/api/clients';

const basePath = '/sponsors';

// 스폰서 인터페이스 (DB 스키마에 맞게 확장)
export interface Sponsor {
  id: number;
  name: string;
  name_en?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

// 스폰서 관계 인터페이스
export interface SponsorRelationship {
  id: number;
  sponsor_id: number;
  sponsored_user_uid: string;
  relationship_type: 'sponsor' | 'partner' | 'affiliate';
  status: 'active' | 'inactive' | 'pending';
  start_date?: string;
  end_date?: string;
  notes?: string;
  sponsor_name: string;
  sponsor_name_en?: string;
  created_at: string;
}

export interface UserData extends User {
  user_name: string;
}

class SponsorApi {
  // 모든 스폰서 조회
  getSponsors = async (): Promise<Sponsor[]> => {
    try {
      const response = await apiClient.get(`${basePath}/all`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      throw error;
    }
  };

  // 스폰서 선택
  selectSponsor = async (
    sponsorData: Sponsor,
    userData: UserData
  ): Promise<any> => {
    try {
      const response = await apiClient.post(`${basePath}/select`, {
        sponsorData,
        userData,
      });
      return response.data;
    } catch (error) {
      console.error('Error selecting sponsor:', error);
      throw error;
    }
  };

  // 사용자의 현재 스폰서 조회
  getUserSponsor = async (
    userUid: string
  ): Promise<SponsorRelationship | null> => {
    try {
      const response = await apiClient.get(`${basePath}/user/${userUid}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user sponsor:', error);
      throw error;
    }
  };

  // 스폰서 관계 해제
  removeSponsor = async (userUid: string): Promise<any> => {
    try {
      const response = await apiClient.delete(`${basePath}/user/${userUid}`);
      return response.data;
    } catch (error) {
      console.error('Error removing sponsor:', error);
      throw error;
    }
  };

  // 스폰서별 관계 목록 조회
  getSponsorRelationships = async (
    sponsorId: number
  ): Promise<SponsorRelationship[]> => {
    try {
      const response = await apiClient.get(
        `${basePath}/${sponsorId}/relationships`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching sponsor relationships:', error);
      throw error;
    }
  };
}

const sponsorApi = new SponsorApi();
export default sponsorApi;
