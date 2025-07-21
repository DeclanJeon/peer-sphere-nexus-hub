import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, QrCode, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import { Peermall } from '@/types/peermall';

const BestPeermalls = () => {
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);

  useEffect(() => {
    const fetchBestPeermalls = async () => {
      try {
        const malls = await peermallApi.getBestPeermalls(10);
        setBestPeermalls(malls);
      } catch (error) {
        console.error('베스트 피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '베스트 피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };
    fetchBestPeermalls();
  }, []);

  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleShare = async (mallUrl: string, mallName: string) => {
    try {
      const shareUrl = `${window.location.origin}/peermall/${encodeURIComponent(mallUrl)}`;
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
    const qrLink = `https://peermall.app/qr/peermall/${encodeURIComponent(mallUrl)}`;
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
            <Link to={`/peermall/${encodeURIComponent(mall.url || mall.name)}`}>
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