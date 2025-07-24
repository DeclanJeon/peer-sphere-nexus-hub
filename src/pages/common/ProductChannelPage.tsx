import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Eye, Heart, Plus } from 'lucide-react';
import BoardList from '@/components/common/community/BoardList';
import { useState } from 'react';
import { Post } from '@/types/post';

const ProductChannelPage = () => {
  const { url, productId, channelId } = useParams<{ url: string; productId: string; channelId: string }>();
  const navigate = useNavigate();
  
  // 채널 정보 (실제로는 API에서 가져와야 함)
  const [channelInfo] = useState({
    id: Number(channelId),
    title: channelId === '1' ? "맛있는 요리 먹고 싶어요" : 
           channelId === '2' ? "저랑 만나실 분" : "이 상품 후기 궁금해요",
    author: channelId === '1' ? "김푸드" : 
            channelId === '2' ? "이만남" : "박궁금",
    category: channelId === '1' ? "맛집" : 
              channelId === '2' ? "모임" : "후기",
    description: channelId === '1' ? "이 상품으로 맛있는 요리를 만들어 먹고 싶어하는 사람들의 모임입니다." :
                 channelId === '2' ? "이 상품에 관심있는 분들과 만나서 이야기해요." : "실제 사용해보신 분들의 후기를 공유해주세요.",
    memberCount: channelId === '1' ? 45 : channelId === '2' ? 67 : 89,
    postCount: channelId === '1' ? 12 : channelId === '2' ? 25 : 18
  });

  // 채널의 게시글들 (실제로는 API에서 가져와야 함)
  const [channelPosts] = useState<Post[]>([
    {
      num: 1,
      id: 101,
      peermall_id: 1,
      peermall_name: "테스트몰",
      user_uid: "user1",
      peermall_owner_uid: "owner1",
      author_name: "요리사123",
      title: "이 재료로 파스타 만들어봤어요!",
      content: "정말 맛있게 잘 만들어졌네요",
      views: 156,
      likes: 23,
      comment_count: 8,
      category: "레시피",
      is_notice: false,
      is_new: true,
      is_popular: false,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      num: 2,
      id: 102,
      peermall_id: 1,
      peermall_name: "테스트몰",
      user_uid: "user2",
      peermall_owner_uid: "owner1",
      author_name: "맛있게드세요",
      title: "같이 요리하실 분 구해요",
      content: "이 재료로 같이 요리해요",
      views: 89,
      likes: 15,
      comment_count: 12,
      category: "모임",
      is_notice: false,
      is_new: false,
      is_popular: true,
      created_at: "2024-01-14T15:20:00Z",
      updated_at: "2024-01-14T15:20:00Z"
    }
  ]);

  const handlePostClick = (postId: number) => {
    navigate(`/home/${url}/product/${productId}/channel/${channelId}/post/${postId}`);
  };

  const handleCreatePost = () => {
    navigate(`/home/${url}/product/${productId}/channel/${channelId}/create`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/home/${url}/product/${productId}`)} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          상품으로 돌아가기
        </Button>
      </div>

      {/* 채널 정보 카드 */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">{channelInfo.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{channelInfo.category}</Badge>
                  <span className="text-sm text-muted-foreground">by {channelInfo.author}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleCreatePost} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              글 작성
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{channelInfo.description}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              멤버 {channelInfo.memberCount}명
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              게시글 {channelInfo.postCount}개
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>채널 게시글</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BoardList 
            posts={channelPosts}
            onPostClick={handlePostClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductChannelPage;