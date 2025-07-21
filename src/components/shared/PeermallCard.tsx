
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, QrCode, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Peermall } from '@/types/peermall';

interface PeermallCardProps {
  peermall: Peermall;
}

const PeermallCard = ({ peermall }: PeermallCardProps) => {
  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/peermall/${encodeURIComponent(peermall.address)}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: '링크 복사 완료',
      description: `'${peermall.name}' 피어몰 링크가 클립보드에 복사되었습니다.`,
    });
  };

  const handleGenerateQR = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // This can be a link to a QR code generation service or a modal showing the QR code
    const qrData = `${window.location.origin}/peermall/${encodeURIComponent(peermall.address)}`;
    // For simplicity, we'll just log it and show a toast.
    console.log('QR Code Data:', qrData);
    toast({
      title: 'QR 코드 생성',
      description: `'${peermall.name}' 피어몰 QR 코드가 생성되었습니다. (콘솔 확인)`,
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer relative group">
      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="secondary"
          className="p-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
          onClick={handleGenerateQR}
        >
          <QrCode className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="p-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
          onClick={handleShare}
        >
          <Share className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
      <Link to={`/peermall/${encodeURIComponent(peermall.address)}`}>
        <CardContent className="p-4">
          <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
            {peermall.image ? (
              <img src={peermall.image} alt={peermall.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground">이미지 없음</div>
            )}
          </div>
          <h3 className="font-semibold mb-2 line-clamp-1">{peermall.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{peermall.familyCompany}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{peermall.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">거래 {peermall.sales}건</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{truncateDescription(peermall.description)}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PeermallCard;
