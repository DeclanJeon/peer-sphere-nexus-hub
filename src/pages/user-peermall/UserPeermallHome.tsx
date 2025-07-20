
import { usePeermall } from '@/contexts/PeermallContext';
import { Badge } from '@/components/ui/badge';
import { Star, Users, ShoppingBag, MessageSquare } from 'lucide-react';

const UserPeermallHome = () => {
  const { currentPeermall } = usePeermall();

  if (!currentPeermall) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">피어몰을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">요청하신 피어몰이 존재하지 않거나 삭제되었습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              {currentPeermall.image && (
                <img 
                  src={currentPeermall.image} 
                  alt={currentPeermall.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
                />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{currentPeermall.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">{currentPeermall.description}</p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {currentPeermall.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">{currentPeermall.rating}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <span>거래 {currentPeermall.sales}건</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>운영자: {currentPeermall.creatorName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">제품</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                다양한 제품들을 둘러보세요
              </p>
              <div className="text-2xl font-bold text-primary">0개</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">커뮤니티</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                사용자들과 소통해보세요
              </p>
              <div className="text-2xl font-bold text-primary">0개</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">이벤트</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                진행중인 이벤트를 확인하세요
              </p>
              <div className="text-2xl font-bold text-primary">0개</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserPeermallHome;
