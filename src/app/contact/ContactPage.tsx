'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { BRANCHES } from '@/data/branches';

const WC_IDS = ['bellville', 'vredekloof', 'brackenfell'];
const EC_IDS = ['17th', 'sydenham', 'newton-park'];

function BranchCard({ branch }: { branch: typeof BRANCHES[number] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <iframe
        src={branch.mapUrl}
        width="100%"
        height="200"
        className="w-full flex-shrink-0 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map – ${branch.fullName}`}
      />
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display font-bold text-lg text-gray-900">{branch.fullName}</h3>

        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-king-blue mt-0.5 flex-shrink-0" />
          <span>{branch.address}</span>
        </div>

        <div className="flex flex-col gap-1">
          {branch.phones.map(p => (
            <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-king-blue transition-colors">
              <Phone className="w-4 h-4 text-king-blue flex-shrink-0" />
              {p}
            </a>
          ))}
        </div>

        <a href={`mailto:${branch.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-king-blue transition-colors">
          <Mail className="w-4 h-4 text-king-blue flex-shrink-0" />
          {branch.email}
        </a>

        <div className="flex items-start gap-2 text-sm text-gray-600 mt-auto pt-2 border-t border-gray-100">
          <Clock className="w-4 h-4 text-king-blue mt-0.5 flex-shrink-0" />
          <div>
            <p>Mon – Fri: {branch.hours.weekdays}</p>
            <p>Sat: {branch.hours.saturdays}</p>
            <p>Sun &amp; Public Holidays: {branch.hours.sundays}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const wcBranches = BRANCHES.filter(b => WC_IDS.includes(b.id));
  const ecBranches = BRANCHES.filter(b => EC_IDS.includes(b.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-king-blue section-padding pt-36 pb-16 text-center">
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4">
          Contact <span className="text-king-blue">Us</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Visit one of our six branches across the Western Cape and Eastern Cape,
          or reach us by phone or email — we&apos;re here to help.
        </p>
      </section>

      {/* General email banner */}
      <div className="bg-king-blue text-white">
        <div className="section-padding py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <Mail className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">General enquiries:</span>
          <a href="mailto:info@kingcars.co.za" className="font-semibold underline underline-offset-2 hover:text-king-cyan transition-colors">
            info@kingcars.co.za
          </a>
        </div>
      </div>

      <div className="section-padding py-16 space-y-16">
        {/* Western Cape */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-king-blue rounded-full" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">Western Cape</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wcBranches.map(b => <BranchCard key={b.id} branch={b} />)}
          </div>
        </section>

        {/* Eastern Cape */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-king-cyan rounded-full" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">Eastern Cape</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ecBranches.map(b => <BranchCard key={b.id} branch={b} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
