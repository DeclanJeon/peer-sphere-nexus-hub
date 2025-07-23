export interface Comment {
  id: string;
  post_id: string;
  user_uid: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}