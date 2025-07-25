// types/comment.ts
export interface Comment {
  id: string;
  post_id: string;
  user_uid: string;
  author_name: string;
  author_avatar_url?: string; // 아바타 URL은 선택적일 수 있습니다.
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateCommentRequest {
  content: string;
  author_name: string;
  author_avatar_url?: string;
}

export interface UpdateCommentRequest {
  content: string;
}
