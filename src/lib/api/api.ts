// lib/api.ts
import apiClient from './clients';

export interface PeermallCreateData {
  url: string;
  name: string;
  creatorName: string;
  description?: string;
  imageUrl?: string;
  familyCompany?: string;
  referrerCode?: string;
}

export const createPeermall = async (data: PeermallCreateData) => {
  const response = await apiClient.post(`/api/v1/peermalls/create`, data);
  return response.data;
};
