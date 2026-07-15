'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { getGuestByToken, recordRSVP } from '@/lib/database';
import { Guest } from '@/lib/types';
import InvitationHero from '@/components/InvitationHero';
import { CornerFrame, StarDivider } from '@/components/ornaments';

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
    background: '#4f6f5b',
    borderRadius: '4px',
    color: '#fffaf2',
  },
};

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="h-8 w-8 animate-spin rounded-full border border-sage-dark/50 border-t-gold" />
    </div>
  );
}

function InviteMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sage-dark px-5 text-center text-ivory">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-lg px-7 py-14 sm:px-12 sm:py-16"
      >
        <CornerFrame borderColor="border-gold-soft" />
        <StarDivider />
        <h1 className="mt-7 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-sm font-display text-lg italic leading-8 text-ivory">
          {message}
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex min-h-11 items-center justify-center border border-gold-soft px-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-soft transition-colors hover:bg-gold-soft hover:text-sage-dark"
        >
          Return home
        </Link>
      </motion.div>
    </main>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalidInvitation, setInvalidInvitation] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rsvpStatus: '',
    partySize: 1,
  });

  useEffect(() => {
    setGuest(null);
    setInvalidInvitation(false);
    setLookupError(false);
    setLoading(true);

    if (!token) {
      setLoading(false);
      return;
    }

    getGuestByToken(token)
      .then((data) => {
        if (data) {
          setGuest(data);
        } else {
          setInvalidInvitation(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching guest:', error);
        setLookupError(true);
      })
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
      await recordRSVP({
        guestId: guest?.id,
        invitationToken: token,
        guestName: name,
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

  if (token && invalidInvitation) {
    return (
      <InviteMessage
        title="Invitation link not found."
        message="Please check that the link was copied completely, or ask Hira and Ali to send a fresh invitation."
      />
    );
  }

  if (token && lookupError) {
    return (
      <InviteMessage
        title="Invitation could not be loaded."
        message="Please try again in a moment. If it still does not load, ask Hira and Ali to send a fresh invitation."
      />
    );
  }

  if (submitted) {
    const accepted = formData.rsvpStatus === 'accepted';

    return (
      <InviteMessage
        title={accepted ? 'We look forward to celebrating with you.' : 'You will be missed.'}
        message={
          accepted
            ? 'Your response has been received. We will share any final details with you directly.'
            : 'Thank you for letting us know. You will be in our thoughts on the day.'
        }
      />
    );
  }

  const maximumPartySize = guest ? Math.max(1, guest.partySize || 1) : 6;

  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <Toaster position="top-center" toastOptions={toasterStyle} />

      <InvitationHero groom="Ali" bride="Hira" />

      <section className="px-5 py-14 sm:px-8 sm:py-[4.5rem]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-script text-3xl text-pink-deep sm:text-4xl">Kindly respond</p>
          <h2 className="mt-3 font-display text-4xl text-sage-dark sm:text-5xl">
            {guest ? `Dear ${guest.name},` : 'Will you join us?'}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base font-medium leading-7 text-charcoal">
            Please let us know whether you will be able to join us.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          onSubmit={handleSubmit}
          className="mx-auto mt-9 max-w-2xl space-y-8 border border-gold/40 bg-ivory px-5 py-9 shadow-xl shadow-sage-deep/10 sm:px-10 sm:py-11"
        >
          {!guest && (
            <div>
              <label
                htmlFor="guest-name"
                className="mb-3 block text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sage-dark"
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
                className="w-full border-b border-sage-dark/60 bg-transparent py-3 text-center font-display text-2xl text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
              />
            </div>
          )}

          <fieldset>
            <legend className="mb-5 block w-full text-center font-display text-2xl text-sage-dark sm:text-3xl">
              Will you be joining us?
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className={`min-h-14 border px-4 font-display text-lg transition-all ${
                      selected
                        ? 'border-sage-dark bg-sage-dark text-ivory shadow-md shadow-sage-deep/25'
                        : 'border-gold/60 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
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
                className="mb-3 block text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sage-dark"
              >
                Number of guests
              </label>
              <select
                id="party-size"
                value={formData.partySize}
                onChange={(event) => setFormData({ ...formData, partySize: Number(event.target.value) })}
                className="w-full border-b border-sage-dark/60 bg-transparent py-3 text-center font-display text-xl text-charcoal outline-none transition-colors focus:border-pink-deep"
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
            className="min-h-12 w-full bg-sage-dark px-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ivory shadow-md shadow-sage-deep/25 transition-colors hover:bg-pink-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending response...' : 'Send response'}
          </button>
        </motion.form>
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
