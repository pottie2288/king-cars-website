import { useState } from 'react';
import { Calculator, Check, Clock, ChevronDown, Phone, Mail, Wallet, TrendingDown, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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

export function FinancePage() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [deposit, setDeposit] = useState(50000);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(11.5);

  // Calculate monthly payment
  const principal = loanAmount - deposit;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = term;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };



  const requirements = [
    'Valid South African ID or passport',
    'Proof of residence (not older than 3 months)',
    'Latest 3 months bank statements',
    'Latest payslip or proof of income',
    'Valid driver\'s license',
  ];

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

              <div className="flex flex-wrap gap-8 mt-12">
                <div className="flex flex-col items-center text-center w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Quick, hassle-free & safe
                  </p>
                </div>

                <div className="flex flex-col items-center text-center w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Private Finance? No Problem
                  </p>
                </div>

                <div className="flex flex-col items-center text-center w-28">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-king-blue">
                    <TrendingDown className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    Lower payments, better terms
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="relative lg:h-[500px] flex items-center justify-center">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
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

      {/* Finance Options Section */}
      <div className="section-padding py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <AnimatedSection>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 leading-tight mb-6">
              We provide various vehicle financing options to meet your needs.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Whether you're purchasing your new ride directly from King Cars or a private owner,
              or simply looking to refinance your current vehicle, our finance division is staffed
              by top financing experts that will guide you through every step of the process.
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            <AnimatedSection>
              <div className="group bg-gray-50 border border-gray-100 hover:border-king-blue/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  I am buying a vehicle from King Cars
                </h3>
                <a href="#contact" className="inline-flex items-center text-king-blue font-medium group-hover:gap-2 transition-all">
                  Apply now <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="group bg-gray-50 border border-gray-100 hover:border-king-blue/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  I am buying/selling a vehicle privately
                </h3>
                <a href="#contact" className="inline-flex items-center text-king-blue font-medium group-hover:gap-2 transition-all">
                  Apply now <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="group bg-gray-50 border border-gray-100 hover:border-king-blue/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-4">
                  I need to refinance my current vehicle
                </h3>
                <a href="#contact" className="inline-flex items-center text-king-blue font-medium group-hover:gap-2 transition-all">
                  Apply now <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </AnimatedSection>
          </div>

        </div>
      </div>

      {/* Calculator Section - Reinserted */}
      <div className="section-padding py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <AnimatedSection>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-4">
              Calculate Your Repayments
            </h2>
            <p className="text-gray-600">
              Use our calculator to estimate your monthly installments based on your budget.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calculator */}
          <AnimatedSection>
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-king-blue/10 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-king-blue" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-xl text-gray-900">
                    Finance Calculator
                  </h2>
                  <p className="text-sm text-gray-500">Estimate your monthly payments</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Vehicle Price</label>
                    <span className="text-sm font-semibold text-king-blue">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-king-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>R50,000</span>
                    <span>R2,000,000</span>
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Deposit</label>
                    <span className="text-sm font-semibold text-king-blue">
                      {formatCurrency(deposit)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={loanAmount * 0.5}
                    step="5000"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-king-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>R0</span>
                    <span>{formatCurrency(loanAmount * 0.5)}</span>
                  </div>
                </div>

                {/* Term */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Repayment Term</label>
                    <span className="text-sm font-semibold text-king-blue">{term} months</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    step="12"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-king-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>12 months</span>
                    <span>72 months</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                    <span className="text-sm font-semibold text-king-blue">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="20"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-king-blue"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>7%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Results */}
          <AnimatedSection>
            <div className="bg-king-blue rounded-3xl p-6 sm:p-8 text-white h-full flex flex-col">
              <h3 className="font-display font-semibold text-xl mb-8">
                Estimated Monthly Payment
              </h3>

              <div className="text-center mb-8">
                <p className="text-5xl sm:text-6xl font-display font-bold text-king-cyan">
                  {formatCurrency(monthlyPayment)}
                </p>
                <p className="text-white/70 mt-2">per month</p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between py-3 border-b border-white/20">
                  <span className="text-white/70">Vehicle Price</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/20">
                  <span className="text-white/70">Less: Deposit</span>
                  <span className="font-medium">{formatCurrency(deposit)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/20">
                  <span className="text-white/70">Loan Amount</span>
                  <span className="font-medium">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/20">
                  <span className="text-white/70">Total Interest</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-white/70">Total Cost</span>
                  <span className="font-medium">{formatCurrency(totalPayment + deposit)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <a
                  href="tel:+27215551234"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-king-cyan text-white rounded-xl font-medium hover:bg-accent-light transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Apply for Finance
                </a>
                <p className="text-center text-sm text-white/60 mt-4">
                  This is an estimate. Actual rates may vary.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-8 shadow-card">
            <h2 className="font-display font-semibold text-2xl text-gray-900 mb-6">
              What You Need to Apply
            </h2>
            <div className="space-y-4">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-king-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-king-cyan" />
                  </div>
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="bg-king-dark rounded-3xl p-8 text-white h-full">
            <h2 className="font-display font-semibold text-2xl mb-6">
              Get Pre-Approved Today
            </h2>
            <p className="text-white/70 mb-8">
              Take the first step towards owning your dream car. Our finance team
              will guide you through the process and find the best solution for your needs.
            </p>
            <div className="space-y-4">
              <a
                href="tel:+27215551234"
                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                <Phone className="w-6 h-6 text-king-cyan" />
                <div>
                  <p className="text-sm text-white/60">Call us</p>
                  <p className="font-medium">+27 21 555 1234</p>
                </div>
              </a>
              <a
                href="mailto:finance@kingcars.co.za"
                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                <Mail className="w-6 h-6 text-king-cyan" />
                <div>
                  <p className="text-sm text-white/60">Email us</p>
                  <p className="font-medium">finance@kingcars.co.za</p>
                </div>
              </a>
            </div>
          </div>
        </AnimatedSection>
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
