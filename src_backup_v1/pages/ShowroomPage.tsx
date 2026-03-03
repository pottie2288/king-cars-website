import { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { FilterState, Car } from '@/types';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
    >
      {children}
    </div>
  );
}

interface ShowroomPageProps {
  onCarClick: (car: Car) => void;
  favourites: string[];
  onToggleFavourite: (carId: string) => void;
}

export function ShowroomPage({ onCarClick, favourites, onToggleFavourite }: ShowroomPageProps) {
  const { cars, filterCars, loading, getUniqueMakes, getUniqueCategories } = useInventory();
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc'>('price-asc');

  const [filters, setFilters] = useState<FilterState>({
    location: null,
    category: null,
    make: null,
    model: null,
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
    searchQuery: '',
  });

  const locations = ['Cape Town', 'Port Elizabeth'];
  const makes = getUniqueMakes();
  const categories = getUniqueCategories();

  // Load filters from sessionStorage if coming from home search
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('homeSearchFilters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
      sessionStorage.removeItem('homeSearchFilters');
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    if (!loading) {
      let result = filterCars(filters);

      // Apply sorting
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'year-desc':
            return b.year - a.year;
          case 'mileage-asc':
            return a.mileage - b.mileage;
          default:
            return 0;
        }
      });

      setFilteredCars(result);
    }
  }, [filters, sortBy, cars, loading, filterCars]);

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: null,
      category: null,
      make: null,
      model: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
      searchQuery: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== null && v !== '').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-36 lg:pt-56 pb-12">
      {/* Header */}
      <div className="section-padding mb-8">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
                Our Inventory
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
                Car Showroom
              </h1>
              <p className="text-gray-600 mt-2">
                Browse our selection of quality used cars in Cape Town and Port Elizabeth
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Results Count */}
              <span className="text-gray-500 text-sm">
                {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
              </span>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <div className="section-padding">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-6 shadow-card sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-lg">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-king-cyan hover:text-king-blue transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label
                        key={location}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="location"
                          checked={filters.location === location}
                          onChange={() => handleFilterChange('location', location)}
                          className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                        />
                        <span className={`text-sm group-hover:text-king-blue transition-colors ${filters.location === location ? 'text-king-blue font-medium' : 'text-gray-600'
                          }`}>
                          {location}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="location"
                        checked={filters.location === null}
                        onChange={() => handleFilterChange('location', null)}
                        className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-king-blue transition-colors">
                        All Locations
                      </span>
                    </label>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === category}
                          onChange={() => handleFilterChange('category', category)}
                          className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                        />
                        <span className={`text-sm group-hover:text-king-blue transition-colors ${filters.category === category ? 'text-king-blue font-medium' : 'text-gray-600'
                          }`}>
                          {category}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === null}
                        onChange={() => handleFilterChange('category', null)}
                        className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-king-blue transition-colors">
                        All Categories
                      </span>
                    </label>
                  </div>
                </div>

                {/* Make Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Make</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {makes.map((make) => (
                      <label
                        key={make}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="make"
                          checked={filters.make === make}
                          onChange={() => handleFilterChange('make', make)}
                          className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                        />
                        <span className={`text-sm group-hover:text-king-blue transition-colors ${filters.make === make ? 'text-king-blue font-medium' : 'text-gray-600'
                          }`}>
                          {make}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="make"
                        checked={filters.make === null}
                        onChange={() => handleFilterChange('make', null)}
                        className="w-4 h-4 text-king-blue border-gray-300 focus:ring-king-cyan"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-king-blue transition-colors">
                        All Makes
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-4 mb-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-king-blue text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Search Input */}
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search cars..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all"
                  />
                </div>

                {/* Sort & View */}
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="appearance-none px-4 py-2 pr-10 rounded-xl border border-gray-200 bg-white focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none transition-all text-sm"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="year-desc">Year: Newest First</option>
                      <option value="mileage-asc">Mileage: Low to High</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                        ? 'bg-white text-king-blue shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                        ? 'bg-white text-king-blue shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <AnimatedSection>
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.location && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-king-blue/10 text-king-blue rounded-full text-sm">
                      {filters.location}
                      <button
                        onClick={() => handleFilterChange('location', null)}
                        className="hover:bg-king-blue/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-king-blue/10 text-king-blue rounded-full text-sm">
                      {filters.category}
                      <button
                        onClick={() => handleFilterChange('category', null)}
                        className="hover:bg-king-blue/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.make && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-king-blue/10 text-king-blue rounded-full text-sm">
                      {filters.make}
                      <button
                        onClick={() => handleFilterChange('make', null)}
                        className="hover:bg-king-blue/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Cars Grid/List */}
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CarCard
                      car={car}
                      onClick={onCarClick}
                      isFavourite={favourites.includes(car.id)}
                      onToggleFavourite={() => onToggleFavourite(car.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <AnimatedSection>
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SlidersHorizontal className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${showMobileFilters ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setShowMobileFilters(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl transition-transform ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-display font-semibold text-lg">Filters</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
            {/* Location Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Location</h4>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleFilterChange('location', filters.location === location ? null : location)}
                    className={`filter-tag ${filters.location === location ? 'filter-tag-active' : ''}`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', filters.category === category ? null : category)}
                    className={`filter-tag ${filters.category === category ? 'filter-tag-active' : ''}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Make Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Make</h4>
              <div className="flex flex-wrap gap-2">
                {makes.map((make) => (
                  <button
                    key={make}
                    onClick={() => handleFilterChange('make', filters.make === make ? null : make)}
                    className={`filter-tag ${filters.make === make ? 'filter-tag-active' : ''}`}
                  >
                    {make}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 btn-primary py-3"
              >
                Show {filteredCars.length} Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
