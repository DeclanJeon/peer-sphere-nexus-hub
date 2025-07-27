// src/pages/SponsorSelectionPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sponsor } from '@/types/sponsor';
import { sponsorApi } from '@/services/sponsor.api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import SponsorCard from '@/components/sponsor/SponsorCard';
import { Loader2 } from 'lucide-react';

const SponsorSelectionPage = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await sponsorApi.getSponsors();
        setSponsors(data);
      } catch (error) {
        console.error('스폰서 목록 조회 실패:', error);
        toast({
          title: '오류',
          description: '스폰서 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const handleSponsorSelect = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
  };

  const handleConfirm = async () => {
    if (!selectedSponsor || !user) {
      toast({
        title: '오류',
        description: '스폰서를 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await sponsorApi.selectSponsor(selectedSponsor.id, user.user_uid);
      
      // localStorage에 선택된 스폰서 저장 (더미 데이터용)
      localStorage.setItem('selectedSponsorId', selectedSponsor.id.toString());
      localStorage.setItem('selectedSponsor', JSON.stringify(selectedSponsor));
      
      toast({
        title: '스폰서 선택 완료',
        description: `${selectedSponsor.name}이(가) 선택되었습니다.`,
      });
      
      navigate('/user-peermall');
    } catch (error) {
      console.error('스폰서 선택 실패:', error);
      toast({
        title: '오류',
        description: '스폰서 선택에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">스폰서 선택</CardTitle>
          <p className="text-muted-foreground">
            피어몰 서비스를 이용하기 위해 스폰서를 선택해주세요.
            선택한 스폰서에 맞춘 맞춤형 이벤트와 상품을 제공받으실 수 있습니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                isSelected={selectedSponsor?.id === sponsor.id}
                onSelect={handleSponsorSelect}
              />
            ))}
          </div>
          
          <div className="flex justify-center pt-6">
            <Button 
              onClick={handleConfirm}
              disabled={!selectedSponsor || submitting}
              size="lg"
              className="px-8"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              선택 완료
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SponsorSelectionPage;