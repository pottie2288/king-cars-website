'use client'

import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, MapPin, Calendar, Fuel, Settings,
    Share2, Heart, Mail, CheckCircle, X, AlertCircle,
    ChevronLeft, ChevronRight, Gauge, Car as CarIcon,
    Users, DoorOpen, Zap, Droplets
} from 'lucide-react';

const WC_MANAGERS = [
    { name: 'Andre Sadie',   branch: 'Bellville',   role: 'Sales Manager', phone: '27835008181', photo: '/managers/Andre-Sadie.png' },
    { name: 'Louis Jacobs',  branch: 'Vredekloof',  role: 'Sales Manager', phone: '27722939376', photo: '/managers/Louis-Jacobs.png' },
    { name: 'Iesmodien Manuel', branch: 'Brackenfell', role: 'Sales Manager', phone: '27834802929', photo: '/managers/Iesmodien-Manuel.png' },
];

const EC_MANAGERS = [
    { name: 'Simbongile Gongqa', branch: '17th Ave',    role: 'Sales Manager', phone: '27734314230', photo: '/managers/Simbongile-Gongqa.png' },
    { name: 'Divan Verwey',      branch: 'Sydenham',    role: 'Sales Manager', phone: '27833149334', photo: '/managers/Divan-Verwey.png' },
    { name: 'Shane Enstrom',     branch: 'Newton Park', role: 'Sales Manager', phone: '27680374018', photo: '/managers/Shane-Enstrom.png' },
];
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FinanceCalculator } from '@/components/FinanceCalculator';
import { useInventory } from '@/hooks/useInventory';
import { useFavourites } from '@/context/FavouritesContext';
import { trackEvent, trackCarView } from '@/lib/analytics';
import { validateSAPhone, validateEmail } from '@/lib/validation';
import type { Car, VmgVehicle } from '@/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

export function CarDetailPage({ initialVehicle }: { initialVehicle?: VmgVehicle }) {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { cars, loading } = useInventory(initialVehicle ? [initialVehicle] : undefined);
    const { isFavourite, toggleFavourite } = useFavourites();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    const car = cars.find(c => c.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Meta ViewContent — the signal Meta campaigns optimise for. useInventory
    // refetches, so `car` gets a new object identity for the same vehicle;
    // guard on the id so a refresh does not double-count the view.
    const viewTrackedFor = useRef<string | null>(null);
    useEffect(() => {
        if (!car || viewTrackedFor.current === car.id) return;
        viewTrackedFor.current = car.id;
        trackCarView(car);
    }, [car]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-king-blue animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-3 h-3 rounded-full bg-king-blue animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-3 h-3 rounded-full bg-king-blue animate-bounce" />
                </div>
            </div>
        );
    }

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

                            <div className="bg-gradient-to-br from-king-blue to-blue-800 rounded-2xl p-6 text-white shadow-card">
                                <h3 className="font-display font-bold text-lg mb-1">Ready to make it yours?</h3>
                                <p className="text-blue-100 text-sm mb-5">Apply online in minutes. We work with all major banks to get you the best rate.</p>
                                <Link
                                    href="/finance#application-form"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-king-cyan hover:bg-accent-light transition-colors font-bold text-white text-sm shadow-lg"
                                >
                                    Apply for Finance
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
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
    const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: `I'm interested in the ${car.year} ${car.make} ${car.model}. Please contact me.` });
    const [enquiryState, setEnquiryState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [showWaModal, setShowWaModal] = useState(false);

    const phoneCheck = validateSAPhone(enquiry.phone);
    const emailCheck = validateEmail(enquiry.email);

    const managers = car.location === 'Eastern Cape' ? EC_MANAGERS : WC_MANAGERS;
    const carUrl = `https://www.kingcars.co.za/showroom/${car.id}`;
    const waMessage = encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${car.variant}) priced at R ${car.price.toLocaleString('en-ZA')}. Please can you assist?\n\n${carUrl}`);

    const handleEnquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneCheck.valid || !emailCheck.valid) return;
        setEnquiryState('submitting');
        try {
            const res = await fetch('/api/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...enquiry, car: `${car.year} ${car.make} ${car.model}`, price: car.price, stockCode: car.stockCode, location: car.location }),
            });
            if (!res.ok) throw new Error(`Enquiry failed: ${res.status}`);
            setEnquiryState('success');
            trackEvent('enquiry_sent', { car: `${car.year} ${car.make} ${car.model}`, car_id: car.id });
        } catch {
            // Don't fake success — surface an honest error with a WhatsApp fallback
            // so a failed email still becomes a recoverable lead.
            setEnquiryState('error');
            trackEvent('enquiry_failed', { car: `${car.year} ${car.make} ${car.model}`, car_id: car.id });
        }
    };

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
                    {car.stockCode && (
                        <p className="text-gray-400 text-xs mt-1">Stock # {car.stockCode}</p>
                    )}
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
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wide mb-1">
                        <Settings className="w-3 h-3 shrink-0" />
                        Transmission
                    </div>
                    <p className="font-semibold text-gray-900">{car.transmission}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wide mb-1">
                        <Fuel className="w-3 h-3 shrink-0" />
                        Fuel Type
                    </div>
                    <p className="font-semibold text-gray-900">{car.fuelType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wide mb-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        Location
                    </div>
                    <p className="font-semibold text-gray-900">{car.location}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wide mb-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        Year
                    </div>
                    <p className="font-semibold text-gray-900">{car.year}</p>
                </div>
            </div>

            {/* WhatsApp Manager Modal */}
            {showWaModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0" onClick={() => setShowWaModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="bg-[#25D366] px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-base">Chat on WhatsApp</p>
                                <p className="text-white/80 text-xs mt-0.5">Select a branch manager to chat with</p>
                            </div>
                            <button onClick={() => setShowWaModal(false)} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {managers.map((m) => (
                                <a
                                    key={m.phone}
                                    href={`https://wa.me/${m.phone}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEvent('whatsapp_manager_tapped', { manager: m.name, branch: m.branch, car: `${car.year} ${car.make} ${car.model}`, car_id: car.id })}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div
                                        className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center"
                                        style={m.photo
                                            ? { backgroundImage: `url(${m.photo})`, backgroundSize: 'cover', backgroundPosition: 'center top' }
                                            : { backgroundColor: 'rgba(29,78,216,0.1)' }
                                        }
                                    >
                                        {!m.photo && <span className="text-king-blue font-bold text-sm">{m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                                        <p className="text-gray-500 text-xs">{m.branch} · {m.role}</p>
                                    </div>
                                    <svg className="w-6 h-6 text-[#25D366] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                <button
                    onClick={() => { setShowWaModal(true); trackEvent('whatsapp_modal_opened', { car: `${car.year} ${car.make} ${car.model}`, car_id: car.id }); }}
                    className="w-full py-4 text-lg shadow-lg flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                        className="flex items-center justify-center gap-2 py-3 px-4 btn-primary font-bold rounded-xl shadow-lg"
                    >
                        <Mail className="w-4 h-4" />
                        Enquire Now
                    </button>
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
                    {enquiryState === 'success' ? (
                        <div className="text-center py-4">
                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                            <p className="font-semibold text-gray-800">Message sent!</p>
                            <p className="text-sm text-gray-500">We&apos;ll be in touch shortly.</p>
                        </div>
                    ) : enquiryState === 'error' ? (
                        <div className="py-2">
                            <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">Couldn&apos;t send your message</p>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        Something went wrong on our side. Message the branch directly on
                                        WhatsApp — it&apos;s instant — or try again.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowWaModal(true); trackEvent('whatsapp_modal_opened', { source: 'enquiry_error', car: `${car.year} ${car.make} ${car.model}`, car_id: car.id }); }}
                                className="w-full py-3 mb-3 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1ebe5d] transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Send via WhatsApp
                            </button>
                            <button
                                onClick={() => setEnquiryState('idle')}
                                className="w-full py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleEnquirySubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                value={enquiry.name}
                                onChange={e => setEnquiry(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none"
                            />
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={enquiry.email}
                                    onChange={e => setEnquiry(prev => ({ ...prev, email: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border outline-none ${
                                        enquiry.email && !emailCheck.valid
                                            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300'
                                            : 'border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue'
                                    }`}
                                />
                                {enquiry.email && !emailCheck.valid && (
                                    <p className="text-red-500 text-xs mt-1">{emailCheck.error}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    required
                                    value={enquiry.phone}
                                    onChange={e => setEnquiry(prev => ({ ...prev, phone: e.target.value }))}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border outline-none ${
                                        enquiry.phone && !phoneCheck.valid
                                            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300'
                                            : 'border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue'
                                    }`}
                                />
                                {enquiry.phone && !phoneCheck.valid && (
                                    <p className="text-red-500 text-xs mt-1">{phoneCheck.error}</p>
                                )}
                            </div>
                            <textarea
                                placeholder="Message"
                                rows={3}
                                value={enquiry.message}
                                onChange={e => setEnquiry(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-king-blue focus:ring-1 focus:ring-king-blue outline-none resize-none"
                            />
                            <button
                                type="submit"
                                disabled={enquiryState === 'submitting' || !phoneCheck.valid || !emailCheck.valid}
                                className="w-full py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {enquiryState === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
