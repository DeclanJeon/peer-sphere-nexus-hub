import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CommunityList from '@/components/common/community/CommunityList';
import CommunityTabs from '@/components/common/community/CommunityTabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
  category: string;
  isNotice?: boolean;
  isPopular?: boolean;
}

const CommunityPage = () => {
  const location = useLocation();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('전체글');
  const [posts, setPosts] = useState<Post[]>([]);

  // 현재 경로가 메인 피어몰인지 유저 피어몰인지 판단
  const isUserPeermall = location.pathname.startsWith('/home/');
  const peermallUrl = params.url;

  // 목업 데이터
  const mockPosts: Post[] = [
    {
      id: 1,
      title: '공짜로 물품을 구매할 수 있는 정보의 장소!!!!!!!!!',
      author: '윤하',
      date: '25/07/15',
      views: 50000,
      likes: 50000,
      category: '공지',
      isNotice: true
    },
    {
      id: 2,
      title: '스크 추천 좀',
      author: '으음',
      date: '18:32',
      views: 15,
      likes: 25,
      category: '일반'
    },
    {
      id: 3,
      title: '제미있는 놀이터',
      author: '키오스크',
      date: '13:26',
      views: 56,
      likes: 13,
      category: '일반'
    },
    {
      id: 4,
      title: '실상해...',
      author: '홍길동',
      date: '10:33',
      views: 32,
      likes: 45,
      category: '일반'
    },
    {
      id: 5,
      title: '갇이 게임하실 분?',
      author: '큰젤리',
      date: '25/07/17',
      views: 41,
      likes: 76,
      category: '일반'
    },
    {
      id: 6,
      title: '여행이 주된 맞아요',
      author: '윤하',
      date: '25/07/16',
      views: 38,
      likes: 33,
      category: '일반',
      isPopular: true
    },
    {
      id: 7,
      title: '바퀴벌레 죽여 주실 분?',
      author: '김다희',
      date: '25/07/15',
      views: 33,
      likes: 63,
      category: '일반'
    },
    {
      id: 8,
      title: '피어몰 운영 팁을 공유합니다!',
      author: '성공메어톨리',
      date: '25/07/14',
      views: 234,
      likes: 45,
      category: '팁'
    },
    {
      id: 9,
      title: '신규 상품 홍보 방법이 궁금해요',
      author: '초보판매자',
      date: '25/07/13',
      views: 156,
      likes: 23,
      category: '질문'
    },
    {
      id: 10,
      title: '올해 트렌드 무성 자료',
      author: '마케팅석가',
      date: '25/07/12',
      views: 789,
      likes: 156,
      category: '정보'
    }
  ];

  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져올 것
    // isUserPeermall과 peermallUrl에 따라 다른 데이터 로드
    setPosts(mockPosts);
  }, [isUserPeermall, peermallUrl, activeTab]);

  const filteredPosts = posts.filter(post => {
    switch (activeTab) {
      case '추천글':
        return post.likes > 30;
      case '공지':
        return post.isNotice;
      case '인기글':
        return post.views > 100 || post.isPopular;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">커뮤니티</h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* 탭 */}
        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 커뮤니티 리스트 */}
        <CommunityList posts={filteredPosts} />
      </div>
    </div>
  );
};

export default CommunityPage;