import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { peermallApi } from '@/services/peermall.api';
import { Peermall } from '@/types/peermall';
import PeermallList from '@/components/common/peermall/PeermallList';
import QRCodeDialog from '@/components/common/QRCodeDialog';
import { Loader2 } from 'lucide-react';

interface ContentSectionProps {
  activeTab: string;
  selectedCategory: string;
  searchQuery: string;
  isMainPeermall?: boolean;
  peermallId?: string;
}

const ContentSection = ({ 
  activeTab, 
  selectedCategory, 
  searchQuery,
  isMainPeermall = true, 
  peermallId 
}: ContentSectionProps) => {
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);
  const [allPeermalls, setAllPeermalls] = useState<Peermall[]>([]);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedPeermallForQR, setSelectedPeermallForQR] = useState<Peermall | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 초기 데이터 로드 (검색어와 무관하게 한 번만 실행)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (dataLoaded || !isMainPeermall) return;
      
      setIsLoading(true);
      try {
        const [newMalls, bestMalls] = await Promise.all([
          peermallApi.getNewPeermalls(20), // 더 많은 데이터를 로드
          peermallApi.getBestPeermalls(20)
        ]);
        
        setNewPeermalls(newMalls);
        setBestPeermalls(bestMalls);
        
        // 중복 제거하여 전체 피어몰 목록 생성
        const allMallsMap = new Map<string, Peermall>();
        [...newMalls, ...bestMalls].forEach(mall => {
          allMallsMap.set(mall.id, mall);
        });
        setAllPeermalls(Array.from(allMallsMap.values()));
        
        setDataLoaded(true);
      } catch (error) {
        console.error('피어몰 로딩 오류:', error);
        toast({
          title: '오류',
          description: '데이터를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isMainPeermall, dataLoaded]);

  // 검색 및 카테고리 필터링 함수
  const getFilteredPeermalls = (peermalls: Peermall[]) => {
    let filtered = peermalls;

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mall => 
        (mall.category || mall.familyCompany || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(mall => 
        mall.name.toLowerCase().includes(query) ||
        (mall.description || '').toLowerCase().includes(query) ||
        (mall.category || '').toLowerCase().includes(query) ||
        (mall.familyCompany || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const handleQRClick = (peermall: Peermall) => {
    setSelectedPeermallForQR(peermall);
    setShowQRDialog(true);
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const renderContent = () => {
    // 검색어가 있을 때
    if (searchQuery.trim()) {
      const searchResults = getFilteredPeermalls(allPeermalls);
      
      if (searchResults.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">''{searchQuery}''에 대한 검색 결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 검색어를 시도해보세요.</p>
          </div>
        );
      }

      return (
        <PeermallList
          title={`'${searchQuery}'에 대한 검색 결과`}
          description={`${searchResults.length}개의 피어몰을 찾았습니다.`}
          peermalls={searchResults}
          selectedCategory={selectedCategory}
          onQRClick={handleQRClick}
        />
      );
    }

    // 탭별 렌더링
    switch (activeTab) {
      case 'new': {
        const filteredNew = getFilteredPeermalls(newPeermalls);
        
        if (filteredNew.length === 0 && selectedCategory !== 'all') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">선택한 카테고리에 해당하는 신규 피어몰이 없습니다.</p>
            </div>
          );
        }

        return (
          <PeermallList
            title="신규 피어몰"
            description="새롭게 오픈한 피어몰들을 만나보세요"
            peermalls={filteredNew.slice(0, 4)} // 메인 페이지에서는 4개만 표시
            viewAllLink="/peermalls?tab=new"
            selectedCategory={selectedCategory}
            onQRClick={handleQRClick}
          />
        );
      }

      case 'best': {
        const filteredBest = getFilteredPeermalls(bestPeermalls);
        
        if (filteredBest.length === 0 && selectedCategory !== 'all') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">선택한 카테고리에 해당하는 베스트 피어몰이 없습니다.</p>
            </div>
          );
        }

        return (
          <PeermallList
            title="베스트 피어몰"
            description="인기 높은 베스트 피어몰들을 확인해보세요"
            peermalls={filteredBest.slice(0, 4)}
            viewAllLink="/peermalls?tab=best"
            selectedCategory={selectedCategory}
            onQRClick={handleQRClick}
          />
        );
      }

      default: { // 'all'
        const filteredNew = getFilteredPeermalls(newPeermalls).slice(0, 4);
        const filteredBest = getFilteredPeermalls(bestPeermalls).slice(0, 4);

        if (filteredNew.length === 0 && filteredBest.length === 0 && selectedCategory !== 'all') {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">선택한 카테고리에 해당하는 피어몰이 없습니다.</p>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            {filteredNew.length > 0 && (
              <PeermallList
                title="신규 피어몰"
                description="새롭게 오픈한 피어몰들을 만나보세요"
                peermalls={filteredNew}
                viewAllLink="/peermalls?tab=new"
                selectedCategory={selectedCategory}
                onQRClick={handleQRClick}
              />
            )}
            {filteredBest.length > 0 && (
              <PeermallList
                title="베스트 피어몰"
                description="인기 높은 베스트 피어몰들을 확인해보세요"
                peermalls={filteredBest}
                viewAllLink="/peermalls?tab=best"
                selectedCategory={selectedCategory}
                onQRClick={handleQRClick}
              />
            )}
          </div>
        );
      }
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