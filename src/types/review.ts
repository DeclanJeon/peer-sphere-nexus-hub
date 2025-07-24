// Frontend/src/pages/user-peermall/products/reviews/types.ts
export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  images?: string[];
  comments: Comment[];
}
