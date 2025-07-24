import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Trash2, Edit, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/types/post';
import { communityApi } from '@/services/community.api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePeermall } from '@/contexts/PeermallContext';
import BoardForm from '@/components/common/community/BoardForm';

const BoardDetail = () => {
  const { url, id } = useParams<{ url?: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeermall } = usePeermall();
  const [post, setPost] = useState<Post | null>(null);
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

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

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
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> 목록으로</Button>
      <Card>
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
    </div>
  );
};

export default BoardDetail;