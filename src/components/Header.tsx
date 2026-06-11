'use client'

import { useState, useEffect } from 'react';
import { MessageSquare, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useFavourites } from '@/context/FavouritesContext';
import { MenuVertical } from '@/components/ui/menu-vertical';

const navItems = [
  { label: 'Showroom', path: '/showroom' },
  { label: 'Sell Your Car', path: '/sell-your-car' },
  { label: 'Finance', path: '/finance' },
  { label: 'About', path: '/about' },
  { label: 'Compliments & Complaints', path: '/compliments-complaints' },
  { label: 'Favourites', path: '/favourites' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { favouritesCount } = useFavourites();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
          <Link
            href="/"
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
              className="absolute top-1/2 left-0 -translate-y-1/2 h-44 sm:h-52 lg:h-80 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xl z-50 pointer-events-none"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-link text-[17px] 2xl:text-lg whitespace-nowrap text-gray-700 hover:text-king-blue after:bg-king-blue ${isActive ? 'nav-link-active' : ''} relative`}
                >
                  {item.label}
                  {item.path === '/favourites' && favouritesCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-king-cyan text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-short shadow-sm">
                      {favouritesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center gap-2">
            <Link
              href="/contact"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover-lift click-press ${isScrolled
                ? 'bg-king-blue text-white hover:bg-primary-light shadow-lg'
                : 'bg-king-blue text-white hover:bg-primary-light shadow-lg'
                }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
            <a
              href="https://www.facebook.com/kingcars.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#1877F2' }}
              className="flex items-center justify-center px-3.5 py-2.5 rounded-xl text-white transition-all duration-300 hover-lift click-press hover:opacity-90"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/kingcars.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              className="flex items-center justify-center px-3.5 py-2.5 rounded-xl text-white transition-all duration-300 hover-lift click-press hover:opacity-90"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`xl:hidden p-2 rounded-xl transition-colors click-press ${isScrolled
              ? 'text-king-blue hover:bg-gray-100'
              : 'text-king-blue hover:bg-white/50'
              }`}
          >
            <MenuToggleIcon
              open={isMobileMenuOpen}
              className="w-8 h-8"
              duration={400}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 ${isMobileMenuOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
      >
        <nav className="section-padding py-6 flex flex-col gap-6">
          <MenuVertical
            menuItems={navItems.map(item => ({
              label: item.label,
              href: item.path
            }))}
            color="#1d4ed8"
          />
          <div className="flex items-stretch gap-2 mt-2">
            <Link
              href="/contact"
              className="flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-3 bg-king-cyan text-white rounded-xl font-medium click-press touch-manipulation"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-sm">Contact Us</span>
            </Link>
            <a
              href="https://www.facebook.com/kingcars.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#1877F2' }}
              className="flex-shrink-0 flex items-center justify-center w-12 rounded-xl text-white click-press touch-manipulation hover:opacity-90 transition-opacity"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/kingcars.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              className="flex-shrink-0 flex items-center justify-center w-12 rounded-xl text-white click-press touch-manipulation hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </nav>
      </div>
    </header >
  );
}
