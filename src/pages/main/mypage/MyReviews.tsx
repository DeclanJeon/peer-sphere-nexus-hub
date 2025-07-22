import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Trash2, Plus } from 'lucide-react';

const MyReviews = () => {
  const reviews = [
    {
      id: 1,
      productName: '프리미엄 스킨케어 세트',
      mallName: '코스메틱 파라다이스',
      rating: 5,
      content: '정말 만족스러운 제품이에요! 피부가 부드러워졌고 보습력이 뛰어나네요.',
      createdAt: '2024-01-15',
      helpful: 12
    },
    {
      id: 2,
      productName: '무선 이어폰 프로',
      mallName: '스마트 라이프',
      rating: 4,
      content: '음질이 깔끔하고 배터리도 오래 갑니다. 가성비 좋은 제품!',
      createdAt: '2024-01-14',
      helpful: 8
    },
    {
      id: 3,
      productName: '캐주얼 맨투맨',
      mallName: '패션 스트리트',
      rating: 5,
      content: '소재가 부드럽고 핏이 예뻐요. 색상도 화면과 동일하네요.',
      createdAt: '2024-01-13',
      helpful: 15
    },
    {
      id: 4,
      productName: '홈 카페 머신',
      mallName: '라이프스타일',
      rating: 3,
      content: '기능은 좋은데 소음이 조금 큰 편입니다.',
      createdAt: '2024-01-12',
      helpful: 5
    },
  ];

  const handleDelete = (reviewId: number) => {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      console.log('Delete review:', reviewId);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Star className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">내 리뷰 관리</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">24</div>
            <div className="text-sm text-muted-foreground">작성한 리뷰</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">4.3</div>
            <div className="text-sm text-muted-foreground">평균 평점</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">89</div>
            <div className="text-sm text-muted-foreground">도움이 됨</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">5</div>
            <div className="text-sm text-muted-foreground">이번달 리뷰</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>리뷰 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Link to={`/products/${review.id}`} className="font-semibold hover:text-primary transition-colors">
                        {review.productName}
                      </Link>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Link to={`/peermalls/${review.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {review.mallName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                    </div>
                    <p className="text-sm mb-2">{review.content}</p>
                    <div className="text-xs text-muted-foreground">
                      도움이 됨 {review.helpful}명
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReviews;