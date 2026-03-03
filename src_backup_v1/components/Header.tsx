import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import type { Page } from '@/types';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  favouritesCount?: number;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Showroom', page: 'showroom' },
  { label: 'Sell Your Car', page: 'sell-your-car' },
  { label: 'Finance', page: 'finance' },
  { label: 'About', page: 'about' },
  { label: 'Favourites', page: 'favourites' },
];

export function Header({ currentPage, onPageChange, favouritesCount = 0 }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: Page) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-lg ${isScrolled
        ? 'py-1'
        : 'py-2'
        }`}
    >
      <div className="w-full section-padding">
        <div className="flex items-center justify-between">
          {/* Logo - Optimized Sizes */}
          <button
            onClick={() => handleNavClick('home')}
            className="relative flex items-center gap-3 group"
          >
            {/* Ghost Image for Layout Spacing */}
            <img
              src="/king-cars-logo.png"
              alt="King Cars"
              className="h-16 sm:h-20 opacity-0 pointer-events-none"
            />
            {/* Actual Oversized Logo */}
            <img
              src="/king-cars-logo.png"
              alt="King Cars"
              className="absolute top-1/2 left-0 -translate-y-1/2 h-44 sm:h-52 lg:h-80 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xl z-50"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`nav-link lg:text-lg xl:text-xl text-gray-700 hover:text-king-blue after:bg-king-blue ${currentPage === item.page ? 'nav-link-active' : ''
                  } relative`}
              >
                {item.label}
                {item.page === 'favourites' && (favouritesCount ?? 0) > 0 && (
                  <span className="absolute -top-3 -right-3 bg-king-cyan text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-short shadow-sm">
                    {favouritesCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+27215551234"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover-lift click-press ${isScrolled
                ? 'bg-king-blue text-white hover:bg-primary-light shadow-lg'
                : 'bg-king-blue text-white hover:bg-primary-light shadow-lg'
                }`}
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors click-press ${isScrolled
              ? 'text-king-blue hover:bg-gray-100'
              : 'text-king-blue hover:bg-white/50'
              }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <nav className="section-padding py-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-all ${currentPage === item.page
                ? 'bg-king-blue text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="tel:+27215551234"
            className="flex items-center gap-2 px-4 py-3 mt-2 bg-king-cyan text-white rounded-xl font-medium click-press touch-manipulation"
          >
            <Phone className="w-5 h-5" />
            <span>Call Us Now</span>
          </a>
        </nav>
      </div>
    </header >
  );
}
