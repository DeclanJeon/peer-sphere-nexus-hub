import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Download, Share, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const QRCodePage = () => {
  const [qrData, setQrData] = useState({
    type: 'mall',
    content: '',
    size: '200'
  });
  const [copied, setCopied] = useState(false);

  const generateQR = () => {
    if (!qrData.content) {
      toast({
        title: '입력 오류',
        description: 'QR 코드로 만들 내용을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'QR 코드 생성 완료',
      description: 'QR 코드가 성공적으로 생성되었습니다!',
    });
  };

  const handleCopy = async () => {
    const qrUrl = `https://peermall.app/qr/${qrData.type}/${qrData.content}`;
    await navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: '복사 완료',
      description: 'QR 코드 링크가 클립보드에 복사되었습니다.',
    });
  };

  const savedQRs = [
    { id: 1, name: '내 피어몰', type: '피어몰', createdAt: '2024-01-15' },
    { id: 2, name: '스킨케어 세트', type: '상품', createdAt: '2024-01-14' },
    { id: 3, name: '신년 할인 이벤트', type: '이벤트', createdAt: '2024-01-13' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <QrCode className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">QR 코드 관리</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Generator */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR 코드 생성</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">QR 코드 유형</Label>
                <Select value={qrData.type} onValueChange={(value) => setQrData({ ...qrData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mall">피어몰</SelectItem>
                    <SelectItem value="product">상품</SelectItem>
                    <SelectItem value="event">이벤트</SelectItem>
                    <SelectItem value="profile">프로필</SelectItem>
                    <SelectItem value="custom">사용자 정의</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Input
                  id="content"
                  value={qrData.content}
                  onChange={(e) => setQrData({ ...qrData, content: e.target.value })}
                  placeholder={
                    qrData.type === 'mall' ? '피어몰 이름 또는 ID' :
                    qrData.type === 'product' ? '상품 이름 또는 ID' :
                    qrData.type === 'event' ? '이벤트 이름 또는 ID' :
                    qrData.type === 'profile' ? '프로필 정보' :
                    'URL 또는 텍스트'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">크기 (픽셀)</Label>
                <Select value={qrData.size} onValueChange={(value) => setQrData({ ...qrData, size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150px</SelectItem>
                    <SelectItem value="200">200px</SelectItem>
                    <SelectItem value="300">300px</SelectItem>
                    <SelectItem value="400">400px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generateQR} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                QR 코드 생성
              </Button>
            </CardContent>
          </Card>

          {/* QR Preview */}
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center"
                  style={{ width: `${qrData.size}px`, height: `${qrData.size}px` }}
                >
                  {qrData.content ? (
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">QR 코드 미리보기</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">내용을 입력하세요</p>
                  )}
                </div>

                {qrData.content && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      다운로드
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copied ? '복사됨' : '링크 복사'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-3 w-3 mr-1" />
                      공유
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved QRs */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>저장된 QR 코드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedQRs.map((qr) => (
                  <div key={qr.id} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border rounded flex items-center justify-center">
                        <QrCode className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{qr.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{qr.type}</span>
                          <span>•</span>
                          <span>{qr.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;