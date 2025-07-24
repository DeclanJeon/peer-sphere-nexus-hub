import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  MessageCircle,
  Heart,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// TODO: Replace with actual API data
const mockPosts = [
  {
    id: '1',
    title: '피어몰 운영 꿀팁 공유합니다',
    content: '안녕하세요! 피어몰을 운영하면서 얻은 노하우를 공유드려요...',
    category: '팁/노하우',
    peermallName: '김민수의 뷰티샵',
    views: 1250,
    likes: 89,
    comments: 23,
    createdAt: '2024-01-25',
    status: 'published' as const,
  },
  {
    id: '2',
    title: '신제품 입고 알림',
    content: '많이 기다려주신 신제품이 드디어 입고되었습니다!',
    category: '공지사항',
    peermallName: '테크 가젯 스토어',
    views: 890,
    likes: 45,
    comments: 12,
    createdAt: '2024-02-10',
    status: 'published' as const,
  },
];

const statusLabels = {
  published: { label: '게시됨', variant: 'default' as const },
  draft: { label: '임시저장', variant: 'secondary' as const },
  hidden: { label: '숨김', variant: 'outline' as const },
};

export function CommunityManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts] = useState(mockPosts);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.peermallName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (postId: string) => {
    // TODO: Navigate to edit page or open edit modal
    console.log('Edit post:', postId);
  };

  const handleDelete = (postId: string) => {
    // TODO: Show confirmation dialog and delete post
    console.log('Delete post:', postId);
  };

  const handleCreate = () => {
    // TODO: Navigate to create page
    console.log('Create new post');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">게시글 관리</h2>
          <p className="text-muted-foreground">
            작성한 커뮤니티 게시글을 관리하고 편집하세요.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          새 게시글 작성
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 게시글</p>
                <p className="text-2xl font-bold">{posts.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 조회수</p>
                <p className="text-2xl font-bold">
                  {formatNumber(posts.reduce((sum, p) => sum + p.views, 0))}회
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">총 좋아요</p>
                <p className="text-2xl font-bold">
                  {formatNumber(posts.reduce((sum, p) => sum + p.likes, 0))}개
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>게시글 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 카테고리 또는 피어몰로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>게시글 정보</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>피어몰</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>반응</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium mb-1">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {truncateText(post.content, 50)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{post.peermallName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusLabels[post.status].variant}>
                        {statusLabels[post.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(post.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(post.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {formatNumber(post.comments)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{post.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(post.id)}
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
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '작성한 게시글이 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}