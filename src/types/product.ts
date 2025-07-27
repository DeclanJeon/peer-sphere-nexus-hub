// src/types/product.ts
export interface Product {
  [x: string]: any;
  id: string;
  peermallId: string;
  name: string;
  price: number;
  selling_price: number;
  cost_price?: number;
  shipping_fee?: number;
  description: string;
  category: string;
  is_new?: boolean;
  is_best?: boolean;
  discount?: number;
  review_count?: number;
  image_url?: string;
  images?: string[];
  brand?: string;
  manufacturer?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  views?: number;
  likes?: number;
  rating?: number;
  features?: string[];
  specifications?: Record<string, string>;
  sellerLinks?: SellerLink[]; // 판매점 링크 배열 (선택적)
}

// 판매점 링크 정보 타입을 정의합니다.
export interface SellerLink {
  id: string;
  name: string;
  logoUrl: string;
  price: number;
  shippingInfo: string;
  link: string;
  updateInfo: string;
}

export interface ProductCreationData {
  peermallId: string;
  name: string;
  price: string;
  sellingPrice: string;
  costPrice?: string;
  shippingFee?: string;
  description: string;
  category: string;
  image?: File;
  imageUrl?: string;
  brand?: string;
  manufacturer?: string;
}
