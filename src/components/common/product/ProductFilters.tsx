import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories: string[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const ProductFilters = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  searchQuery = '',
  onSearchChange
}: ProductFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(localSearchQuery);
  };

  const handleReset = () => {
    onCategoryChange('전체');
    onSortChange('최신순');
    setLocalSearchQuery('');
    onSearchChange?.('');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* 검색 바 */}
      {onSearchChange && (
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="상품명으로 검색..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="default">
            검색
          </Button>
        </form>
      )}

      {/* 필터 옵션들 */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="최신순">최신순</SelectItem>
            <SelectItem value="인기순">인기순</SelectItem>
            <SelectItem value="가격낮은순">가격 낮은순</SelectItem>
            <SelectItem value="가격높은순">가격 높은순</SelectItem>
            <SelectItem value="평점순">평점순</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          title="필터 초기화"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;