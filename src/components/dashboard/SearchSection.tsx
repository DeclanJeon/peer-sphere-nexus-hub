
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchSection = ({ searchQuery, setSearchQuery }: SearchSectionProps) => {
  return (
    <section className="bg-white border-b py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="피어몰, 상품명, 브랜드명을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg border-2 focus:border-primary"
          />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
