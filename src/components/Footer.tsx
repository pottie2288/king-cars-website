'use client'

import { MapPin, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-king-dark text-white">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/king-cars-logo.png"
                alt="King Cars"
                className="h-20 w-auto object-contain bg-white rounded-xl p-3 shadow-lg"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              South Africa's trusted premium used car dealership. Quality vehicles,
              transparent pricing, and exceptional service in Western Cape and Eastern Cape.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/kingcars.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-king-cyan transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/kingcars.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-king-cyan transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Showroom', path: '/showroom' },
                { label: 'Sell Your Car', path: '/sell-your-car' },
                { label: 'Finance', path: '/finance' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Compliments & Complaints', path: '/compliments-complaints' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={scrollToTop}
                    className="text-gray-400 hover:text-king-cyan transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div>
              <h4 className="font-display font-semibold text-lg mb-6">Contact Us</h4>
              <div className="space-y-6">
                {/* Western Cape Region */}
                <div>
                  <h5 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-king-cyan" />
                    Western Cape
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-400 pl-6">
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">Bellville:</span>
                      <a href="tel:0835008181" className="hover:text-king-cyan transition-colors">083 500 8181</a>
                    </li>
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">Vredekloof:</span>
                      <a href="tel:0722939376" className="hover:text-king-cyan transition-colors">072 293 9376</a>
                    </li>
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">Brackenfell:</span>
                      <a href="tel:0834802929" className="hover:text-king-cyan transition-colors">083 480 2929</a>
                    </li>
                  </ul>
                </div>

                {/* Eastern Cape Region */}
                <div>
                  <h5 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-king-cyan" />
                    Eastern Cape
                  </h5>
                  <ul className="space-y-2 text-sm text-gray-400 pl-6">
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">17th Ave:</span>
                      <a href="tel:0734314230" className="hover:text-king-cyan transition-colors">073 431 4230</a>
                    </li>
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">Sydenham:</span>
                      <a href="tel:0833149334" className="hover:text-king-cyan transition-colors">083 314 9334</a>
                    </li>
                    <li className="flex justify-between md:justify-start gap-4">
                      <span className="text-gray-300 w-24">Newton Park:</span>
                      <a href="tel:0680374018" className="hover:text-king-cyan transition-colors">068 037 4018</a>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-3 pl-1">
                  <Mail className="w-4 h-4 text-king-cyan flex-shrink-0" />
                  <a href="mailto:info@kingcars.co.za" className="text-sm text-gray-400 hover:text-king-cyan transition-colors">
                    info@kingcars.co.za
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-6">Business Hours</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white font-medium">Monday - Friday</p>
                    <p className="text-gray-400">8:00 AM - 5:30 PM</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white font-medium">Saturday</p>
                    <p className="text-gray-400">9:00 AM - 1:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white font-medium">Sunday & Public Holidays</p>
                    <p className="text-gray-400">Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} King Cars South Africa. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/popi-policy" className="text-gray-500 hover:text-king-cyan text-sm transition-colors">
                POPI Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
