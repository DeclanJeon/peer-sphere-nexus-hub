export interface Peermall {
  [x: string]: any;
  id: string;
  url: string; // Changed from address to url to match backend
  name: string;
  description?: string;
  imageUrl?: string;
  creatorName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  familyCompany?: string;
  referrerCode: string;
  status: 'active' | 'inactive' | 'suspended';
  image_url: string | null;
  family_company: string;
  creator_name: string;
  owner_email: string;
  owner_phone: string;
  rating: number | null;
  sales_volume: number | null;
  follower_count: number;
  referrer_code: string;
  is_new: boolean;
  created_at: string;
  updated_at: string;
}

export interface PeermallCreationData {
  url: string; // Changed from address to url
  name: string;
  description?: string;
  imageUrl?: string;
  creatorName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  familyCompany?: string;
  referrerCode?: string;
  // Legacy fields for backward compatibility
  address?: string; // Alias for url
  ownerId?: string; // Not used in new API
  ownerName?: string; // Alias for creatorName
  category?: string; // Not used in new API
  image?: string; // Alias for imageUrl
}

export interface PeermallContextType {
  peermalls: Peermall[];
  currentPeermall: Peermall | null;
  loading: boolean;
  error: string | null;
  isMainPeermall: boolean;
  fetchPeermalls: () => Promise<void>;
  fetchPeermallByUrl: (address: string) => Promise<void>;
  createPeermall: (
    data: PeermallCreationData,
    imageFile: File | null
  ) => Promise<Peermall | undefined>;
  setCurrentPeermall: (peermall: Peermall | null) => void;
}
