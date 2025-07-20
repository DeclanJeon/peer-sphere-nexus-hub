import { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { usePeermall } from '@/contexts/PeermallContext';
import UserPeermallLayout from '@/components/layout/UserPeermallLayout';
import NotFound from '@/pages/NotFound';
import { Loader2 } from 'lucide-react';

const UserPeermallPage = () => {
  const { url } = useParams<{ url: string }>();
  const { fetchPeermallByUrl, currentPeermall, loading, error } = usePeermall();

  useEffect(() => {
    if (url) {
      fetchPeermallByUrl(url);
    }
  }, [url, fetchPeermallByUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error === '404') {
    return <NotFound />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">오류 발생</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentPeermall) {
    // 로딩이 끝났지만 피어몰 정보가 없는 경우 (초기 상태 등)
    return null; 
  }

  return (
    <UserPeermallLayout>
      <Outlet />
    </UserPeermallLayout>
  );
};

export default UserPeermallPage;