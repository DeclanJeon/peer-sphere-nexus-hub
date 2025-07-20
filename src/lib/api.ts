// lib/api.ts
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:9393';

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
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/peermalls/create`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};
