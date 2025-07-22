export interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  category: string;
  isNotice?: boolean;
  isPopular?: boolean;
}
