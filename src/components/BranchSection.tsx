import { useState } from 'react';

export function BranchSection() {
  const branches = [
    {
      id: 'bellville',
      name: 'Bellville',
      fullName: 'King Cars Bellville',
      address: '25 Strand Rd, Bellville, Cape Town, 7530',
      phones: ['021 910 1343'],
      email: 'andresadie@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=25%20Strand%20Rd%2C%20Bellville%2C%20Cape%20Town&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    },
    {
      id: '17th',
      name: '17th Ave',
      fullName: 'King Cars On 17th',
      address: '1 William Moffett Express Way, Walmer, Gqeberha',
      phones: ['041 365 3900'],
      email: 'info@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=1%20William%20Moffett%20Express%20Way%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    },
    {
      id: 'vredekloof',
      name: 'Vredekloof',
      fullName: 'King Cars Vredekloof',
      address: '2 Hillcrest Rd, Vredekloof, Cape Town, 7560',
      phones: ['021 910 1343'],
      email: 'hansie@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=2%20Hillcrest%20Rd%2C%20Vredekloof%2C%20Cape%20Town%2C%207560&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    },
    {
      id: 'sydenham',
      name: 'Sydenham',
      fullName: 'King Cars Sydenham',
      address: '19 - 21 Uitenhage Road, Sydenham, Gqeberha',
      phones: ['041 487 1241'],
      email: 'derick@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=19%20-%2021%20Uitenhage%20Road%2C%20Sydenham%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    },
    {
      id: 'newton-park',
      name: 'Newton Park',
      fullName: 'King Cars Newton Park',
      address: '343 Cape Rd, Newton Park, Gqeberha',
      phones: ['041 364 0167'],
      email: 'justin@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=343%20Cape%20Rd%2C%20Newton%20Park%2C%20Gqeberha&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    },
    {
      id: 'brackenfell',
      name: 'Brackenfell',
      fullName: 'King Cars Brackenfell',
      address: 'Corner of Old Paarl and Ferndale St, Brackenfell, Cape Town',
      phones: ['021 910 1343'],
      email: 'info@kingcars.co.za',
      mapUrl: "https://maps.google.com/maps?q=Corner%20of%20Old%20Paarl%20and%20Ferndale%20St%2C%20Brackenfell%2C%20Cape%20Town&t=&z=15&ie=UTF8&iwloc=&output=embed",
      hours: {
        weekdays: '08:00 to 17:30',
        saturdays: '09:00 to 13:00',
        sundays: 'Closed',
        holidays: 'Closed'
      }
    }
  ];

  const [activeBranch, setActiveBranch] = useState(branches[0]);

  return (
    <div className="space-y-8">
      {/* Branch Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setActiveBranch(branch)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border-2 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap ${activeBranch.id === branch.id
              ? 'bg-king-blue border-king-blue text-white shadow-lg shadow-king-blue/20 scale-105'
              : 'border-king-blue text-king-blue hover:bg-king-blue/5'
              }`}
          >
            {branch.name}
          </button>
        ))}
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl overflow-hidden transition-all duration-500 animate-fade-in">
        <div className="flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-2/5 p-10 lg:p-14 space-y-10">
            <div>
              <h3 className="font-display font-bold text-3xl text-gray-900 mb-8">
                {activeBranch.fullName}
              </h3>

              {/* Mobile Only Map */}
              <div className="lg:hidden w-full h-64 mb-10 rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                <iframe
                  title={`${activeBranch.fullName} Mobile Map`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={activeBranch.mapUrl}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[0.2] contrast-[1.1]"
                />
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${activeBranch.email}`}
                  className="w-full sm:w-64 py-4 px-8 bg-king-blue text-white font-bold rounded-xl text-center hover:bg-king-blue/90 transition-all hover:-translate-y-1 shadow-md"
                >
                  Email us
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeBranch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-64 py-4 px-8 bg-king-blue text-white font-bold rounded-xl text-center hover:bg-king-blue/90 transition-all hover:-translate-y-1 shadow-md"
                >
                  Get directions
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Physical address:</h4>
                <p className="text-gray-600 leading-relaxed max-w-xs">{activeBranch.address}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Contact numbers:</h4>
                {activeBranch.phones.map((phone: string, idx: number) => (
                  <p key={idx} className="text-gray-600">{phone}</p>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Trading hours:</h4>
                <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-gray-600">
                  <span>Monday to Friday:</span><span className="font-medium">{activeBranch.hours.weekdays}</span>
                  <span>Saturdays:</span><span className="font-medium">{activeBranch.hours.saturdays}</span>
                  <span>Sundays:</span><span className="font-medium">{activeBranch.hours.sundays}</span>
                  <span>Public holidays:</span><span className="font-medium">{activeBranch.hours.holidays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side (Desktop Only) */}
          <div className="hidden lg:block lg:w-3/5 min-h-[600px] relative bg-gray-50 border-l border-gray-100">
            <iframe
              title={`${activeBranch.fullName} Map`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '100%' }}
              src={activeBranch.mapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
