'use client'

import { useState } from 'react';
import { BRANCHES } from '@/data/branches';

export function BranchSection() {
  const [activeBranch, setActiveBranch] = useState(BRANCHES[0]);

  return (
    <div className="space-y-8">
      {/* Branch Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {BRANCHES.map((branch) => (
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
