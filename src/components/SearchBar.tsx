'use client'

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { FilterState } from '@/types';

interface SearchBarProps {
  onSearch: (filters: FilterState) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch({
      searchQuery: query,
      location: null,
      make: null,
      model: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
      category: null,
      doors: null,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 sm:p-3 flex items-center gap-2 overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search make, model, year..."
          className="flex-1 min-w-0 h-10 sm:h-12 px-3 sm:px-4 bg-transparent text-gray-800 font-semibold text-[15px] placeholder:text-gray-400 placeholder:font-normal focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 w-10 h-10 sm:w-[52px] sm:h-[52px] bg-king-blue hover:bg-king-cyan text-white rounded-full flex items-center justify-center transition-all duration-300"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
