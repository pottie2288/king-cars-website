import { useState } from 'react';
import { Clock, ChevronDown, Phone, Wallet, TrendingDown, ArrowRight, Building2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { FinanceApplicationForm } from '@/components/FinanceApplicationForm';

import { SEO } from '@/components/SEO';

const SA_BANKS = [
  { name: 'ABSA',          logo: '/banks/absa.png' },
  { name: 'Standard Bank', logo: '/banks/standardbank.png' },
  { name: 'FNB',           logo: '/banks/fnb.png' },
  { name: 'Nedbank',       logo: '/banks/nedbank.png' },
  { name: 'Capitec',       logo: '/banks/capitec.png' },
  { name: 'WesBank',       logo: '/banks/wesbank.png' },
];


export function FinancePage() {

  const faqs = [
    {
      question: 'What is the minimum deposit required?',
      answer: 'We recommend a minimum deposit of 10% of the vehicle price, but we also offer no-deposit options for qualified buyers.',
    },
    {
      question: 'How long does approval take?',
      answer: 'Most applications are approved within 24-48 hours, provided all required documents are submitted.',
    },
    {
      question: 'Can I finance a used car?',
      answer: 'Yes, we offer financing for both new and quality used vehicles up to 10 years old.',
    },
    {
      question: 'What if I have a poor credit score?',
      answer: 'We work with multiple lenders and may still be able to help. Contact us to discuss your options.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <SEO
        title="Car Finance Calculator"
        description="Calculate your monthly car repayments. We offer vehicle finance through all major banks. Apply online today."
      />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-100/50 skew-x-12 translate-x-1/4" />

        <div className="section-padding relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <AnimatedSection>
              <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-king-blue mb-4 leading-tight">
                FINANCING
                <span className="block text-gray-900 font-light">MADE SIMPLE</span>
              </h1>

              <div className="flex flex-row justify-center lg:justify-start gap-4 sm:gap-8 mt-8 lg:mt-12">
                <div className="flex flex-col items-center text-center w-24 sm:w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Quick, hassle-free & safe
                  </p>
                </div>

                <div className="flex flex-col items-center text-center w-24 sm:w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Private Finance? No Problem
                  </p>
                </div>

                <div className="flex flex-col items-center text-center w-24 sm:w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <TrendingDown className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Lower payments, better terms
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative lg:h-[500px] flex items-center justify-center -mt-8 lg:mt-0">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-showroom.png"
                  alt="Happy couple financing a car"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-king-blue/50 to-transparent opacity-60" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-king-cyan/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-king-blue/20 rounded-full blur-2xl" />
            </AnimatedSection>

          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="section-padding py-24 bg-king-blue relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-king-cyan/10 skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 -skew-x-12 -translate-x-1/4" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-10 leading-tight">
              Put us to the test
              <span className="block text-king-cyan">apply online</span>
            </h2>
            <a
              href="#application-form"
              className="inline-flex items-center justify-center px-12 py-5 bg-king-cyan text-white font-bold text-xl rounded-2xl shadow-lg shadow-king-cyan/30 hover:bg-white hover:text-king-blue hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
            >
              APPLY NOW
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </AnimatedSection>
        </div>
      </div>

      {/* Eligibility & Application Section */}
      <div className="section-padding py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Sidebar: Requirements & Eligibility */}
            <div className="lg:col-span-1 space-y-8">
              <AnimatedSection>
                <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-100">
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-king-blue" />
                    Banks We Work With
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">We submit your application to all major South African banks to get you the best rate.</p>
                  <div className="grid grid-cols-3 gap-5">
                    {SA_BANKS.map((bank) => (
                      <img
                        key={bank.name}
                        src={bank.logo}
                        alt={bank.name}
                        className="w-full h-14 object-contain rounded-xl transition-transform duration-200 hover:scale-110"
                      />
                    ))}
                  </div>
                </div>
              </AnimatedSection>


              <AnimatedSection>
                <div className="bg-king-dark rounded-3xl p-8 text-white">
                  <h3 className="font-display font-bold text-2xl mb-4">Direct Assistance</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Prefer to speak with an expert? Our finance team is standing by to help you.
                  </p>
                  <div className="space-y-4">
                    <a href="tel:+27215551234" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                      <Phone className="w-5 h-5 text-king-cyan" />
                      <div>
                        <p className="text-xs text-white/50">Call Finance Dept</p>
                        <p className="font-medium text-sm">+27 21 555 1234</p>
                      </div>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Content: The Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <FinanceApplicationForm />
              </AnimatedSection>
            </div>

          </div>
        </div>
      </div>


      {/* FAQ Section */}
      <div className="section-padding">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
              Common Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index}>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 animate-fade-in">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}
