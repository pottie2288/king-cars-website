import { ArrowLeft, MapPin, Fuel, Settings, Gauge, Calendar, Palette, Tag, Check, Phone, MessageSquare, Heart } from 'lucide-react';
import type { Car } from '@/types';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FinanceCalculator } from '@/components/FinanceCalculator';

interface CarDetailsPageProps {
    car: Car;
    onBack: () => void;
    isFavourite?: boolean;
    onToggleFavourite?: () => void;
}

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

// Extracted component to reuse on mobile and desktop
function CarPriceCard({ car }: { car: Car }) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-card">
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
                {car.make} {car.model}
            </h1>
            <p className="text-gray-500 mb-6">{car.year} • {car.transmission} • {car.fuelType}</p>

            <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-bold text-4xl text-king-blue">
                    {formatPrice(car.price)}
                </span>
                <span className="text-gray-500 text-sm">incl. VAT</span>
            </div>

            <div className="space-y-4">
                <button className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                    <Phone className="w-5 h-5" />
                    Call Dealership
                </button>
                <button className="w-full bg-white border-2 border-king-blue text-king-blue px-6 py-4 rounded-xl font-display font-semibold hover:bg-king-blue/5 transition-all duration-300 flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Enquire Now
                </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Available at</p>
                        <p className="text-gray-600">King Cars {car.location}</p>
                        <p className="text-sm text-gray-500 mt-1">Free delivery within 50km</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CarDetailsPage({ car, onBack, isFavourite = false, onToggleFavourite }: CarDetailsPageProps) {
    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat('en-ZA').format(mileage);
    };

    const features = [
        'Air Conditioning',
        'Power Steering',
        'Electric Windows',
        'Central Locking',
        'ABS Brakes',
        'Airbags',
        'Bluetooth Connectivity',
        'USB Port',
        'Service History',
        'Spare Key'
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="section-padding">
                {/* Back Button */}
                <AnimatedSection className="mb-8 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-king-blue transition-all group bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Showroom</span>
                    </button>

                    <button
                        onClick={onToggleFavourite}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all shadow-sm ${isFavourite
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavourite ? 'fill-current' : ''}`} />
                        <span className="font-medium">{isFavourite ? 'Saved to Favourites' : 'Add to Favourites'}</span>
                    </button>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Section */}
                        <AnimatedSection>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-card p-2">
                                <div className="relative aspect-video rounded-2xl overflow-hidden">
                                    <img
                                        src={car.image}
                                        alt={`${car.make} ${car.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {car.featured && (
                                        <div className="absolute top-4 left-4 bg-king-cyan text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                            FEATURED VEHICLE
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimatedSection>



                        {/* Mobile Price Card - Visible only on mobile */}
                        <div className="lg:hidden">
                            <AnimatedSection>
                                <CarPriceCard car={car} />
                            </AnimatedSection>
                        </div>

                        {/* Specs Grid */}
                        <AnimatedSection>
                            <div className="bg-white rounded-2xl p-8 shadow-card">
                                <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Vehicle Specifications</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Calendar className="w-4 h-4 text-king-cyan" />
                                            Year
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.year}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Gauge className="w-4 h-4 text-king-cyan" />
                                            Mileage
                                        </div>
                                        <p className="font-semibold text-gray-900">{formatMileage(car.mileage)} km</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Fuel className="w-4 h-4 text-king-cyan" />
                                            Fuel Type
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.fuelType}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Settings className="w-4 h-4 text-king-cyan" />
                                            Transmission
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.transmission}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Palette className="w-4 h-4 text-king-cyan" />
                                            Color
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.color}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Tag className="w-4 h-4 text-king-cyan" />
                                            Category
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.category}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <MapPin className="w-4 h-4 text-king-cyan" />
                                            Location
                                        </div>
                                        <p className="font-semibold text-gray-900">{car.location}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Description / Features */}
                        <AnimatedSection>
                            <div className="bg-white rounded-2xl p-8 shadow-card">
                                <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Features & Options</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 text-king-blue" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <AnimatedSection>
                            <div className="sticky top-28 space-y-8">
                                {/* Desktop Price Card - Hidden on mobile */}
                                <div className="hidden lg:block">
                                    <CarPriceCard car={car} />
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Finance Calculator */}
                        <AnimatedSection className="mt-8">
                            <FinanceCalculator vehiclePrice={car.price} />
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </div >
    );
}
