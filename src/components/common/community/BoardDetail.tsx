import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Heart, MessageCircle, Clock, User, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { communityApi } from '@/services/community.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const BoardDetail = () => {
  const { url, id } = useParams<{ url: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
  }, [url, id, toast]);

  const isAuthor = user && post && user.user_uid === post.user_uid;
  const isPeermallOwner = user && post && user.user_uid === post.peermall_owner_uid;
  const canDeletePost = user && (isAuthor || isPeermallOwner);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !post) return;

    try {
      await communityApi.createComment(post.id.toString(), commentContent);
      toast({
        title: '댓글 작성 완료',
        description: '댓글이 성공적으로 작성되었습니다.',
      });
      setCommentContent('');
      fetchPostAndComments(); // Refresh comments
    } catch (error) {
      toast({
        title: '오류',
        description: '댓글 작성에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleLike = async () => {
    if (!post) return;
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
        navigate(`/community/${url}`); // Redirect to community board
      } catch (error) {
        toast({
          title: '오류',
          description: '게시글 삭제에 실패했습니다.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await communityApi.deleteComment(commentId);
        toast({
          title: '댓글 삭제 완료',
          description: '댓글이 성공적으로 삭제되었습니다.',
        });
        fetchPostAndComments(); // Refresh comments
      } catch (error) {
        toast({
          title: '오류',
          description: '댓글 삭제에 실패했습니다.',
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
  if (error || !post) {
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

  const authorName = post.author_display_name || post.author_name;

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
            <Button variant="outline" size="sm" onClick={handleLike}>
              <Heart className="h-4 w-4 mr-2" />
              좋아요 ({post.likes})
            </Button>
            <Button variant="outline" size="sm">
              공유하기
            </Button>
            {canDeletePost && (
              <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                <Trash2 className="h-4 w-4 mr-2" />
                게시글 삭제
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">댓글 {comments?.length}개</span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                rows={3}
                className="mb-3"
              />
              <Button type="submit" disabled={!commentContent.trim()}>
                댓글 작성
              </Button>
            </form>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">댓글을 작성하려면 로그인해주세요.</p>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments?.length === 0 ? (
              <p className="text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium text-sm">{comment.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}</span>
                      </div>
                    </div>
                    {user && user.user_uid === comment.user_uid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardDetail;