import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Share2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Peermall } from '@/types/peermall';
import { toast } from '@/hooks/use-toast';

interface PeermallCardProps {
  peermall: Peermall;
  onQRClick: (peermall: Peermall) => void;
}

const PeermallCard = ({ peermall, onQRClick }: PeermallCardProps) => {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/home/${peermall.url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: peermall.name,
          text: peermall.description || `${peermall.name} 피어몰에 방문해보세요!`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('공유 취소 또는 오류:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: '링크 복사 완료',
          description: '피어몰 링크가 클립보드에 복사되었습니다.',
        });
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    }
  };

  const handleQRCode = (e: React.MouseEvent) => {
    e.preventDefault();
    onQRClick(peermall);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group">
      <CardContent className="p-0">
        {/* 상단 아이콘들 */}
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleQRCode}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* 대표 이미지 */}
        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
          {peermall.image_url ? (
            <img 
              src={peermall.image_url} 
              alt={peermall.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-lg font-medium">{peermall.name}</span>
            </div>
          )}
          
          {/* 입장하기 버튼 */}
          <div className="absolute bottom-2 right-2">
            <Link to={`/home/${peermall.url}`}>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-white shadow-lg"
              >
                <LogIn className="h-4 w-4 mr-1" />
                입장하기
              </Button>
            </Link>
          </div>
        </div>

        {/* 피어몰 정보 */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{peermall.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {peermall.description || '다양한 상품과 서비스를 만나보세요. 특별한 경험이 기다리고 있습니다.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeermallCard;