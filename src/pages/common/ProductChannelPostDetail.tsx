// Frontend/src/pages/common/ProductChannelPostDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import BoardDetail from '@/components/common/community/BoardDetail';
import { Button } from '@/components/ui/button';

// 더미 데이터
const mockChannelPosts: Record<string, Post> = {
  '101': {
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
  '102': {
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
  '103': {
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
  '104': {
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
};

const ProductChannelPostDetail = () => {
  const { url, productId, channelId, postId } = useParams<{ 
    url: string; 
    productId: string; 
    channelId: string; 
    postId: string;
  }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제로는 API 호출
    // const fetchPost = async () => {
    //   try {
    //     const response = await productChannelApi.getPost(productId, channelId, postId);
    //     setPost(response);
    //   } catch (error) {
    //     console.error('Failed to fetch post:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPost();

    // 개발용 더미 데이터 사용
    const mockPost = mockChannelPosts[postId || ''];
    if (mockPost) {
      setPost(mockPost);
    }
    setLoading(false);
  }, [productId, channelId, postId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>게시글을 찾을 수 없습니다.</p>
        <Button 
          onClick={() => navigate(`/home/${url}/product/${productId}/channel/${channelId}`)}
          className="mt-4"
        >
          채널로 돌아가기
        </Button>
      </div>
    );
  }

  // BoardDetail에 필요한 props 전달을 위한 래퍼
  return <ChannelPostDetailWrapper post={post} />;
};

// BoardDetail을 감싸는 래퍼 컴포넌트
const ChannelPostDetailWrapper = ({ post }: { post: Post }) => {
  const { url, productId, channelId } = useParams();
  const navigate = useNavigate();

  // BoardDetail이 기대하는 형태로 데이터 제공
  // 실제로는 Context나 다른 방법으로 데이터를 전달할 수 있음
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 상품 채널 전용 헤더 */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/home/${url}/product/${productId}/channel/${channelId}`)}
          className="flex items-center gap-2"
        >
          ← 채널로 돌아가기
        </Button>
      </div>

      {/* 게시글 내용 표시 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">{post.category}</span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>조회 {post.views}</span>
              <span>좋아요 {post.likes}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.author_name}</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="p-6">
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductChannelPostDetail;
