import { useState } from 'react';
import { Check, ChevronRight, Send, Shield, Clock, Banknote } from 'lucide-react';


type Step = 1 | 2 | 3 | 4;

interface FormData {
  year: string;
  make: string;
  model: string;
  mileage: string;
  condition: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
}

const carMakes = [
  'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mercedes-Benz',
  'Nissan', 'Toyota', 'Volkswagen', 'Volvo', 'Other'
];

const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

const locations = ['Cape Town', 'Port Elizabeth', 'Other'];

const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

import { SEO } from '@/components/SEO';

export function SellYourCarPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  const canProceedToNext = () => {
    if (currentStep === 1) {
      return formData.year && formData.make && formData.model && formData.mileage && formData.location && formData.condition;
    }
    if (currentStep === 2) {
      return formData.name && formData.email && formData.phone;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 2 && canProceedToNext()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: Banknote,
      title: 'Instant Cash Offer',
      description: 'Get a fair market value offer within 24 hours',
    },
    {
      icon: Shield,
      title: 'Hassle-Free Process',
      description: 'We handle all the paperwork and legal requirements',
    },
    {
      icon: Clock,
      title: 'Quick Payment',
      description: 'Receive payment immediately after vehicle inspection',
    },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Sell Your Car"
        description="Get an instant, obligation-free valuation for your vehicle. We buy cars for cash in Cape Town and Port Elizabeth."
      />
      {/* Hero Section with Valuation Card */}
      <div className="relative bg-gradient-to-b from-king-blue to-blue-900 pt-36 pb-32 lg:pt-48 lg:pb-48">
        {/* Background Pattern/Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/sell-car-hero.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 drop-shadow-lg">
              Sell Your Car the King Cars Way
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get an instant, obligation-free valuation for your vehicle.
              Simple, transparent, and fast.
            </p>
          </div>

          {/* Valuation Card */}
          <div className="max-w-4xl mx-auto">
            {isSubmitted ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">
                  Valuation Request Received!
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We've received your details. One of our buyers will contact you shortly
                  with a fair market offer for your vehicle.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Valuate Another Car
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                {/* Progress Bar (if multi-step) */}
                <div className="h-2 bg-gray-100">
                  <div
                    className="h-full bg-king-cyan transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / 2) * 100}%` }}
                  />
                </div>

                <div className="p-8 sm:p-10">
                  {currentStep === 1 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-king-blue/10 rounded-full flex items-center justify-center text-king-blue font-bold">1</div>
                        <h2 className="font-display font-bold text-2xl text-gray-900">Vehicle Details</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Year */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Year</label>
                          <select
                            value={formData.year}
                            onChange={(e) => updateFormData('year', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          >
                            <option value="">Select Year</option>
                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                          </select>
                        </div>

                        {/* Make */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Make</label>
                          <select
                            value={formData.make}
                            onChange={(e) => updateFormData('make', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          >
                            <option value="">Select Make</option>
                            {carMakes.map(make => <option key={make} value={make}>{make}</option>)}
                          </select>
                        </div>

                        {/* Model */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Model</label>
                          <input
                            type="text"
                            placeholder="e.g. Ranger 2.0 Bi-Turbo"
                            value={formData.model}
                            onChange={(e) => updateFormData('model', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          />
                        </div>

                        {/* Mileage */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mileage</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="e.g. 45000"
                              value={formData.mileage}
                              onChange={(e) => updateFormData('mileage', e.target.value)}
                              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">km</span>
                          </div>
                        </div>

                        {/* Condition */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Condition</label>
                          <select
                            value={formData.condition}
                            onChange={(e) => updateFormData('condition', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          >
                            <option value="">Select Condition</option>
                            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Location</label>
                          <div className="grid grid-cols-3 gap-4">
                            {locations.map(loc => (
                              <button
                                key={loc}
                                onClick={() => updateFormData('location', loc)}
                                className={`h-12 rounded-xl font-medium border-2 transition-all ${formData.location === loc
                                  ? 'border-king-blue bg-king-blue text-white shadow-lg transform scale-[1.02]'
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                  }`}
                              >
                                {loc}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="w-full btn-primary h-14 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Get My Valuation
                      </button>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="animate-fade-in">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center text-gray-400 hover:text-king-blue mb-6 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Back to Vehicle Details
                      </button>

                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-king-blue/10 rounded-full flex items-center justify-center text-king-blue font-bold">2</div>
                        <h2 className="font-display font-bold text-2xl text-gray-900">Your Contact Info</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+27 82 123 4567"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-king-blue focus:ring-0 font-medium transition-colors bg-gray-50"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                        className="w-full btn-primary h-14 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit Request
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Indicators Section (Why King Cars?) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-gray-900">Why Sell to King Cars?</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of South Africans since 1995</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-king-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
