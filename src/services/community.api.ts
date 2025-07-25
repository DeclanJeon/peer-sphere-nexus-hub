// services/community.api.ts
import apiClient from '@/lib/api/clients';
import { Post, PostsResponse } from '@/types/post';
import { Comment, UpdateCommentRequest } from '@/types/comment';

class CommunityApi {
  private basePath = '/community';

  async getAllPosts() {
    const response = await apiClient.get(`${this.basePath}/all`);
    return response.data.data;
  }

  async getPostsByPeermallId(
    peermallId: string,
    options?: {
      page: number;
      limit: number;
      sortBy: string;
      category?: string;
    }
  ): Promise<PostsResponse> {
    const params = new URLSearchParams();
    if (options) {
      params.append('page', options.page.toString());
      params.append('limit', options.limit.toString());
      params.append('sortBy', options.sortBy);
      if (options.category) {
        params.append('category', options.category);
      }
    }

    const response = await apiClient.get(
      `${this.basePath}/peermall/${peermallId}?${params.toString()}`
    );
    return response.data;
  }

  async createPost(postData: Post): Promise<Post> {
    const response = await apiClient.post(`${this.basePath}/create`, postData);
    return response.data.data;
  }

  async getPostById(url: string, id: string): Promise<Post> {
    const response = await apiClient.get(`${this.basePath}/${id}`, {
      params: { url },
    });
    return response.data.data;
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    const response = await apiClient.patch(`${this.basePath}/${id}`, postData);
    return response.data.data;
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async toggleLike(postId: string): Promise<{ likes: number }> {
    const response = await apiClient.post(`${this.basePath}/${postId}/like`);
    return response.data.data;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const response = await apiClient.get(`${this.basePath}/${postId}/comments`);
    return response.data.data;
  }

  async createComment(commentData: Comment): Promise<Comment> {
    const response = await apiClient.post(
      `${this.basePath}/${commentData.post_id}/comments`,
      commentData
    );
    return response.data.data;
  }

  async updateComment(
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<Comment> {
    const response = await apiClient.patch(
      `${this.basePath}/comments/${commentId}`,
      data
    );
    return response.data.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/comments/${commentId}`);
  }
}

export const communityApi = new CommunityApi();
