import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestPeermalls = () => {
  const bestPeermalls = [
    { id: 1, name: '럭셔리 브랜드 하우스', category: '명품', rating: 4.9, sales: '1,234', followers: '12,345' },
    { id: 2, name: '헬스 앤 라이프', category: '건강', rating: 4.8, sales: '987', followers: '8,765' },
    { id: 3, name: '키즈 원더랜드', category: '유아용품', rating: 4.9, sales: '756', followers: '6,543' },
    { id: 4, name: '테크 이노베이션', category: '전자기기', rating: 4.8, sales: '654', followers: '5,432' },
    { id: 5, name: '오가닉 라이프', category: '유기농', rating: 4.7, sales: '543', followers: '4,321' },
    { id: 6, name: '아트 갤러리', category: '예술품', rating: 4.9, sales: '432', followers: '3,210' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">베스트 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">가장 인기있고 성공적인 피어몰들을 확인해보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bestPeermalls.map((mall, index) => (
          <Link key={mall.id} to={`/peermalls/${mall.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 relative">
                  {index < 3 && (
                    <Badge className={`absolute top-2 left-2 ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      #{index + 1}
                    </Badge>
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
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>거래 {mall.sales}건</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{mall.followers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestPeermalls;