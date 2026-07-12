'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { getGuestByToken, recordRSVP } from '@/lib/database';
import { Guest } from '@/lib/types';
import InvitationHero from '@/components/InvitationHero';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const toasterStyle = {
  style: {
    background: '#0a2038',
    borderRadius: '4px',
    color: '#f8f5ef',
  },
};

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <div className="h-8 w-8 animate-spin rounded-full border border-gold/30 border-t-gold" />
    </div>
  );
}

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
      .catch((error) => console.error('Error fetching guest:', error))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

  if (loading) return <LoadingScreen />;

  if (!guest) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-5 text-center text-ivory">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md border border-gold/40 px-7 py-12 sm:px-10"
        >
          <p className="font-arabic text-xl text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <h1 className="mt-8 font-display text-4xl">Invitation not found</h1>
          <p className="mt-4 leading-7 text-ivory/65">Please open the personal link that was sent to you.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center border border-ivory/35 px-6 text-sm transition-colors hover:border-gold hover:text-gold"
          >
            Return home
          </Link>
        </motion.div>
      </main>
    );
  }

  if (submitted) {
    const accepted = formData.rsvpStatus === 'accepted';

    return (
      <main className="flex min-h-screen items-center justify-center bg-navy px-5 text-center text-ivory">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg border border-gold/40 px-7 py-12 sm:px-12 sm:py-16"
        >
          <p className="text-sm text-gold">✦</p>
          <h1 className="mt-6 font-display text-5xl">
            {accepted ? 'We look forward to celebrating with you.' : 'You will be missed.'}
          </h1>
          <p className="mx-auto mt-6 max-w-sm leading-7 text-ivory/65">
            {accepted
              ? 'Your response has been received. We will share any final details with you directly.'
              : 'Thank you for letting us know. You will be in our thoughts on the day.'}
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex min-h-11 items-center justify-center border border-ivory/35 px-6 text-sm transition-colors hover:border-gold hover:text-gold"
          >
            Return home
          </Link>
        </motion.div>
      </main>
    );
  }

  const maximumPartySize = Math.max(1, guest.partySize || 1);

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <Toaster position="top-center" toastOptions={toasterStyle} />

      <div className="mx-auto max-w-2xl">
        <InvitationHero groom="Ali" bride="Hira" />
      </div>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-medium uppercase text-sage-deep">Your response</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Dear {guest.name},</h2>
          <p className="mx-auto mt-4 max-w-md leading-7 text-charcoal-soft">
            Please let us know whether you will be able to join us.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-xl space-y-10 border-y border-charcoal/15 py-10 sm:py-12"
        >
          <fieldset>
            <legend className="mb-5 block w-full text-center font-display text-2xl">
              Will you be joining us?
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: 'accepted', label: 'Joyfully accept' },
                { value: 'declined', label: 'Regretfully decline' },
              ].map((option) => {
                const selected = formData.rsvpStatus === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFormData({ ...formData, rsvpStatus: option.value })}
                    className={`min-h-14 border px-3 text-xs transition-colors sm:text-sm ${
                      selected
                        ? 'border-navy bg-navy text-ivory'
                        : 'border-charcoal/20 bg-transparent text-charcoal hover:border-navy'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {formData.rsvpStatus === 'accepted' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-8 overflow-hidden"
            >
              <div>
                <label htmlFor="party-size" className="mb-3 block text-xs font-medium uppercase text-charcoal-soft">
                  Number of guests
                </label>
                <select
                  id="party-size"
                  value={formData.partySize}
                  onChange={(event) => setFormData({ ...formData, partySize: Number(event.target.value) })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-3 outline-none transition-colors focus:border-navy"
                >
                  {Array.from({ length: maximumPartySize }, (_, index) => index + 1).map((number) => (
                    <option key={number} value={number}>
                      {number} {number === 1 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dietary-notes" className="mb-3 block text-xs font-medium uppercase text-charcoal-soft">
                  Dietary notes
                </label>
                <input
                  id="dietary-notes"
                  type="text"
                  placeholder="Allergies or dietary preferences"
                  value={formData.dietaryRestrictions}
                  onChange={(event) => setFormData({ ...formData, dietaryRestrictions: event.target.value })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-3 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
                />
              </div>
            </motion.div>
          )}

          <div>
            <label htmlFor="guest-note" className="mb-3 block text-xs font-medium uppercase text-charcoal-soft">
              Note to the couple <span className="normal-case">(optional)</span>
            </label>
            <textarea
              id="guest-note"
              placeholder="Share your wishes"
              value={formData.specialRequests}
              onChange={(event) => setFormData({ ...formData, specialRequests: event.target.value })}
              rows={3}
              className="w-full resize-none border-b border-charcoal/25 bg-transparent py-3 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="min-h-12 w-full bg-navy px-6 text-sm font-medium text-ivory transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Sending response...' : 'Send response'}
          </button>
        </motion.form>

        <div className="mx-auto mt-9 max-w-xl text-center">
          <Link href="/" className="text-sm text-charcoal-soft underline decoration-charcoal/25 underline-offset-4 hover:text-charcoal">
            Back to Hira &amp; Ali
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <InviteContent />
    </Suspense>
  );
}
