import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchSection from '@/components/home/SearchSection';
import CategorySection from '@/components/home/CategorySection';
import NavigationTabs from '@/components/home/NavigationTabs';
import ContentSection from '@/components/home/ContentSection';

const UserPeermallHome = () => {
  const { peermallName } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // TODO: This should be fetched from the specific peermall's data
  const categories = [
    { name: '패션', icon: '👔', count: 12 },
    { name: '뷰티', icon: '💄', count: 34 },
    { name: '식품', icon: '🍎', count: 56 },
    { name: '주방용품', icon: '🍴', count: 8 },
    { name: '생활용품', icon: '🏠', count: 45 },
    { name: '스포츠/레저', icon: '⚽', count: 23 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategorySection 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <ContentSection 
        activeTab={activeTab} 
        selectedCategory={selectedCategory} 
        isMainPeermall={false}
        peermallId={peermallName}
      />
    </div>
  );
};

export default UserPeermallHome;