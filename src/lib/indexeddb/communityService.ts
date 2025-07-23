import { dbManager, Post } from './database';

export class CommunityService {
  // 커뮤니티 게시글 생성
  async createPost(
    postData: Omit<
      Post,
      'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Post> {
    const post: Post = {
      id: crypto.randomUUID(),
      likes: 0,
      comments: 0,
      type: 'community',
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      title: '',
      content: '',
      authorId: '',
    };

    const store = await dbManager.getStore('posts', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.add(post);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return post;
  }

  // 게시글 조회 (ID로)
  async getPostById(id: string): Promise<Post | null> {
    const store = await dbManager.getStore('posts');

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // 피어몰의 커뮤니티 게시글 목록 조회
  async getPostsByPeermallId(peermallId: string): Promise<Post[]> {
    const store = await dbManager.getStore('posts');
    const index = store.index('peermallId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(peermallId);
      request.onsuccess = () => {
        const posts = request.result || [];
        const communityPosts = posts.filter(
          (post) => post.type === 'community'
        );
        resolve(communityPosts);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 모든 커뮤니티 게시글 조회
  async getAllCommunityPosts(): Promise<Post[]> {
    const store = await dbManager.getStore('posts');
    const index = store.index('type');

    return new Promise((resolve, reject) => {
      const request = index.getAll('community');
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // 인기 게시글 조회 (좋아요 기준)
  async getPopularPosts(
    limit: number = 10,
    peermallId?: string
  ): Promise<Post[]> {
    let posts: Post[];

    if (peermallId) {
      posts = await this.getPostsByPeermallId(peermallId);
    } else {
      posts = await this.getAllCommunityPosts();
    }

    return posts.sort((a, b) => b.likes - a.likes).slice(0, limit);
  }

  // 최신 게시글 조회
  async getRecentPosts(
    limit: number = 10,
    peermallId?: string
  ): Promise<Post[]> {
    let posts: Post[];

    if (peermallId) {
      posts = await this.getPostsByPeermallId(peermallId);
    } else {
      posts = await this.getAllCommunityPosts();
    }

    return posts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }

  // 게시글 업데이트
  async updatePost(
    id: string,
    updates: Partial<Omit<Post, 'id' | 'authorId' | 'type' | 'createdAt'>>
  ): Promise<Post> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    const updatedPost: Post = {
      ...post,
      ...updates,
      updatedAt: new Date(),
    };

    const store = await dbManager.getStore('posts', 'readwrite');
    await new Promise((resolve, reject) => {
      const request = store.put(updatedPost);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return updatedPost;
  }

  // 게시글 삭제
  async deletePost(id: string): Promise<void> {
    const store = await dbManager.getStore('posts', 'readwrite');

    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 좋아요 증가
  async likePost(id: string): Promise<Post> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    return this.updatePost(id, { likes: post.likes + 1 });
  }

  // 댓글 수 업데이트
  async updateCommentCount(id: string, count: number): Promise<Post> {
    return this.updatePost(id, { comments: count });
  }

  // 게시글 검색
  async searchPosts(query: string, peermallId?: string): Promise<Post[]> {
    let posts: Post[];

    if (peermallId) {
      posts = await this.getPostsByPeermallId(peermallId);
    } else {
      posts = await this.getAllCommunityPosts();
    }

    const lowercaseQuery = query.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const communityService = new CommunityService();
