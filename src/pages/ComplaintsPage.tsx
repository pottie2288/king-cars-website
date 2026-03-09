import { useState } from 'react';
import { MessageSquareHeart, ThumbsUp, ThumbsDown, Upload, Send, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { SEO } from '@/components/SEO';

export function ComplaintsPage() {
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center px-4">
        <SEO title="Compliments & Complaints" description="Share your experience with King Cars." />
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
      <SEO
        title="Compliments & Complaints"
        description="Share your experience with King Cars. We value your feedback and use it to continuously improve our service."
      />

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
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue text-gray-900 text-sm transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue text-gray-900 text-sm transition-all"
                  />
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
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-king-blue/30 focus:border-king-blue text-gray-900 text-sm transition-all resize-none"
                  />
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
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={e => setter(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">Max. file size: 10 MB</p>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
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
