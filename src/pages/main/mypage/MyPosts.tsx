import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Eye, Heart, Edit, Trash2, Plus } from 'lucide-react';

const MyPosts = () => {
  const posts = [
    {
      id: 1,
      title: '피어몰 운영 꿀팁 공유합니다!',
      category: '운영팁',
      views: 234,
      comments: 12,
      likes: 45,
      createdAt: '2024-01-15',
      status: '게시중'
    },
    {
      id: 2,
      title: '신규 상품 홍보 방법이 궁금해요',
      category: '질문',
      views: 156,
      comments: 8,
      likes: 23,
      createdAt: '2024-01-14',
      status: '게시중'
    },
    {
      id: 3,
      title: '올해 트렌드 분석 자료',
      category: '정보',
      views: 789,
      comments: 34,
      likes: 156,
      createdAt: '2024-01-13',
      status: '게시중'
    },
    {
      id: 4,
      title: '임시 저장된 게시글',
      category: '자유',
      views: 0,
      comments: 0,
      likes: 0,
      createdAt: '2024-01-12',
      status: '임시저장'
    },
  ];

  const handleDelete = (postId: number) => {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      // Handle delete
      console.log('Delete post:', postId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">내 게시글 관리</h1>
        </div>
        <Button asChild>
          <Link to="/community/create">
            <Plus className="h-4 w-4 mr-2" />
            새 게시글
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">8</div>
            <div className="text-sm text-muted-foreground">총 게시글</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">1,179</div>
            <div className="text-sm text-muted-foreground">총 조회수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">54</div>
            <div className="text-sm text-muted-foreground">총 댓글</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">224</div>
            <div className="text-sm text-muted-foreground">총 좋아요</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>게시글 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 rounded border hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant={post.status === '게시중' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{post.createdAt}</span>
                  </div>
                  <Link to={`/community/${post.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/community/edit/${post.id}`}>
                      <Edit className="h-3 w-3" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPosts;