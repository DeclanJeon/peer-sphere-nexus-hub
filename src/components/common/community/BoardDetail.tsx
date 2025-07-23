import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Trash2, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { communityApi } from '@/services/community.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import BoardForm from './BoardForm';
import CommentSection from './CommentSection';

const BoardDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [getPost, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchPostAndComments = async () => {
    if (!url || !id) {
      setError('피어몰 정보 또는 게시글 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
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
  }, [url, id]);

  if (!user) return null;

  const userDatas = Object.values(user);
  const userUid = Object.values(userDatas[1])[0];
  
  const isAuthor = userUid === getPost?.user_uid;
  const isPeermallOwner = userUid === getPost?.peermall_owner_uid;
  const canDeletePost = user && (isAuthor || isPeermallOwner);
  const canEditPost = user && isAuthor;

  const handleEditSubmit = async (formData: {
    title: string;
    category: string;
    content: string;
    is_notice?: boolean;
  }) => {
    if (!getPost || !canEditPost) return;

    try {
      await communityApi.updatePost(getPost.id.toString(), formData);
      
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
    if (!getPost) return;

    try {
      await communityApi.createComment(getPost.id.toString(), content);
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
      throw error; // CommentSection에서 처리하도록 에러 전파
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
    if (!getPost || isEditMode) return;
    try {
      const result = await communityApi.toggleLike(getPost.id.toString());
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
    if (!getPost || !canDeletePost) return;

    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await communityApi.deletePost(getPost.id.toString());
        toast({
          title: '게시글 삭제 완료',
          description: '게시글이 성공적으로 삭제되었습니다.',
        });
        navigate(`/home/${url}/community`);
      } catch (error) {
        toast({
          title: '오류',
          description: '게시글 삭제에 실패했습니다.',
          variant: 'destructive',
        });
      }
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
  if (error || !getPost) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-destructive">{error || '게시글을 찾을 수 없습니다.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const authorName = getPost.author_display_name || getPost.author_name;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isEditMode ? (
        <>
          <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>
          <BoardForm
            mode="edit"
            initialData={getPost}
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
                  <Badge variant="outline">{getPost.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{authorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(getPost.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{getPost.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{getPost.likes}</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold">{getPost.title}</h1>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{getPost.content}</div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  <Heart className="h-4 w-4 mr-2" />
                  좋아요 ({getPost.likes})
                </Button>
                <Button variant="outline" size="sm">
                  공유하기
                </Button>
                {canEditPost && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    수정
                  </Button>
                )}
                {canDeletePost && (
                  <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section - 분리된 컴포넌트 사용 */}
          <CommentSection
            postId={getPost.id.toString()}
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
