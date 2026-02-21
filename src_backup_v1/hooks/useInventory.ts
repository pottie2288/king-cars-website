import { useState, useEffect, useCallback } from 'react';
import type { Car, FilterState } from '@/types';

export function useInventory() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/inventory.json');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const data = await response.json();
        // Ensure IDs are strings
        const carsData = Array.isArray(data.cars) ? data.cars : [];
        const carsWithStringIds = carsData.map((car: any) => ({
          ...car,
          id: String(car.id)
        }));
        setCars(carsWithStringIds);
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
      // Exact matches
      if (filters.location && car.location !== filters.location) return false;
      if (filters.category && car.category !== filters.category) return false;
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;

      // Range matches
      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      if (filters.maxMileage && car.mileage > filters.maxMileage) return false;

      // Text search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchString = `${car.make} ${car.model} ${car.year} ${car.location}`.toLowerCase();
        if (!searchString.includes(query)) {
          return false;
        }
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

  return {
    cars,
    loading,
    error,
    filterCars,
    getFeaturedCars,
    getCarById,
    getUniqueMakes,
    getUniqueModels,
    getUniqueCategories,
  };
}
