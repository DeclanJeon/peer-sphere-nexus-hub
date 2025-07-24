import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MessageCircle, ThumbsUp, Eye, Search, Edit, Trash2 } from 'lucide-react';

// Mock comment data
const mockComments = [
  {
    id: 'comment-1',
    content: '정말 좋은 상품이네요! 다음에도 구매할 예정입니다.',
    author: '김댓글',
    createdAt: '2024-07-20T10:30:00Z',
    postType: 'product',
    postTitle: 'iPhone 15 Pro',
    postId: 'product-1',
    status: 'published',
    likes: 12,
    replies: 3,
  },
  {
    id: 'comment-2',
    content: '이벤트 참여하고 싶어요! 언제까지 신청 가능한가요?',
    author: '박참여',
    createdAt: '2024-07-19T14:20:00Z',
    postType: 'event',
    postTitle: '여름 특가 이벤트',
    postId: 'event-1',
    status: 'published',
    likes: 8,
    replies: 1,
  },
  {
    id: 'comment-3',
    content: '커뮤니티 게시글에 대한 의견입니다.',
    author: '이의견',
    createdAt: '2024-07-18T09:15:00Z',
    postType: 'board',
    postTitle: '피어몰 이용 팁 공유',
    postId: 'board-1',
    status: 'published',
    likes: 5,
    replies: 0,
  },
  {
    id: 'comment-4',
    content: '문의사항이 있습니다. 연락 부탁드려요.',
    author: '최문의',
    createdAt: '2024-07-17T16:45:00Z',
    postType: 'product',
    postTitle: '갤럭시 S24',
    postId: 'product-2',
    status: 'reported',
    likes: 2,
    replies: 5,
  }
];

const statusLabels = {
  published: { label: '게시중', variant: 'default' as const },
  reported: { label: '신고됨', variant: 'destructive' as const },
  hidden: { label: '숨김', variant: 'secondary' as const },
};

const postTypeLabels = {
  product: '상품',
  event: '이벤트',
  board: '게시글',
};

export function CommentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [comments] = useState(mockComments);

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (commentId: string) => {
    console.log('Edit comment:', commentId);
    // 댓글 수정 로직
  };

  const handleDelete = (commentId: string) => {
    console.log('Delete comment:', commentId);
    // 댓글 삭제 로직
  };

  const handleHide = (commentId: string) => {
    console.log('Hide comment:', commentId);
    // 댓글 숨김 로직
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getTotalStats = () => {
    return {
      total: comments.length,
      published: comments.filter(c => c.status === 'published').length,
      reported: comments.filter(c => c.status === 'reported').length,
      totalLikes: comments.reduce((sum, c) => sum + c.likes, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">댓글 관리</h2>
        <p className="text-muted-foreground">
          내가 받은 댓글들을 관리하고 모니터링하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 댓글</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">게시 중</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.published)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신고된 댓글</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.reported)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalLikes)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="댓글 내용, 게시글 제목, 작성자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* 댓글 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>댓글 목록</CardTitle>
          <CardDescription>
            총 {filteredComments.length}개의 댓글이 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>댓글 내용</TableHead>
                <TableHead>게시글</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>반응</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm">{truncateText(comment.content, 60)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{truncateText(comment.postTitle, 30)}</p>
                      <Badge variant="outline" className="text-xs">
                        {postTypeLabels[comment.postType as keyof typeof postTypeLabels]}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{comment.author}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[comment.status as keyof typeof statusLabels]?.variant}>
                      {statusLabels[comment.status as keyof typeof statusLabels]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {comment.replies}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">메뉴 열기</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(comment.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          답글 작성
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHide(comment.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          숨김 처리
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(comment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredComments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '아직 댓글이 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}