import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import CategorySection from '@/components/home/CategorySection';
import NavigationTabs from '@/components/home/NavigationTabs';
import ContentSection from '@/components/home/ContentSection';
import PeermallContentSection from '@/components/peermall/PeermallContentSection';

interface LandingPageTemplateProps {
  isMainPage?: boolean;
  peermallData?: {
    name: string;
    description: string;
    imageUrl?: string;
  };
}

const LandingPageTemplate = ({ isMainPage = false, peermallData }: LandingPageTemplateProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { name: '패션', icon: '👔', count: 189 },
    { name: '뷰티', icon: '💄', count: 234 },
    { name: '식품', icon: '🍎', count: 156 },
    { name: '주방용품', icon: '🍴', count: 89 },
    { name: '생활용품', icon: '🏠', count: 145 },
    { name: '출산대리', icon: '👶', count: 67 },
    { name: '임신/유아', icon: '🍼', count: 98 },
    { name: '스포츠/레저', icon: '⚽', count: 123 }
  ];

  // 피어몰 페이지용 탭 (피어몰 리스트 제외)
  const peermallTabs = [
    { id: 'products', label: '제품/상품' },
    { id: 'community', label: '커뮤니티' },
    { id: 'events', label: '이벤트' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 메인 페이지에만 Hero 섹션 표시 */}
      {isMainPage && <HeroSection categories={categories} />}
      
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <CategorySection 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      
      {isMainPage ? (
        <>
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ContentSection activeTab={activeTab} selectedCategory={selectedCategory} />
        </>
      ) : (
        <PeermallContentSection />
      )}
    </div>
  );
};

export default LandingPageTemplate;