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

  console.log(peermall)

  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (!description) return '설명이 없습니다.';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const formatRating = (rating: number | string | null | undefined): string => {
    if (rating === null || rating === undefined) return '0.0';
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
  };

  const formatSalesVolume = (salesVolume: number | string | null | undefined): string => {
    if (salesVolume === null || salesVolume === undefined) return '0';
    const numSales = typeof salesVolume === 'string' ? parseInt(salesVolume) : salesVolume;
    return isNaN(numSales) ? '0' : numSales.toLocaleString();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!peermall.url) {
      toast({
        title: '오류',
        description: '공유할 수 있는 주소 정보가 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    const shareUrl = `${window.location.origin}/home/${encodeURIComponent(peermall.url)}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: '링크 복사 완료',
          description: `'${peermall.name || '피어몰'}' 링크가 클립보드에 복사되었습니다.`,
        });
      }).catch(() => {
        // 클립보드 복사 실패 시 대체 방법
        fallbackCopyTextToClipboard(shareUrl);
      });
    } else {
      // 클립보드 API를 지원하지 않는 경우 대체 방법
      fallbackCopyTextToClipboard(shareUrl);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      toast({
        title: '링크 복사 완료',
        description: `'${peermall.name || '피어몰'}' 링크가 복사되었습니다.`,
      });
    } catch (err) {
      toast({
        title: '복사 실패',
        description: '링크 복사에 실패했습니다. 수동으로 복사해주세요.',
        variant: 'destructive',
      });
    }

    document.body.removeChild(textArea);
  };

  const handleGenerateQR = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!peermall.url) {
      toast({
        title: '오류',
        description: 'QR 코드를 생성할 주소 정보가 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    const qrData = `${window.location.origin}/home/${encodeURIComponent(peermall.url)}`;
    console.log('QR Code Data:', qrData);
    toast({
      title: 'QR 코드 생성',
      description: `'${peermall.name || '피어몰'}' QR 코드가 생성되었습니다.`,
    });
  };

  // 필수 데이터 검증
  if (!peermall) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            데이터를 불러올 수 없습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

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
      
      <Link to={`/home/${encodeURIComponent(peermall.url || '')}`}>
        <CardContent className="p-4">
          <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
            {peermall.image_url ? (
              <img 
                src={peermall.image_url} 
                alt={peermall.name || '피어몰 이미지'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`text-muted-foreground ${peermall.image_url ? 'hidden' : ''}`}>
              이미지 없음
            </div>
          </div>
          
          <h3 className="font-semibold mb-2 line-clamp-1">
            {peermall.name || '이름 없음'}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              {peermall.family_company || '미분류'}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{formatRating(peermall.rating)}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            거래 {formatSalesVolume(peermall.sales_volume)}건
          </p>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncateDescription(peermall.description)}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PeermallCard;