import { useState, useEffect, useCallback } from 'react';
import type { Car, VmgVehicle, FilterState } from '@/types';

/** Map VMG single-letter fuel codes to readable labels */
function formatFuelType(code: string): string {
  const map: Record<string, string> = {
    P: 'Petrol',
    D: 'Diesel',
    E: 'Electric',
    H: 'Hybrid',
  };
  return map[code?.toUpperCase()] ?? code ?? 'Unknown';
}

/** Map VMG single-letter transmission codes to readable labels */
function formatTransmission(code: string): string {
  const map: Record<string, string> = {
    A: 'Automatic',
    M: 'Manual',
  };
  return map[code?.toUpperCase()] ?? code ?? 'Unknown';
}

/** Capitalise first letter of each word */
function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Collect all non-empty image URLs from url1..url20 */
function collectImages(v: VmgVehicle): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const url = v[`url${i}` as keyof VmgVehicle] as string;
    if (url && url.trim() !== '') {
      urls.push(url);
    }
  }
  return urls;
}

/** Normalise body type to match our category labels */
function normaliseBodyType(raw: string): string {
  if (!raw) return 'Other';
  const upper = raw.toUpperCase();
  if (upper === 'SUV') return 'SUV';
  if (upper === 'MPV') return 'MPV';
  // Match panel vans, minibuses and kombis BEFORE the bakkie check so a
  // VMG value like "PANEL VAN BAKKIE" doesn't get swept into "Bakkie".
  if (
    upper.includes('PANEL VAN') ||
    upper.includes('MINIBUS') ||
    upper.includes('MINI BUS') ||
    upper.includes('KOMBI')
  ) {
    return 'Panel Van / Mini';
  }
  if (upper.includes('BAKKIE') || upper.includes('SINGLE CAB')) return 'Bakkie';
  if (upper === 'COMMERCIAL') return 'Commercial';
  return titleCase(raw); // Sedan, Hatchback, etc.
}

/** Transform a VMG vehicle record into our normalised Car shape */
function transformVehicle(v: VmgVehicle): Car {
  const images = collectImages(v);
  const features = v.extras_csv
    ? v.extras_csv.split(',').map((f) => f.trim()).filter(Boolean)
    : [];

  return {
    id: String(v.stock_id),
    stockCode: v.stock_code ?? '',
    make: titleCase(v.make ?? ''),
    model: titleCase(v.series ?? ''),
    variant: v.variant ?? '',
    year: v.year,
    price: v.selling_price,
    mileage: v.mileage,
    location: v.province ?? '',
    branch: v.location ?? '',
    fuelType: formatFuelType(v.fuel_type),
    transmission: formatTransmission(v.transmission),
    color: titleCase(v.colour ?? ''),
    image: images[0] ?? '',
    images,
    featured: false,
    category: normaliseBodyType(v.body_type ?? ''),
    features,
    condition: v.condition ?? '',
    seats: v.seats ?? 0,
    doors: v.doors ?? 0,
    kilowatts: v.kilowatts ?? 0,
    cubicCapacity: v.cubic_capacity ?? 0,
    fuelTankSize: v.fuel_tank_size ?? 0,
    gears: v.gears ?? 0,
    axleConfig: v.axle_configuration ?? '',
    serviceHistory: v.service_history ?? '',
    co2: v.co2 ?? 0,
    used: v.used ?? true,
    videoUrl: v.video_url ?? '',
    interior360Url: v.interior_360_video_url ?? '',
    exterior360Url: v.exterior_360_video_url ?? '',
    dateUpdated: v.date_updated ?? '',
  };
}

function markFeatured(transformed: Car[]): Car[] {
  const sorted = [...transformed].sort(
    (a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
  );
  const featuredIds = new Set(sorted.slice(0, 6).map((c) => c.id));
  return transformed.map((car) => ({ ...car, featured: featuredIds.has(car.id) }));
}

export function useInventory(initialVehicles?: VmgVehicle[]) {
  const [cars, setCars] = useState<Car[]>(() =>
    initialVehicles?.length ? markFeatured(initialVehicles.map(transformVehicle)) : []
  );
  const [loading, setLoading] = useState(!initialVehicles?.length);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const data: VmgVehicle[] = await response.json();
        const transformed = data.map(transformVehicle);
        setCars(markFeatured(transformed));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filterCars = useCallback((filters: FilterState): Car[] => {
    return cars.filter((car) => {
      if (filters.location && car.location !== filters.location) return false;
      if (filters.category && car.category !== filters.category) return false;
      if (filters.doors != null && car.doors !== filters.doors) return false;
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.maxMileage && car.mileage > filters.maxMileage) return false;

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchString = `${car.make} ${car.model} ${car.variant} ${car.year} ${car.location}`.toLowerCase();
        if (!searchString.includes(query)) return false;
      }

      return true;
    });
  }, [cars]);

  const getFeaturedCars = useCallback((): Car[] => {
    return cars.filter((car) => car.featured);
  }, [cars]);

  const getCarById = useCallback((id: string): Car | undefined => {
    return cars.find((car) => car.id === id);
  }, [cars]);

  const getUniqueMakes = useCallback((): string[] => {
    const makes = new Set(cars.map((car) => car.make));
    return Array.from(makes).sort();
  }, [cars]);

  const getUniqueModels = useCallback((make: string): string[] => {
    const models = new Set(
      cars
        .filter((car) => car.make === make)
        .map((car) => car.model)
    );
    return Array.from(models).sort();
  }, [cars]);

  const getUniqueCategories = useCallback((): string[] => {
    const categories = new Set(cars.map((car) => car.category));
    return Array.from(categories).sort();
  }, [cars]);

  const getUniqueLocations = useCallback((): string[] => {
    const locations = new Set(cars.map((car) => car.location));
    return Array.from(locations).sort();
  }, [cars]);

  return {
    cars,
    inventory: cars,
    loading,
    error,
    filterCars,
    getFeaturedCars,
    getCarById,
    getUniqueMakes,
    getUniqueModels,
    getUniqueCategories,
    getUniqueLocations,
  };
}
