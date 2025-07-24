// src/components/common/product/reviews/types.ts

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  avatar?: string;
  images?: string[];
  helpful?: number;
  comments?: Comment[];
}