import { Button } from '@/components/ui/button';

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProductTabs = ({ activeTab, onTabChange }: ProductTabsProps) => {
  const tabs = ['전체', '신상품', '베스트', '할인'];

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

export default ProductTabs;