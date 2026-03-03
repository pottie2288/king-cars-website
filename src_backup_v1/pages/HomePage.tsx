import { useEffect, useState } from 'react';
import { ArrowRight, Shield, Clock, Award, Phone, Star, MapPin, Mail, Car as CarIcon, Coins, HandCoins } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CarCard } from '@/components/CarCard';
import { useInventory } from '@/hooks/useInventory';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { Page, FilterState, Car } from '@/types';

interface HomePageProps {
  onPageChange: (page: Page) => void;
  onCarClick: (car: Car) => void;
  favourites: string[];
  onToggleFavourite: (carId: string) => void;
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

export function HomePage({ onPageChange, onCarClick, favourites, onToggleFavourite }: HomePageProps) {
  const { getFeaturedCars, getUniqueMakes, getUniqueModels, loading } = useInventory();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    if (!loading) {
      setFeaturedCars(getFeaturedCars().slice(0, 3));
    }
  }, [loading, getFeaturedCars]);

  const handleSearch = (filters: FilterState) => {
    onPageChange('showroom');
    // Store filters in sessionStorage for showroom page
    sessionStorage.setItem('homeSearchFilters', JSON.stringify(filters));
  };

  const locations = ['Cape Town', 'Port Elizabeth'];
  const makes = getUniqueMakes();

  const stats = [
    { value: '30+', label: 'Years Experience' },
    { value: '5,000+', label: 'Cars Sold' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '5', label: 'Locations' },
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
      name: 'John Peterson',
      location: 'Cape Town',
      rating: 5,
      text: 'Excellent service from start to finish. Found my dream car at a great price!',
    },
    {
      name: 'Sarah Williams',
      location: 'Port Elizabeth',
      rating: 5,
      text: 'Professional team, hassle-free process. Highly recommend King Cars!',
    },
    {
      name: 'Michael Brown',
      location: 'Cape Town',
      rating: 5,
      text: 'Sold my car within a week. Fair price and excellent customer service.',
    },
  ];

  return (
    <div className="min-h-screen">
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
                  <p className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-2">
                    {stat.value}
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
                onClick={() => onPageChange('showroom')}
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
                    onClick={onCarClick}
                    isFavourite={favourites.includes(car.id)}
                    onToggleFavourite={() => onToggleFavourite(car.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
                    onClick={() => onPageChange('sell-your-car')}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index}>
                <div className="bg-white rounded-2xl p-8 shadow-card h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-king-blue/10 rounded-full flex items-center justify-center">
                      <span className="font-display font-bold text-king-blue">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Our Locations
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Visit Our Showrooms
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Cape Town Region */}
            <div className="space-y-8">
              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Cape Town Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=25%20Strand%20Rd%2C%20Belgravia%2C%20Cape%20Town%2C%207530&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Cape Town</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      25 Strand Rd, Belgravia, Cape Town, 7530
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0219101343" className="hover:text-king-blue transition-colors">(021) 910 1343</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:andresadie@kingcars.co.za" className="hover:text-king-blue transition-colors">andresadie@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Vredekloof Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=2%20Hillcrest%20Rd%2C%20Vredekloof%2C%20Cape%20Town%2C%207560&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Vredekloof</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      2 Hillcrest Rd, Vredekloof, Cape Town, 7560
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0219101343" className="hover:text-king-blue transition-colors">021 910 1343</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:hansie@kingcars.co.za" className="hover:text-king-blue transition-colors">hansie@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Port Elizabeth Region */}
            <div className="space-y-8">
              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Cape Road Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=343%20Cape%20Rd%2C%20Newton%20Park%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Cape Road</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      343 Cape Rd, Newton Park, Port Elizabeth
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0413653900" className="hover:text-king-blue transition-colors">(041) 365 3900</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:justin@kingcars.co.za" className="hover:text-king-blue transition-colors">justin@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Sydenham Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=19%20-%2021%20Uitenhage%20Road%2C%20Sydenham%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Sydenham</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      19 - 21 Uitenhage Road, Sydenham, Port Elizabeth
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0414871241" className="hover:text-king-blue transition-colors">(041) 487 1241</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:derick@kingcars.co.za" className="hover:text-king-blue transition-colors">derick@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
