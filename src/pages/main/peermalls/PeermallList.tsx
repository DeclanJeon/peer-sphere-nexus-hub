
import { useEffect, useState } from 'react';
import { peermallService, Peermall } from '@/lib/indexeddb';
import { toast } from '@/hooks/use-toast';
import PeermallCard from '@/components/shared/PeermallCard';

const PeermallList = () => {
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPeermalls = async () => {
      try {
        setIsLoading(true);
        const allMalls = await peermallService.getAllPeermalls();
        setPeermalls(allMalls);
      } catch (error) {
        toast({
          title: '오류',
          description: '피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPeermalls();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">전체 피어몰</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 피어몰</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {peermalls.map((peermall) => (
          <PeermallCard key={peermall.id} peermall={peermall} />
        ))}
      </div>
      {peermalls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 생성된 피어몰이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default PeermallList;
