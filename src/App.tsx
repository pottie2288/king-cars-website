import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StickyContactBar } from '@/components/StickyContactBar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { HomePage } from '@/pages/HomePage';
import { ShowroomPage } from '@/pages/ShowroomPage';
import { SellYourCarPage } from '@/pages/SellYourCarPage';
import { FinancePage } from '@/pages/FinancePage';
import { AboutPage } from '@/pages/AboutPage';
import { CarDetailsPage } from '@/pages/CarDetailsPage';
import { FavouritesPage } from '@/pages/FavouritesPage';
import { ComplaintsPage } from '@/pages/ComplaintsPage';
import './App.css';

function App() {
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      <ScrollToTop />

      {/* Header */}
      <Header favouritesCount={favourites.length} />

      {/* Main Content */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage favourites={favourites} onToggleFavourite={toggleFavourite} />} />
          <Route path="/showroom" element={<ShowroomPage favourites={favourites} onToggleFavourite={toggleFavourite} />} />
          <Route path="/showroom/:id" element={<CarDetailsPage isFavourite={(id) => favourites.includes(id)} onToggleFavourite={toggleFavourite} />} />
          <Route path="/sell-your-car" element={<SellYourCarPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/favourites" element={<FavouritesPage favourites={favourites} onToggleFavourite={toggleFavourite} />} />
          <Route path="/compliments-complaints" element={<ComplaintsPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Contact Bar */}
      <StickyContactBar />

      {/* Add padding to bottom on mobile to account for sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}

export default App;
