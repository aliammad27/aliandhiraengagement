'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getEngagementConfig, getGuestByToken, recordRSVP } from '@/lib/database';
import { EngagementConfig, Guest } from '@/lib/types';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FALLBACK_ENGAGEMENT_DATE = new Date('2026-10-17T12:00:00Z');
const EVENT_ADDRESS = '1204 Middle Ave, Waterford Works, NJ';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ';

const toasterStyle = {
  style: {
    background: '#4f6f5b',
    borderRadius: '4px',
    color: '#fffaf2',
  },
};

type RsvpStatus = 'accepted' | 'declined';

interface OnePageInvitationProps {
  initialToken: string | null;
}

function engagementDisplayDate(value: EngagementConfig['engagementDate'] | undefined) {
  const date = value ? new Date(value) : FALLBACK_ENGAGEMENT_DATE;
  return Number.isNaN(date.getTime()) ? FALLBACK_ENGAGEMENT_DATE : date;
}

function formatEngagementDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });
}

function InlineNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="border border-gold/40 bg-cream px-4 py-4 text-center text-charcoal sm:px-5">
      <p className="font-display text-xl leading-tight text-sage-dark">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal-soft">{message}</p>
    </div>
  );
}

export default function OnePageInvitation({ initialToken }: OnePageInvitationProps) {
  const token = initialToken;

  const [config, setConfig] = useState<EngagementConfig | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(Boolean(token));
  const [invalidInvitation, setInvalidInvitation] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rsvpStatus: '' as RsvpStatus | '',
    partySize: 1,
  });

  useEffect(() => {
    let isMounted = true;

    getEngagementConfig()
      .then((data) => {
        if (isMounted && data) setConfig(data);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    setGuest(null);
    setInvalidInvitation(false);
    setLookupError(false);
    setSubmitted(false);
    setFormData({ name: '', rsvpStatus: '', partySize: 1 });

    if (!token) {
      setRsvpLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setRsvpLoading(true);

    getGuestByToken(token)
      .then((data) => {
        if (!isMounted) return;

        if (data) {
          const savedStatus = data.rsvpStatus === 'accepted' || data.rsvpStatus === 'declined' ? data.rsvpStatus : '';
          setGuest(data);
          setFormData({
            name: data.name,
            rsvpStatus: savedStatus,
            partySize: Math.max(1, Number(data.partySize) || 1),
          });
        } else {
          setInvalidInvitation(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching guest:', error);
        if (isMounted) setLookupError(true);
      })
      .finally(() => {
        if (isMounted) setRsvpLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const groom = config?.coupleNames?.groom || 'Ali';
  const bride = config?.coupleNames?.bride || 'Hira';
  const engagementDate = engagementDisplayDate(config?.engagementDate);
  const eventDate = formatEngagementDate(engagementDate, { month: 'long', day: 'numeric', year: 'numeric' });
  const eventWeekday = formatEngagementDate(engagementDate, { weekday: 'long' });
  const eventDay = formatEngagementDate(engagementDate, { day: 'numeric' });
  const eventMonth = formatEngagementDate(engagementDate, { month: 'long' });
  const eventYear = formatEngagementDate(engagementDate, { year: 'numeric' });
  const eventIsoDate = engagementDate.toISOString().split('T')[0];
  const photos = config?.photos?.filter(Boolean) || [];
  const story =
    config?.story?.trim() ||
    'With love and gratitude, we invite you to join us for an intimate engagement celebration with our family and friends.';
  const maximumPartySize = guest ? Math.max(1, Number(guest.partySize) || 1) : 6;
  const lookupNotice = invalidInvitation
    ? {
        title: 'This link was not found.',
        message: 'You can still RSVP here by entering your name. If your party size looks wrong, text Ali or Hira directly.',
      }
    : lookupError
      ? {
          title: 'We could not personalize this link.',
          message: 'You can still RSVP here by entering your name. If it does not submit, please try again in a moment.',
        }
      : null;

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
        invitationToken: guest ? token : undefined,
        guestName: name,
        eventId: 'main',
        status: formData.rsvpStatus,
        partySize: Number(formData.partySize),
        respondedAt: new Date(),
      });
      setSubmitted(true);
      window.history.replaceState(null, '', '#rsvp');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full overflow-hidden bg-cream text-charcoal">
      <Toaster position="top-center" toastOptions={toasterStyle} />

      <header className="sticky top-0 z-50 border-b border-sage-dark/10 bg-cream/95 text-sage-dark backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
          <a href="#top" className="font-display text-2xl font-semibold">
            H<span className="text-pink-deep">&amp;</span>A
          </a>
          <nav className="flex items-center gap-4 text-sm" aria-label="Main navigation">
            <a href="#details" className="hidden text-charcoal-soft transition-colors hover:text-sage-dark sm:inline">
              Details
            </a>
            <a
              href="#rsvp"
              className="inline-flex min-h-10 items-center justify-center border border-sage-dark/30 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sage-dark transition-colors hover:bg-sage-dark hover:text-ivory"
            >
              RSVP
            </a>
          </nav>
        </div>
      </header>

      <section id="top" className="flex min-h-[calc(100svh-3.5rem)] items-center px-4 py-14 text-center sm:min-h-[calc(92svh-4rem)] sm:px-8 sm:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-arabic text-xl leading-none text-gold sm:text-2xl"
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mt-8 text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.18em] text-pink-deep sm:tracking-[0.22em]"
          >
            An invitation to celebrate the engagement of
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-5 max-w-full font-display text-[clamp(4.25rem,18vw,8rem)] font-normal leading-none text-sage-dark [text-wrap:balance]"
          >
            {bride} <span className="text-pink-deep">&amp;</span> {groom}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6 max-w-2xl font-display text-2xl leading-9 text-charcoal sm:text-3xl sm:leading-10"
          >
            {story}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-9 h-px w-full max-w-md bg-gold/60"
            aria-hidden="true"
          />

          <motion.time
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
            dateTime={eventIsoDate}
            className="mt-8 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-sage-dark"
          >
            {eventWeekday}, {eventDate}
          </motion.time>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
            className="mt-4 text-sm font-semibold uppercase leading-6 tracking-[0.14em] text-charcoal-soft sm:tracking-[0.18em]"
          >
            {EVENT_ADDRESS}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={7}
            className="mt-8 grid w-full max-w-sm grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2"
          >
            <a
              href="#rsvp"
              className="inline-flex min-h-12 items-center justify-center bg-sage-dark px-6 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory shadow-sm shadow-sage-dark/20 transition-colors hover:bg-pink-deep"
            >
              RSVP
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center border border-gold/70 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep"
            >
              Directions
            </a>
          </motion.div>
        </div>
      </section>

      <section id="details" className="border-y border-sage-dark/10 bg-ivory px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-pink-deep">Details</p>
            <h2 className="mt-4 font-display text-[clamp(2.75rem,11vw,4.6rem)] font-normal leading-none text-sage-dark">
              A simple evening with family and friends.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-charcoal-soft sm:text-lg">
              We would be honored to celebrate with you, insha&apos;Allah. Please RSVP below so we can plan the evening clearly.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            custom={1}
            className="divide-y divide-sage-dark/15 border-y border-sage-dark/15"
          >
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">When</p>
              <p className="font-display text-3xl leading-tight text-sage-dark">
                {eventWeekday}, {eventMonth} {eventDay}, {eventYear}
              </p>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Where</p>
              <div>
                <p className="font-display text-3xl leading-tight text-sage-dark">Waterford Works, NJ</p>
                <p className="mt-2 text-base leading-7 text-charcoal-soft">{EVENT_ADDRESS}</p>
              </div>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Respond</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#rsvp"
                  className="inline-flex min-h-12 items-center justify-center bg-sage-dark px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-pink-deep"
                >
                  RSVP now
                </a>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center border border-gold/70 px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep"
                >
                  Get directions
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="bg-cream px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.figure
                key={photo}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                className="aspect-[4/5] overflow-hidden bg-sage-deep/5"
              >
                <img src={photo} alt={`${bride} and ${groom}`} className="h-full w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      <section id="rsvp" className="bg-cream px-4 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center lg:sticky lg:top-24 lg:text-left"
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-pink-deep">RSVP</p>
            <h2 className="mt-4 font-display text-[clamp(2.75rem,12vw,4.8rem)] font-normal leading-none text-sage-dark">
              {guest ? `Dear ${guest.name},` : 'Will you join us?'}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-charcoal-soft sm:text-lg lg:max-w-md">
              Please let us know whether you will be able to join us for {bride} and {groom}&apos;s engagement.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={1}
            className="border border-sage-dark/15 bg-ivory px-4 py-8 text-charcoal shadow-sm shadow-sage-deep/5 sm:px-8 sm:py-10"
          >
            {submitted ? (
              <div className="mx-auto max-w-xl py-8 text-center">
                <h3 className="font-display text-[clamp(2.35rem,10vw,3.6rem)] leading-tight text-sage-dark">
                  {formData.rsvpStatus === 'accepted' ? 'We look forward to celebrating with you.' : 'You will be missed.'}
                </h3>
                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-charcoal-soft">
                  {formData.rsvpStatus === 'accepted'
                    ? 'Your response has been received. We will share any final details with you directly.'
                    : 'Thank you for letting us know. You will be in our thoughts on the day.'}
                </p>
                <a
                  href="#top"
                  className="mt-8 inline-flex min-h-11 w-full max-w-xs items-center justify-center border border-gold/70 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:w-auto"
                >
                  Back to top
                </a>
              </div>
            ) : rsvpLoading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border border-sage-dark/30 border-t-pink-deep" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
                {lookupNotice && <InlineNotice title={lookupNotice.title} message={lookupNotice.message} />}

                {!guest && (
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="mb-3 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark"
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
                      className="w-full border-b border-sage-dark/45 bg-transparent py-3 font-display text-2xl text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                    />
                  </div>
                )}

                <fieldset>
                  <legend className="mb-4 block w-full font-display text-2xl leading-tight text-sage-dark sm:text-3xl">
                    Will you be joining us?
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { value: 'accepted' as const, label: 'Joyfully accept' },
                      { value: 'declined' as const, label: 'Regretfully decline' },
                    ].map((option) => {
                      const selected = formData.rsvpStatus === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFormData({ ...formData, rsvpStatus: option.value })}
                          className={`min-h-14 w-full border px-4 font-display text-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep ${
                            selected
                              ? 'border-sage-dark bg-sage-dark text-ivory shadow-sm shadow-sage-deep/20'
                              : 'border-sage-dark/20 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {formData.rsvpStatus === 'accepted' && (
                  <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                    <legend className="mb-3 block w-full text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark">
                      Number of guests
                    </legend>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {Array.from({ length: maximumPartySize }, (_, index) => index + 1).map((number) => {
                        const selected = formData.partySize === number;

                        return (
                          <button
                            key={number}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setFormData({ ...formData, partySize: number })}
                            className={`min-h-12 w-full border px-2 text-center font-display text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep sm:text-lg ${
                              selected
                                ? 'border-sage-dark bg-sage-dark text-ivory shadow-sm shadow-sage-deep/20'
                                : 'border-sage-dark/20 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
                            }`}
                          >
                            {number} {number === 1 ? 'guest' : 'guests'}
                          </button>
                        );
                      })}
                    </div>
                  </motion.fieldset>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-12 w-full bg-sage-dark px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory shadow-sm shadow-sage-deep/20 transition-colors hover:bg-pink-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending response...' : 'Send response'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-sage-dark/10 bg-ivory px-4 py-10 text-center text-sage-dark sm:py-12">
        <p className="font-display text-[clamp(2.75rem,12vw,4rem)] leading-tight">
          {bride} <span className="text-pink-deep">&amp;</span> {groom}
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.16em] text-charcoal-soft sm:max-w-none">
          {eventDate} · Insha&apos;Allah
        </p>
        <a href="/admin" className="mt-7 inline-block text-xs font-medium text-charcoal-soft transition-colors hover:text-pink-deep">
          Manage invitations
        </a>
      </footer>
    </main>
  );
}
