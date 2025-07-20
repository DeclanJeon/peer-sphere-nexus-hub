
export interface Peermall {
  id: string;
  name: string;
  url: string;
  description: string;
  image?: string;
  creatorName: string;
  familyCompany?: string;
  referrerCode?: string;
  rating: number;
  sales: number;
  category: string;
  isMain?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PeermallContextType {
  currentPeermall: Peermall | null;
  isMainPeermall: boolean;
  setCurrentPeermall: (peermall: Peermall | null) => void;
}
