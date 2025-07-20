import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { peermallService } from '@/lib/indexeddb/peermallService';
import { toast } from '@/hooks/use-toast';
import LandingPageTemplate from '@/components/templates/LandingPageTemplate';

interface PeermallData {
  name: string;
  description: string;
  imageUrl?: string;
}

const PeermallLandingPage = () => {
  const { url } = useParams<{ url: string }>();
  const [peermall, setPeermall] = useState<PeermallData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeermallData = async () => {
      if (!url) return;

      try {
        // IndexedDB에서 피어몰 데이터 가져오기 (URL은 name으로 대체)
        const peermallData = await peermallService.getPeermallByName(url);
        if (peermallData) {
          setPeermall({
            name: peermallData.name,
            description: peermallData.description,
            imageUrl: peermallData.image
          });
        } else {
          throw new Error('피어몰을 찾을 수 없습니다.');
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

  return <LandingPageTemplate isMainPage={false} peermallData={peermall} />;
};

export default PeermallLandingPage;