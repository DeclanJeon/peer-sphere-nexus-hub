// src/types/product.ts
export interface Product {
  id: string;
  peermallId: string;
  name: string;
  price: number;
  sellingPrice: number;
  costPrice?: number;
  shippingFee?: number;
  description: string;
  category: string;
  imageUrl?: string;
  images?: string[];
  brand?: string;
  manufacturer?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
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
