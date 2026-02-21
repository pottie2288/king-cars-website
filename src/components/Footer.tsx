import { MapPin, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              transparent pricing, and exceptional service in Cape Town and Port Elizabeth.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-king-cyan transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-king-cyan transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-king-cyan transition-colors"
              >
                <Linkedin className="w-5 h-5" />
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
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
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
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact Us</h4>
            <div className="space-y-6">
              {/* Cape Town Region */}
              <div>
                <h5 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-king-cyan" />
                  Cape Town
                </h5>
                <ul className="space-y-2 text-sm text-gray-400 pl-6">
                  <li>
                    <span className="block text-gray-300">Cape Town</span>
                    <a href="tel:0219101343" className="hover:text-king-cyan transition-colors">021 910 1343</a>
                  </li>
                  <li>
                    <span className="block text-gray-300">Vredekloof</span>
                    <a href="tel:0219101343" className="hover:text-king-cyan transition-colors">021 910 1343</a>
                  </li>
                </ul>
              </div>

              {/* Port Elizabeth Region */}
              <div>
                <h5 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-king-cyan" />
                  Port Elizabeth
                </h5>
                <ul className="space-y-2 text-sm text-gray-400 pl-6">
                  <li>
                    <span className="block text-gray-300">Cape Road</span>
                    <a href="tel:0413653900" className="hover:text-king-cyan transition-colors">(041) 365 3900</a>
                  </li>
                  <li>
                    <span className="block text-gray-300">Sydenham</span>
                    <a href="tel:0414871241" className="hover:text-king-cyan transition-colors">(041) 487 1241</a>
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
                  <p className="text-gray-400">8:00 AM - 6:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-white font-medium">Saturday</p>
                  <p className="text-gray-400">9:00 AM - 4:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-white font-medium">Sunday</p>
                  <p className="text-gray-400">Closed</p>
                </div>
              </li>
            </ul>
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
              <button className="text-gray-500 hover:text-king-cyan text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-500 hover:text-king-cyan text-sm transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
