// src/components/common/event/EventTabs.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EventTabs = ({ activeTab, onTabChange }: EventTabsProps) => {
  const tabs = ['전체', '진행중', '종료', '예정'];

  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant="ghost"
          onClick={() => onTabChange(tab)}
          className={cn(
            'rounded-none border-b-2 border-transparent -mb-px pt-3 pb-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground',
            { 'border-primary text-primary': activeTab === tab }
          )}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default EventTabs;
