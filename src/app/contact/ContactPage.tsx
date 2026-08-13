'use client'

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { validateSAPhone, validateEmail, validateText, FIELD_LIMITS } from '@/lib/validation';
import { BRANCHES } from '@/data/branches';

const WC_IDS = ['bellville', 'vredekloof', 'brackenfell'];
const EC_IDS = ['17th', 'sydenham', 'newton-park'];

function BranchCard({ branch }: { branch: typeof BRANCHES[number] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <iframe
        src={branch.mapUrl}
        width="100%"
        height="180"
        className="w-full flex-shrink-0 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map – ${branch.fullName}`}
      />
      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <h3 className="font-display font-bold text-base text-gray-900">{branch.fullName}</h3>

        <div className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-king-blue mt-0.5 flex-shrink-0" />
          <span>{branch.address}</span>
        </div>

        {branch.phones.map(p => (
          <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-king-blue transition-colors">
            <Phone className="w-3.5 h-3.5 text-king-blue flex-shrink-0" />
            {p}
          </a>
        ))}

        <a href={`mailto:${branch.email}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-king-blue transition-colors">
          <Mail className="w-3.5 h-3.5 text-king-blue flex-shrink-0" />
          {branch.email}
        </a>

        <div className="flex items-start gap-2 text-sm text-gray-400 pt-2 mt-auto border-t border-gray-100">
          <Clock className="w-3.5 h-3.5 text-king-blue mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <p>Mon – Fri: {branch.hours.weekdays}</p>
            <p>Sat: {branch.hours.saturdays}</p>
            <p>Sun &amp; Public Holidays: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue transition-colors';

export function ContactPage() {
  const wcBranches = BRANCHES.filter(b => WC_IDS.includes(b.id));
  const ecBranches = BRANCHES.filter(b => EC_IDS.includes(b.id));

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const phoneCheck = validateSAPhone(form.phone);
  const emailCheck = validateEmail(form.email);
  const nameCheck = validateText(form.name, 'Full name', FIELD_LIMITS.name);
  const messageCheck = validateText(form.message, 'Message', FIELD_LIMITS.message, { minLength: 5 });

  const formValid = nameCheck.valid && emailCheck.valid && phoneCheck.valid && messageCheck.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setStatus('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        trackEvent('contact_form_submitted');
        return;
      }
      // Show why it was rejected — validation or rate limit — rather than a
      // generic failure the visitor can't act on.
      const payload = await res.json().catch(() => null);
      setErrorMessage(payload?.error ?? null);
      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean page header */}
      <section className="bg-white border-b border-gray-100 section-padding pt-36 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-3">
            Contact <span className="text-king-blue">Us</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Send us a message and we&apos;ll get back to you, or find your nearest branch below.
          </p>
        </div>
      </section>

      <div className="section-padding py-12 max-w-7xl mx-auto space-y-16">

        {/* Form + quick info row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-display font-bold text-xl text-gray-900 mb-6">Send us a message</h2>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle className="w-14 h-14 text-green-500" />
                <p className="font-semibold text-gray-900 text-lg">Message sent!</p>
                <p className="text-gray-500 text-sm">We&apos;ll be in touch within one business day.</p>
                <button
                  onClick={() => { setForm({ name: '', email: '', phone: '', message: '' }); setStatus('idle'); }}
                  className="mt-2 text-king-blue text-sm font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Smith"
                      maxLength={FIELD_LIMITS.name}
                      className={`${inputCls} ${form.name && !nameCheck.valid ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                    {form.name && !nameCheck.valid && (
                      <p className="text-red-500 text-xs mt-1">{nameCheck.error}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 082 000 0000"
                      maxLength={20}
                      className={`${inputCls} ${form.phone && !phoneCheck.valid ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                    {form.phone && !phoneCheck.valid && (
                      <p className="text-red-500 text-xs mt-1">{phoneCheck.error}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. john@gmail.com"
                    maxLength={254}
                    className={`${inputCls} ${form.email && !emailCheck.valid ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''}`}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {form.email && !emailCheck.valid && (
                    <p className="text-red-500 text-xs mt-1">{emailCheck.error}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">How can we help? *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you're looking for or what you need help with..."
                    maxLength={FIELD_LIMITS.message}
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.message.length} / {FIELD_LIMITS.message}
                  </p>
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">
                    {errorMessage ?? 'Something went wrong. Please try again or call us directly.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || !formValid}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-king-blue text-white font-semibold rounded-xl hover:bg-primary-light transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Quick contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
              <h2 className="font-display font-bold text-lg text-gray-900">Quick contact</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">General enquiries</p>
                  <a href="mailto:info@kingcars.co.za" className="flex items-center gap-2 text-sm text-gray-700 hover:text-king-blue transition-colors font-medium">
                    <Mail className="w-4 h-4 text-king-blue flex-shrink-0" />
                    info@kingcars.co.za
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Western Cape</p>
                  <a href="tel:0219101343" className="flex items-center gap-2 text-sm text-gray-700 hover:text-king-blue transition-colors font-medium">
                    <Phone className="w-4 h-4 text-king-blue flex-shrink-0" />
                    021 910 1343
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Eastern Cape</p>
                  <a href="tel:0414871241" className="flex items-center gap-2 text-sm text-gray-700 hover:text-king-blue transition-colors font-medium">
                    <Phone className="w-4 h-4 text-king-blue flex-shrink-0" />
                    041 487 1241
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Business hours</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Monday – Friday</span>
                  <span className="font-medium text-gray-800">08:00 – 17:30</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Saturday</span>
                  <span className="font-medium text-gray-800">09:00 – 13:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Sunday</span>
                  <span className="font-medium text-gray-400">Closed</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Public Holidays</span>
                  <span className="font-medium text-gray-400">Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Western Cape branches */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-king-blue rounded-full" />
            <h2 className="font-display font-bold text-2xl text-gray-900">Western Cape</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {wcBranches.map(b => <BranchCard key={b.id} branch={b} />)}
          </div>
        </section>

        {/* Eastern Cape branches */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-king-cyan rounded-full" />
            <h2 className="font-display font-bold text-2xl text-gray-900">Eastern Cape</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {ecBranches.map(b => <BranchCard key={b.id} branch={b} />)}
          </div>
        </section>

      </div>
    </div>
  );
}
