import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import { Peermall } from '@/types/peermall';
import PeermallList from '@/components/common/peermall/PeermallList';
import QRCodeDialog from '@/components/common/QRCodeDialog';

interface ContentSectionProps {
  activeTab: string;
  selectedCategory: string;
  isMainPeermall?: boolean;
  peermallId?: string;
}

const ContentSection = ({ 
  activeTab, 
  selectedCategory, 
  isMainPeermall = true, 
  peermallId 
}: ContentSectionProps) => {
  const params = useParams();
  const currentPeermallId = peermallId || params.peermallName;
  
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedPeermallForQR, setSelectedPeermallForQR] = useState<Peermall | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isMainPeermall) {
          const [newMalls, bestMalls] = await Promise.all([
            peermallApi.getNewPeermalls(4),
            peermallApi.getBestPeermalls(4)
          ]);
          
          setNewPeermalls(newMalls);
          setBestPeermalls(bestMalls);
        }
      } catch (error) {
        console.error('피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '데이터를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, [isMainPeermall]);

  const getFilteredPeermalls = (peermalls: Peermall[]) => {
    if (selectedCategory === 'all') return peermalls;
    return peermalls.filter(mall => 
      (mall.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const handleQRClick = (peermall: Peermall) => {
    setSelectedPeermallForQR(peermall);
    setShowQRDialog(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'new':
        return (
          <PeermallList
            title="신규 피어몰"
            description="새롭게 오픈한 피어몰들을 만나보세요"
            peermalls={getFilteredPeermalls(newPeermalls)}
            viewAllLink="/peermalls/new"
            selectedCategory={selectedCategory}
            onQRClick={handleQRClick}
          />
        );

      case 'best':
        return (
          <PeermallList
            title="베스트 피어몰"
            description="인기 높은 베스트 피어몰들을 확인해보세요"
            peermalls={getFilteredPeermalls(bestPeermalls)}
            viewAllLink="/peermalls/best"
            selectedCategory={selectedCategory}
            onQRClick={handleQRClick}
          />
        );

      default: // 'all'
        return (
          <div className="space-y-8">
            <PeermallList
              title="신규 피어몰"
              description="새롭게 오픈한 피어몰들을 만나보세요"
              peermalls={getFilteredPeermalls(newPeermalls)}
              viewAllLink="/peermalls/new"
              selectedCategory={selectedCategory}
              onQRClick={handleQRClick}
            />
            <PeermallList
              title="베스트 피어몰"
              description="인기 높은 베스트 피어몰들을 확인해보세요"
              peermalls={getFilteredPeermalls(bestPeermalls)}
              viewAllLink="/peermalls/best"
              selectedCategory={selectedCategory}
              onQRClick={handleQRClick}
            />
          </div>
        );
    }
  };

  return (
    <>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {renderContent()}
        </div>
      </section>

      <QRCodeDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
        peermall={selectedPeermallForQR}
      />
    </>
  );
};

export default ContentSection;
