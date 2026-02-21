export interface Car {
  id: string; // Changed from number as App.tsx treats ID as string for favourites
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  fuelType: string;
  transmission: string;
  color: string;
  image: string;
  featured: boolean;
  category: string;
}

export interface InventoryData {
  cars: Car[];
}

export type Page = 'home' | 'showroom' | 'sell-your-car' | 'finance' | 'about' | 'car-details' | 'favourites';

export interface FormData {
  year: string;
  make: string;
  model: string;
  mileage: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface FilterState {
  location: string | null;
  category: string | null;
  make: string | null;
  model: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  maxMileage: number | null;
  searchQuery: string;
}
