// src/pages/BoardDetail.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Trash2, Edit, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { communityApi } from '@/services/community.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import BoardForm from '@/components/common/community/BoardForm';
import CommentSection from '@/components/common/community/CommentSection';

const BoardDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeermall } = usePeermall();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  // 메인 피어몰인지 확인
  const isMainPeermall = location.pathname.startsWith('/community/');

  const fetchPostAndComments = async () => {
    if (!id) {
      setError('게시글 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // API 호출
      const postData = await communityApi.getPostById(id);
      setPost(postData);
      
      const commentsData = await communityApi.getCommentsByPostId(id);
      setComments(commentsData);
    } catch (err) {
      console.error('게시글 또는 댓글 조회 오류:', err);
      setError('게시글 또는 댓글을 불러오는데 실패했습니다.');
      toast({
        title: '오류',
        description: '게시글 또는 댓글을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  // 사용자 권한 확인
  const isAuthor = user?.user_uid === post?.user_uid;
  const isPeermallOwner = !isMainPeermall && user?.user_uid === currentPeermall?.owner_uid;
  const canDeletePost = user && (isAuthor || isPeermallOwner);
  const canEditPost = user && isAuthor && !isMainPeermall; // 메인 피어몰에서는 수정 불가

  const handleEditSubmit = async (formData: {
    title: string;
    category: string;
    content: string;
    is_notice?: boolean;
  }) => {
    if (!post || !canEditPost) return;

    try {
      await communityApi.updatePost(post.id.toString(), formData);
      
      toast({
        title: '수정 완료',
        description: '게시글이 성공적으로 수정되었습니다.',
      });
      
      setIsEditMode(false);
      fetchPostAndComments();
    } catch (error) {
      toast({
        title: '오류',
        description: '게시글 수정에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleCommentSubmit = async (content: string) => {
    if (!post || isMainPeermall) {
      if (isMainPeermall) {
        toast({
          title: '알림',
          description: '메인 페이지에서는 댓글을 작성할 수 없습니다.',
          variant: 'default',
        });
      }
      return;
    }

    try {
      await communityApi.createComment(post.id.toString(), content);
      toast({
        title: '댓글 작성 완료',
        description: '댓글이 성공적으로 작성되었습니다.',
      });
      fetchPostAndComments();
    } catch (error) {
      toast({
        title: '오류',
        description: '댓글 작성에 실패했습니다.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await communityApi.deleteComment(commentId);
      toast({
        title: '댓글 삭제 완료',
        description: '댓글이 성공적으로 삭제되었습니다.',
      });
      fetchPostAndComments();
    } catch (error) {
      toast({
        title: '오류',
        description: '댓글 삭제에 실패했습니다.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleLike = async () => {
    if (!post || isEditMode || isMainPeermall) {
      if (isMainPeermall) {
        toast({
          title: '알림',
          description: '메인 페이지에서는 추천할 수 없습니다.',
          variant: 'default',
        });
      }
      return;
    }
    
    try {
      const result = await communityApi.toggleLike(post.id.toString());
      setPost(prev => prev ? { ...prev, likes: result.likes } : null);
      toast({
        title: '추천 완료',
        description: '게시글을 추천했습니다.',
      });
    } catch (error) {
      toast({
        title: '오류',
        description: '추천에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!post || !canDeletePost) return;

    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await communityApi.deletePost(post.id.toString());
        toast({
          title: '게시글 삭제 완료',
          description: '게시글이 성공적으로 삭제되었습니다.',
        });
        
        // 삭제 후 이동
        if (isMainPeermall) {
          navigate('/community');
        } else {
          navigate(`/home/${url}/community`);
        }
      } catch (error) {
        toast({
          title: '오류',
          description: '게시글 삭제에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleBackClick = () => {
    if (isMainPeermall) {
      navigate('/community');
    } else {
      navigate(`/home/${url}/community`);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-4">{error || '게시글을 찾을 수 없습니다.'}</p>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const authorName = post.author_display_name || post.author_name;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBackClick}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        목록으로
      </Button>

      {isEditMode ? (
        <>
          <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>
          <BoardForm
            mode="edit"
            initialData={post}
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </>
      ) : (
        <>
          {/* Post Content */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isMainPeermall && post.peermall_name && (
                    <Badge variant="secondary">{post.peermall_name}</Badge>
                  )}
                  <Badge variant="outline">{post.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{authorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
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
                {!isMainPeermall && (
                  <Button variant="outline" size="sm" onClick={handleLike}>
                    <Heart className="h-4 w-4 mr-2" />
                    좋아요 ({post.likes})
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  공유하기
                </Button>
                {canEditPost && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                )}
                {canDeletePost && !isMainPeermall && (
                  <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection
            postId={post.id.toString()}
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
            onCommentDelete={handleCommentDelete}
          />
        </>
      )}
    </div>
  );
};

export default BoardDetail;