import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, ThumbsUp } from 'lucide-react';
import { Post } from '@/types/post';
import { useEffect, useState } from 'react';
import { communityApi } from '@/services/community.api';

interface BoardListProps {
  peermallId?: number | string;
  posts?: Post[];
  onPostClick?: (postId: number) => void;
  isMainPeermall?: boolean;
}

const BoardList = ({ peermallId, posts: propsPosts, onPostClick, isMainPeermall = false }: BoardListProps) => {
  const [posts, setPosts] = useState<Post[]>(propsPosts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (peermallId && !propsPosts) {
      const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await communityApi.getPostsByPeermallId(
            peermallId.toString(),
            {
              page: 1,
              limit: 20,
              sortBy: 'latest'
            }
          );

          setPosts(response.data || []);
        } catch (err) {
          setError('게시글을 불러오는데 실패했습니다.');
          console.error('Failed to fetch posts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    } else if (propsPosts) {
      setPosts(propsPosts);
    }
  }, [peermallId, propsPosts]);

  // 천 단위 포맷팅 함수
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  // 클릭 핸들러 - 이벤트 전파 방지 추가
  const handleRowClick = (e: React.MouseEvent, postId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // onPostClick이 있는지 확인
    if (onPostClick && typeof onPostClick === 'function') {
      onPostClick(postId);
    } else {
      console.error('onPostClick is not defined or not a function');
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">게시글을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  // 게시글이 없는 경우
  if (posts.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">게시글이 없습니다.</p>
      </div>
    );
  }

  // 게시글 행 렌더링 함수
  const renderPostRow = (post: Post) => {
    if (!post) {
      console.warn('Invalid post data:', post);
      return null;
    }

    const commentCount = post.comment_count || 0;
    const authorName = post.author_display_name || post.author_name;

    return (
      <TableRow
        key={post.id}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={(e) => handleRowClick(e, post.id)}
        style={{ cursor: 'pointer' }} // 명시적으로 커서 스타일 추가
      >
        <TableCell className="text-center text-sm">
          {post.is_notice ? (
            <Badge variant="outline" className="border-primary text-primary">공지</Badge>
          ) : (
            post.num
          )}
        </TableCell>
        {/* 메인 피어몰에서는 피어몰명 표시 */}
        {isMainPeermall && (
          <TableCell className="text-sm">
            <Badge variant="secondary">
              {post.peermall_name || post.peermall_url || '피어몰'}
            </Badge>
          </TableCell>
        )}
        <TableCell className="text-sm">
          <Badge variant={post.is_notice ? 'secondary' : 'outline'}>
            {post.category}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium hover:text-primary transition-colors">{post.title}</span>
            {post.is_new && (
              <Badge variant="secondary" className="text-xs">NEW</Badge>
            )}
            {post.is_popular && (
              <Badge variant="destructive" className="text-xs">인기</Badge>
            )}
            {commentCount > 0 && (
              <div className="flex items-center text-muted-foreground text-sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center text-sm">{authorName}</TableCell>
        <TableCell className="text-center text-sm">{formatDate(post.created_at)}</TableCell>
        <TableCell className="text-center text-sm">
          <div className="flex items-center justify-center gap-1">
            <Eye className="h-4 w-4 text-muted-foreground" />
            {formatNumber(post.views || 0)}
          </div>
        </TableCell>
        <TableCell className="text-center text-sm">
          <div className="flex items-center justify-center gap-1">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            {formatNumber(post.likes || 0)}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/50">
            <TableHead className="w-16 text-center">번호</TableHead>
            {isMainPeermall && <TableHead className="w-32">피어몰</TableHead>}
            <TableHead className="w-24">카테고리</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-24 text-center">글쓴이</TableHead>
            <TableHead className="w-24 text-center">작성일</TableHead>
            <TableHead className="w-16 text-center">조회</TableHead>
            <TableHead className="w-16 text-center">추천</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(renderPostRow)}
        </TableBody>
      </Table>
    </div>
  );
};

export default BoardList;