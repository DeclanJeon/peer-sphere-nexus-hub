import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';

interface Post {
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

interface CommunityListProps {
  posts: Post[];
}

const CommunityList = ({ posts }: CommunityListProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="w-16 text-center">번호</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-24 text-center">글쓴이</TableHead>
            <TableHead className="w-24 text-center">작성일</TableHead>
            <TableHead className="w-16 text-center">조회</TableHead>
            <TableHead className="w-16 text-center">추천</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow 
              key={post.id}
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell className="text-center font-medium">
                {post.isNotice ? (
                  <MessageSquare className="w-4 h-4 mx-auto text-red-500" />
                ) : (
                  post.id
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {post.isNotice && (
                    <Badge variant="destructive" className="text-xs">
                      공지
                    </Badge>
                  )}
                  {post.isPopular && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      인기
                    </Badge>
                  )}
                  <span className="text-foreground hover:text-primary transition-colors">
                    {post.title}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {post.author}
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {post.date}
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {formatNumber(post.views)}
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {formatNumber(post.likes)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommunityList;