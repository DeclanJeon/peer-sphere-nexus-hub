import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { communityApi } from '@/services/community.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types/post';
import BoardForm from './BoardForm';

const BoardCreate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: {
    title: string;
    category: string;
    content: string;
  }) => {
    if (!currentPeermall?.id) {
      toast({
        title: '오류',
        description: '피어몰 정보를 찾을 수 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: '오류',
        description: '로그인이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const userDatas = Object.values(user);
      const userUid = Object.values(userDatas[1])[0];
      
      const newPost: Post = {
        id: 0,
        peermall_name: currentPeermall.name,
        peermall_url: params.url,
        peermall_id: Number(currentPeermall.id),
        peermall_owner_uid: '',
        user_uid: userUid,
        author_name: user?.name || '익명',
        title: formData.title,
        content: formData.content,
        category: formData.category,
        views: 0,
        likes: 0,
        is_notice: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await communityApi.createPost(newPost);

      toast({
        title: '게시글 작성 완료',
        description: '새로운 게시글이 성공적으로 등록되었습니다!',
      });
      
      navigate(`/home/${params.url}/community`);
      
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast({
        title: '오류',
        description: '게시글 작성에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">게시글 작성</h1>
      <BoardForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default BoardCreate;