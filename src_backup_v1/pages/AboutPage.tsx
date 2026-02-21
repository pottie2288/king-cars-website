import { Award, Users, Target, Heart, Phone, MapPin, Mail } from 'lucide-react';
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

  const milestones = [
    { year: '1995', event: 'King Cars founded by Jacques du Plessis' },
    { year: '2014', event: 'Pierre Potgieter appointed Group CEO' },
    { year: '2026', event: 'Continuing legacy of integrity & service' },
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
                It all started in 1995 in Port Elizabeth, now known as Gqeberha. Jacques Du Plessis, youngest brother of the Springbok Rugby legendary Du Plessis brothers, Carel, Michael and Willie started King Cars as an independently owned business. Playing rugby at the highest provincial level for WP and the Eastern Province, Jacques hard-working ethics, integrity and passion for the motor industry led to King Cars being a trusted household name, still many years later.
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

      {/* Milestones Section */}
      <section className="section-padding mb-20">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Milestones
            </h2>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-king-blue/20 sm:-translate-x-1/2" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <AnimatedSection key={index}>
                  <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}>
                    <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-card inline-block">
                        <span className="text-king-cyan font-display font-bold text-xl">
                          {milestone.year}
                        </span>
                        <p className="text-gray-700 mt-1">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-king-blue rounded-full flex items-center justify-center relative z-10 flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="flex-1 hidden sm:block" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding mb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="bg-king-blue rounded-3xl p-8 sm:p-12 text-white">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl text-king-cyan mb-2">
                    5,000+
                  </p>
                  <p className="text-white/80">Cars Sold</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl text-king-cyan mb-2">
                    98%
                  </p>
                  <p className="text-white/80">Satisfaction Rate</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl text-king-cyan mb-2">
                    30+
                  </p>
                  <p className="text-white/80">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-4xl sm:text-5xl text-king-cyan mb-2">
                    2
                  </p>
                  <p className="text-white/80">Locations</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact & Locations Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-king-cyan font-medium text-sm uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">
              Visit Our Showrooms
            </h2>
            <p className="text-gray-600">
              We have branches conveniently located in Cape Town and Port Elizabeth.
              Visit us today or contact our friendly team.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cape Town Region */}
            <div className="space-y-8">
              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Cape Town Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=25%20Strand%20Rd%2C%20Belgravia%2C%20Cape%20Town%2C%207530&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Cape Town</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      25 Strand Rd, Belgravia, Cape Town, 7530
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0219101343" className="hover:text-king-blue transition-colors">(021) 910 1343</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:andresadie@kingcars.co.za" className="hover:text-king-blue transition-colors">andresadie@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Vredekloof Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=2%20Hillcrest%20Rd%2C%20Vredekloof%2C%20Cape%20Town%2C%207560&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Vredekloof</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      2 Hillcrest Rd, Vredekloof, Cape Town, 7560
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0219101343" className="hover:text-king-blue transition-colors">021 910 1343</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:hansie@kingcars.co.za" className="hover:text-king-blue transition-colors">hansie@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Port Elizabeth Region */}
            <div className="space-y-8">
              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Cape Road Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=343%20Cape%20Rd%2C%20Newton%20Park%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Cape Road</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      343 Cape Rd, Newton Park, Port Elizabeth
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0413653900" className="hover:text-king-blue transition-colors">(041) 365 3900</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:justin@kingcars.co.za" className="hover:text-king-blue transition-colors">justin@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  <div className="h-64 w-full bg-gray-100">
                    <iframe
                      title="King Cars Sydenham Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src="https://maps.google.com/maps?q=19%20-%2021%20Uitenhage%20Road%2C%20Sydenham%2C%20Port%20Elizabeth&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display font-bold text-xl text-gray-900 mb-2">King Cars Sydenham</h3>
                    <p className="text-gray-600 mb-4 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-king-cyan flex-shrink-0 mt-0.5" />
                      19 - 21 Uitenhage Road, Sydenham, Port Elizabeth
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-king-blue" />
                        <a href="tel:0414871241" className="hover:text-king-blue transition-colors">(041) 487 1241</a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-king-blue" />
                        <a href="mailto:derick@kingcars.co.za" className="hover:text-king-blue transition-colors">derick@kingcars.co.za</a>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
