import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import UserContentSection from './home/UserContentSection';
import UserCategorySection from './home/UserCategorySection';
import UserNavigationTabs from './home/UserNavigationTabs';
import UserSearchSection from './home/UserSearchSection';

const UserPeermallHome = () => {
  // const { peermallName } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  // const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const context = useOutletContext<{activeTab?: string}>();
  const activeTab = context?.activeTab || 'all';

  // TODO: This should be fetched from the specific peermall's data
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
      {/* <UserNavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <UserSearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserCategorySection 
        categories={categories} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <UserContentSection 
        activeTab={activeTab} 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default UserPeermallHome;