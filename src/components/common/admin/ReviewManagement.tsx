import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Star, MessageCircle, Search, Edit, Trash2, Eye } from 'lucide-react';

// Mock review data
const mockReviews = [
  {
    id: 'review-1',
    content: '정말 좋은 상품이에요! 품질도 만족스럽고 배송도 빨랐습니다.',
    author: '김리뷰',
    rating: 5,
    productTitle: 'iPhone 15 Pro',
    productId: 'product-1',
    createdAt: '2024-07-20T10:30:00Z',
    status: 'published',
    helpful: 15,
    comments: 3,
    hasImages: true,
  },
  {
    id: 'review-2',
    content: '디자인이 예쁘고 마음에 들어요. 다만, 사이즈가 조금 작은 것 같네요.',
    author: '박구매',
    rating: 4,
    productTitle: '갤럭시 S24',
    productId: 'product-2',
    createdAt: '2024-07-19T14:20:00Z',
    status: 'published',
    helpful: 8,
    comments: 1,
    hasImages: false,
  },
  {
    id: 'review-3',
    content: '가격 대비 만족스럽습니다. 추천해요!',
    author: '최만족',
    rating: 5,
    productTitle: 'AirPods Pro',
    productId: 'product-3',
    createdAt: '2024-07-18T09:15:00Z',
    status: 'published',
    helpful: 22,
    comments: 5,
    hasImages: true,
  },
  {
    id: 'review-4',
    content: '배송이 너무 늦었어요. 상품은 괜찮지만...',
    author: '이불만',
    rating: 2,
    productTitle: 'MacBook Air',
    productId: 'product-4',
    createdAt: '2024-07-17T16:45:00Z',
    status: 'reported',
    helpful: 3,
    comments: 8,
    hasImages: false,
  }
];

const statusLabels = {
  published: { label: '게시중', variant: 'default' as const },
  reported: { label: '신고됨', variant: 'destructive' as const },
  hidden: { label: '숨김', variant: 'secondary' as const },
};

export function ReviewManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews] = useState(mockReviews);

  const filteredReviews = reviews.filter(review =>
    review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReply = (reviewId: string) => {
    console.log('Reply to review:', reviewId);
    // 리뷰 답글 로직
  };

  const handleDelete = (reviewId: string) => {
    console.log('Delete review:', reviewId);
    // 리뷰 삭제 로직
  };

  const handleHide = (reviewId: string) => {
    console.log('Hide review:', reviewId);
    // 리뷰 숨김 로직
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getTotalStats = () => {
    return {
      total: reviews.length,
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      published: reviews.filter(r => r.status === 'published').length,
      totalHelpful: reviews.reduce((sum, r) => sum + r.helpful, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">리뷰 관리</h2>
        <p className="text-muted-foreground">
          내 상품에 달린 리뷰들을 관리하고 고객과 소통하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 리뷰</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
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
            <CardTitle className="text-sm font-medium">도움됨</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalHelpful)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="리뷰 내용, 상품명, 작성자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* 리뷰 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>리뷰 목록</CardTitle>
          <CardDescription>
            총 {filteredReviews.length}개의 리뷰가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>리뷰 내용</TableHead>
                <TableHead>상품</TableHead>
                <TableHead>평점</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>반응</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm">{truncateText(review.content, 60)}</p>
                      {review.hasImages && (
                        <Badge variant="outline" className="text-xs mt-1">
                          이미지 포함
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{truncateText(review.productTitle, 30)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm ml-1">{review.rating}.0</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{review.author}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusLabels[review.status as keyof typeof statusLabels]?.variant}>
                      {statusLabels[review.status as keyof typeof statusLabels]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {review.helpful}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {review.comments}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => handleReply(review.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          답글 작성
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHide(review.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          숨김 처리
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(review.id)}
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

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '아직 리뷰가 없습니다.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}