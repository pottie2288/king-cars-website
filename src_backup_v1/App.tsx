import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyContactBar } from '@/components/StickyContactBar';
import { HomePage } from '@/pages/HomePage';
import { ShowroomPage } from '@/pages/ShowroomPage';
import { SellYourCarPage } from '@/pages/SellYourCarPage';
import { FinancePage } from '@/pages/FinancePage';
import { AboutPage } from '@/pages/AboutPage';
import { CarDetailsPage } from '@/pages/CarDetailsPage';
import { FavouritesPage } from '@/pages/FavouritesPage';
import type { Page, Car } from '@/types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);


  // Load favourites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('king-cars-favourites');
    if (saved) {
      try {
        setFavourites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favourites', e);
        localStorage.removeItem('king-cars-favourites');
      }
    }
  }, []);

  // Save favourites to local storage
  useEffect(() => {
    localStorage.setItem('king-cars-favourites', JSON.stringify(favourites));
  }, [favourites]);



  const toggleFavourite = (carId: string) => {
    setFavourites(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  // Handle page change with scroll to top
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    handlePageChange('car-details');
  };

  const handleBackShowroom = () => {
    handlePageChange('showroom');
  };

  // Update document title based on current page
  useEffect(() => {
    const titles: Record<Page, string> = {
      home: 'King Cars South Africa | Premium Used Cars Cape Town & Port Elizabeth',
      showroom: 'Car Showroom | Browse Our Inventory | King Cars South Africa',
      'sell-your-car': 'Sell Your Car | Get a Fair Offer | King Cars South Africa',
      finance: 'Car Finance | Affordable Rates | King Cars South Africa',
      about: 'About Us | South Africa\'s Trusted Dealer | King Cars',
      'favourites': 'My Favourites | King Cars South Africa',
      'car-details': selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model} | King Cars` : 'Car Details | King Cars',
    };
    document.title = titles[currentPage];
  }, [currentPage, selectedCar]);

  // Update meta description based on current page
  useEffect(() => {
    const descriptions: Record<Page, string> = {
      home: 'King Cars South Africa - Premium used cars in Cape Town and Port Elizabeth. Quality guaranteed with transparent pricing. Browse our showroom today!',
      showroom: 'Browse our extensive inventory of quality used cars in Cape Town and Port Elizabeth. Filter by location, make, and category. Find your perfect vehicle today!',
      'sell-your-car': 'Sell your car to King Cars and get a fair market value offer within 24 hours. We buy cars in any condition. Instant payment guaranteed.',
      finance: 'Get affordable car finance with King Cars. Competitive rates from 9.5% APR, flexible terms up to 72 months. Apply today and drive away tomorrow!',
      about: 'Learn about King Cars South Africa - your trusted car dealer for over 15 years. Discover our story, values, and commitment to excellence.',
      'favourites': 'View your saved favourite vehicles. Compare your top picks and find your dream car at King Cars.',
      'car-details': selectedCar ? `View details for this ${selectedCar.year} ${selectedCar.make} ${selectedCar.model}. Available at King Cars ${selectedCar.location}.` : 'View detailed vehicle specifications and features.',
    };

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', descriptions[currentPage]);
  }, [currentPage, selectedCar]);



  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <meta name="keywords" content="used cars Cape Town, second hand cars Port Elizabeth, car dealership South Africa, buy car Cape Town, sell car Port Elizabeth, car finance South Africa, King Cars" />
        <meta name="author" content="King Cars South Africa" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="King Cars South Africa | Premium Used Cars" />
        <meta property="og:description" content="South Africa's trusted car dealer. Quality used cars in Cape Town and Port Elizabeth with transparent pricing." />
        <meta property="og:image" content="/king-cars-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://kingcars.co.za/${currentPage === 'home' ? '' : currentPage}`} />
      </head>

      {/* Header */}
      <Header currentPage={currentPage} onPageChange={handlePageChange} favouritesCount={favourites.length} />

      {/* Main Content */}
      <main className="min-h-screen">
        {currentPage === 'home' && (
          <HomePage
            onPageChange={handlePageChange}
            onCarClick={handleCarClick}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
        )}
        {currentPage === 'showroom' && (
          <ShowroomPage
            onCarClick={handleCarClick}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
        )}
        {currentPage === 'sell-your-car' && <SellYourCarPage />}
        {currentPage === 'finance' && <FinancePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'favourites' && (
          <FavouritesPage
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
            onCarClick={handleCarClick}
            onBrowseShowroom={() => handlePageChange('showroom')}
          />
        )}
        {currentPage === 'car-details' && selectedCar && (
          <CarDetailsPage
            car={selectedCar}
            onBack={handleBackShowroom}
            isFavourite={favourites.includes(selectedCar.id)}
            onToggleFavourite={() => toggleFavourite(selectedCar.id)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onPageChange={handlePageChange} />

      {/* Mobile Sticky Contact Bar */}
      <StickyContactBar />

      {/* Add padding to bottom on mobile to account for sticky bar */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}

export default App;
