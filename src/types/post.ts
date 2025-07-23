// types/post.ts
export interface Post {
  id: number;
  peermall_id: number; // string에서 number로 변경 (DB 스키마에 맞춤)
  peermall_name: string;
  user_uid: string;
  peermall_owner_uid: string;
  author_name: string;
  author_display_name?: string; // 추가
  author_profile_image?: string; // 추가
  title: string;
  content: string;
  views: number;
  likes: number;
  comment_count?: number; // 추가
  category: string;
  is_notice: boolean;
  is_new?: boolean; // 추가
  is_popular?: boolean; // 추가
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  peermall_url?: string;
}

export interface PostItem {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  category: string;
  isNotice: boolean;
  isPopular: boolean;
  commentCount: number;
  isNew: boolean;
}

export interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}
