// src/components/common/layout/UserNavigationTabs.tsx
import { cn } from '@/lib/utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface NavigationTabsProps {
  activeTab: string;  
  setActiveTab: (tab: string) => void;
}

const UserNavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  const navigate = useNavigate();
  const { url } = useParams();

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'new', label: '신규' },
    { id: 'best', label: '베스트' },
    { id: 'community', label: '커뮤니티' },
    { id: 'events', label: '이벤트' },
  ];

  const handleButtonClick = (tabId) => {
    switch(tabId) {
      case 'community':
      case 'events':
        navigate(`/home/${url}/${tabId}`)
        return;
      default:
        setActiveTab(tabId);
      return;
    }
  }

  return (
    <section className="bg-white border-b sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleButtonClick(tab.id)}
              className={cn(
                'py-3 px-4 font-semibold hover:text-primary transition-colors text-muted-foreground border-b-2',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default UserNavigationTabs;
