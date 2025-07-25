import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Trash2, Edit, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/types/post';
import { Comment, UpdateCommentRequest } from '@/types/comment'; // UpdateCommentRequest 임포트
import { communityApi } from '@/services/community.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import BoardForm from '@/components/common/community/BoardForm';
import CommentSection from '@/components/common/community/CommentSection';

const BoardDetail = () => {
  const { url, id } = useParams<{ url?: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeermall } = usePeermall();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);

  const isMainPeermall = !url;

  const fetchPost = useCallback(async () => {
    if (!id) {
      setError('게시글 정보가 없습니다.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const postData = await communityApi.getPostById(url, id);
      setPost(postData);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id, url]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      // API 호출 활성화
      // const commentsData = await communityApi.getComments(id);
      // setComments(commentsData);
    } catch (err) {
      console.error('댓글을 불러오는데 실패했습니다:', err);
      toast({ title: '오류', description: '댓글 목록을 가져오지 못했습니다.', variant: 'destructive' });
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id, fetchPost, fetchComments]);

  const isAuthor = user?.user_uid === post?.user_uid;
  const isPeermallOwner = !isMainPeermall && user?.user_uid === currentPeermall?.owner_uid;
  const canEditPost = user && isAuthor;
  const canDeletePost = user && (isAuthor || isPeermallOwner);

  const handleEditSubmit = async (formData: {
    author_name: string;
    title: string;
    category: string;
    content: string;
  }) => {
    if (!post || !canEditPost) return;
    setLoading(true);
    try {
      await communityApi.updatePost(post.id.toString(), formData);
      toast({ title: '수정 완료', description: '게시글이 성공적으로 수정되었습니다.' });
      setIsEditMode(false);
      await fetchPost();
    } catch (error) {
      toast({ title: '오류', description: '게시글 수정에 실패했습니다.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !canDeletePost) return;
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await communityApi.deletePost(post.id.toString());
        toast({ title: '게시글 삭제 완료', description: '게시글이 성공적으로 삭제되었습니다.' });
        navigate(isMainPeermall ? '/community' : `/home/${url}/community`);
      } catch (error) {
        toast({ title: '오류', description: '게시글 삭제에 실패했습니다.', variant: 'destructive' });
      }
    }
  };

  // --- 댓글 로직 ---

  const handleCommentSubmit = async (content: string) => {
    if (!id || !user) return;
    
    try {
      // API 호출 활성화
      // await communityApi.createComment(id, {
      //   content,
      //   // [추론] user 객체에 name과 photoURL 속성이 있다고 가정합니다.
      //   author_name: user.name || '익명 사용자',
      //   author_avatar_url: user.photoURL || '',
      // });
      
      toast({ title: '댓글 작성 완료', description: '댓글이 성공적으로 작성되었습니다.' });
      await fetchComments(); // 댓글 목록 즉시 새로고침
    } catch (error) {
      toast({ title: '오류', description: '댓글 작성에 실패했습니다.', variant: 'destructive' });
      throw error;
    }
  };

  const handleCommentUpdate = async (commentId: string, data: UpdateCommentRequest) => {
    try {
      // await communityApi.updateComment(commentId, data);
      // toast({ title: '수정 완료', description: '댓글이 성공적으로 수정되었습니다.' });
      // await fetchComments(); // 댓글 목록 즉시 새로고침
    } catch (error) {
      toast({ title: '오류', description: '댓글 수정에 실패했습니다.', variant: 'destructive' });
      throw error;
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await communityApi.deleteComment(commentId);
      toast({ title: '댓글 삭제 완료', description: '댓글이 성공적으로 삭제되었습니다.' });
      await fetchComments(); // 댓글 목록 즉시 새로고침
    } catch (error) {
      toast({ title: '오류', description: '댓글 삭제에 실패했습니다.', variant: 'destructive' });
      throw error;
    }
  };

  if (loading && !post) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (error || !post) return <div className="container text-center py-8"><p className="text-destructive">{error}</p></div>;

  if (isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>
        <BoardForm mode="edit" initialData={post} onSubmit={handleEditSubmit} onCancel={() => setIsEditMode(false)} loading={loading} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> 목록으로
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">{post.category}</Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><Eye className="h-4 w-4" /><span>{post.views}</span></div>
              <div className="flex items-center gap-1"><Heart className="h-4 w-4" /><span>{post.likes}</span></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold break-words">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{post.author_name}</span></div>
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{new Date(post.created_at).toLocaleString('ko-KR')}</span></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none break-words" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="flex justify-end gap-2 mt-8 pt-4 border-t">
            {canEditPost && <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}><Edit className="h-4 w-4 mr-2" />수정</Button>}
            {canDeletePost && <Button variant="destructive" size="sm" onClick={handleDeletePost}><Trash2 className="h-4 w-4 mr-2" />삭제</Button>}
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션에 모든 핸들러 함수를 props로 전달 */}
      <CommentSection
        postId={id!}
        comments={comments}
        postAuthorUid={post?.user_uid}
        onCommentSubmit={handleCommentSubmit}
        onCommentUpdate={handleCommentUpdate}
        onCommentDelete={handleCommentDelete}
      />
    </div>
  );
};

export default BoardDetail;