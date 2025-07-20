import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye, Heart, Plus, Clock } from 'lucide-react';

const Community = () => {
  const posts = [
    {
      id: 1,
      title: '피어몰 운영 꿀팁 공유합니다!',
      content: '한 달간 피어몰을 운영하면서 얻은 노하우들을 공유해드려요.',
      author: '성공피어몰러',
      category: '운영팁',
      views: 234,
      comments: 12,
      likes: 45,
      createdAt: '2시간 전'
    },
    {
      id: 2,
      title: '신규 상품 홍보 방법이 궁금해요',
      content: '새로운 상품을 등록했는데 어떻게 홍보하면 좋을까요?',
      author: '초보판매자',
      category: '질문',
      views: 156,
      comments: 8,
      likes: 23,
      createdAt: '4시간 전'
    },
    {
      id: 3,
      title: '올해 트렌드 분석 자료',
      content: '2024년 상반기 인기 상품 카테고리 분석 자료를 공유합니다.',
      author: '마켓분석가',
      category: '정보',
      views: 789,
      comments: 34,
      likes: 156,
      createdAt: '1일 전'
    },
  ];

  const categories = [
    { name: '전체', count: 1234 },
    { name: '운영팁', count: 456 },
    { name: '질문', count: 789 },
    { name: '정보', count: 234 },
    { name: '자유', count: 567 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">피어몰 커뮤니티</h1>
          <p className="text-muted-foreground">다른 피어몰 운영자들과 소통하고 정보를 나누세요</p>
        </div>
        <Button asChild>
          <Link to="/community/create">
            <Plus className="h-4 w-4 mr-2" />
            글쓰기
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>카테고리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer">
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Table Format */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>게시글 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">번호</th>
                      <th className="text-left py-2 px-4 font-medium">제목</th>
                      <th className="text-left py-2 px-4 font-medium">글쓴이</th>
                      <th className="text-left py-2 px-4 font-medium">작성일</th>
                      <th className="text-left py-2 px-4 font-medium">조회</th>
                      <th className="text-left py-2 px-4 font-medium">추천</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post, index) => (
                      <tr key={post.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{posts.length - index}</td>
                        <td className="py-3 px-4">
                          <Link to={`/community/${post.id}`} className="hover:text-primary transition-colors">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{post.category}</Badge>
                              <span className="font-medium">{post.title}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{post.author}</td>
                        <td className="py-3 px-4 text-muted-foreground">{post.createdAt}</td>
                        <td className="py-3 px-4 text-muted-foreground">{post.views}</td>
                        <td className="py-3 px-4 text-muted-foreground">{post.likes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{'<'}</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                  <span className="text-sm text-muted-foreground">{'>'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;