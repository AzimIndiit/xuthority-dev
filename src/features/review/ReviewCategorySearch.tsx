import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';

interface ReviewCategorySearchProps {
  popularMentions: {label: string, value: string, slug: string}[];
  onSearch: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const ReviewCategorySearch: React.FC<ReviewCategorySearchProps> = ({ popularMentions, onSearch, selectedCategory, setSelectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
console.log(popularMentions,'popularMentions',selectedCategory);
  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  return (
    <div className="bg-white p-4 rounded-lg h-full flex flex-col shadow-md mb-10">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search software or services you want to review..."
          className="w-full pl-10 pr-4 py-3 border-gray-300 focus:ring-blue-500 rounded-full h-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 mt-4">Popular Categories</h3>
      <div className="flex flex-wrap gap-2 ">
        {popularMentions.slice(0, 8).map((mention) => (
          <button
            key={mention.value}
            onClick={() => {
              setSelectedCategory( mention.label === 'All Categories' ? "All Categories" : mention.slug);
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              mention.label === 'All Categories' 
                && mention.label === selectedCategory 
                || mention.slug === selectedCategory
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {mention.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewCategorySearch; 