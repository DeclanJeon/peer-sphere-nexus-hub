import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { peermallService, Peermall } from '@/lib/indexeddb';
import { toast } from '@/hooks/use-toast';
import PeermallCard from '@/components/shared/PeermallCard';

const NewPeermalls = () => {
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);

  useEffect(() => {
    const fetchNewPeermalls = async () => {
      try {
        const malls = await peermallService.getNewPeermalls(10);
        setNewPeermalls(malls);
      } catch (error) {
        toast({
          title: '오류',
          description: '신규 피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };
    fetchNewPeermalls();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">신규 피어몰</h1>
      </div>
      <p className="text-muted-foreground mb-8">최근에 새롭게 개설된 피어몰들을 만나보세요</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newPeermalls.map((mall) => (
          <PeermallCard key={mall.id} peermall={mall} />
        ))}
      </div>
    </div>
  );
};

export default NewPeermalls;