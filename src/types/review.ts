export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_uid: string;
  rating: number;
  content: string;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  updated_at: string;
  comments: ReviewComment[];
}

export interface ReviewComment {
  id: string | number; // id가 숫자일 수도 있음
  review_id: string;
  user_id: string;
  content: string;
  is_seller_reply: boolean;
  author_name: string;
  author_avatar?: string;
  created_at: string;
}

export interface ReviewStats {
  total_count: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface GetReviewsParams {
  productId?: string;
  userId?: string;
  sortBy?: 'latest' | 'rating' | 'helpful';
  limit?: number;
  offset?: number;
}
