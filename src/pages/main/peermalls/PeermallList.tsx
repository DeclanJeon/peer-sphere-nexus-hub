
import { useEffect } from 'react';
import { usePeermall } from '@/contexts/PeermallContext';
import PeermallCard from '@/components/shared/PeermallCard';
import { toast } from '@/hooks/use-toast';

const PeermallList = () => {
  const { peermalls, loading, error, fetchPeermalls } = usePeermall();

  useEffect(() => {
    fetchPeermalls();
  }, [fetchPeermalls]);

  useEffect(() => {
    if (error) {
      toast({
        title: '오류',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  if (loading && peermalls.length === 0) {
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
      {!loading && peermalls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 생성된 피어몰이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default PeermallList;
