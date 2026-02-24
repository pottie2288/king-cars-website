import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Shield, Clock, Award, Phone, Star, Car as CarIcon, Coins, HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { SEO } from '@/components/SEO';
import { AnimatedSection } from '@/components/AnimatedSection';
import { BodyTypeFilter } from '@/components/BodyTypeFilter';
import type { FilterState, Car } from '@/types';

interface HomePageProps {
  favourites: string[];
  onToggleFavourite: (carId: string) => void;
}



export function HomePage({ favourites, onToggleFavourite }: HomePageProps) {
  const navigate = useNavigate();
  const { getFeaturedCars, getUniqueMakes, getUniqueModels, loading } = useInventory();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    if (!loading) {
      setFeaturedCars(getFeaturedCars().slice(0, 3));
    }
  }, [loading, getFeaturedCars]);

  const handleSearch = (filters: FilterState) => {
    // Store filters in sessionStorage for showroom page
    sessionStorage.setItem('homeSearchFilters', JSON.stringify(filters));
    navigate('/showroom');
  };

  const locations = ['Cape Town', 'Port Elizabeth'];
  const makes = getUniqueMakes();

  const stats = [
    { value: '30+', label: 'Years Experience' },
    { value: '50,000+', label: 'Cars Sold' },
    { value: '4.8', label: 'Google Reviews' },
    { value: '6', label: 'Locations' },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Every vehicle undergoes a comprehensive 100-point inspection before sale.',
    },
    {
      icon: Clock,
      title: 'Fast Approval',
      description: 'Get finance approval within 24 hours with our trusted partners.',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with transparent, no-hidden-fee policy.',
    },
  ];

  const testimonials = [
    {
      name: 'Andre',
      location: 'Bellville',
      rating: 5,
      text: 'Andre gave me excellent service right from the start. I highly recommend him and King Cars.',
      date: '2 weeks ago'
    },
    {
      name: 'Tamaryne',
      location: 'Bellville',
      rating: 5,
      text: 'Excellent Service. Thank you King Cars Bellville for the excellent service received.',
      date: '1 month ago'
    },
    {
      name: 'Ollie',
      location: 'Cape Town',
      rating: 5,
      text: "GREAT WORK & SERVICE. Just a word thanks to you and Nigel for the great work and the service you gave me and Barbara at your dealership last Friday.",
      date: '3 weeks ago'
    },
    {
      name: 'Teresa Booysen',
      location: 'Bellville',
      rating: 5,
      text: 'Customer service is nie meer soos dit vroeer jare was nie maar Justin het my gewys dat daar nog mense is wat belangstel in hulle kliente. Dankie weereens.',
      date: '2 months ago'
    },
    {
      name: 'Michael',
      location: 'Cape Town',
      rating: 5,
      text: 'Thank you for keeping on trying. The effort you put into finding the right car for my budget was exceptional.',
      date: '4 days ago'
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen">
      <SEO
        title="Home"
        description="King Cars - Premium used cars in Cape Town and Port Elizabeth. Quality guaranteed with transparent pricing and exceptional service."
      />

      {/* Hero Section - Blue Gradient Background */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#87CEFA] to-[#00aeef]">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full section-padding pt-36 lg:pt-56 pb-20">
          <div className="max-w-7xl mx-auto text-center">

            {/* Pill Label */}
            <div className="animate-fade-in flex justify-center">
              <span className="inline-block px-6 py-3 bg-king-blue/10 backdrop-blur-sm text-king-blue rounded-full text-base sm:text-lg font-medium mb-8 border border-king-blue/20">
                South Africa's Trusted Car Dealer
              </span>
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-gray-900 mb-8 leading-tight animate-fade-in animate-delay-100">
              Find your next car at
              <span className="block text-king-blue">King Cars</span>
            </h1>
            <p className="text-gray-600 text-2xl sm:text-3xl max-w-4xl mx-auto mb-16 animate-fade-in animate-delay-200">
              Premium used cars in Cape Town and Port Elizabeth.
              Quality guaranteed with transparent pricing and exceptional service.
            </p>

            {/* Search Bar */}
            <div className="animate-fade-in animate-delay-300">
              <SearchBar
                onSearch={handleSearch}
                locations={locations}
                makes={makes}
                getUniqueModels={getUniqueModels}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in animate-delay-400">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-2 flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.value === '4.8' && (
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 fill-yellow-400 text-yellow-400 inline-block" />
                    )}
                  </p>
                  <p className="text-gray-600 text-lg sm:text-xl">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Car Image (Hidden for now as focused on gradient) */}
        <div className="absolute bottom-10 left-10 md:left-20 w-64 md:w-96 animate-fade-in animate-delay-500 hidden lg:block pointer-events-none">
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-gray-50">
        <div className="section-padding">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
                  Featured Vehicles
                </span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
                  Our Best Deals
                </h2>
              </div>
              <button
                onClick={() => navigate('/showroom')}
                className="flex items-center gap-2 text-king-blue font-medium hover:text-king-cyan transition-colors"
              >
                View All Cars
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car, index) => (
                <div
                  key={car.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CarCard
                    car={car}
                    isFavourite={favourites.includes(car.id)}
                    onToggleFavourite={() => onToggleFavourite(car.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Body Type Filter Section */}
      <BodyTypeFilter />

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              The King Cars Advantage
            </h2>
            <p className="text-gray-600">
              We go above and beyond to ensure you get the best car buying experience in South Africa.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index}>
                <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-card transition-all duration-300 group">
                  <div className="w-16 h-16 bg-king-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-king-blue group-hover:scale-110 transition-all duration-300">
                    <benefit.icon className="w-8 h-8 text-king-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-king-blue relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-king-cyan/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Icon: Car with K */}
            <div className="hidden lg:block relative opacity-90 transform -rotate-6">
              <div className="relative text-white/90">
                <CarIcon className="w-48 h-48 stroke-1" strokeWidth={1.5} />
              </div>
            </div>

            {/* Center Content */}
            <div className="max-w-3xl text-center flex-1">
              <AnimatedSection>
                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
                  Ready to Sell Your Car?
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                  Get a fair market value for your vehicle. We buy cars in any condition
                  and offer instant payment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/sell-your-car')}
                    className="btn-accent flex items-center justify-center gap-2 text-lg px-8 py-4 bg-king-cyan hover:bg-king-cyan/90 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    Sell Your Car
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="tel:+27215551234"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all hover:border-white"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us Now
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Icon: Coins/Hand */}
            <div className="hidden lg:block relative opacity-90">
              <div className="flex flex-col items-center text-white/90 transform rotate-6">
                <div className="relative">
                  <Coins className="w-32 h-32 absolute -top-16 -right-4 text-king-cyan/80 animate-bounce" style={{ animationDuration: '3s' }} strokeWidth={1.5} />
                  <HandCoins className="w-48 h-48 stroke-1" strokeWidth={1.5} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="section-padding">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              What Our Customers Say
            </h2>
          </AnimatedSection>

          <div className="relative group">
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6">
                    <div className="bg-white rounded-2xl p-8 shadow-card h-full border border-gray-100 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-60">
                          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                          <span className="text-[10px] uppercase tracking-tighter font-bold">Review</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6 leading-relaxed flex-grow italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-king-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-display font-bold text-king-blue">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-none mb-1">{testimonial.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{testimonial.location}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{testimonial.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={scrollPrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-king-blue hover:bg-king-blue hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-king-blue hover:bg-king-blue hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://www.google.com/search?q=King+Cars+Bellville+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              See more Google Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="section-padding">
          <AnimatedSection className="max-w-2xl mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-4">
              Our branches
            </h2>
          </AnimatedSection>

          <BranchSection />
        </div>
      </section>
    </div>
  );
}

function BranchSection() {
  const branches = [
    {
      id: 'cape-town',
      name: 'Cape Town',
      fullName: 'King Cars Cape Town',
      address: '25 Strand Rd, Belgravia, Cape Town, 7530',
      phones: ['(021) 910 1343'],
      email: 'andresadie@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=25%20Strand%20Rd%2C%20Belgravia%2C%20Cape%20Town%2C%207530&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 18:00',
        saturdays: '09:00 to 14:00',
        sundays: '09:00 to 15:00',
        holidays: '09:00 to 14:00'
      }
    },
    {
      id: 'vredekloof',
      name: 'Vredekloof',
      fullName: 'King Cars Vredekloof',
      address: '2 Hillcrest Rd, Vredekloof, Cape Town, 7560',
      phones: ['021 910 1343'],
      email: 'hansie@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=2%20Hillcrest%20Rd%2C%20Vredekloof%2C%20Cape%20Town%2C%207560&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 18:00',
        saturdays: '09:00 to 14:00',
        sundays: '09:00 to 15:00',
        holidays: '09:00 to 14:00'
      }
    },
    {
      id: 'cape-road',
      name: 'Cape Road',
      fullName: 'King Cars Cape Road',
      address: '343 Cape Rd, Newton Park, Port Elizabeth',
      phones: ['(041) 365 3900'],
      email: 'justin@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=343%20Cape%20Rd%2C%20Newton%20Park%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 18:00',
        saturdays: '09:00 to 14:00',
        sundays: '09:00 to 15:00',
        holidays: '09:00 to 14:00'
      }
    },
    {
      id: 'sydenham',
      name: 'Sydenham',
      fullName: 'King Cars Sydenham',
      address: '19 - 21 Uitenhage Road, Sydenham, Port Elizabeth',
      phones: ['(041) 487 1241'],
      email: 'derick@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=19%20-%2021%20Uitenhage%20Road%2C%20Sydenham%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 18:00',
        saturdays: '09:00 to 14:00',
        sundays: '09:00 to 15:00',
        holidays: '09:00 to 14:00'
      }
    }
  ];

  const [activeBranch, setActiveBranch] = useState(branches[0]);

  return (
    <div className="space-y-8">
      {/* Branch Tabs */}
      <div className="flex flex-wrap gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setActiveBranch(branch)}
            className={`px-6 py-2.5 rounded-full border-2 font-semibold transition-all duration-300 whitespace-nowrap ${activeBranch.id === branch.id
              ? 'bg-king-blue border-king-blue text-white shadow-lg shadow-king-blue/20 scale-105'
              : 'border-king-blue text-king-blue hover:bg-king-blue/5'
              }`}
          >
            {branch.name}
          </button>
        ))}
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden transition-all duration-500 animate-fade-in">
        <div className="flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-2/5 p-10 lg:p-14 space-y-10">
            <div>
              <h3 className="font-display font-bold text-3xl text-gray-900 mb-8 lowercase first-letter:uppercase">
                {activeBranch.fullName}
              </h3>

              {/* Mobile Only Map */}
              <div className="lg:hidden w-full h-64 mb-10 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                <iframe
                  title={`${activeBranch.fullName} Mobile Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={activeBranch.mapUrl}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[0.2] contrast-[1.1]"
                />
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${activeBranch.email}`}
                  className="w-full sm:w-64 py-4 px-8 bg-king-blue text-white font-bold rounded-xl text-center hover:bg-king-blue/90 transition-all hover:-translate-y-1 shadow-md"
                >
                  Email us
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeBranch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-64 py-4 px-8 bg-king-blue text-white font-bold rounded-xl text-center hover:bg-king-blue/90 transition-all hover:-translate-y-1 shadow-md"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Physical address:</h4>
                <p className="text-gray-600 leading-relaxed max-w-xs">
                  {activeBranch.address}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Contact numbers:</h4>
                {activeBranch.phones.map((phone, idx) => (
                  <p key={idx} className="text-gray-600">{phone}</p>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Trading hours:</h4>
                <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-gray-600">
                  <span>Monday to Friday:</span>
                  <span className="font-medium">{activeBranch.hours.weekdays}</span>
                  <span>Saturdays:</span>
                  <span className="font-medium">{activeBranch.hours.saturdays}</span>
                  <span>Sundays:</span>
                  <span className="font-medium">{activeBranch.hours.sundays}</span>
                  <span>Public holidays:</span>
                  <span className="font-medium">{activeBranch.hours.holidays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side (Desktop Only) */}
          <div className="hidden lg:block lg:w-3/5 min-h-[600px] relative bg-gray-50 border-l border-gray-100">
            <iframe
              title={`${activeBranch.fullName} Map`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '100%' }}
              src={activeBranch.mapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[0.2] contrast-[1.1]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
