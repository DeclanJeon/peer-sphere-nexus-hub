import { Button } from '@/components/ui/button';

interface EventTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EventTabs = ({ activeTab, onTabChange }: EventTabsProps) => {
  const tabs = ['전체', '진행중', '종료', '예정'];

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

export default EventTabs;