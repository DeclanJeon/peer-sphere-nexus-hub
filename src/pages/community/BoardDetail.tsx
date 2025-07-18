import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Heart, MessageCircle, Clock, User } from 'lucide-react';
import { useState } from 'react';

const BoardDetail = () => {
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const post = {
    id,
    title: '피어몰 운영 꿀팁 공유합니다!',
    content: `안녕하세요! 피어몰을 운영한 지 한 달이 되어서 그동안 얻은 노하우들을 공유해드리려고 해요.

1. 상품 사진은 정말 중요해요
고품질의 사진을 올리니까 확실히 관심도가 달라지더라고요. 자연광에서 찍는 것을 추천드립니다.

2. 고객과의 소통
빠른 답변과 친절한 응대가 재구매로 이어지는 것 같아요. 가능하면 24시간 이내에 답변하려고 노력하고 있습니다.

3. 트렌드 파악
인스타그램, 틱톡 등에서 요즘 뭐가 인기인지 계속 체크하고 있어요. 트렌드에 맞는 상품을 빠르게 입고하는 게 중요한 것 같습니다.

더 궁금한 점 있으시면 댓글로 남겨주세요!`,
    author: '성공피어몰러',
    category: '운영팁',
    views: 234,
    likes: 45,
    createdAt: '2시간 전'
  };

  const comments = [
    {
      id: 1,
      author: '신규판매자',
      content: '정말 유용한 정보네요! 사진 촬영 팁이 특히 도움이 됐습니다.',
      createdAt: '1시간 전'
    },
    {
      id: 2,
      author: '중급피어몰러',
      content: '트렌드 파악하는 방법 더 자세히 알 수 있을까요?',
      createdAt: '30분 전'
    }
  ];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment('');
    // Handle comment submission
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Post Content */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{post.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{post.createdAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              좋아요
            </Button>
            <Button variant="outline" size="sm">
              공유하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">댓글 {comments.length}개</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              rows={3}
              className="mb-3"
            />
            <Button type="submit" disabled={!comment.trim()}>
              댓글 작성
            </Button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="font-medium text-sm">{comment.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{comment.createdAt}</span>
                  </div>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardDetail;