import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import PeermallCard from '@/components/shared/PeermallCard';
import { peermallApi } from '@/services/peermall.api';
import { Peermall } from '@/types/peermall';

const NewPeermalls = () => {
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  
  useEffect(() => {
    const fetchNewPeermalls = async () => {
      try {
        const response = await peermallApi.getNewPeermalls(10);
        // API 응답이 배열이 아닌 경우를 대비해 예외 처리
        const malls = Array.isArray(response) ? response : [];
        setNewPeermalls(malls);
      } catch (error) {
        console.error('신규 피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '신규 피어몰 목록을 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
        setNewPeermalls([]); // 오류 발생 시 빈 배열로 초기화
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
        {newPeermalls && newPeermalls.length > 0 ? (
          newPeermalls.map((peermall) => (
            <PeermallCard key={peermall.id} peermall={peermall} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            신규 피어몰이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPeermalls;