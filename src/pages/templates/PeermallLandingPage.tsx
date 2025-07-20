import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PeermallHeroSection from '@/components/peermall/PeermallHeroSection';
import PeermallContentSection from '@/components/peermall/PeermallContentSection';
import { toast } from '@/hooks/use-toast';
import SearchSection from '@/components/home/SearchSection';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:9393';

interface PeermallData {
  name: string;
  description: string;
  imageUrl?: string;
}

const PeermallLandingPage = () => {
  const { url } = useParams<{ url: string }>();
  const [peermall, setPeermall] = useState<PeermallData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPeermallData = async () => {
      if (!url) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/peermalls/${url}`);
        if (response.data.success) {
          setPeermall(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        toast({
          title: '오류',
          description: error.message || '피어몰 정보를 불러오는 데 실패했습니다.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    };

    fetchPeermallData();
  }, [url]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">로딩 중...</div>;
  }

  if (!peermall) {
    return <div className="container mx-auto px-4 py-8 text-center">피어몰을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <PeermallHeroSection 
        name={peermall.name}
        description={peermall.description}
        imageUrl={peermall.imageUrl}
      />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <PeermallContentSection />
    </div>
  );
};

export default PeermallLandingPage;