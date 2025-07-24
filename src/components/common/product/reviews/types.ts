// src/components/common/product/reviews/types.ts

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  avatar?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  avatar?: string;
  helpful: number;
  images?: string[];
  comments?: Comment[];
}