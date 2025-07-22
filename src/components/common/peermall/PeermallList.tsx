import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Peermall } from '@/types/peermall';
import PeermallCard from './PeermallCard';

interface PeermallListProps {
  title: string;
  description: string;
  peermalls: Peermall[];
  viewAllLink: string;
  selectedCategory?: string;
  onQRClick: (peermall: Peermall) => void;
}

const PeermallList = ({ 
  title, 
  description, 
  peermalls, 
  viewAllLink, 
  selectedCategory = 'all',
  onQRClick 
}: PeermallListProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
            {selectedCategory !== 'all' && (
              <span className="text-primary ml-1">({selectedCategory} 카테고리)</span>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" asChild>
          <Link to={viewAllLink}>전체보기</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {peermalls.map((mall) => (
            <PeermallCard key={mall.id} peermall={mall} onQRClick={onQRClick} />
          ))}
        </div>
        {peermalls.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            해당 카테고리에 피어몰이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeermallList;