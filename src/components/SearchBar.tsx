import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { FilterState } from '@/types';

interface SearchBarProps {
  onSearch: (filters: FilterState) => void;
  locations?: string[];
  makes?: string[];
  getUniqueModels: (make: string) => string[];
}

export function SearchBar({ onSearch, locations = [], makes = [], getUniqueModels }: SearchBarProps) {
  const [category, setCategory] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [variant, setVariant] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // UI State
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  useEffect(() => {
    if (selectedMake) {
      setAvailableModels(getUniqueModels(selectedMake));
      setSelectedModel(''); // Reset model when make changes
    } else {
      setAvailableModels([]);
      setSelectedModel('');
    }
  }, [selectedMake, getUniqueModels]);

  const handleSearch = () => {
    onSearch({
      searchQuery: '',
      location: null,
      make: selectedMake || null,
      model: selectedModel || null,
      minPrice: null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
      category: category || null,
    });
  };

  const categories = ['Hatchback', 'Sedan', 'SUV', 'Bakkie', 'Coupe', 'Convertible'];
  const priceRanges = [100000, 200000, 300000, 400000, 500000, 750000, 1000000];

  return (
    <div className="w-full max-w-6xl mx-auto relative z-20">
      <div className="bg-white rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 md:p-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 transition-all duration-300">

        {/* Type / Category */}
        <div className="flex-1 w-full relative px-4 md:px-6 md:border-r border-gray-100 flex items-center h-14">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-gray-700 font-bold text-sm md:text-[15px] outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>Type</option>
            <option value="">All Types</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-6 pointer-events-none text-gray-900">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Make */}
        <div className="flex-1 w-full relative px-4 md:px-6 md:border-r border-gray-100 flex items-center h-14">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full bg-transparent text-gray-700 font-bold text-sm md:text-[15px] outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>All Makes</option>
            <option value="">All Makes</option>
            {makes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          <div className="absolute right-6 pointer-events-none text-gray-900">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Model */}
        <div className="flex-1 w-full relative px-4 md:px-6 md:border-r border-gray-100 flex items-center h-14">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
            className={`w-full bg-transparent font-bold text-sm md:text-[15px] outline-none appearance-none cursor-pointer ${!selectedMake ? 'text-gray-400' : 'text-gray-700'}`}
          >
            <option value="" disabled hidden>All Models</option>
            <option value="">All Models</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <div className="absolute right-6 pointer-events-none text-gray-900 opacity-60">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Variant */}
        <div className="flex-1 w-full relative px-4 md:px-6 md:border-r border-gray-100 flex items-center h-14">
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            className="w-full bg-transparent text-gray-700 font-bold text-sm md:text-[15px] outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>Variant</option>
            <option value="">All Variants</option>
          </select>
          <div className="absolute right-6 pointer-events-none text-gray-900">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Max Price */}
        <div className="flex-1 w-full relative px-4 md:px-6 flex items-center h-14">
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-transparent text-gray-700 font-bold text-sm md:text-[15px] outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>Max Price</option>
            <option value="">No Max Price</option>
            {priceRanges.map((price) => (
              <option key={price} value={price}>R {price.toLocaleString()}</option>
            ))}
          </select>
          <div className="absolute right-6 pointer-events-none text-gray-900">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1.5L6 6L10.5 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto px-2 md:px-2 pb-2 md:pb-0">
          <button
            onClick={handleSearch}
            className="w-full md:w-[60px] h-[52px] bg-king-blue hover:bg-king-cyan text-white rounded-2xl md:rounded-[1rem] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Search className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

      </div>
    </div>
  );
}
