import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Car, Calendar, MapPin } from 'lucide-react';
import type { FilterState } from '@/types';

interface SearchBarProps {
  onSearch: (filters: FilterState) => void;
  locations?: string[];
  makes?: string[];
  getUniqueModels: (make: string) => string[];
}

export function SearchBar({ onSearch, locations = [], makes = [], getUniqueModels }: SearchBarProps) {
  // Filter State
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');
  const [maxMileage, setMaxMileage] = useState<string>('');

  // UI State
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update models when make changes
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
      location: selectedLocation || null,
      make: selectedMake || null,
      model: selectedModel || null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minYear: minYear ? Number(minYear) : null,
      maxYear: maxYear ? Number(maxYear) : null,
      maxMileage: maxMileage ? Number(maxMileage) : null,
      category: null,
    });
  };

  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);
  const priceRanges = [100000, 200000, 300000, 400000, 500000, 750000, 1000000];
  const mileageRanges = [10000, 25000, 50000, 75000, 100000, 150000, 200000];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-800">
            Find Your <span className="text-king-blue">Perfect</span> Car
          </h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-king-blue font-medium text-lg flex items-center gap-2 hover:text-primary-light transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showAdvanced ? 'Simple Search' : 'Advanced Search'}
          </button>
        </div>

        {/* Search Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Make */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Make</label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Model</label>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake}
                className={`w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg ${!selectedMake ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <option value="">{selectedMake ? 'All Models' : 'Select Make First'}</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Min Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 font-bold">R</span>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
              >
                <option value="">No Min</option>
                {priceRanges.map((price) => (
                  <option key={price} value={price}>R {price.toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Max Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 font-bold">R</span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
              >
                <option value="">No Max</option>
                {priceRanges.map((price) => (
                  <option key={price} value={price}>R {price.toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters (Conditional) */}
          {showAdvanced && (
            <>
              {/* Min Year */}
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Min Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <select
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Any Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Year */}
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Max Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <select
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Any Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Max Mileage */}
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Max Mileage</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 pointer-events-none">
                    <span className="text-xs font-bold">KM</span>
                  </div>
                  <select
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Any Mileage</option>
                    {mileageRanges.map((km) => (
                      <option key={km} value={km}>{km.toLocaleString()} km</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2 animate-fade-in md:col-span-1 lg:col-span-1">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all appearance-none cursor-pointer text-lg"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100">
          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => setSelectedLocation('Western Cape')}
              className={`filter-tag text-base px-6 py-3 ${selectedLocation === 'Western Cape' ? 'filter-tag-active' : ''}`}
            >
              Western Cape
            </button>
            <button
              onClick={() => setSelectedLocation('Eastern Cape')}
              className={`filter-tag text-base px-6 py-3 ${selectedLocation === 'Eastern Cape' ? 'filter-tag-active' : ''}`}
            >
              Eastern Cape
            </button>
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-3 py-4 px-12 shadow-lg hover:shadow-xl hover-lift"
          >
            <Search className="w-6 h-6" />
            <span className="text-xl">Search Vehicles</span>
          </button>
        </div>
      </div>
    </div>
  );
}
