
import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import CategorySection from '@/components/home/CategorySection';
import NavigationTabs from '@/components/home/NavigationTabs';
import ContentSection from '@/components/home/ContentSection';

const Main = () => {
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

  return (
    <div className="min-h-screen bg-background">
      
      <HeroSection categories={categories} />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategorySection 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentSection activeTab={activeTab} selectedCategory={selectedCategory} />
    </div>
  );
};

export default Main;
