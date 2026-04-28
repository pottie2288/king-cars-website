'use client'

import { useState, useEffect } from 'react';
import {
    ArrowLeft, MapPin, Calendar, Fuel, Settings,
    Share2, Heart, Phone, Mail, CheckCircle,
    ChevronLeft, ChevronRight, Gauge, Car as CarIcon,
    Users, DoorOpen, Zap, Droplets
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FinanceCalculator } from '@/components/FinanceCalculator';
import { useInventory } from '@/hooks/useInventory';
import { useFavourites } from '@/context/FavouritesContext';
import type { Car } from '@/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { cars } = useInventory();
    const { isFavourite, toggleFavourite } = useFavourites();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    const car = cars.find(c => c.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (!car) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Car not found</h2>
                    <button onClick={() => router.push('/showroom')} className="btn-primary">
                        Back to Showroom
                    </button>
                </div>
            </div>
        );
    }

    const images = car.images.length > 0 ? car.images : [car.image];

    const formatMileage = (mileage: number) => {
        return new Intl.NumberFormat('en-ZA').format(mileage);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${car.year} ${car.make} ${car.model}`,
                    text: `Check out this ${car.make} ${car.model} at King Cars!`,
                    url: window.location.href,
                });
            } catch {
                // User cancelled share
            }
        }
    };

    const handleThumbnailClick = (index: number) => {
        api?.scrollTo(index);
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Back Navigation */}
            <div className="section-padding pt-6 pb-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-king-blue transition-colors font-medium group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Showroom
                </button>
            </div>

            <div className="section-padding py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Image Gallery */}
                        <div className="relative group">
                            <Carousel setApi={setApi} className="w-full">
                                <CarouselContent className="-ml-0">
                                    {images.map((img, idx) => (
                                        <CarouselItem key={idx} className="pl-0">
                                            <div className="aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                                                <img
                                                    src={img}
                                                    alt={`${car.make} ${car.model} - View ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full z-10">
                                    {current} / {count}
                                </div>

                                <div className="hidden lg:block">
                                    <button
                                        onClick={() => api?.scrollPrev()}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => api?.scrollNext()}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </Carousel>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {images.slice(0, 12).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleThumbnailClick(idx)}
                                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${current === idx + 1 ? 'border-king-blue shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Price & Actions (Mobile Only) */}
                        <div className="lg:hidden">
                            <PriceActionsCard
                                car={car}
                                formatPrice={formatPrice}
                                formatMileage={formatMileage}
                                isFavourite={isFavourite}
                                onToggleFavourite={toggleFavourite}
                                setShowEnquiryForm={setShowEnquiryForm}
                                showEnquiryForm={showEnquiryForm}
                                handleShare={handleShare}
                            />
                        </div>

                        {/* Vehicle Overview */}
                        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                            <h2 className="font-display font-bold text-2xl mb-2">Vehicle Overview</h2>
                            <p className="text-sm text-gray-400 mb-6">{car.variant}</p>
                            <div className="prose max-w-none text-gray-600">
                                <p className="leading-relaxed">
                                    This {car.condition ? car.condition.toLowerCase() + ' condition' : 'quality'} {car.year} {car.make} {car.model} represents exceptional value.
                                    Finished in {car.color}, this {car.category} comes with {car.features.length} extras
                                    and has covered {formatMileage(car.mileage)} km.
                                    {car.serviceHistory && ` It comes with ${car.serviceHistory}.`}
                                </p>
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {car.seats > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Users className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Seats</p>
                                            <p className="font-semibold text-gray-900">{car.seats}</p>
                                        </div>
                                    </div>
                                )}
                                {car.doors > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <DoorOpen className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Doors</p>
                                            <p className="font-semibold text-gray-900">{car.doors}</p>
                                        </div>
                                    </div>
                                )}
                                {car.kilowatts > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Zap className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Power</p>
                                            <p className="font-semibold text-gray-900">{car.kilowatts} kW</p>
                                        </div>
                                    </div>
                                )}
                                {car.cubicCapacity > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <CarIcon className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Engine</p>
                                            <p className="font-semibold text-gray-900">{(car.cubicCapacity / 1000).toFixed(1)}L</p>
                                        </div>
                                    </div>
                                )}
                                {car.gears > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Settings className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Gears</p>
                                            <p className="font-semibold text-gray-900">{car.gears}-speed {car.transmission}</p>
                                        </div>
                                    </div>
                                )}
                                {car.fuelTankSize > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Droplets className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Fuel Tank</p>
                                            <p className="font-semibold text-gray-900">{car.fuelTankSize}L</p>
                                        </div>
                                    </div>
                                )}
                                {car.axleConfig && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Gauge className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">Drivetrain</p>
                                            <p className="font-semibold text-gray-900">{car.axleConfig}</p>
                                        </div>
                                    </div>
                                )}
                                {car.co2 > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Fuel className="w-5 h-5 text-king-cyan shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400">CO2</p>
                                            <p className="font-semibold text-gray-900">{car.co2} g/km</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                {[
                                    car.serviceHistory || 'Service History Available',
                                    'Roadworthy Certificate',
                                    'Finance Available',
                                    'Trade-ins Welcome'
                                ].map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features / Extras */}
                        {car.features.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                                <h2 className="font-display font-bold text-2xl mb-6">Features & Extras</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {car.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <span className="w-2 h-2 rounded-full bg-king-blue shrink-0" />
                                            <span className="text-sm font-medium text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right Column) */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="hidden lg:block">
                                <PriceActionsCard
                                    car={car}
                                    formatPrice={formatPrice}
                                    formatMileage={formatMileage}
                                    isFavourite={isFavourite}
                                    onToggleFavourite={toggleFavourite}
                                    setShowEnquiryForm={setShowEnquiryForm}
                                    showEnquiryForm={showEnquiryForm}
                                    handleShare={handleShare}
                                />
                            </div>

                            <FinanceCalculator vehiclePrice={car.price} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PriceActionsCardProps {
    car: Car;
    formatPrice: (price: number) => string;
    formatMileage: (mileage: number) => string;
    isFavourite: (id: string) => boolean;
    onToggleFavourite: (id: string) => void;
    setShowEnquiryForm: (show: boolean) => void;
    showEnquiryForm: boolean;
    handleShare: () => void;
}

function PriceActionsCard({
    car, formatPrice, formatMileage, isFavourite,
    onToggleFavourite, setShowEnquiryForm, showEnquiryForm, handleShare
}: PriceActionsCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-1">
                        {car.make} {car.model}
                    </h1>
                    <p className="text-gray-500 text-sm mb-1">{car.variant}</p>
                    <p className="text-gray-500 font-medium">
                        {car.year} &bull; {formatMileage(car.mileage)} km
                    </p>
                </div>
                <button
                    onClick={() => onToggleFavourite(car.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isFavourite(car.id)
                        ? 'bg-red-50 text-red-500'
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                >
                    <Heart className={`w-6 h-6 ${isFavourite(car.id) ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="mb-8">
                <span className="text-3xl font-bold text-king-blue">
                    {formatPrice(car.price)}
                </span>
                <span className="text-sm text-gray-400 block mt-1">
                    Excludes on-the-road fees
                </span>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                        <Settings className="w-3 h-3" />
                        Transmission
                    </div>
                    <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                        <Fuel className="w-3 h-3" />
                        Fuel Type
                    </div>
                    <p className="font-semibold text-gray-900">{car.fuelType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                        <MapPin className="w-3 h-3" />
                        Location
                    </div>
                    <p className="font-semibold text-gray-900">{car.location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
                        <Calendar className="w-3 h-3" />
                        Year
                    </div>
                    <p className="font-semibold text-gray-900">{car.year}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                    className="w-full btn-primary py-4 text-lg shadow-lg flex items-center justify-center gap-2"
                >
                    <Mail className="w-5 h-5" />
                    Enquire Now
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <a
                        href="tel:0215551234"
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        Call Us
                    </a>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </div>

            {/* Enquiry Form */}
            {showEnquiryForm && (
                <div className="mt-8 pt-8 border-t border-gray-100 animate-slide-in">
                    <h3 className="font-bold text-gray-900 mb-4">Send Enquiry</h3>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none"
                        />
                        <textarea
                            placeholder="Message"
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none resize-none"
                            defaultValue={`I'm interested in the ${car.year} ${car.make} ${car.model}. Please contact me.`}
                        />
                        <button className="w-full btn-secondary py-3">
                            Send Message
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
