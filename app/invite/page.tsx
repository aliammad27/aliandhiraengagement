'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getGuestByToken, recordRSVP } from '@/lib/database';
import { Guest } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: 'easeOut' },
  }),
};

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rsvpStatus: '',
    partySize: 1,
    dietaryRestrictions: '',
    specialRequests: '',
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getGuestByToken(token)
      .then((data) => setGuest(data || null))
      .catch((e) => console.error('Error fetching guest:', e))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    if (!formData.rsvpStatus) {
      toast.error('Please let us know if you can attend');
      return;
    }

    setSubmitting(true);
    try {
      await recordRSVP({
        guestId: guest.id,
        eventId: 'main',
        status: formData.rsvpStatus as 'accepted' | 'declined',
        partySize: Number(formData.partySize),
        dietaryRestrictions: formData.dietaryRestrictions,
        specialRequests: formData.specialRequests,
        respondedAt: new Date(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border border-gold/30 border-t-gold rounded-full"
        />
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p className="eyebrow text-gold mb-4">Invitation</p>
          <h1 className="font-display text-4xl mb-4">We couldn’t find your invitation</h1>
          <p className="text-charcoal-soft font-light">Please double-check the link you were sent.</p>
          <Link href="/" className="inline-block mt-8 eyebrow text-charcoal border-b border-gold pb-1">Return Home</Link>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory px-6 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-md">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="font-script text-7xl text-gold mb-6"
          >
            {formData.rsvpStatus === 'accepted' ? 'Thank you' : 'With love'}
          </motion.div>
          <h1 className="font-display text-3xl mb-4">
            {formData.rsvpStatus === 'accepted'
              ? 'We can’t wait to celebrate with you'
              : 'You’ll be dearly missed'}
          </h1>
          <p className="text-charcoal-soft font-light mb-10">
            {formData.rsvpStatus === 'accepted'
              ? 'Your response has been received. We’ll be in touch with all the details soon.'
              : 'Thank you for letting us know. You’ll be with us in spirit.'}
          </p>
          <Link href="/" className="eyebrow text-charcoal border-b border-gold pb-1">Return Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal py-16 sm:py-24 px-6">
      <Toaster position="top-center" toastOptions={{ style: { background: '#2c2a28', color: '#faf7f2' } }} />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-xl mx-auto text-center mb-12">
        <p className="eyebrow text-gold mb-5">You’re Invited</p>
        <h1 className="font-display text-5xl sm:text-6xl mb-4">Dear {guest.name}</h1>
        <div className="flex items-center justify-center gap-4 text-charcoal-soft">
          <span className="hairline w-12" />
          <span className="font-script text-2xl text-gold">join us</span>
          <span className="hairline w-12" />
        </div>
      </motion.div>

      <motion.form
        variants={fadeUp} initial="hidden" animate="visible" custom={1}
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white/60 border border-charcoal/10 rounded-sm p-8 sm:p-12 space-y-10"
      >
        {/* Attendance */}
        <div>
          <label className="block font-display text-2xl mb-5 text-center">Will you be joining us?</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'accepted', label: 'Joyfully Accept' },
              { value: 'declined', label: 'Regretfully Decline' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData({ ...formData, rsvpStatus: opt.value })}
                className={`py-4 px-3 rounded-sm border text-sm tracking-wide transition-all duration-300 ${
                  formData.rsvpStatus === opt.value
                    ? 'border-gold bg-gold/10 text-charcoal'
                    : 'border-charcoal/15 text-charcoal-soft hover:border-gold/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {formData.rsvpStatus === 'accepted' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="space-y-8 overflow-hidden"
          >
            <div>
              <label className="eyebrow text-charcoal-soft block mb-3">Number of Guests</label>
              <select
                value={formData.partySize}
                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                className="w-full bg-transparent border-b border-charcoal/20 py-3 focus:outline-none focus:border-gold transition-colors"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="eyebrow text-charcoal-soft block mb-3">Dietary Notes</label>
              <input
                type="text"
                placeholder="Allergies, preferences…"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                className="w-full bg-transparent border-b border-charcoal/20 py-3 focus:outline-none focus:border-gold transition-colors placeholder:text-charcoal-soft/50"
              />
            </div>
          </motion.div>
        )}

        <div>
          <label className="eyebrow text-charcoal-soft block mb-3">A Note to the Couple <span className="lowercase tracking-normal">(optional)</span></label>
          <textarea
            placeholder="Share your wishes…"
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            rows={3}
            className="w-full bg-transparent border-b border-charcoal/20 py-3 focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-charcoal-soft/50"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-charcoal text-ivory rounded-full py-4 text-sm tracking-wide hover:bg-sage-deep transition-colors duration-500 disabled:opacity-50"
        >
          {submitting ? 'Sending…' : 'Send Response'}
        </button>
      </motion.form>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="w-10 h-10 border border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <InviteContent />
    </Suspense>
  );
}
