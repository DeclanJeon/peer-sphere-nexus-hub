
export interface Peermall {
  id: string;
  name: string;
  address: string;
  category: string;
  description: string;
  image?: string;
  ownerId: string;
  ownerName: string;
  familyCompany: string;
  referralCode?: string;
  rating: number;
  sales: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface PeermallCreationData {
  name: string;
  address: string;
  category: string;
  description: string;
  image?: string;
  ownerId: string;
  ownerName: string;
  familyCompany: string;
  referralCode?: string;
  status?: 'active' | 'inactive';
}

export interface PeermallContextType {
  peermalls: Peermall[];
  currentPeermall: Peermall | null;
  loading: boolean;
  error: string | null;
  isMainPeermall: boolean;
  fetchPeermalls: () => Promise<void>;
  fetchPeermallByUrl: (address: string) => Promise<void>;
  createPeermall: (data: PeermallCreationData) => Promise<Peermall | undefined>;
  setCurrentPeermall: (peermall: Peermall | null) => void;
}
