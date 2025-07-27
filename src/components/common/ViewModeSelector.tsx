import { Button } from '@/components/ui/button';
import { LayoutGrid, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewModeSelectorProps {
  viewMode: 'grid' | 'split';
  onViewModeChange: (mode: 'grid' | 'split') => void;
}

const ViewModeSelector = ({ viewMode, onViewModeChange }: ViewModeSelectorProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'h-8 px-3 rounded-md transition-all',
          viewMode === 'grid' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        통합뷰
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('split')}
        className={cn(
          'h-8 px-3 rounded-md transition-all',
          viewMode === 'split' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <PanelLeft className="h-4 w-4 mr-2" />
        분리뷰
      </Button>
    </div>
  );
};

export default ViewModeSelector;