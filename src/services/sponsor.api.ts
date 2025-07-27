import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9393/api/v1';

export interface Sponsor {
  id: number;
  name: string;
  name_en?: string;
}

export interface UserData {
  user_uid: string;
  user_name: string;
  // Add other user properties as needed
}

export const getSponsors = async (): Promise<Sponsor[]> => {
  try {
    const response = await axios.get(`${API_URL}/sponsors/all`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    throw error;
  }
};

export const selectSponsor = async (
  sponsorData: Sponsor,
  userData: UserData
): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/sponsors/select`, {
      sponsorData,
      userData,
    });
    return response.data;
  } catch (error) {
    console.error('Error selecting sponsor:', error);
    throw error;
  }
};
