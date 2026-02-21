import { MapPin, Fuel, Settings, Gauge, Heart } from 'lucide-react';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
  onClick?: (car: Car) => void;
  isFavourite?: boolean;
  onToggleFavourite?: (e: React.MouseEvent) => void;
}

export function CarCard({ car, onClick, isFavourite = false, onToggleFavourite }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-ZA').format(mileage);
  };

  return (
    <div
      className="card-vehicle group cursor-pointer hover-lift shadow-md border border-gray-200 rounded-2xl bg-white"
      onClick={() => onClick?.(car)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute bottom-3 right-3 bg-king-cyan text-white text-xs font-bold px-3 py-1.5 rounded-full">
            FEATURED
          </div>
        )}
        {/* Location Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-king-blue text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {car.location}
        </div>
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-king-blue/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          {car.category}
        </div>
        {/* Favourite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite?.(e);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isFavourite
            ? 'bg-red-500 text-white shadow-md scale-110'
            : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-500'
            }`}
        >
          <Heart className={`w-4 h-4 ${isFavourite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-gray-900 mb-1 group-hover:text-king-blue transition-colors">
          {car.make} {car.model}
        </h3>
        <p className="text-gray-500 text-sm mb-4">{car.year} • {car.color}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Fuel className="w-4 h-4 text-king-cyan" />
            <span className="text-xs">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Settings className="w-4 h-4 text-king-cyan" />
            <span className="text-xs">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Gauge className="w-4 h-4 text-king-cyan" />
            <span className="text-xs">{formatMileage(car.mileage)} km</span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Price</p>
              <p className="font-display font-bold text-xl text-king-blue">
                {formatPrice(car.price)}
              </p>
            </div>
            <button className="px-4 py-2 bg-king-blue text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-all shine-effect click-press group-hover:shadow-md">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
