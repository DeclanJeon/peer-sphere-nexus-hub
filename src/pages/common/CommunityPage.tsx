import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Post } from '@/types/post';
import BoardList from '@/components/common/community/BoardList';
import CommunityTabs from '@/components/common/community/CommunityTabs';
import { communityApi } from '@/services/community.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CommunityPage = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { currentPeermall } = usePeermall();
  const { isAuthenticated } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('전체글');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const peermallUrl = params.url;

  // 게시글 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    if (!currentPeermall?.id) return;
    
    setLoading(true);
    try {
      const response = await communityApi.getPostsByPeermallId(
        currentPeermall.id.toString(),
        {
          page: pagination.page,
          limit: pagination.limit,
          sortBy,
          category: category === 'all' ? undefined : category
        }
      );

      if (response.success) {
        setPosts(response.data || []);
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
      toast({
        title: '오류',
        description: '게시글을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPeermall?.id, pagination.page, pagination.limit, sortBy, category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 탭에 따른 게시글 필터링
  const filteredPosts = posts.filter((post: Post) => {
    switch (activeTab) {
      case '추천글':
        return post.likes > 10;
      case '공지':
        return post.is_notice;
      case '인기글':
        return post.is_popular || post.views > 100;
      default:
        return true;
    }
  });

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '글쓰기는 로그인 후 이용할 수 있습니다.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    navigate(`/home/${peermallUrl}/community/create`);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/home/${peermallUrl}/community/${postId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const categories = [
    { value: 'all', label: '전체' },
    { value: '공지', label: '공지' },
    { value: '운영팁', label: '운영팁' },
    { value: '질문', label: '질문' },
    { value: '정보', label: '정보' },
    { value: '자유', label: '자유' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">커뮤니티</h1>
            <p className="text-muted-foreground mt-1">
              {currentPeermall?.name || '피어몰'} 커뮤니티에서 다양한 이야기를 나눠보세요
            </p>
          </div>
          <Button 
            onClick={handleWriteClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* 필터 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="views">조회순</SelectItem>
                <SelectItem value="likes">추천순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 게시글 리스트 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <BoardList
              posts={filteredPosts}
              onPostClick={handlePostClick}
            />
            
            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  이전
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {pagination.totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={pagination.page === pagination.totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}

        {/* 게시글이 없는 경우 */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {activeTab === '전체글' 
                ? '아직 작성된 게시글이 없습니다.' 
                : `${activeTab}이 없습니다.`}
            </p>
            {isAuthenticated && (
              <Button onClick={handleWriteClick}>
                첫 번째 글 작성하기
              </Button>
            )}
          </div>
        )}

        {/* 게시글 통계 */}
        {!loading && posts.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>전체 게시글: {pagination.total}개</span>
              <span>페이지: {pagination.page} / {pagination.totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
