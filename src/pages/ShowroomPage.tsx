import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Grid, List as ListIcon, X } from 'lucide-react';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import type { FilterState } from '@/types';
import { SEO } from '@/components/SEO';

interface ShowroomPageProps {
  favourites: string[];
  onToggleFavourite: (carId: string) => void;
}

export function ShowroomPage({ favourites, onToggleFavourite }: ShowroomPageProps) {
  const { inventory, loading, getUniqueMakes, getUniqueCategories, getUniqueLocations } = useInventory();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    make: null,
    model: null,
    minPrice: null,
    maxPrice: null,
    minYear: null,
    maxYear: null,
    maxMileage: null,
    category: null,
    location: null,
  });

  // Filter Options
  const makes = getUniqueMakes();
  const categories = getUniqueCategories();
  const locations = getUniqueLocations();

  // Load filters from sessionStorage on mount
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('homeSearchFilters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
      sessionStorage.removeItem('homeSearchFilters'); // Clear after using
    }
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      make: null,
      model: null,
      minPrice: null,
      maxPrice: null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
      category: null,
      location: null,
    });
  };

  // Filter Logic
  const filteredCars = inventory.filter(car => {
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const match =
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query);
      if (!match) return false;
    }

    if (filters.make && car.make !== filters.make) return false;
    if (filters.category && car.category !== filters.category) return false;
    if (filters.location && car.location !== filters.location) return false;
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxYear && car.year > filters.maxYear) return false;
    if (filters.maxMileage && car.mileage > filters.maxMileage) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <SEO
        title="Showroom"
        description="Browse our extensive collection of premium quality used vehicles. Each car is thoroughly inspected and comes with our quality guarantee."
      />
      {/* Header Section */}
      <div className="bg-king-blue text-white py-12">
        <div className="section-padding">
          <h1 className="font-display font-bold text-4xl mb-4">Our Showroom</h1>
          <p className="text-blue-100 max-w-2xl">
            Browse our extensive collection of premium quality used vehicles.
            Each car is thoroughly inspected and comes with our quality guarantee.
          </p>
        </div>
      </div>

      <div className="section-padding py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <span className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-king-blue" />
              Filters
            </span>
            <span className="bg-king-blue text-white text-xs px-2 py-1 rounded-full">
              {filteredCars.length} results
            </span>
          </button>

          {/* Filters Sidebar */}
          <aside className={`
            fixed inset-0 z-50 bg-white lg:bg-transparent lg:static lg:w-1/4 lg:block
            overflow-y-auto lg:overflow-visible transition-transform duration-300
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-lg">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-6 bg-white rounded-2xl shadow-sm border border-gray-200 space-y-6">
              {/* Search */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Make, model, or keyword..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Make & Category */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Make</label>
                  <select
                    value={filters.make || ''}
                    onChange={(e) => handleFilterChange('make', e.target.value || null)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm bg-white"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || null)}
                    className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value || null)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm bg-white text-gray-600"
                    >
                      <option value="">All Locations</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={filters.minYear || ''}
                    onChange={(e) => handleFilterChange('minYear', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={filters.maxYear || ''}
                    onChange={(e) => handleFilterChange('maxYear', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-king-cyan focus:ring-2 focus:ring-king-cyan/20 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2.5 text-king-blue font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-king-blue/30"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found <span className="font-bold text-gray-900">{filteredCars.length}</span> vehicles
              </p>

              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                    ? 'bg-king-blue text-white'
                    : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                    ? 'bg-king-blue text-white'
                    : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Car Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className={`
                ${viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-6'}
              `}>
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CarCard
                      car={car}
                      isFavourite={favourites.includes(car.id)}
                      onToggleFavourite={() => onToggleFavourite(car.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Try adjusting your filters or search criteria to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
