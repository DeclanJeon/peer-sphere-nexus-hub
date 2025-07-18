import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PeermallList = () => {
  const peermalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', rating: 4.8, sales: '234' },
    { id: 2, name: '스마트 라이프', category: '전자기기', rating: 4.9, sales: '567' },
    { id: 3, name: '패션 스트리트', category: '의류', rating: 4.7, sales: '123' },
    { id: 4, name: '홈 데코', category: '인테리어', rating: 4.6, sales: '89' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 피어몰</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {peermalls.map((mall) => (
          <Link key={mall.id} to={`/peermalls/${mall.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                <h3 className="font-semibold mb-2">{mall.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{mall.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{mall.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">거래 {mall.sales}건</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PeermallList;