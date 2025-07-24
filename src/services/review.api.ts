// Frontend/src/services/review.api.ts
import { apiClient } from '@/lib/api/clients';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  images: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  comments: ReviewComment[];
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  isSellerReply: boolean;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

interface GetReviewsParams {
  productId?: string;
  userId?: string;
  sortBy?: 'latest' | 'rating' | 'helpful';
  limit?: number;
  offset?: number;
}

class ReviewApi {
  private basePath = '/products/reviews';

  async getReviews(params: GetReviewsParams): Promise<Review[]> {
    const response = await apiClient.get(this.basePath, { params });
    return response.data.data;
  }

  async getReviewStats(productId: string): Promise<ReviewStats> {
    const response = await apiClient.get(`${this.basePath}/stats/${productId}`);
    return response.data.data;
  }

  async getReviewById(id: string): Promise<Review> {
    const response = await apiClient.get(`${this.basePath}/${id}`);
    return response.data.data;
  }

  async createReview(reviewData: FormData): Promise<Review> {
    const response = await apiClient.post(this.basePath, reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async updateReview(id: string, reviewData: FormData): Promise<void> {
    await apiClient.patch(`${this.basePath}/${id}`, reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async toggleLike(reviewId: string): Promise<{ isLiked: boolean }> {
    const response = await apiClient.post(`${this.basePath}/${reviewId}/like`);
    return response.data.data;
  }

  async createComment(
    reviewId: string,
    content: string,
    isSellerReply = false
  ): Promise<ReviewComment> {
    const response = await apiClient.post(
      `${this.basePath}/${reviewId}/comments`,
      {
        content,
        isSellerReply,
      }
    );
    return response.data.data;
  }

  async deleteComment(reviewId: string, commentId: string): Promise<void> {
    await apiClient.delete(
      `${this.basePath}/${reviewId}/comments/${commentId}`
    );
  }
}

export const reviewApi = new ReviewApi();
