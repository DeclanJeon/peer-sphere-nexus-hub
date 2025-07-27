import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, AlertCircle, Loader2, Globe, Mail, Phone } from 'lucide-react';
import sponsorApi, { Sponsor } from '@/services/sponsor.api';
import { User } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';

const SponsorSelectionPage: React.FC = () => {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedSponsors = await sponsorApi.getSponsors();
      
      if (!fetchedSponsors || fetchedSponsors.length === 0) {
        setError('현재 이용 가능한 스폰서가 없습니다.');
        return;
      }
      
      setSponsors(fetchedSponsors);
    } catch (err: any) {
      console.error('스폰서 목록 조회 실패:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load sponsors.';
      setError(errorMessage);
      
      toast({
        title: "오류",
        description: "스폰서 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSponsorClick = (sponsor: Sponsor) => {
    if (isSelecting) return; // 선택 중일 때는 클릭 방지
    setSelectedSponsor(sponsor);
  };

  const handleConfirm = async () => {
    if (!selectedSponsor || !user || isSelecting) return;

    setIsSelecting(true);
    setError(null);

    try {
      // userData에 user_name 추가 (필요한 경우)
      const userDataWithName = {
        ...user,
        user_name: user.name || user.user_uid,
      };

      await sponsorApi.selectSponsor(selectedSponsor, userDataWithName);
      
      toast({
        title: "스폰서 선택 완료",
        description: `${selectedSponsor.name}이(가) 성공적으로 선택되었습니다.`,
      });

      // 스폰서 선택 후 피어몰 페이지로 이동
      const mallInfo = await peermallApi.getPeermallByUid(user.user_uid);
      navigate(`/home/${mallInfo.url}`);
      
    } catch (err: any) {
      console.error('스폰서 선택 실패:', err);
      
      let errorMessage = '스폰서 선택에 실패했습니다.';
      
      if (err?.response?.status === 409) {
        errorMessage = '이미 스폰서가 선택되어 있습니다.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSelecting(false);
    }
  };

  const handleRetry = () => {
    fetchSponsors();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">스폰서 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && sponsors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            스폰서를 선택해주세요
          </h1>
          <p className="text-gray-600">
            피어몰 서비스를 이용하기 위해 스폰서를 선택해야 합니다.
          </p>
        </div>

        {/* 에러 메시지 표시 (스폰서 목록이 있는 경우) */}
        {error && sponsors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedSponsor?.id === sponsor.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-accent/50'
              } ${isSelecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleSponsorClick(sponsor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <h3 className="font-semibold text-base truncate">{sponsor.name}</h3>
                    </div>
                    
                    {sponsor.name_en && (
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {sponsor.name_en}
                      </p>
                    )}
                    
                    {sponsor.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {sponsor.description}
                      </p>
                    )}
                    
                    {/* 연락처 정보 */}
                    <div className="space-y-2 mb-4">
                      {sponsor.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">
                            {sponsor.website.replace(/^https?:\/\//, '')}
                          </span>
                        </div>
                      )}
                      {sponsor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">
                            {sponsor.email}
                          </span>
                        </div>
                      )}
                      {sponsor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {sponsor.phone}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      Premium Partner
                    </Badge>
                  </div>
                  
                  {selectedSponsor?.id === sponsor.id && (
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            disabled={isSelecting}
            className="min-w-[120px]"
          >
            뒤로
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={!selectedSponsor || !user || isSelecting}
            size="lg"
            className="min-w-[200px]"
          >
            {isSelecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                선택 중...
              </>
            ) : selectedSponsor ? (
              `${selectedSponsor.name} 선택`
            ) : (
              '스폰서를 선택해주세요'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorSelectionPage;