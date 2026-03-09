import { useState } from 'react';
import { Check, ChevronRight, Send, Shield, Clock, Banknote, Phone, MapPin, Mail, MessageCircle, UploadCloud } from 'lucide-react';


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

const locations = ['Western Cape', 'Eastern Cape', 'Other'];

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
        description="Get an instant, obligation-free valuation for your vehicle. We buy cars for cash in Western Cape and Eastern Cape."
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

                        {/* File Upload Box */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Upload Your Car Photos</label>
                          <div className="w-full sm:w-1/2 border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-king-blue mb-3 transition-colors" />
                            <p className="text-gray-600 text-sm font-medium">Drop a file here or click to upload (Max. 5 images)</p>
                            <p className="text-gray-400 text-xs mt-1">Maximum file size: 2MB</p>
                          </div>
                        </div>

                        {/* Privacy Policy text */}
                        <div className="md:col-span-2 mt-4 text-sm text-gray-600">
                          <span className="font-bold text-gray-900">Privacy Policy</span> By sending this enquiry, you agree to be contacted by King Cars and have your personal information processed for the purpose of this enquiry, and in doing so agree to our <a href="#" className="text-king-cyan hover:underline hover:text-king-blue font-medium transition-colors">Privacy Policy</a>.
                        </div>

                        {/* Where did you find out about us */}
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-700 mb-2">Where did you find out about us?</label>
                          <select className="w-full h-12 px-4 rounded border border-gray-300 focus:border-king-blue focus:ring-0 text-sm text-gray-500 bg-white">
                            <option value="">Please select one of the options below</option>
                            <option value="google">Google Search</option>
                            <option value="facebook">Facebook</option>
                            <option value="friend">Friend / Family</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className="btn-primary bg-king-dark hover:bg-black text-white px-8 h-12 rounded mt-4"
                      >
                        Submit
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

      {/* Bring Your Car In Section */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Map Side */}
            <div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-gray-900 mb-4">
                Bring Your <span className="font-bold">Car In</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Bring your vehicle to one of our branches and our friendly staff will give you an assessment while you wait! You get an instant appraisal and immediate cash payment should you decide to sell.
              </p>
              
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[300px] w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105995.66018318063!2d18.558776611391515!3d-33.88204642277884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5a1b2413725b%3King%20Cars!5e0!3m2!1sen!2sza!4v1714574900000!5m2!1sen!2sza" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="King Cars Locations Map"
                ></iframe>
              </div>
            </div>

            {/* Contact Details Side */}
            <div>
              <h2 className="font-display font-light text-3xl sm:text-4xl text-gray-900 mb-8 lg:mt-0 mt-8">
                Contact <span className="font-bold">Us</span>
              </h2>
              <p className="text-gray-600 mb-10 leading-relaxed">
                For more information on selling your car, getting an estimate, or how our process works, please feel free to get in touch with us! We're always happy to help.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                
                {/* Contact Option 1 */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Western Cape</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Bellville</span>
                        <a href="tel:0219101343" className="text-sm text-gray-600 hover:text-king-blue">021 910 1343</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Vredekloof</span>
                        <a href="tel:0219101343" className="text-sm text-gray-600 hover:text-king-blue">021 910 1343</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Brackenfell</span>
                        <a href="tel:0219101343" className="text-sm text-gray-600 hover:text-king-blue">021 910 1343</a>
                      </div>
                    </li>
                  </ul>
                  
                  {/* Whatsapp Button */}
                  <a href="https://wa.me/27821234567" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-lg transition-colors shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Now
                  </a>
                </div>

                {/* Contact Option 2 */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Eastern Cape</h3>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">17th Ave</span>
                        <a href="tel:0413653900" className="text-sm text-gray-600 hover:text-king-blue">041 365 3900</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Sydenham</span>
                        <a href="tel:0414871241" className="text-sm text-gray-600 hover:text-king-blue">041 487 1241</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-king-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Phone className="w-4 h-4 text-king-blue" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Newton Park</span>
                        <a href="tel:0413640167" className="text-sm text-gray-600 hover:text-king-blue">041 364 0167</a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-king-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="w-4 h-4 text-king-cyan" />
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">Email Enquiries</span>
                        <a href="mailto:info@kingcars.co.za" className="text-sm text-gray-600 hover:text-king-blue break-all">info@kingcars.co.za</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Section (Why King Cars?) */}
      <div className="bg-gray-50 border-b border-gray-100">
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
