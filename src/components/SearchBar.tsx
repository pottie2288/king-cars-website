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
      <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search make, model, year..."
          className="flex-1 h-12 px-4 bg-transparent text-gray-800 font-semibold text-[15px] placeholder:text-gray-400 placeholder:font-normal focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 w-[52px] h-[52px] bg-king-blue hover:bg-king-cyan text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Search className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
