import { Award, Users, Target, Heart, Shield, Star } from 'lucide-react';
import { SEO } from '@/components/SEO';

import { AnimatedSection } from '@/components/AnimatedSection';

export function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Family Driven',
      description: 'We treat both employees and customers like family, creating a home where people want to be.',
    },
    {
      icon: Award,
      title: 'Service Excellence',
      description: 'We prioritize quality, price, and excellent customer service, going the extra mile to understand your needs.',
    },
    {
      icon: Target,
      title: 'Integrity & Honesty',
      description: 'We guide every transaction with core principles of honesty, integrity, and loyalty.',
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'We are dedicated to making a positive difference in people\'s lives and assisting our local communities.',
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
      <SEO
        title="About King Cars"
        description="Learn about our history, values, and the team behind King Cars. Family-owned and operated since 1995."
      />
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
      <section className="section-padding mb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600">
              Our core values guide every decision we make and every interaction we have
              with our customers.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={index}>
                <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 h-full text-center">
                  <div className="w-16 h-16 bg-king-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-king-blue" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="section-padding mb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Our Impact
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              King Cars in Numbers
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-king-blue mb-2 flex items-center justify-center gap-2">
                    {stat.value}
                    {stat.value === '4.8' && (
                      <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 fill-yellow-400 text-yellow-400 inline-block" />
                    )}
                  </p>
                  <p className="text-gray-600 font-medium text-lg sm:text-xl">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust & Partnerships Section */}
      <section className="section-padding pb-24 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Trust & Partnerships
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2">
              Our Professional Affiliations
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-card transition-all duration-300 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-king-blue/5 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-king-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Authorised Service Provider</h3>
                <p className="text-king-blue font-semibold mb-2">FSP Licence No. 10220</p>
                <p className="text-gray-500 text-sm">Compliant with financial regulations to provide expert advice.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-card transition-all duration-300 h-full flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-king-blue rounded-2xl flex items-center justify-center rotate-3 shadow-lg">
                    <span className="text-white font-display font-black text-2xl">BC</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Blue Chip Dealer Group</h3>
                <p className="text-gray-500 text-sm">Exclusive association of elite dealerships focused on integrity.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center hover:shadow-card transition-all duration-300 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-king-blue/5 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-king-blue" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">IDA Member</h3>
                <p className="text-gray-500 text-sm">Proud member of the Independent Dealers Association of South Africa.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </div>
  );
}
