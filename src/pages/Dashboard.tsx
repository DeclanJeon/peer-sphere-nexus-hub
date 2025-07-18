import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newMallData, setNewMallData] = useState({
    name: '',
    category: '',
    description: ''
  });

  const handleCreateMall = () => {
    if (!newMallData.name || !newMallData.category) {
      toast({
        title: '입력 오류',
        description: '피어몰 이름과 카테고리를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '피어몰 생성 완료',
      description: `${newMallData.name} 피어몰이 성공적으로 생성되었습니다!`,
    });

    setNewMallData({ name: '', category: '', description: '' });
  };

  const heroSlides = [
    {
      title: '새로운 피어몰 경험',
      subtitle: '당신만의 특별한 쇼핑몰을 만들어보세요',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop'
    },
    {
      title: '베스트 셀러 상품',
      subtitle: '인기 상품들만 모은 특별 컬렉션',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop'
    },
    {
      title: '특가 이벤트',
      subtitle: '지금만 누릴 수 있는 특별한 혜택',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop'
    }
  ];

  const categories = [
    { name: '뷰티', icon: '💄', count: 234 },
    { name: '식품', icon: '🍎', count: 156 },
    { name: '주방용품', icon: '🍴', count: 89 },
    { name: '생활용품', icon: '🏠', count: 145 },
    { name: '출산대리', icon: '👶', count: 67 },
    { name: '임신/유아', icon: '🍼', count: 98 },
    { name: '스포츠/레저', icon: '⚽', count: 123 },
    { name: '패션', icon: '👔', count: 189 }
  ];
  const newPeermalls = [
    { id: 1, name: '코스메틱 파라다이스', category: '뷰티', rating: 4.8, image: '/placeholder.svg' },
    { id: 2, name: '스마트 라이프', category: '전자기기', rating: 4.9, image: '/placeholder.svg' },
    { id: 3, name: '패션 스트리트', category: '의류', rating: 4.7, image: '/placeholder.svg' },
  ];

  const newProducts = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: '89,000원', mall: '코스메틱 파라다이스', image: '/placeholder.svg' },
    { id: 2, name: '무선 이어폰 프로', price: '129,000원', mall: '스마트 라이프', image: '/placeholder.svg' },
    { id: 3, name: '캐주얼 맨투맨', price: '45,000원', mall: '패션 스트리트', image: '/placeholder.svg' },
  ];

  const bestPeermalls = [
    { id: 1, name: '럭셔리 브랜드 하우스', category: '명품', rating: 4.9, sales: '1,234', image: '/placeholder.svg' },
    { id: 2, name: '헬스 앤 라이프', category: '건강', rating: 4.8, sales: '987', image: '/placeholder.svg' },
    { id: 3, name: '키즈 원더랜드', category: '유아용품', rating: 4.9, sales: '756', image: '/placeholder.svg' },
  ];

  const bestProducts = [
    { id: 1, name: '다이아몬드 반지', price: '2,890,000원', mall: '럭셔리 브랜드 하우스', rating: 4.9, image: '/placeholder.svg' },
    { id: 2, name: '프로틴 파우더', price: '89,000원', mall: '헬스 앤 라이프', rating: 4.8, image: '/placeholder.svg' },
    { id: 3, name: '교육용 태블릿', price: '299,000원', mall: '키즈 원더랜드', rating: 4.9, image: '/placeholder.svg' },
  ];

  const stats = [
    { title: '전체 피어몰', value: '1,234', icon: Store, change: '+12%' },
    { title: '전체 상품', value: '45,678', icon: ShoppingBag, change: '+8%' },
    { title: '활성 사용자', value: '12,345', icon: Users, change: '+15%' },
    { title: '이번달 거래', value: '234', icon: TrendingUp, change: '+22%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Carousel */}
      <section className="relative h-80 bg-gradient-to-r from-primary to-primary-hover overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroSlides[currentSlide].image}
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl mb-6 text-primary-foreground/90">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="secondary">
                  <Plus className="h-5 w-5 mr-2" />
                  내 피어몰 만들기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 피어몰 만들기</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mallName">피어몰 이름 *</Label>
                    <Input
                      id="mallName"
                      value={newMallData.name}
                      onChange={(e) => setNewMallData({ ...newMallData, name: e.target.value })}
                      placeholder="예: 뷰티 파라다이스"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mallCategory">카테고리 *</Label>
                    <Select value={newMallData.category} onValueChange={(value) => setNewMallData({ ...newMallData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mallDescription">피어몰 소개</Label>
                    <Textarea
                      id="mallDescription"
                      value={newMallData.description}
                      onChange={(e) => setNewMallData({ ...newMallData, description: e.target.value })}
                      placeholder="피어몰에 대한 간단한 소개를 작성해주세요"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateMall} className="w-full">
                    피어몰 생성하기
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Search Section */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="찾고싶은 이름이나 검색어를 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <Link to="/peermalls/new" className="text-primary font-medium hover:text-primary-hover">
              신규
            </Link>
            <Link to="/peermalls/best" className="text-muted-foreground hover:text-primary">
              베스트
            </Link>
            <Link to="/community" className="text-muted-foreground hover:text-primary">
              커뮤니티
            </Link>
            <Link to="/events" className="text-muted-foreground hover:text-primary">
              이벤트
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 신규 피어몰 리스트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>신규 피어몰</CardTitle>
              <CardDescription>새롭게 오픈한 피어몰들을 만나보세요</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/peermalls/new">전체보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newPeermalls.map((mall) => (
                <Link key={mall.id} to={`/peermalls/${mall.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3">
                        <img src={mall.image} alt={mall.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h4 className="font-semibold text-base mb-1">{mall.name}</h4>
                      <Badge variant="secondary" className="mb-2">{mall.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mall.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 베스트 피어몰 리스트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>베스트 피어몰</CardTitle>
              <CardDescription>인기 높은 베스트 피어몰들을 확인해보세요</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/peermalls/best">전체보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestPeermalls.map((mall) => (
                <Link key={mall.id} to={`/peermalls/${mall.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3">
                        <img src={mall.image} alt={mall.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h4 className="font-semibold text-base mb-1">{mall.name}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{mall.category}</Badge>
                        <span className="text-sm text-muted-foreground">판매 {mall.sales}건</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mall.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 신규 제품/상품 리스트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>신규 제품/상품</CardTitle>
              <CardDescription>새롭게 등록된 상품들을 확인해보세요</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products/new">전체보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-muted rounded-lg mb-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-primary font-semibold text-sm mb-1">{product.price}</p>
                      <p className="text-xs text-muted-foreground">{product.mall}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 베스트 제품/상품 리스트 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>베스트 제품/상품</CardTitle>
              <CardDescription>인기 높은 베스트 상품들을 만나보세요</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products/best">전체보기</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-muted rounded-lg mb-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-primary font-semibold text-sm mb-1">{product.price}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{product.mall}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">커뮤니티 참여</h3>
              <p className="text-sm text-muted-foreground mb-4">다른 사용자들과 소통해보세요</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/community">커뮤니티 가기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">이벤트 확인</h3>
              <p className="text-sm text-muted-foreground mb-4">진행 중인 이벤트를 확인하세요</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/events">이벤트 보기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Store className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">내 피어몰 관리</h3>
              <p className="text-sm text-muted-foreground mb-4">내 피어몰을 관리하고 운영하세요</p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/mypage">관리하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;