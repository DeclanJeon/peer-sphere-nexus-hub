// Frontend/src/pages/common/ProductChannelPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Eye, Heart, Plus } from 'lucide-react';
import BoardList from '@/components/common/community/BoardList';
import { useState } from 'react';
import { Post } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ProductChannelPage = () => {
  const { url, productId, channelId } = useParams<{ url: string; productId: string; channelId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
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

  // 채널의 게시글들 - 더 상세한 더미 데이터
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
      content: `<p>안녕하세요! 이 상품으로 파스타를 만들어봤는데 정말 맛있었어요.</p>
                <p>특히 올리브오일과 함께 볶으니 풍미가 정말 좋더라구요.</p>
                <p>레시피 공유합니다:</p>
                <ul>
                  <li>재료를 먼저 손질합니다</li>
                  <li>팬에 올리브오일을 두르고...</li>
                  <li>마늘을 볶아 향을 냅니다</li>
                </ul>
                <p>다들 한번 시도해보세요!</p>`,
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
      content: `<p>이번 주말에 같이 요리하실 분 구합니다!</p>
                <p>장소는 강남역 근처 쿠킹스튜디오 예약했어요.</p>
                <p><strong>일시:</strong> 1월 20일 토요일 오후 2시</p>
                <p><strong>인원:</strong> 4명 (현재 2명 모집완료)</p>
                <p>참여하실 분은 댓글 남겨주세요~</p>`,
      views: 89,
      likes: 15,
      comment_count: 12,
      category: "모임",
      is_notice: false,
      is_new: false,
      is_popular: true,
      created_at: "2024-01-14T15:20:00Z",
      updated_at: "2024-01-14T15:20:00Z"
    },
    {
      num: 3,
      id: 103,
      peermall_id: 1,
      peermall_name: "테스트몰",
      user_uid: "user3",
      peermall_owner_uid: "owner1",
      author_name: "리뷰왕",
      title: "한 달 사용 후기 - 정말 만족해요!",
      content: `<p>이 제품을 한 달간 사용해본 솔직한 후기입니다.</p>
                <h3>장점</h3>
                <ul>
                  <li>품질이 정말 좋아요</li>
                  <li>가격 대비 성능이 훌륭합니다</li>
                  <li>디자인도 깔끔해요</li>
                </ul>
                <h3>단점</h3>
                <ul>
                  <li>배송이 조금 늦었어요</li>
                  <li>설명서가 좀 부실한 편</li>
                </ul>
                <p>전체적으로는 매우 만족스럽고 재구매 의향 있습니다!</p>`,
      views: 234,
      likes: 45,
      comment_count: 18,
      category: "후기",
      is_notice: false,
      is_new: false,
      is_popular: true,
      created_at: "2024-01-13T09:15:00Z",
      updated_at: "2024-01-13T09:15:00Z"
    },
    {
      num: 4,
      id: 104,
      peermall_id: 1,
      peermall_name: "테스트몰",
      user_uid: "admin",
      peermall_owner_uid: "owner1",
      author_name: "관리자",
      title: "[공지] 채널 이용 규칙 안내",
      content: `<p>안녕하세요, 채널 관리자입니다.</p>
                <p>원활한 채널 운영을 위해 몇 가지 규칙을 안내드립니다:</p>
                <ol>
                  <li>상품과 관련된 내용만 작성해주세요</li>
                  <li>욕설 및 비방은 금지됩니다</li>
                  <li>광고성 글은 즉시 삭제됩니다</li>
                  <li>서로 존중하며 소통해주세요</li>
                </ol>
                <p>모두가 즐거운 커뮤니티를 만들어가요!</p>`,
      views: 567,
      likes: 12,
      comment_count: 3,
      category: "공지",
      is_notice: true,
      is_new: false,
      is_popular: false,
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-10T08:00:00Z"
    }
  ]);

  const handlePostClick = (postId: number) => {
    // BoardDetail 페이지로 이동
    navigate(`/home/${url}/product/${productId}/channel/${channelId}/post/${postId}`);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "게시글 작성은 로그인 후 이용 가능합니다.",
        variant: "destructive"
      });
      return;
    }
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