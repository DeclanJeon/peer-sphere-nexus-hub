import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, QrCode, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Peermall } from '@/types/peermall';
import PeermallCard from '@/components/common/peermall/PeermallCard';

const BestPeermalls = () => {
  // ========== 목업 데이터 START ==========
  // 실제 API 연동 시 제거 예정인 더미 데이터입니다.
  const mockBestPeermalls: Peermall[] = [
    {
      id: '1',
      name: '럭셔리 브랜드 하우스',
      description: '명품 브랜드와 고급 제품만을 취급하는 프리미엄 피어몰입니다.',
      url: 'luxury-brand-house',
      imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
      rating: 4.9,
      sales_volume: 2340,
      created_at: '2023-06-15',
      updated_at: '2024-01-20',
      status: 'active',
      referrerCode: 'BEST001',
      creatorName: '김럭셔리',
      image_url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
      family_company: '럭셔리 그룹',
      creator_name: '김럭셔리',
      owner_email: 'luxury@example.com',
      owner_phone: '010-1111-2222',
      follower_count: 5234,
      referrer_code: 'BEST001',
      is_new: false
    },
    {
      id: '2',
      name: '글로벌 마켓플레이스',
      description: '세계 각국의 특산품과 수입 제품을 만날 수 있는 곳입니다.',
      url: 'global-marketplace',
      imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      rating: 4.8,
      sales_volume: 1890,
      created_at: '2023-05-20',
      updated_at: '2024-01-19',
      status: 'active',
      referrerCode: 'BEST002',
      creatorName: '이글로벌',
      image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
      family_company: '글로벌 트레이드',
      creator_name: '이글로벌',
      owner_email: 'global@example.com',
      owner_phone: '010-2222-3333',
      follower_count: 4567,
      referrer_code: 'BEST002',
      is_new: false
    }
  ];
  // ========== 목업 데이터 END ==========

  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>(mockBestPeermalls);

  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleShare = async (mallUrl: string, mallName: string) => {
    try {
      const shareUrl = `${window.location.origin}/home/${encodeURIComponent(mallUrl)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: '링크 복사 완료',
        description: `'${mallName}' 피어몰 링크가 클립보드에 복사되었습니다.`, 
      });
    } catch (error) {
      console.error('링크 복사 실패:', error);
      toast({
        title: '오류',
        description: '링크 복사에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateQR = (mallUrl: string, mallName: string) => {
    const qrLink = `https://peermall.com/qr/home/${encodeURIComponent(mallUrl)}`;
    toast({
      title: 'QR 코드 생성',
      description: `'${mallName}' 피어몰 QR 코드 링크: ${qrLink}`, 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">베스트 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">가장 인기있고 성공적인 피어몰들을 확인해보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bestPeermalls.map((mall, index) => (
          <Card key={mall.id} className="hover:shadow-lg transition-shadow cursor-pointer relative">
            <Link to={`/home/${encodeURIComponent(mall.url || mall.name)}`}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {mall.imageUrl || mall.image_url ? (
                    <img 
                      src={mall.imageUrl || mall.image_url}
                      alt={mall.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground p-4 text-center">
                      <div className="text-sm">이미지 없음</div>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{mall.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">피어몰</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{mall.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">거래 {mall.sales_volume || 0}건</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{truncateDescription(mall.description)}</p>
              </CardContent>
            </Link>
            {index < 3 && (
              <Badge className={`absolute top-2 left-2 ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 'bg-orange-500'
              }`}>
                #{index + 1}
              </Badge>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleGenerateQR(mall.url || mall.name, mall.name);
                }} 
                className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                aria-label="QR 코드 생성"
              >
                <QrCode className="h-4 w-4 text-gray-600" />
              </button>
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handleShare(mall.url || mall.name, mall.name);
                }} 
                className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                aria-label="링크 공유"
              >
                <Share className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BestPeermalls;
