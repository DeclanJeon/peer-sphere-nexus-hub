// src/pages/BoardCreate.tsx

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { communityApi } from '@/services/community.api';
import { usePeermall } from '@/contexts/PeermallContext';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types/post';
import BoardForm from '@/components/common/community/BoardForm';

const BoardCreate = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { currentPeermall } = usePeermall();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: {
    author_name: string;
    title: string;
    category: string;
    content: string;
  }) => {
    if (!user) {
      toast({ title: '오류', description: '로그인이 필요합니다.', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const postData: Partial<Post> = {
        user_uid: user.user_uid,
        author_name: formData.author_name,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        views: 0,
        likes: 0,
        is_notice: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (params.url) {
        if (!currentPeermall) {
          toast({ title: '오류', description: '피어몰 정보를 찾을 수 없습니다.', variant: 'destructive' });
          setLoading(false);
          return;
        }
        postData.peermall_id = Number(currentPeermall.id);
        postData.peermall_url = params.url;
      } else {
        postData.peermall_id = null;
        postData.peermall_url = null;
      }

      await communityApi.createPost(postData as Post);

      toast({ title: '게시글 작성 완료', description: '새로운 게시글이 성공적으로 등록되었습니다!' });
      
      navigate(params.url ? `/home/${params.url}/community` : '/community');
      
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast({ title: '오류', description: '게시글 작성에 실패했습니다.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const initialDataForCreate = {
    author_name: user?.name || user?.email || '',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">게시글 작성</h1>
      <BoardForm
        mode="create"
        initialData={initialDataForCreate}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};

export default BoardCreate;