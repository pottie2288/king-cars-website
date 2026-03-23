'use client'

import { useEffect, useState } from 'react';
import { ArrowRight, Car as CarIcon, Coins, HandCoins } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { CssCarAnimation } from '@/components/ui/css-car-animation';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { AnimatedSection } from '@/components/AnimatedSection';
import { BodyTypeFilter } from '@/components/BodyTypeFilter';
import { BranchSection } from '@/components/BranchSection';
import { TestimonialCarousel } from '@/components/ui/testimonial';
import { Typewriter } from '@/components/ui/typewriter';
import { useFavourites } from '@/context/FavouritesContext';
import type { FilterState, Car } from '@/types';


export function HomePage() {
  const router = useRouter();
  const { favourites, toggleFavourite } = useFavourites();
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
    router.push('/showroom');
  };

  const makes = getUniqueMakes();


  const testimonials = [
    {
      id: 1,
      name: 'Andre',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: 'Andre gave me excellent service right from the start. I highly recommend him and King Cars.',
    },
    {
      id: 2,
      name: 'Tamaryne',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Excellent Service. Thank you King Cars Bellville for the excellent service received.',
    },
    {
      id: 3,
      name: 'Ollie',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      description: "GREAT WORK & SERVICE. Just a word thanks to you and Nigel for the great work and service.",
    },
    {
      id: 4,
      name: 'Teresa Booysen',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      description: 'Customer service is nie meer soos dit vroeer jare was nie maar Justin het my gewys dat daar nog mense is.',
    },
    {
      id: 5,
      name: 'Michael',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      description: 'Thank you for keeping on trying. The effort you put into finding the right car was exceptional.',
    }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section - Blue Gradient Background */}
      <section className="relative flex flex-col justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-king-blue">
        </div>

        {/* Content */}
        <div className="relative z-10 w-full section-padding pt-32 lg:pt-48 pb-12 lg:pb-16">
          <div className="max-w-7xl mx-auto text-center">

            {/* Pill Label */}
            <AnimatedSection className="mb-8 flex justify-center">
              <span className="inline-flex items-center justify-center py-1.5 sm:py-2">
                <img
                  src="/bluechip-dealer-logo.png"
                  alt="Bluechip Dealer"
                  className="h-10 sm:h-12 w-auto object-contain block"
                />
              </span>
            </AnimatedSection>
            <h1 className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl text-gray-900 mb-16 leading-tight animate-fade-in animate-delay-100">
              Find Your <span className="text-king-blue">Perfect</span> Car
            </h1>

            {/* Search Bar */}
            <div className="animate-fade-in animate-delay-300">
              <SearchBar
                onSearch={handleSearch}
                makes={makes}
                getUniqueModels={getUniqueModels}
              />
            </div>
          </div>
        </div>

        {/* Car Image (Hidden for now as focused on gradient) */}
        <div className="absolute bottom-10 left-10 md:left-20 w-64 md:w-96 animate-fade-in animate-delay-500 hidden lg:block pointer-events-none">
        </div>
      </section>

      {/* Body Type Filter Section */}
      <BodyTypeFilter />

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
                onClick={() => router.push('/showroom')}
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
                    onToggleFavourite={() => toggleFavourite(car.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Car Animation Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-8">
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

          <div className="flex items-center justify-center">
            <CssCarAnimation />
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
                <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 min-h-[2.5em] sm:min-h-[2em] flex items-center justify-center">
                  <Typewriter
                    words={["Ready to Sell Your Car?", "Get Instant Cash Today!", "We Buy Any Car!"]}
                    speed={80}
                    delayBetweenWords={2000}
                    cursor={true}
                    cursorChar="|"
                  />
                </h2>
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                  Get a fair market offer for your vehicle, easy and hassle-free!
                </p>
                <div className="flex justify-center">
                  <InteractiveHoverButton
                    text="Sell Your Car"
                    onClick={() => router.push('/sell-your-car')}
                    className="w-48 bg-white text-king-blue text-lg py-4 border-transparent hover:border-white"
                  />
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

          <div className="flex justify-center">
            <TestimonialCarousel
              testimonials={testimonials}
              className="max-w-4xl"
            />
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
