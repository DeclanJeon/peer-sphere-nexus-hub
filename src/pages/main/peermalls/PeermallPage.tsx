import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Peermall } from '@/types/peermall';
import { peermallApi } from '@/services/peermall.api';
import PeermallCard from '@/components/common/peermall/PeermallCard';
import QRCodeDialog from '@/components/common/QRCodeDialog';
import { toast } from '@/hooks/use-toast';

const PeermallPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 'tab' 파라미터를 읽어와 초기 상태를 설정합니다. 없으면 'best'가 기본값.
  const initialTab = searchParams.get('tab') === 'new' ? 'new' : 'best';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bestPeermalls, setBestPeermalls] = useState<Peermall[]>([]);
  const [newPeermalls, setNewPeermalls] = useState<Peermall[]>([]);
  const [filteredPeermalls, setFilteredPeermalls] = useState<Peermall[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedPeermall, setSelectedPeermall] = useState<Peermall | null>(null);

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'fashion', label: '패션' },
    { value: 'electronics', label: '전자제품' },
    { value: 'books', label: '도서' },
    { value: 'food', label: '식품' },
    { value: 'beauty', label: '뷰티' },
    { value: 'sports', label: '스포츠' },
    { value: 'home', label: '홈인테리어' },
  ];

  useEffect(() => {
    // activeTab이 변경될 때마다 데이터를 다시 불러옵니다.
    fetchPeermalls();
  }, [activeTab]);

  useEffect(() => {
    // 필터링 관련 상태가 변경될 때마다 목록을 다시 필터링합니다.
    filterPeermalls();
  }, [bestPeermalls, newPeermalls, searchQuery, selectedCategory, activeTab]);

  const fetchPeermalls = async () => {
    setLoading(true);
    try {
      if (activeTab === 'best' && bestPeermalls.length === 0) { // 데이터가 없을 때만 호출
        const data = await peermallApi.getBestPeermalls(20);
        setBestPeermalls(data);
      } else if (activeTab === 'new' && newPeermalls.length === 0) { // 데이터가 없을 때만 호출
        const data = await peermallApi.getNewPeermalls(20);
        setNewPeermalls(data);
      }
    } catch (error) {
      console.error('피어몰 데이터 로드 실패:', error);
      toast({
        title: '오류',
        description: '피어몰 데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPeermalls = () => {
    const currentPeermalls = activeTab === 'best' ? bestPeermalls : newPeermalls;
    
    let filtered = currentPeermalls;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(peermall => peermall.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(peermall =>
        peermall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        peermall.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPeermalls(filtered);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // URL의 쿼리 파라미터를 업데이트하여 상태를 동기화합니다.
    setSearchParams({ tab: newTab });
  };

  const handleQRClick = (peermall: Peermall) => {
    setSelectedPeermall(peermall);
    setQrDialogOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const renderPeermallList = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">로딩 중...</p>
        </div>
      );
    }
    
    if (filteredPeermalls.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">조건에 맞는 피어몰이 없습니다.</p>
          <p className="text-sm mt-2">검색어나 필터를 변경해보세요.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPeermalls.map((peermall) => (
          <PeermallCard
            key={peermall.id}
            peermall={peermall}
            onQRClick={handleQRClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">피어몰 둘러보기</h1>
        <p className="text-muted-foreground">
          다양한 피어몰을 탐색하고 새로운 쇼핑 경험을 만나보세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="피어몰 이름이나 설명으로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="new">신규 피어몰</TabsTrigger>
          <TabsTrigger value="best">베스트 피어몰</TabsTrigger>
        </TabsList> */}

        <TabsContent value="best" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🏆 베스트 피어몰</CardTitle>
              <CardDescription>
                인기있는 피어몰들을 만나보세요
                {selectedCategory !== 'all' && (
                  <span className="text-primary ml-1">
                    ({categories.find(c => c.value === selectedCategory)?.label} 카테고리)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPeermallList()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">✨ 신규 피어몰</CardTitle>
              <CardDescription>
                최근에 오픈한 새로운 피어몰들을 확인해보세요
                {selectedCategory !== 'all' && (
                  <span className="text-primary ml-1">
                    ({categories.find(c => c.value === selectedCategory)?.label} 카테고리)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderPeermallList()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <QRCodeDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        peermall={selectedPeermall}
      />
    </div>
  );
};

export default PeermallPage;