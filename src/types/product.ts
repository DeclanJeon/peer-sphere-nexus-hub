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
