import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
}

const FilterBar = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange, 
  categories 
}: FilterBarProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Поиск по названию сервиса..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-border focus:ring-ai-primary focus:border-ai-primary"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">Предмет:</span>
          
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange('all')}
            className={selectedCategory === 'all' ? 'bg-ai-primary hover:bg-ai-primary/90' : ''}
          >
            Все
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className={selectedCategory === category ? 'bg-ai-primary hover:bg-ai-primary/90' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;