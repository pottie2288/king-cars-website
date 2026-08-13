'use client'

import { useState } from 'react';
import { MessageSquareHeart, ThumbsUp, ThumbsDown, Upload, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { validateSAPhone, validateEmail, validateText, FIELD_LIMITS } from '@/lib/validation';
import { AnimatedSection } from '@/components/AnimatedSection';

export function ComplaintsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('Compliment');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    description: '',
  });
  const [attachment1, setAttachment1] = useState<File | null>(null);
  const [attachment2, setAttachment2] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const phoneCheck = validateSAPhone(form.phone);
  const emailCheck = validateEmail(form.email);
  const firstNameCheck = validateText(form.firstName, 'First name', FIELD_LIMITS.firstName);
  const lastNameCheck = validateText(form.lastName, 'Last name', FIELD_LIMITS.lastName);
  const descriptionCheck = validateText(form.description, 'Description', FIELD_LIMITS.description, { minLength: 10 });

  const formValid =
    firstNameCheck.valid &&
    lastNameCheck.valid &&
    phoneCheck.valid &&
    emailCheck.valid &&
    descriptionCheck.valid;

  /** Mirror the server's file rules in the browser so problems surface immediately. */
  const handleAttachment = (file: File | null, setter: (f: File | null) => void) => {
    setAttachmentError(null);

    if (!file) {
      setter(null);
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setAttachmentError(`"${file.name}" isn’t a supported file type. Please attach a JPG, PNG, WEBP or PDF.`);
      setter(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError(`"${file.name}" is larger than 5MB. Please attach a smaller file.`);
      setter(null);
      return;
    }

    setter(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formValid) return;
    setError(false);
    setErrorMessage(null);
    try {
      const body = new FormData();
      (Object.entries(form) as [string, string][]).forEach(([k, v]) => body.append(k, v));
      body.append('reason', reason);
      if (attachment1) body.append('attachment1', attachment1, attachment1.name);
      if (attachment2) body.append('attachment2', attachment2, attachment2.name);
      const res = await fetch('/api/complaints', { method: 'POST', body });
      if (!res.ok) {
        // Show the server's actual reason so the sender can correct it.
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? `Complaints request failed: ${res.status}`);
      }
      setSubmitted(true);
      trackEvent('feedback_submitted', { reason });
    } catch (err) {
      // Don't fake success — surface an honest error so the message isn't lost silently.
      setError(true);
      setErrorMessage(err instanceof Error ? err.message : null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center px-4">
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-12 shadow-card border border-gray-100 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-gray-500 mb-8">
              {errorMessage ?? 'We couldn’t submit your message just now.'} Your details are still here —
              please try again. If it keeps happening, call us on{' '}
              <a href="tel:0835008181" className="text-king-blue font-semibold">083 500 8181</a>.
            </p>
            <button onClick={() => handleSubmit()} className="btn-primary">
              Try Again
            </button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center px-4">
        <AnimatedSection>
          <div className="bg-white rounded-3xl p-12 shadow-card border border-gray-100 text-center max-w-lg w-full">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-500 mb-8">
              Your {reason.toLowerCase()} has been submitted. Our team will review it and get back to you within 2 business days.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', phone: '', email: '', description: '' }); setAttachment1(null); setAttachment2(null); }}
              className="btn-primary"
            >
              Submit Another
            </button>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Banner */}
      <div className="bg-king-blue pt-32 pb-14 px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MessageSquareHeart className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Compliments & Complaints
            </h1>
            <p className="text-white/75 text-lg max-w-xl mx-auto">
              Your feedback matters to us. Whether you had an exceptional experience or something didn't meet your expectations — we want to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="section-padding">
        <div className="max-w-2xl mx-auto">

          {/* Reason Toggle */}
          <AnimatedSection>
            <div className="flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => setReason('Compliment')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${
                  reason === 'Compliment'
                    ? 'bg-king-blue border-king-blue text-white shadow-lg'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-king-blue hover:text-king-blue'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Compliment
              </button>
              <button
                type="button"
                onClick={() => setReason('Complaint')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${
                  reason === 'Complaint'
                    ? 'bg-red-500 border-red-500 text-white shadow-lg'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Complaint
              </button>
            </div>
          </AnimatedSection>

          {/* Form Card */}
          <AnimatedSection>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name Row */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="First"
                        required
                        maxLength={FIELD_LIMITS.firstName}
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue text-gray-900 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last"
                        required
                        maxLength={FIELD_LIMITS.lastName}
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue text-gray-900 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 082 123 4567"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-900 text-sm transition-all ${
                      form.phone && !phoneCheck.valid
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-200 focus:ring-king-blue/30 focus:border-king-blue'
                    }`}
                  />
                  {form.phone && !phoneCheck.valid && (
                    <p className="text-red-500 text-xs mt-1">{phoneCheck.error}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-900 text-sm transition-all ${
                      form.email && !emailCheck.valid
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-200 focus:ring-king-blue/30 focus:border-king-blue'
                    }`}
                  />
                  {form.email && !emailCheck.valid && (
                    <p className="text-red-500 text-xs mt-1">{emailCheck.error}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please describe your {reason.toLowerCase()} in detail <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder={reason === 'Compliment'
                      ? 'Tell us what made your experience great...'
                      : 'Tell us what went wrong and how we can improve...'}
                    maxLength={FIELD_LIMITS.description}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-gray-900 text-sm transition-all resize-none ${
                      form.description && !descriptionCheck.valid
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-gray-200 focus:ring-king-blue/30 focus:border-king-blue'
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3 mt-1">
                    <p className="text-red-500 text-xs">
                      {form.description && !descriptionCheck.valid ? descriptionCheck.error : ''}
                    </p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {form.description.length} / {FIELD_LIMITS.description}
                    </p>
                  </div>
                </div>

                {/* Attachments */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Attachment 1', file: attachment1, setter: setAttachment1 },
                    { label: 'Attachment 2', file: attachment2, setter: setAttachment2 },
                  ].map(({ label, file, setter }) => (
                    <div key={label}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                      <label className="flex flex-col items-center justify-center gap-2 w-full py-5 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-king-blue hover:bg-blue-50/40 transition-all">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-400 text-center px-2">
                          {file ? file.name : 'Choose file'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
                          className="hidden"
                          onChange={e => handleAttachment(e.target.files?.[0] ?? null, setter)}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP or PDF — max 5 MB</p>
                    </div>
                  ))}
                </div>

                {attachmentError && (
                  <p className="flex items-start gap-1.5 text-red-500 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {attachmentError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!formValid}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg ${
                    reason === 'Complaint'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-king-blue hover:bg-king-blue/90'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit {reason}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
