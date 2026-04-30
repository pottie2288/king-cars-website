'use client'

import { Award, Users, Target, Heart, Star, MapPin, Phone, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { BRANCHES } from '@/data/branches';
import Link from 'next/link';

export function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Family Driven',
      description: 'At King Cars, family isn\'t just a word — it\'s how we operate. Every member of our team is treated with respect and care, and that same warmth extends to every customer who walks through our doors. We believe that when people feel at home, they make better decisions and leave with real confidence in their purchase.',
    },
    {
      icon: Award,
      title: 'Service Excellence',
      description: 'Excellence isn\'t achieved by accident. We invest in our people, our processes, and our vehicles to ensure that every interaction — from the first phone call to the final handshake — exceeds your expectations. Our team is trained to listen, advise honestly, and consistently go further than required.',
    },
    {
      icon: Target,
      title: 'Integrity & Honesty',
      description: 'In an industry where trust can be hard to come by, we\'ve built our name on transparency. Our pricing is straightforward, our advice is honest, and our deals are fair. What you see is what you get — every time, without exception. That\'s a promise we\'ve kept since 1995.',
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'King Cars has deep roots in the Western Cape and Eastern Cape. We employ locally, support local causes, and take pride in being more than just a dealership. We are neighbours — and we take that responsibility seriously. Giving back to the communities that trust us is not optional; it\'s part of who we are.',
    },
  ];

  const stats = [
    { value: '30+', label: 'Years Experience' },
    { value: '50,000+', label: 'Cars Sold' },
    { value: '4.8', label: 'Google Reviews' },
    { value: '6', label: 'Locations' },
  ];



  return (
    <div className="min-h-screen bg-gray-50 pt-36 lg:pt-56 pb-12">
      {/* Hero Section */}
      <section className="section-padding mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <AnimatedSection>
              <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
                About Us
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mt-2 mb-6">
                The King Cars Journey
              </h1>
              <h2 className="font-display font-bold text-2xl text-gray-800 mb-4">
                And Now
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                King Cars, now more than ever, is committed to taking the journey with you. From buying your first-ever car, trading in for a family-friendly vehicle or settling down with ‘the last one’, King Cars promises to be there, every kilometer of the way.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From the paperwork, to the road and beyond, King Cars will be with you, advising and sharing our industry knowledge, helping each customer make the right purchasing decision for the path they are currently on. Take the journey with King Cars for affordable, trustworthy and reliable vehicles and services.
              </p>

            </AnimatedSection>
            <AnimatedSection>
              <div className="relative">
                <img
                  src="/about-showroom.png"
                  alt="King Cars Showroom"
                  className="rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-king-blue text-white rounded-2xl p-6 shadow-xl">
                  <p className="font-display font-bold text-4xl">30+</p>
                  <p className="text-white/80">Years of Excellence</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* History Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection>
              <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">
                How It Started
              </h3>
              <p className="text-gray-600 leading-relaxed">
                It all started in 1995 in Port Elizabeth, now known as Gqeberha. Jacques Du Plessis, youngest brother of the Springbok Rugby legendary Du Plessis brothers, Carel, Michael and Willie started King Cars as an independently owned business. Playing rugby at the highest provincial level for WP and the Eastern Cape, Jacques hard-working ethics, integrity and passion for the motor industry led to King Cars being a trusted household name, still many years later.
              </p>
            </AnimatedSection>
            <AnimatedSection>
              <h3 className="font-display font-bold text-2xl text-gray-900 mb-4">
                Then (2014)
              </h3>
              <p className="text-gray-600 leading-relaxed">
                In 2014, Pierre Potgieter, a financial accountant with 28 years’ experience in commerce and the motor trade teamed up with Jacques, becoming the King Cars Group new CEO. Driven by the same level of integrity as Jacques, Pierre has an immense love for people and a passion to not only deliver a valuable and reliable service, with respect, but to serve the community and offer each client the highest possible quality products.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
                What We Stand For
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              The principles behind every car we sell and every customer we serve.
            </p>
          </AnimatedSection>

          <div className="divide-y divide-gray-100">
            {values.map((value, index) => (
              <AnimatedSection key={index}>
                <div className="group grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-6 md:gap-16 py-10 items-center">
                  <div className="flex items-start gap-5">
                    <div className="w-[3px] shrink-0 bg-king-cyan rounded-full mt-3 group-hover:bg-king-cyan/80 transition-colors self-stretch max-h-24" />
                    <div>
                      <span className="font-black text-[80px] leading-none text-gray-100 select-none group-hover:text-king-blue/10 transition-colors duration-500 block">
                        {index + 1}
                      </span>
                      <h3 className="font-display font-bold text-2xl text-gray-900 -mt-2">
                        {value.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed md:border-l md:border-gray-100 md:pl-16">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — image left, numbers right */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[360px]">
          <div
            className="relative min-h-[260px] lg:min-h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/hero-showroom.png)' }}
          >
            <div className="absolute inset-0 bg-king-blue/60" />
            <div className="absolute inset-0 flex items-end p-10">
              <p className="text-white/80 text-lg italic leading-relaxed max-w-sm">
                "Taking the journey with you — every kilometre of the way."
              </p>
            </div>
          </div>

          <div className="bg-king-blue section-padding py-14">
            <div className="grid grid-cols-2 gap-y-10 gap-x-6 h-full content-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-display font-black text-5xl text-white mb-1 flex items-center gap-2">
                    {stat.value}
                    {stat.value === '4.8' && <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />}
                  </p>
                  <p className="text-white/60 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Finance Partners */}
      <section className="section-padding py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
            <AnimatedSection>
              <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">Finance</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-6">
                We Work With SA's<br />Leading Banks
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Getting finance shouldn't be stressful. Our team — licensed through FSP No. 10220 — works directly with South Africa's top banks and private lenders to secure you the most competitive rate available.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're a first-time buyer or upgrading, we handle all the paperwork and guide you through every step. Trade-ins are also welcome — we'll assess your current car fairly and apply it directly to your deal.
              </p>
              <Link href="/finance" className="btn-primary inline-flex items-center gap-2">
                Explore Finance Options
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection className="flex flex-col h-full">
              <div className="grid grid-cols-3 gap-3 flex-1">
                {['absa', 'fnb', 'nedbank', 'standardbank', 'wesbank', 'capitec'].map(bank => (
                  <div
                    key={bank}
                    className="bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center hover:border-gray-200 hover:shadow-sm transition-all duration-200 p-4"
                  >
                    <img
                      src={`/banks/${bank}.png`}
                      alt={bank}
                      className="w-full max-h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs text-center mt-4">
                Competitive rates through multiple lenders — we find the best fit for you.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Locations */}
      <section className="section-padding py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">Find Us</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Our Locations
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              6 branches across the Western Cape and Eastern Cape — always close to home.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="bg-king-blue px-8 py-5 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/70" />
                  <h3 className="font-display font-bold text-xl text-white">Western Cape</h3>
                  <span className="ml-auto text-white/50 text-sm">3 branches</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {BRANCHES.filter(b => ['bellville', 'vredekloof', 'brackenfell'].includes(b.id)).map(branch => (
                    <div key={branch.id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900 mb-1">{branch.fullName}</p>
                      <p className="text-gray-500 text-sm mb-3">{branch.address}</p>
                      <a
                        href={`tel:${branch.phones[0].replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-king-blue font-semibold text-sm hover:text-king-cyan transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {branch.phones[0]}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="bg-gray-800 px-8 py-5 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/70" />
                  <h3 className="font-display font-bold text-xl text-white">Eastern Cape</h3>
                  <span className="ml-auto text-white/50 text-sm">3 branches</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {BRANCHES.filter(b => ['17th', 'sydenham', 'newton-park'].includes(b.id)).map(branch => (
                    <div key={branch.id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900 mb-1">{branch.fullName}</p>
                      <p className="text-gray-500 text-sm mb-3">{branch.address}</p>
                      <a
                        href={`tel:${branch.phones[0].replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-2 text-king-blue font-semibold text-sm hover:text-king-cyan transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {branch.phones[0]}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trust — Blue Chip logo + credentials as earned trust, not icon cards */}
      <section className="section-padding py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">Our Credentials</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
              Trusted, Licensed & Recognised
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Member of</p>
                <img
                  src="/bluechip-dealer-logo.png"
                  alt="Blue Chip Dealer Group"
                  className="h-24 w-auto object-contain mb-6"
                />
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                  An exclusive network of South Africa's most trusted independent dealerships, united by a shared commitment to integrity and service excellence.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-6">
                <div className="border-l-4 border-king-blue pl-6 py-2">
                  <p className="font-display font-bold text-lg text-gray-900 mb-1">
                    Authorised Financial Services Provider
                  </p>
                  <p className="text-king-blue font-semibold text-sm mb-2">FSP Licence No. 10220</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We are fully compliant with FSCA regulations, meaning you can trust the finance advice and deals our team provides are held to the highest legal standard.
                  </p>
                </div>

                <div className="border-l-4 border-king-cyan pl-6 py-2">
                  <p className="font-display font-bold text-lg text-gray-900 mb-1">
                    IDA Member
                  </p>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Independent Dealers Association of South Africa</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Proud member of the body that sets and enforces standards for independent vehicle dealers across South Africa, ensuring fair and transparent practices.
                  </p>
                </div>

                <div className="border-l-4 border-gray-200 pl-6 py-2">
                  <p className="font-display font-bold text-lg text-gray-900 mb-1">
                    4.8 ★ on Google Reviews
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Thousands of South Africans have rated their King Cars experience. Our reputation is built one customer at a time — and we take that seriously.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA over showroom image */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/about-showroom.png)' }}
        />
        <div className="absolute inset-0 bg-king-blue/85" />
        <div className="relative section-padding py-24 text-center">
          <AnimatedSection>
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">Get Started</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mt-3 mb-5">
              Ready to Find Your Next Car?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Browse over 200 quality-inspected vehicles across our 6 locations. Transparent pricing, flexible finance, and a team that genuinely cares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/showroom" className="btn-accent inline-flex items-center gap-2">
                Browse Showroom
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sell-your-car"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-200 min-h-[44px]"
              >
                Sell Your Car
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
