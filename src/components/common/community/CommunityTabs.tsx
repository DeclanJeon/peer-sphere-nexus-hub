import { Button } from '@/components/ui/button';

interface CommunityTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CommunityTabs = ({ activeTab, onTabChange }: CommunityTabsProps) => {
  const tabs = ['전체글', '추천글', '공지', '인기글'];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? 'default' : 'outline'}
          onClick={() => onTabChange(tab)}
          className={`
            ${activeTab === tab 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background text-foreground border-border hover:bg-muted'
            }
          `}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default CommunityTabs;