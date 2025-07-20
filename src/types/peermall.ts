
export interface Peermall {
  id: number;
  url: string;
  name: string;
  description: string;
  image_url: string | null;
  creator_name: string;
  owner_email: string | null;
  owner_phone: string | null;
  family_company: string;
  referrer_code: string | null;
  rating: number;
  sales_volume: number;
  follower_count: number;
  created_at: string;
  updated_at: string;
  is_new?: 0 | 1;
  score?: number;
}

export interface PeermallCreationData {
  url: string;
  name: string;
  description: string;
  imageUrl?: string;
  creatorName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  familyCompany?: string;
  referrerCode?: string;
}

export interface PeermallContextType {
  peermalls: Peermall[];
  currentPeermall: Peermall | null;
  loading: boolean;
  error: string | null;
  isMainPeermall: boolean;
  fetchPeermalls: () => Promise<void>;
  fetchPeermallByUrl: (url: string) => Promise<void>;
  createPeermall: (data: PeermallCreationData) => Promise<Peermall | undefined>;
  setCurrentPeermall: (peermall: Peermall | null) => void;
}
