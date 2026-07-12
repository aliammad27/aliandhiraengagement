'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { addGuest, generateInvitationToken, getGuestByToken, recordRSVP } from '@/lib/database';
import { Guest } from '@/lib/types';
import InvitationHero from '@/components/InvitationHero';
import { CornerFrame, StarDivider, navyRadial } from '@/components/ornaments';

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
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'radial-gradient(130% 90% at 50% 22%, #12315a 0%, #0a2038 48%, #051220 100%)' }}
    >
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
    name: '',
    rsvpStatus: '',
    partySize: 1,
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

    const name = guest?.name || formData.name.trim();
    if (!name) {
      toast.error('Please tell us your name');
      return;
    }

    if (!formData.rsvpStatus) {
      toast.error('Please let us know if you can attend');
      return;
    }

    setSubmitting(true);
    try {
      let guestId = guest?.id;

      if (!guestId) {
        guestId = await addGuest({
          name,
          email: '',
          phone: '',
          partySize: Number(formData.partySize),
          invitationToken: generateInvitationToken(),
        });
      }

      await recordRSVP({
        guestId,
        eventId: 'main',
        status: formData.rsvpStatus as 'accepted' | 'declined',
        partySize: Number(formData.partySize),
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

  if (submitted) {
    const accepted = formData.rsvpStatus === 'accepted';

    return (
      <main className="flex min-h-screen items-center justify-center px-5 text-center text-ivory" style={navyRadial}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-lg px-7 py-14 sm:px-12 sm:py-16"
        >
          <CornerFrame borderColor="border-gold/50" />
          <StarDivider />
          <h1 className="mt-7 font-display text-4xl leading-tight sm:text-5xl">
            {accepted ? 'We look forward to celebrating with you.' : 'You will be missed.'}
          </h1>
          <p className="mx-auto mt-6 max-w-sm font-display text-lg italic leading-8 text-ivory/70">
            {accepted
              ? 'Your response has been received. We will share any final details with you directly.'
              : 'Thank you for letting us know. You will be in our thoughts on the day.'}
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex min-h-11 items-center justify-center border border-gold/50 px-6 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Return home
          </Link>
        </motion.div>
      </main>
    );
  }

  const maximumPartySize = guest ? Math.max(1, guest.partySize || 1) : 6;

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
          <p className="font-script text-3xl text-gold">Kindly respond</p>
          <h2 className="mt-4 font-display text-4xl text-navy sm:text-5xl">
            {guest ? `Dear ${guest.name},` : 'Will you join us?'}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-display text-lg italic leading-8 text-charcoal-soft">
            Please let us know whether you will be able to join us.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          onSubmit={handleSubmit}
          className="relative mx-auto mt-10 max-w-xl space-y-10 bg-white px-6 py-12 shadow-xl shadow-navy/10 sm:px-12"
        >
          <CornerFrame borderColor="border-gold/45" />

          {!guest && (
            <div>
              <label
                htmlFor="guest-name"
                className="mb-3 block text-center text-[0.66rem] font-medium uppercase tracking-[0.2em] text-charcoal-soft"
              >
                Your name
              </label>
              <input
                id="guest-name"
                type="text"
                required
                autoComplete="name"
                placeholder="First and last name"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="w-full border-b border-gold/40 bg-transparent py-3 text-center font-display text-xl outline-none transition-colors placeholder:text-charcoal-soft/45 focus:border-navy"
              />
            </div>
          )}

          <fieldset>
            <legend className="mb-6 block w-full text-center font-display text-2xl text-navy">
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
                    className={`min-h-14 border px-3 font-display text-base transition-all sm:text-lg ${
                      selected
                        ? 'border-navy bg-navy text-ivory shadow-md shadow-navy/25'
                        : 'border-gold/40 bg-transparent text-charcoal hover:border-navy hover:text-navy'
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
              className="overflow-hidden"
            >
              <label
                htmlFor="party-size"
                className="mb-3 block text-center text-[0.66rem] font-medium uppercase tracking-[0.2em] text-charcoal-soft"
              >
                Number of guests
              </label>
              <select
                id="party-size"
                value={formData.partySize}
                onChange={(event) => setFormData({ ...formData, partySize: Number(event.target.value) })}
                className="w-full border-b border-gold/40 bg-transparent py-3 text-center font-display text-lg outline-none transition-colors focus:border-navy"
              >
                {Array.from({ length: maximumPartySize }, (_, index) => index + 1).map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="min-h-12 w-full bg-navy px-6 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ivory shadow-md shadow-navy/25 transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Sending response...' : 'Send response'}
          </button>
        </motion.form>

        <div className="mx-auto mt-9 max-w-xl text-center">
          <Link href="/" className="text-sm text-charcoal-soft underline decoration-gold/40 underline-offset-4 transition-colors hover:text-navy">
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
