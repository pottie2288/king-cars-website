'use client'

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, MapPin, Grid, List as ListIcon, X, ChevronDown, Car as CarIcon, Shapes } from 'lucide-react';
import { MAKE_LOGOS } from '@/lib/car-logos';
import { Slider } from '@/components/ui/slider';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { useFavourites } from '@/context/FavouritesContext';
import type { FilterState } from '@/types';

const PAGE_SIZE = 12;
const MAX_PRICE = 1_000_000;
const MIN_YEAR = 2005;
const MAX_YEAR = new Date().getFullYear();

type OpenFilter = 'make' | 'model' | 'category' | 'location' | null;

function BrandLogo({ make, size = 28, inverted = false }: { make: string; size?: number; inverted?: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = MAKE_LOGOS[make];
  if (failed || !src) {
    return (
      <span
        style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
        className={`inline-flex items-center justify-center rounded-full font-bold flex-shrink-0 uppercase leading-none ${
          inverted ? 'bg-white/20 text-white' : 'bg-king-blue/10 text-king-blue'
        }`}
      >
        {make.slice(0, 2)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={make}
      onError={() => setFailed(true)}
      className="object-contain flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function ShowroomPage() {
  const { inventory, loading, getUniqueMakes, getUniqueModels, getUniqueCategories, getUniqueLocations } = useInventory();
  const { favourites, toggleFavourite } = useFavourites();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [yearRange, setYearRange] = useState<[number, number]>([MIN_YEAR, MAX_YEAR]);
  const searchParams = useSearchParams();

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
    doors: null,
  });

  const makes = getUniqueMakes();
  const models = filters.make ? getUniqueModels(filters.make) : [];
  const categories = getUniqueCategories();
  const locations = getUniqueLocations();

  useEffect(() => {
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const doors = searchParams.get('doors');
    const maxPrice = searchParams.get('maxPrice');
    const q = searchParams.get('q');

    const hasUrlFilters = make || model || location || category || doors || maxPrice || q;

    if (hasUrlFilters) {
      const urlFilters: FilterState = {
        searchQuery: q || '',
        make: make || null,
        model: model || null,
        location: location || null,
        category: category || null,
        doors: doors ? parseInt(doors) : null,
        minPrice: null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        minYear: null,
        maxYear: null,
        maxMileage: null,
      };
      setFilters(urlFilters);
      setPriceRange([0, urlFilters.maxPrice ?? MAX_PRICE]);
      setYearRange([MIN_YEAR, MAX_YEAR]);
    } else {
      const stored = sessionStorage.getItem('showroomFilters');
      if (stored) {
        const parsed: FilterState = JSON.parse(stored);
        setFilters(parsed);
        setPriceRange([parsed.minPrice ?? 0, parsed.maxPrice ?? MAX_PRICE]);
        setYearRange([parsed.minYear ?? MIN_YEAR, parsed.maxYear ?? MAX_YEAR]);
      }
    }
  }, [searchParams]);

  // When inventory loads, check if the URL `q` param is a known make.
  // If so, promote it to the make filter so the user lands with Make pre-selected.
  useEffect(() => {
    if (!makes.length) return;
    const q = searchParams.get('q');
    if (!q || searchParams.get('make')) return;
    const matched = makes.find(m => m.toLowerCase() === q.trim().toLowerCase());
    if (!matched) return;
    setFilters(prev => {
      if (prev.searchQuery.toLowerCase() !== q.trim().toLowerCase()) return prev;
      return { ...prev, make: matched, searchQuery: '' };
    });
  }, [makes, searchParams]);

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'make') next.model = null;
      if (key === 'category') next.doors = null;
      sessionStorage.setItem('showroomFilters', JSON.stringify(next));
      return next;
    });
  };

  const defaultFilters: FilterState = {
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
    doors: null,
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPriceRange([0, MAX_PRICE]);
    setYearRange([MIN_YEAR, MAX_YEAR]);
    sessionStorage.removeItem('showroomFilters');
    setVisibleCount(PAGE_SIZE);
    setOpenFilter(null);
  };

  const handlePriceChange = (values: number[]) => {
    const [min, max] = values;
    setPriceRange([min, max]);
    setFilters(prev => {
      const next = {
        ...prev,
        minPrice: min > 0 ? min : null,
        maxPrice: max < MAX_PRICE ? max : null,
      };
      sessionStorage.setItem('showroomFilters', JSON.stringify(next));
      return next;
    });
  };

  const handleYearChange = (values: number[]) => {
    const [min, max] = values;
    setYearRange([min, max]);
    setFilters(prev => {
      const next = {
        ...prev,
        minYear: min > MIN_YEAR ? min : null,
        maxYear: max < MAX_YEAR ? max : null,
      };
      sessionStorage.setItem('showroomFilters', JSON.stringify(next));
      return next;
    });
  };

  const formatPrice = (p: number) =>
    p >= MAX_PRICE ? 'R 1M+' : `R ${p.toLocaleString('en-ZA')}`;

  const filteredCars = useMemo(() => {
    return inventory.filter(car => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const match =
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.variant.toLowerCase().includes(query) ||
          car.category.toLowerCase().includes(query);
        if (!match) return false;
      }
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.category && car.category !== filters.category) return false;
      if (filters.doors != null && car.doors !== filters.doors) return false;
      if (filters.location && car.location !== filters.location) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.maxMileage && car.mileage > filters.maxMileage) return false;
      return true;
    });
  }, [inventory, filters]);

  const hasActiveFilters =
    !!filters.searchQuery ||
    filters.make !== null ||
    filters.model !== null ||
    filters.category !== null ||
    filters.location !== null ||
    filters.doors !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minYear !== null ||
    filters.maxYear !== null ||
    filters.maxMileage !== null;

  const carsToShow = hasActiveFilters ? filteredCars : filteredCars.slice(0, visibleCount);

  // ── shared item class helper ─────────────────────────────────────────
  const itemCls = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
      active ? 'bg-king-blue text-white' : 'text-gray-700 hover:bg-gray-50'
    }`;

  // ── filter dropdown factory (accordion, no absolute positioning) ─────
  const filterDropdown = (
    field: OpenFilter,
    trigger: React.ReactNode,
    body: React.ReactNode,
    disabled?: boolean,
  ) => (
    <div>
      <button
        onClick={() => !disabled && setOpenFilter(openFilter === field ? null : field)}
        disabled={disabled}
        className={`w-full h-[48px] px-4 bg-white rounded-2xl flex items-center gap-2.5 text-sm font-medium shadow-sm transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : openFilter === field
            ? 'ring-2 ring-king-cyan/50'
            : 'hover:ring-1 hover:ring-white/50 cursor-pointer'
        }`}
      >
        {trigger}
        {!disabled && (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
              openFilter === field ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {/* Accordion expand — grid-template-rows avoids overflow:hidden + border-radius conflict */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out mt-1"
        style={{ gridTemplateRows: openFilter === field ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="max-h-[55vh] overflow-y-auto overscroll-contain py-1.5 px-1.5">
              {body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── complete filter panel (shared between mobile overlay + desktop sidebar) ──
  const filterPanel = (
    <div className="space-y-5">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white ml-1">Search</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Make, model, or keyword..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 h-[48px] rounded-2xl border-0 focus:ring-2 focus:ring-king-cyan/50 outline-none text-sm bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="h-px bg-white/10" />

      {/* Make */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white ml-1">Make</label>
        {filterDropdown(
          'make',
          filters.make ? (
            <span className="flex items-center gap-2.5 flex-1 min-w-0">
              <BrandLogo make={filters.make} size={22} />
              <span className="truncate text-gray-800 font-semibold">{filters.make}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2.5 flex-1">
              <CarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-400">All Makes</span>
            </span>
          ),
          <>
            {filters.make && (
              <button
                onClick={() => { handleFilterChange('make', null); setOpenFilter(null); }}
                className={itemCls(false)}
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                  <CarIcon className="w-3.5 h-3.5 text-gray-400" />
                </span>
                All Makes
              </button>
            )}
            {makes.map(make => (
              <button
                key={make}
                onClick={() => { handleFilterChange('make', make); setOpenFilter(null); }}
                className={itemCls(filters.make === make)}
              >
                <BrandLogo make={make} size={28} inverted={filters.make === make} />
                {make}
              </button>
            ))}
          </>,
        )}
      </div>

      {/* Model */}
      <div className="space-y-2">
        <label className={`text-sm font-semibold ml-1 transition-colors ${filters.make ? 'text-white' : 'text-white/40'}`}>
          Model
        </label>
        {filterDropdown(
          'model',
          <span className={`flex-1 text-left ${!filters.make ? 'text-gray-300' : filters.model ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>
            {filters.model || 'All Models'}
          </span>,
          <>
            {filters.model && (
              <button
                onClick={() => { handleFilterChange('model', null); setOpenFilter(null); }}
                className={itemCls(false)}
              >
                All Models
              </button>
            )}
            {models.map(model => (
              <button
                key={model}
                onClick={() => { handleFilterChange('model', model); setOpenFilter(null); }}
                className={itemCls(filters.model === model)}
              >
                {model}
              </button>
            ))}
          </>,
          !filters.make,
        )}
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white ml-1">Body Type</label>
        {filterDropdown(
          'category',
          <span className="flex items-center gap-2.5 flex-1">
            <Shapes className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={filters.category ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
              {filters.category || 'All Body Types'}
            </span>
          </span>,
          <>
            {filters.category && (
              <button
                onClick={() => { handleFilterChange('category', null); setOpenFilter(null); }}
                className={itemCls(false)}
              >
                All Body Types
              </button>
            )}
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { handleFilterChange('category', cat); setOpenFilter(null); }}
                className={itemCls(filters.category === cat)}
              >
                {cat}
              </button>
            ))}
          </>,
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white ml-1">Location</label>
        {filterDropdown(
          'location',
          <span className="flex items-center gap-2.5 flex-1">
            <MapPin className={`w-4 h-4 flex-shrink-0 ${filters.location ? 'text-king-blue' : 'text-gray-400'}`} />
            <span className={filters.location ? 'text-gray-800 font-semibold' : 'text-gray-400'}>
              {filters.location || 'All Locations'}
            </span>
          </span>,
          <>
            {filters.location && (
              <button
                onClick={() => { handleFilterChange('location', null); setOpenFilter(null); }}
                className={itemCls(false)}
              >
                All Locations
              </button>
            )}
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => { handleFilterChange('location', loc); setOpenFilter(null); }}
                className={itemCls(filters.location === loc)}
              >
                {loc}
              </button>
            ))}
          </>,
        )}
      </div>

      <div className="h-px bg-white/10" />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white ml-1">Price Range</label>
          <span className="text-xs font-semibold text-king-cyan tabular-nums">
            {priceRange[0] === 0 && priceRange[1] === MAX_PRICE
              ? 'Any price'
              : priceRange[0] === 0
              ? `Up to ${formatPrice(priceRange[1])}`
              : priceRange[1] === MAX_PRICE
              ? `From ${formatPrice(priceRange[0])}`
              : `${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`}
          </span>
        </div>
        <div className="px-1">
          <Slider
            min={0}
            max={MAX_PRICE}
            step={25_000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="[&_[data-slot=slider-range]]:bg-king-cyan [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-king-blue [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:bg-white/20"
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-white/40 px-1">
          <span>R 0</span>
          <span>R 1M+</span>
        </div>
      </div>

      {/* Year Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white ml-1">Year</label>
          <span className="text-xs font-semibold text-king-cyan tabular-nums">
            {yearRange[0] === MIN_YEAR && yearRange[1] === MAX_YEAR
              ? 'Any year'
              : yearRange[0] === MIN_YEAR
              ? `Up to ${yearRange[1]}`
              : yearRange[1] === MAX_YEAR
              ? `From ${yearRange[0]}`
              : `${yearRange[0]} – ${yearRange[1]}`}
          </span>
        </div>
        <div className="px-1">
          <Slider
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={yearRange}
            onValueChange={handleYearChange}
            className="[&_[data-slot=slider-range]]:bg-king-cyan [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-king-blue [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:bg-white/20"
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-white/40 px-1">
          <span>{MIN_YEAR}</span>
          <span>{MAX_YEAR}</span>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2.5 text-white font-medium text-sm hover:bg-white/10 rounded-xl transition-colors border border-dashed border-white/30"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
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
            fixed inset-0 z-50 lg:z-10 bg-king-blue lg:bg-transparent lg:static lg:w-1/4 lg:block
            overflow-y-auto lg:overflow-visible lg:sticky lg:top-24
            transition-transform duration-300
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-king-blue z-10">
              <h2 className="font-bold text-lg text-white">Filters</h2>
              <button
                onClick={() => { setShowMobileFilters(false); setOpenFilter(null); }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 lg:p-8 lg:bg-king-blue rounded-none lg:rounded-xl lg:shadow-xl border-none lg:border lg:border-white/10">
              {filterPanel}
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
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-king-blue text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-king-blue text-white' : 'text-gray-500 hover:text-gray-900'}`}
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
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }>
                  {carsToShow.map((car, index) => (
                    <div
                      key={car.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${(index % PAGE_SIZE) * 50}ms` }}
                    >
                      <CarCard
                        car={car}
                        isFavourite={favourites.includes(car.id)}
                        onToggleFavourite={() => toggleFavourite(car.id)}
                        viewMode={viewMode}
                      />
                    </div>
                  ))}
                </div>

                {!hasActiveFilters && visibleCount < filteredCars.length && (
                  <div className="flex flex-col items-center gap-3 mt-10">
                    <p className="text-sm text-gray-400">
                      Showing {visibleCount} of {filteredCars.length} vehicles
                    </p>
                    <button
                      onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-king-blue text-king-blue font-semibold hover:bg-king-blue hover:text-white transition-all duration-200 shadow-sm"
                    >
                      Load More
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Try adjusting your filters or search criteria to find what you&apos;re looking for.
                </p>
                <button onClick={clearFilters} className="btn-primary">
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
