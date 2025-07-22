import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const ProductFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange 
}: ProductFiltersProps) => {
  const categories = ['전체', '전자기기', '패션', '식품', '생활용품', '스포츠', '도서'];
  const sortOptions = ['최신순', '가격낮은순', '가격높은순', '인기순', '평점순'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground mb-2 block">
          카테고리
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground mb-2 block">
          정렬
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;