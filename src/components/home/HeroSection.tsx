
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HeroSectionProps {
  categories: { name: string; icon: string; count: number }[];
}

const HeroSection = ({ categories }: HeroSectionProps) => {
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
      title: '피어몰에 오신것을 환영합니다',
      subtitle: '당신만의 특별한 쇼핑몰을 만들어보세요',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop'
    },
    {
      title: '베스트 셀러 상품',
      subtitle: '인기 상품들만 모은 특별 컬렉션',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=500&fit=crop'
    },
    {
      title: '특가 이벤트',
      subtitle: '지금만 누릴 수 있는 특별한 혜택',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop'
    }
  ];

  return (
    <section className="relative h-96 bg-gradient-to-r from-primary to-primary-hover overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroSlides[currentSlide].image}
          alt="Hero"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-white text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            이벤트/배너/인기글 섹션
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90">
            {heroSlides[currentSlide].subtitle}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />
                입장하기
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
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              currentSlide === index ? 'bg-white scale-110' : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};

export default HeroSection;
