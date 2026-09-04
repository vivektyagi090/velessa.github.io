import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const FAQS = [
  {
    q: 'How can I determine my exact ring size?',
    a: 'We offer a complimentary digital sizing guide and can dispatch a physical luxury ring sizer to your residence worldwide. You may also schedule a private consultation at our Milan or New York salons.'
  },
  {
    q: 'Are Velessa creations forged in solid 18k gold?',
    a: 'Yes, without exception. We never use thin electroplate over base brass. Every piece is cast in solid 18k gold (750 hallmark) or 950 Platinum, ensuring it will never tarnish, peel, or irritate sensitive skin.'
  },
  {
    q: 'What is your insured shipping policy?',
    a: 'All acquisitions over $250 include complimentary insured white-glove courier shipping with real-time GPS tracking and adult signature required upon physical handoff.'
  },
  {
    q: 'Can I commission a bespoke engagement or heirloom piece?',
    a: 'Our master goldsmiths accept a limited number of bespoke private commissions each quarter. Please select "Bespoke Atelier Commission" in the subject dropdown to initiate a design consultation.'
  }
];

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Concierge Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);
    setIsSubmitted(true);
    showToast('Your message has been received by our salon concierge.', 'success', 'Inquiry Dispatched');
  };

  return (
    <div className="min-h-screen bg-ivory pb-24">
      {/* Banner */}
      <div className="bg-beige/30 border-b border-beige py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-medium mb-2 block">
            Atelier Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-charcoal tracking-tight">
            Contact & Private Appointments
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted font-sans mt-2 max-w-lg mx-auto">
            Our private client concierge is at your service to assist with bespoke commissions, acquisitions, and sizing consultations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumb items={[{ label: 'Concierge & Contact' }]} />

        {/* Two-column layout: Form & Salon Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-beige p-6 sm:p-10 rounded-sm shadow-sm">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light mb-2">
              Send a Salon Inquiry
            </h2>
            <p className="text-xs text-charcoal-muted font-sans mb-6">
              Our specialists respond within 12 business hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 bg-champagne/10 border border-champagne/30 text-center rounded-sm space-y-4">
                <div className="w-12 h-12 rounded-full bg-champagne/20 flex items-center justify-center mx-auto text-champagne">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">Thank You, {formData.name}</h3>
                <p className="text-xs text-charcoal-muted font-sans max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been assigned to a senior jewelry specialist. A personalized response will be dispatched to <strong className="text-charcoal">{formData.email}</strong>.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lady Vivienne Montgomery"
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. vivienne@example.com"
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Telephone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne cursor-pointer"
                    >
                      <option value="General Concierge Inquiry">General Concierge Inquiry</option>
                      <option value="Private Salon Appointment">Private Salon Appointment</option>
                      <option value="Bespoke Atelier Commission">Bespoke Atelier Commission</option>
                      <option value="Ring Sizing & Resizing">Ring Sizing & Resizing</option>
                      <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the creation you are inquiring about, appointment date preferences, or custom requirements..."
                    className="w-full p-3 bg-beige/20 border border-beige rounded-xs outline-none focus:border-champagne resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="shadow-md"
                  >
                    Dispatch Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Salon Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-beige p-6 sm:p-8 rounded-sm shadow-sm space-y-6 font-sans text-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-champagne font-semibold block">
                Salon Information
              </span>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-charcoal font-serif">Flagship Atelier</strong>
                    <p className="text-charcoal-muted leading-relaxed mt-0.5">
                      Via Monte Napoleone 8, 20121 Milano, Italy <br />
                      Fifth Avenue Salon, 740 5th Ave, New York, NY 10019
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-charcoal font-serif">Concierge Direct</strong>
                    <p className="text-charcoal-muted leading-relaxed mt-0.5">
                      +1 (800) 835-3772 (US Toll-Free) <br />
                      +39 02 876 5432 (Milan Atelier)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-charcoal font-serif">Private Inquiries</strong>
                    <p className="text-charcoal-muted leading-relaxed mt-0.5">
                      concierge@velessa-jewellery.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-charcoal font-serif">Salon Hours</strong>
                    <p className="text-charcoal-muted leading-relaxed mt-0.5">
                      Monday – Saturday: 10:00 AM – 7:00 PM <br />
                      Sunday: Private Bookings By Appointment Only
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-beige">
                <div className="p-4 bg-beige/30 rounded-xs flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-champagne shrink-0" />
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    Private evening appointments can be arranged with our Senior Master Goldsmith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-20 pt-16 border-t border-beige">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-champagne font-sans font-semibold">
              Collector Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-beige rounded-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-serif text-lg text-charcoal hover:text-champagne transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-champagne shrink-0 transition-transform duration-300 ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-charcoal-muted font-sans leading-relaxed border-t border-beige/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
