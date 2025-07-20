import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, QrCode, Share } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { peermallService, Peermall } from '@/lib/indexeddb';
import { toast } from '@/hooks/use-toast';

const NewPeermalls = () => {
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);

  useEffect(() => {
    const fetchNewPeermalls = async () => {
      try {
        const malls = await peermallService.getNewPeermalls(10);
        setNewPeermalls(malls);
      } catch (error) {
        toast({
          title: '오류',
          description: '신규 피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };
    fetchNewPeermalls();
  }, []);

  const isNew = (createdAt: Date) => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return (new Date().getTime() - new Date(createdAt).getTime()) <= sevenDays;
  };

  const truncateDescription = (description: string, maxLength: number = 80) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleShare = (mallName: string) => {
    const shareUrl = `${window.location.origin}/peermall/${encodeURIComponent(mallName)}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: '링크 복사 완료',
      description: `'${mallName}' 피어몰 링크가 클립보드에 복사되었습니다.`, 
    });
  };

  const handleGenerateQR = (mallName: string) => {
    const qrLink = `https://peermall.app/qr/peermall/${encodeURIComponent(mallName)}`;
    toast({
      title: 'QR 코드 생성',
      description: `'${mallName}' 피어몰 QR 코드 링크: ${qrLink}`, 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">신규 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">최근에 새롭게 개설된 피어몰들을 만나보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newPeermalls.map((mall) => (
          <Card key={mall.id} className="hover:shadow-lg transition-shadow cursor-pointer relative">
            <Link to={`/peermall/${encodeURIComponent(mall.name)}`}>
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {mall.image ? (
                    <img src={mall.image} alt={mall.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-muted-foreground">이미지 없음</div>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{mall.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{mall.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{mall.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{truncateDescription(mall.description)}</p>
              </CardContent>
            </Link>
            {isNew(mall.createdAt) && (
              <Badge className="absolute top-2 left-2 bg-primary">NEW</Badge>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <button onClick={() => handleGenerateQR(mall.name)} className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
                <QrCode className="h-4 w-4 text-gray-600" />
              </button>
              <button onClick={() => handleShare(mall.name)} className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
                <Share className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewPeermalls;