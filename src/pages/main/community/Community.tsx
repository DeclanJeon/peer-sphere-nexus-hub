import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MessageCircle, Eye, Heart, Plus, Search, Volume2 } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('신규');
  const [activeCategory, setActiveCategory] = useState('전체글');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['전체글', '추천글', '공지', '인기글'];

  const posts = [
    {
      id: 'notice',
      number: '공지',
      title: '공짜로 물품을 구매할 수 있는 정보의 창소!!!!!!!!!',
      author: '윤하',
      createdAt: '25/07/15',
      views: '50K',
      likes: '50K',
      isNotice: true,
      isPopular: false
    },
    {
      id: 6,
      number: 6,
      title: '소금 추천 좀',
      author: '으응',
      createdAt: '18:32',
      views: 15,
      likes: 25,
      isNotice: false,
      isPopular: false
    },
    {
      id: 5,
      number: 5,
      title: '재미있는 놀이터',
      author: '키오스크',
      createdAt: '13:26',
      views: 56,
      likes: 13,
      isNotice: false,
      isPopular: false
    },
    {
      id: 4,
      number: 4,
      title: '심심해...',
      author: '롱김동',
      createdAt: '10:33',
      views: 32,
      likes: 45,
      isNotice: false,
      isPopular: false
    },
    {
      id: 3,
      number: 3,
      title: '같이 게임하실 분?',
      author: '콘젤리',
      createdAt: '25/07/17',
      views: 41,
      likes: 76,
      isNotice: false,
      isPopular: false
    },
    {
      id: 2,
      number: 2,
      title: '여행이 주된 말아요',
      author: '윤하',
      createdAt: '25/07/16',
      views: 38,
      likes: 33,
      isNotice: false,
      isPopular: true
    },
    {
      id: 1,
      number: 1,
      title: '바퀴벌레 죽여 주실 분?',
      author: '김다희',
      createdAt: '25/07/15',
      views: 33,
      likes: 63,
      isNotice: false,
      isPopular: false
    },
    {
      id: 7,
      number: 7,
      title: '피어몰 운영 꿀팁 공유합니다!',
      author: '성공피어몰러',
      createdAt: '25/07/14',
      views: 234,
      likes: 45,
      isNotice: false,
      isPopular: false
    },
    {
      id: 8,
      number: 8,
      title: '신규 상품 홍보 방법이 궁금해요',
      author: '초보판매자',
      createdAt: '25/07/13',
      views: 156,
      likes: 23,
      isNotice: false,
      isPopular: false
    },
    {
      id: 9,
      number: 9,
      title: '올해 트렌드 분석 자료',
      author: '마켓분석가',
      createdAt: '25/07/12',
      views: 789,
      likes: 156,
      isNotice: false,
      isPopular: false
    },
    {
      id: 10,
      number: 10,
      title: '고객 서비스 개선 방안',
      author: '서비스기획자',
      createdAt: '25/07/11',
      views: 445,
      likes: 89,
      isNotice: false,
      isPopular: false
    },
    {
      id: 11,
      number: 11,
      title: '마케팅 전략 토론해요',
      author: '마케터',
      createdAt: '25/07/10',
      views: 321,
      likes: 67,
      isNotice: false,
      isPopular: false
    }
  ];

  const formatNumber = (num: number | string) => {
    if (typeof num === 'string') return num;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">커뮤니티</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="게시글을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button asChild>
            <Link to="/community/create">
              <Plus className="h-4 w-4 mr-2" />
              글쓰기
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Posts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
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
                className={`hover:bg-muted/50 ${post.isPopular ? 'border-2 border-dashed border-primary' : ''}`}
              >
                <TableCell className="text-center">
                  {post.isNotice ? (
                    <div className="flex items-center justify-center">
                      <Volume2 className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{post.number}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/community/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {post.author}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">
                  {post.createdAt}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">
                  {formatNumber(post.views)}
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-sm">
                  {formatNumber(post.likes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={page === 2}
                  className={page === 2 ? "bg-primary text-primary-foreground" : ""}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Community;