
interface CategorySectionProps {
  categories: { name: string; icon: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const UserCategorySection = ({ categories, selectedCategory, setSelectedCategory }: CategorySectionProps) => {
  return (
    <section className="bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-bold mb-6 text-center">카테고리</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`group p-4 rounded-xl text-center border-2 transition-all duration-200 ${
              selectedCategory === 'all' 
                ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:scale-102'
            }`}
          >
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-sm font-semibold">전체</div>
            {/* <div className="text-xs text-muted-foreground">모든 상품</div> */}
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`group p-4 rounded-xl text-center border-2 transition-all duration-200 ${
                selectedCategory === category.name 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105' 
                  : 'bg-card hover:bg-muted border-border hover:border-primary/50 hover:scale-102'
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-semibold">{category.name}</div>
              {/* <div className={`text-xs ${selectedCategory === category.name ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {category.count}개
              </div> */}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserCategorySection;
