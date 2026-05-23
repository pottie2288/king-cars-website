'use client'

import { useState, useEffect, useRef } from 'react';
import { Search, Check, ChevronDown, Car, MapPin } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { MAKE_LOGOS } from '@/lib/car-logos';
import type { FilterState } from '@/types';

type OpenField = 'make' | 'model' | 'price' | 'location' | null;
const MAX_PRICE = 1_000_000;

interface SearchBarProps {
  onSearch: (filters: FilterState) => void;
  makes?: string[];
  locations?: string[];
  getUniqueModels: (make: string) => string[];
}

// Defined outside to avoid remount on every render
function BrandLogo({ make, size = 24 }: { make: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const src = MAKE_LOGOS[make];

  if (failed || !src) {
    return (
      <span
        style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
        className="inline-flex items-center justify-center rounded-full bg-king-blue/10 text-king-blue font-bold flex-shrink-0 uppercase leading-none"
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
      decoding="async"
      onError={() => setFailed(true)}
      className="object-contain flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}


export function SearchBar({ onSearch, makes = [], locations = [], getUniqueModels }: SearchBarProps) {
  const [openField, setOpenField] = useState<OpenField>(null);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [maxPriceValue, setMaxPriceValue] = useState(MAX_PRICE);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedMake) {
      setAvailableModels(getUniqueModels(selectedMake));
      setSelectedModel('');
    } else {
      setAvailableModels([]);
      setSelectedModel('');
    }
  }, [selectedMake, getUniqueModels]);

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenField(null);
      }
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);


  const toggle = (f: OpenField) => setOpenField(p => (p === f ? null : f));
  const close = () => setOpenField(null);

  const handleSearch = () => {
    onSearch({
      searchQuery: '',
      location: selectedLocation || null,
      make: selectedMake || null,
      model: selectedModel || null,
      minPrice: null,
      maxPrice: maxPriceValue < MAX_PRICE ? maxPriceValue : null,
      minYear: null,
      maxYear: null,
      maxMileage: null,
      category: null,
      doors: null,
    });
    close();
  };

  const priceLabel =
    maxPriceValue < MAX_PRICE ? `R ${maxPriceValue.toLocaleString('en-ZA')}` : 'Max Price';

  // ── shared content blocks (JSX factories, not components) ──────────

  const makesBody = (onPick: () => void) => (
    <div className="p-3 pb-3">
      {selectedMake && (
        <button
          onClick={() => { setSelectedMake(''); onPick(); }}
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl mb-0.5 active:bg-king-blue/5 text-gray-700"
        >
          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Car className="w-4 h-4 text-gray-400" />
          </span>
          <span className="text-[15px] font-semibold flex-1 text-left">All Makes</span>
        </button>
      )}
      <div className="flex flex-col">
        {makes.map((make) => (
          <button
            key={make}
            onClick={() => { setSelectedMake(make); onPick(); }}
            className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-left ${
              selectedMake === make
                ? 'bg-king-blue/10 text-king-blue'
                : 'text-gray-700 active:bg-king-blue/5'
            }`}
          >
            <BrandLogo make={make} size={32} />
            <span className="text-[15px] font-semibold flex-1">{make}</span>
            {selectedMake === make && <Check className="w-4 h-4 flex-shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );

  const modelsBody = (onPick: () => void) => (
    <div className="p-3">
      <div className="flex flex-wrap gap-1.5">
        {[...(selectedModel ? [{ label: 'All Models', value: '' }] : []), ...availableModels.map(m => ({ label: m, value: m }))].map(
          ({ label, value }) => (
            <button
              key={label}
              onClick={() => { setSelectedModel(value); onPick(); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedModel === value
                  ? 'bg-king-blue/10 text-king-blue ring-1 ring-king-blue/20'
                  : 'text-gray-700 hover:bg-king-blue/5'
              }`}
            >
              {label}
              {selectedModel === value && <Check className="w-3 h-3" />}
            </button>
          )
        )}
      </div>
    </div>
  );

  const priceBody = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Max Price</span>
        <span className={`text-sm font-bold tabular-nums ${maxPriceValue < MAX_PRICE ? 'text-king-blue' : 'text-gray-400'}`}>
          {maxPriceValue < MAX_PRICE ? `R ${maxPriceValue.toLocaleString('en-ZA')}` : 'No limit'}
        </span>
      </div>
      <Slider
        min={0}
        max={MAX_PRICE}
        step={25_000}
        value={[maxPriceValue]}
        onValueChange={(v) => setMaxPriceValue(v[0])}
        className="[&_[data-slot=slider-range]]:bg-king-blue [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-king-blue [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-track]]:bg-gray-200"
      />
      <div className="flex justify-between text-xs font-medium text-gray-400">
        <span>R 0</span><span>R 1 000 000+</span>
      </div>
      {maxPriceValue < MAX_PRICE && (
        <button
          onClick={() => setMaxPriceValue(MAX_PRICE)}
          className="text-xs font-medium text-gray-400 hover:text-king-blue transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );

  const locationsBody = (onPick: () => void) => (
    <div className="p-3">
      <div className="flex flex-wrap gap-1.5">
        {[...(selectedLocation ? [{ label: 'All Locations', value: '' }] : []), ...locations.map(l => ({ label: l, value: l }))].map(
          ({ label, value }) => (
            <button
              key={label}
              onClick={() => { setSelectedLocation(value); onPick(); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedLocation === value
                  ? 'bg-king-blue/10 text-king-blue ring-1 ring-king-blue/20'
                  : 'text-gray-700 hover:bg-king-blue/5'
              }`}
            >
              {label}
              {selectedLocation === value && <Check className="w-3 h-3" />}
            </button>
          )
        )}
      </div>
    </div>
  );

  // ── desktop absolute dropdown panel ───────────────────────────────
  const ddPanel = (field: OpenField, w: number, body: React.ReactNode) => (
    <div
      className={`absolute left-0 z-50 bg-white rounded-2xl border border-gray-100 overflow-hidden
        shadow-[0_8px_30px_rgba(0,0,0,0.14)]
        transition-[opacity,transform] duration-150 ease-out ${
          openField === field
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      style={{ top: 'calc(100% + 8px)', width: w }}
    >
      <div className="max-h-[320px] overflow-y-auto">{body}</div>
    </div>
  );

  // ── chevron helper ─────────────────────────────────────────────────
  const chevron = (field: OpenField, extra?: string) => (
    <ChevronDown
      className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
        openField === field ? 'rotate-180' : ''
      } ${extra ?? 'text-gray-700'}`}
      strokeWidth={2.5}
    />
  );

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto relative z-20">

      {/* ════════════════════════════════
          MOBILE  –  pill + absolute dropdowns
          ════════════════════════════════ */}
      <div className="md:hidden bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex flex-col gap-3">

        {/* Make */}
        <div className="relative w-full">
          <button
            onClick={() => toggle('make')}
            className={`w-full h-[56px] px-5 border border-gray-200 rounded-full flex items-center gap-2.5 text-left ${
              openField === 'make' ? 'bg-black/[0.02] border-king-blue/30' : ''
            }`}
          >
            {selectedMake
              ? <BrandLogo make={selectedMake} size={22} />
              : <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            <span className={`flex-1 font-bold text-sm truncate ${selectedMake ? 'text-gray-800' : 'text-gray-600'}`}>
              {selectedMake || 'All Makes'}
            </span>
            {chevron('make')}
          </button>
          {openField === 'make' && (
            <div className="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '55vh' }}>
                {makesBody(close)}
              </div>
            </div>
          )}
        </div>

        {/* Model */}
        <div className="relative w-full">
          <button
            onClick={() => selectedMake && toggle('model')}
            disabled={!selectedMake}
            className={`w-full h-[56px] px-5 border border-gray-200 rounded-full flex items-center gap-2.5 text-left ${
              !selectedMake
                ? 'bg-gray-50 cursor-not-allowed'
                : openField === 'model'
                  ? 'bg-black/[0.02] border-king-blue/30 cursor-pointer'
                  : 'cursor-pointer'
            }`}
          >
            <span className={`flex-1 font-bold text-sm truncate ${
              !selectedMake ? 'text-gray-400' : selectedModel ? 'text-gray-800' : 'text-gray-600'
            }`}>
              {selectedModel || 'All Models'}
            </span>
            {chevron('model', !selectedMake ? 'text-gray-400 opacity-60' : 'text-gray-700')}
          </button>
          {openField === 'model' && selectedMake && (
            <div className="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '45vh' }}>
                {modelsBody(close)}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="relative w-full">
          <button
            onClick={() => toggle('price')}
            className={`w-full h-[56px] px-5 border border-gray-200 rounded-full flex items-center gap-2.5 text-left ${
              openField === 'price' ? 'bg-black/[0.02] border-king-blue/30' : ''
            }`}
          >
            <span className={`flex-1 font-bold text-sm truncate ${maxPriceValue < MAX_PRICE ? 'text-king-blue' : 'text-gray-600'}`}>
              {priceLabel}
            </span>
            {chevron('price')}
          </button>
          {openField === 'price' && (
            <div className="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              {priceBody()}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="relative w-full">
          <button
            onClick={() => toggle('location')}
            className={`w-full h-[56px] px-5 border border-gray-200 rounded-full flex items-center gap-2.5 text-left ${
              openField === 'location' ? 'bg-black/[0.02] border-king-blue/30' : ''
            }`}
          >
            <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedLocation ? 'text-king-blue' : 'text-gray-400'}`} />
            <span className={`flex-1 font-bold text-sm truncate ${selectedLocation ? 'text-gray-800' : 'text-gray-600'}`}>
              {selectedLocation || 'Location'}
            </span>
            {chevron('location')}
          </button>
          {openField === 'location' && (
            <div className="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '45vh' }}>
                {locationsBody(close)}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <button
          onClick={handleSearch}
          className="w-full h-[56px] bg-king-blue hover:bg-king-cyan text-white rounded-full flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Search <Search className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>

      {/* ════════════════════════════════
          DESKTOP  –  pill + absolute dropdowns
          ════════════════════════════════ */}
      <div className="hidden md:block">
        <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3 flex items-center">

          {/* Make */}
          <div className="relative flex-1">
            <button
              onClick={() => toggle('make')}
              className={`w-full h-14 px-6 flex items-center gap-2.5 border-r border-gray-100 text-left transition-colors rounded-l-full ${
                openField === 'make' ? 'bg-black/[0.02]' : 'hover:bg-black/[0.02]'
              }`}
            >
              {selectedMake
                ? <BrandLogo make={selectedMake} size={22} />
                : <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              <span className={`flex-1 font-bold text-[15px] truncate ${selectedMake ? 'text-gray-800' : 'text-gray-600'}`}>
                {selectedMake || 'All Makes'}
              </span>
              {chevron('make')}
            </button>
            {ddPanel('make', 320, makesBody(close))}
          </div>

          {/* Model */}
          <div className="relative flex-1">
            <button
              onClick={() => selectedMake && toggle('model')}
              disabled={!selectedMake}
              className={`w-full h-14 px-6 flex items-center gap-2.5 border-r border-gray-100 text-left transition-colors ${
                !selectedMake ? 'cursor-not-allowed' : openField === 'model' ? 'bg-black/[0.02]' : 'hover:bg-black/[0.02] cursor-pointer'
              }`}
            >
              <span className={`flex-1 font-bold text-[15px] truncate ${
                !selectedMake ? 'text-gray-400' : selectedModel ? 'text-gray-800' : 'text-gray-600'
              }`}>
                {selectedModel || 'All Models'}
              </span>
              {chevron('model', !selectedMake ? 'text-gray-400 opacity-60' : 'text-gray-700')}
            </button>
            {ddPanel('model', 280, modelsBody(close))}
          </div>

          {/* Price */}
          <div className="relative flex-1">
            <button
              onClick={() => toggle('price')}
              className={`w-full h-14 px-6 flex items-center gap-2.5 border-r border-gray-100 text-left transition-colors ${
                openField === 'price' ? 'bg-black/[0.02]' : 'hover:bg-black/[0.02]'
              }`}
            >
              <span className={`flex-1 font-bold text-[15px] truncate ${maxPriceValue < MAX_PRICE ? 'text-king-blue' : 'text-gray-600'}`}>
                {priceLabel}
              </span>
              {chevron('price')}
            </button>
            {ddPanel('price', 300, priceBody())}
          </div>

          {/* Location */}
          <div className="relative flex-1">
            <button
              onClick={() => toggle('location')}
              className={`w-full h-14 px-6 flex items-center gap-2.5 text-left transition-colors ${
                openField === 'location' ? 'bg-black/[0.02]' : 'hover:bg-black/[0.02]'
              }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedLocation ? 'text-king-blue' : 'text-gray-400'}`} />
              <span className={`flex-1 font-bold text-[15px] truncate ${selectedLocation ? 'text-gray-800' : 'text-gray-600'}`}>
                {selectedLocation || 'Location'}
              </span>
              {chevron('location')}
            </button>
            {ddPanel('location', 240, locationsBody(close))}
          </div>

          {/* Search */}
          <div className="shrink-0 pl-2 pr-0">
            <button
              onClick={handleSearch}
              className="w-[60px] h-[52px] bg-king-blue hover:bg-king-cyan text-white rounded-[1rem] flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Search className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
