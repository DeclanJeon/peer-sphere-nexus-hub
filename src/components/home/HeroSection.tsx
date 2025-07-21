import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  categories: { name: string; icon: string; count: number }[];
}

const HeroSection = ({ categories }: HeroSectionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const eventBanners = [
    {
      id: 1,
      title: '신년 대축제 이벤트',
      description: '새해를 맞이하여 모든 상품 최대 50% 할인! 이번 기회를 놓치지 마세요. 1월 31일까지 한정된 시간 동안만 진행되는 특별 이벤트입니다.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop',
      eventPeriod: '2024.01.01 - 2024.01.31',
      tags: ['할인', '신년이벤트', '전상품']
    },
    {
      id: 2,
      title: '봄맞이 뷰티 페스티벌',
      description: '봄을 맞이하여 새로운 뷰티 아이템들을 만나보세요. 화사한 봄 메이크업부터 스킨케어까지, 당신의 아름다움을 더욱 빛내줄 제품들을 소개합니다.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      eventPeriod: '2024.03.01 - 2024.03.31',
      tags: ['뷰티', '봄시즌', '신상품']
    },
    {
      id: 3,
      title: '건강한 라이프스타일 챌린지',
      description: '건강한 삶을 위한 첫걸음! 유기농 식품과 건강 관리 제품들로 새로운 라이프스타일을 시작해보세요. 참여자 모두에게 특별한 혜택을 드립니다.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop',
      eventPeriod: '2024.02.15 - 2024.04.15',
      tags: ['건강', '라이프스타일', '챌린지']
    }
  ];

  const currentEvent = eventBanners[currentBanner];

  return (
    <section className="relative bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* 좌측: 이벤트/배너 이미지 */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img 
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <Button size="lg" className="px-8">
                참여하기
              </Button>
            </div>
          </div>

          {/* 우측: 이벤트/배너 게시글 */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {currentEvent.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h2 className="text-3xl font-bold text-foreground">
                {currentEvent.title}
              </h2>
              
              <div className="text-sm text-muted-foreground">
                이벤트 기간: {currentEvent.eventPeriod}
              </div>
              
              <p className="text-lg text-foreground leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* 이벤트 네비게이션 */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-2">
                {eventBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentBanner === index ? 'bg-primary scale-110' : 'bg-muted hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + eventBanners.length) % eventBanners.length)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % eventBanners.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;