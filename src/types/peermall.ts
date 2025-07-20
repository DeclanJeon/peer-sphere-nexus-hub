
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

export interface PeermallContextType {
  currentPeermall: Peermall | null;
  isMainPeermall: boolean;
  setCurrentPeermall: (peermall: Peermall | null) => void;
}
