import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewPeermalls = () => {
  const newPeermalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', rating: 4.8, createdAt: '2024-01-15' },
    { id: 2, name: '스마트 라이프', category: '전자기기', rating: 4.9, createdAt: '2024-01-14' },
    { id: 3, name: '패션 스트리트', category: '의류', rating: 4.7, createdAt: '2024-01-13' },
    { id: 4, name: '프리미엄 푸드', category: '식품', rating: 4.8, createdAt: '2024-01-12' },
    { id: 5, name: '반려동물 천국', category: '펫샵', rating: 4.6, createdAt: '2024-01-11' },
    { id: 6, name: '스포츠 월드', category: '스포츠', rating: 4.7, createdAt: '2024-01-10' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">신규 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">최근에 새롭게 개설된 피어몰들을 만나보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newPeermalls.map((mall) => (
          <Link key={mall.id} to={`/peermalls/${mall.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 relative">
                  <Badge className="absolute top-2 left-2 bg-primary">NEW</Badge>
                </div>
                <h3 className="font-semibold mb-2">{mall.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{mall.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{mall.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">개설일: {mall.createdAt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewPeermalls;