/** VMG raw API response shape for a single vehicle */
export interface VmgVehicle {
  stock_id: number;
  company_id: number;
  branch_guid: string;
  stock_code: string;
  mmcode: string;
  variant: string;
  series: string;
  make: string;
  selling_price: number;
  year: number;
  mileage: number;
  date_created: string;
  date_updated: string;
  description: string;
  condition: string;
  colour: string;
  province: string;
  suburb: string;
  location: string;
  extras_csv: string;
  body_type: string;
  finance_url: string;
  video_url: string;
  image_count: number;
  used: boolean;
  url1: string;
  url2: string;
  url3: string;
  url4: string;
  url5: string;
  url6: string;
  url7: string;
  url8: string;
  url9: string;
  url10: string;
  url11: string;
  url12: string;
  url13: string;
  url14: string;
  url15: string;
  url16: string;
  url17: string;
  url18: string;
  url19: string;
  url20: string;
  fuel_type: string;
  height: number;
  width: number;
  length: number;
  gears: number;
  transmission: string;
  cooling: string;
  front_tyre_size: string;
  rear_tyre_size: string;
  axle_configuration: string;
  tare: number;
  gvm: number;
  gcm: number;
  seats: number;
  doors: number;
  kilowatts: number;
  cubic_capacity: number;
  fuel_tank_size: number;
  co2: number;
  premium: number;
  interior_360_video_url: string;
  exterior_360_video_url: string;
  minimum_selling_price: number;
  service_history: string;
  vin_number: string;
  branch: string;
}

/** Normalised car object used throughout the app */
export interface Car {
  id: string;
  stockCode: string;
  make: string;
  model: string;       // VMG "series" (e.g. "KONA")
  variant: string;     // VMG "variant" (e.g. "KONA 1.6TGDI N-LINE DCT")
  year: number;
  price: number;
  mileage: number;
  location: string;    // Province (e.g. "Western Cape")
  branch: string;      // Specific branch (e.g. "F/P King Cars VREDEKLOOF")
  fuelType: string;    // Human-readable (e.g. "Petrol")
  transmission: string; // Human-readable (e.g. "Automatic")
  color: string;
  image: string;       // Primary image URL
  images: string[];    // All available image URLs
  featured: boolean;
  category: string;    // Body type (e.g. "SUV")
  features: string[];  // Extras split from extras_csv
  condition: string;
  seats: number;
  doors: number;
  kilowatts: number;
  cubicCapacity: number;
  fuelTankSize: number;
  gears: number;
  axleConfig: string;
  serviceHistory: string;
  co2: number;
  used: boolean;
  videoUrl: string;
  interior360Url: string;
  exterior360Url: string;
  dateUpdated: string;
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
  /** Exact door count match. Used to distinguish Single Cab (2) from Double Cab (4). */
  doors: number | null;
  searchQuery: string;
}
