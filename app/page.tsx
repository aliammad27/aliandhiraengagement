'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getEngagementConfig, getGuestByToken, recordRSVP } from '@/lib/database';
import { EngagementConfig, Guest } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';
import { CornerFrame, StarDivider } from '@/components/ornaments';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
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

function engagementDisplayDate(value: EngagementConfig['engagementDate'] | undefined) {
  const date = value ? new Date(value) : FALLBACK_ENGAGEMENT_DATE;
  return Number.isNaN(date.getTime()) ? FALLBACK_ENGAGEMENT_DATE : date;
}

function formatEngagementDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-cream">
      <div className="h-8 w-8 animate-spin rounded-full border border-sage-dark/50 border-t-gold" />
    </div>
  );
}

function InlineNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="border border-gold/50 bg-cream px-4 py-4 text-center text-charcoal sm:px-5">
      <p className="font-display text-xl leading-tight text-sage-dark">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal-soft">{message}</p>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [config, setConfig] = useState<EngagementConfig | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(true);
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
    setRsvpLoading(true);
    setFormData({ name: '', rsvpStatus: '', partySize: 1 });

    if (!token) {
      setRsvpLoading(false);
      return () => {
        isMounted = false;
      };
    }

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
      <InvitationCardIntro bride={bride} groom={groom} />

      <header className="absolute inset-x-0 top-0 z-50 text-ivory">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
          <a href="#top" className="font-display text-2xl font-semibold text-ivory">
            H<span className="text-pink-light">&amp;</span>A
          </a>
          <nav className="flex items-center gap-4 text-sm sm:gap-6" aria-label="Main navigation">
            <a href="#details" className="hidden text-ivory transition-colors hover:text-gold-soft sm:inline">
              Details
            </a>
            <a
              href="#rsvp"
              className="inline-flex min-h-10 items-center justify-center border border-ivory px-3 text-[0.7rem] font-semibold uppercase text-ivory transition-colors hover:bg-ivory hover:text-sage-dark sm:px-4"
            >
              RSVP
            </a>
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[100svh] items-center justify-center bg-sage-dark px-4 pb-12 pt-20 text-center text-ivory sm:min-h-[92svh] sm:px-8 sm:pb-16 sm:pt-24"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" className="font-arabic text-xl text-gold-soft sm:text-3xl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="my-5">
            <StarDivider />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="max-w-xs text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.18em] text-gold-soft sm:max-w-none sm:tracking-[0.22em]"
          >
            With the blessings of their families
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 max-w-full font-display text-[clamp(3.5rem,16vw,6rem)] font-normal leading-none text-ivory [text-wrap:balance] sm:text-8xl"
          >
            {bride} <span className="font-script mx-1 align-middle text-[0.68em] text-pink-light">&amp;</span> {groom}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6 w-full max-w-[350px] font-display italic text-[1.35rem] leading-8 text-ivory sm:max-w-xl sm:text-3xl sm:leading-relaxed"
          >
            {story}
          </motion.p>

          <motion.time
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            dateTime={eventIsoDate}
            aria-label={eventDate}
            className="mt-9 block w-full max-w-[360px]"
          >
            <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-gold-soft/70 py-4">
              <span className="flex min-w-0 flex-col gap-1 px-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-soft sm:tracking-[0.2em]">Day</span>
                <span className="truncate font-display text-lg text-ivory sm:text-2xl">{eventWeekday}</span>
              </span>
              <span className="flex min-w-0 flex-col border-x border-gold-soft/50 px-1">
                <span className="font-display text-5xl leading-none text-pink-light">{eventDay}</span>
              </span>
              <span className="flex min-w-0 flex-col gap-1 px-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold-soft sm:tracking-[0.2em]">Month</span>
                <span className="truncate font-display text-lg text-ivory sm:text-2xl">{eventMonth}</span>
              </span>
            </span>
            <span aria-hidden="true" className="mt-3 block font-display text-lg italic text-ivory">
              {eventYear} · Insha&apos;Allah
            </span>
          </motion.time>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mt-8 w-full text-center">
            <p className="mx-auto max-w-xs text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.13em] text-ivory sm:max-w-none sm:tracking-[0.18em]">
              {EVENT_ADDRESS}
            </p>
            <div className="mx-auto mt-5 grid w-full max-w-xs grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2 sm:justify-center">
              <a
                href="#rsvp"
                className="inline-flex min-h-11 items-center justify-center bg-ivory px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark shadow-md shadow-sage-dark/20 transition-colors hover:bg-pink-light hover:text-sage-dark sm:tracking-[0.18em]"
              >
                RSVP below
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center border border-gold-soft px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:bg-gold-soft hover:text-sage-dark sm:tracking-[0.18em]"
              >
                Get directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="details" className="border-t border-sage-deep/10 bg-cream px-4 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative border border-gold/40 bg-ivory px-5 py-10 text-center shadow-xl shadow-sage-deep/10 sm:px-10 sm:py-12"
          >
            <CornerFrame borderColor="border-pink-deep/55" />
            <p className="font-script text-3xl text-pink-deep sm:text-4xl">The invitation</p>
            <h2 className="mt-5 font-display text-[clamp(2.35rem,11vw,4rem)] font-normal leading-tight text-sage-dark">
              {eventDate}
            </h2>
            <div className="mx-auto mt-5 max-w-[240px]">
              <StarDivider tone="sage" />
            </div>
            <p className="mx-auto mt-7 max-w-sm font-display text-xl italic leading-8 text-charcoal sm:text-2xl sm:leading-9">
              We would be honored to celebrate with you, insha&apos;Allah.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={1}
            className="flex flex-col justify-center gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-sage-dark/20 bg-ivory p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">When</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">{eventWeekday}</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">{eventMonth} {eventDay}, {eventYear}</p>
              </div>
              <div className="border border-sage-dark/20 bg-ivory p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Where</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">Waterford Works</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">{EVENT_ADDRESS}</p>
              </div>
              <div className="border border-sage-dark/20 bg-ivory p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Respond</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">Kindly RSVP</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">Use the form below so we can plan for you.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#rsvp"
                className="inline-flex min-h-12 flex-1 items-center justify-center bg-sage-dark px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ivory shadow-md shadow-sage-deep/20 transition-colors hover:bg-pink-deep sm:tracking-[0.18em]"
              >
                RSVP now
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center border border-gold/70 px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:tracking-[0.18em]"
              >
                Directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="border-y border-sage-deep/10 bg-ivory px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.figure
                key={photo}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                className="aspect-[4/5] overflow-hidden border border-gold/30 bg-sage-deep/5"
              >
                <img src={photo} alt={`${bride} and ${groom}`} className="h-full w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      <section id="rsvp" className="bg-sage-dark px-4 py-14 text-ivory sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center lg:sticky lg:top-8 lg:text-left"
          >
            <p className="font-script text-4xl text-pink-light sm:text-5xl">Kindly respond</p>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,12vw,4.6rem)] font-normal leading-none text-ivory">
              {guest ? `Dear ${guest.name},` : 'Will you join us?'}
            </h2>
            <p className="mt-6 max-w-xl font-display text-xl italic leading-8 text-ivory/90 sm:text-2xl sm:leading-9 lg:max-w-md">
              Please let us know whether you will be able to join us for {bride} and {groom}&apos;s engagement.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={1}
            className="relative border border-gold-soft/50 bg-ivory px-4 py-8 text-charcoal shadow-2xl shadow-sage-dark/30 sm:px-8 sm:py-10"
          >
            <CornerFrame borderColor="border-pink-deep/55" />

            {submitted ? (
              <div className="mx-auto max-w-xl py-8 text-center">
                <StarDivider tone="pink" />
                <h3 className="mt-7 font-display text-[clamp(2.4rem,10vw,3.75rem)] leading-tight text-sage-dark">
                  {formData.rsvpStatus === 'accepted' ? 'We look forward to celebrating with you.' : 'You will be missed.'}
                </h3>
                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-charcoal-soft">
                  {formData.rsvpStatus === 'accepted'
                    ? 'Your response has been received. We will share any final details with you directly.'
                    : 'Thank you for letting us know. You will be in our thoughts on the day.'}
                </p>
                <a
                  href="#top"
                  className="mt-8 inline-flex min-h-11 w-full max-w-xs items-center justify-center border border-gold/70 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:w-auto sm:tracking-[0.18em]"
                >
                  Back to invitation
                </a>
              </div>
            ) : rsvpLoading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border border-sage-dark/40 border-t-gold" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
                {lookupNotice && <InlineNotice title={lookupNotice.title} message={lookupNotice.message} />}

                {!guest && (
                  <div>
                    <label
                      htmlFor="guest-name"
                      className="mb-3 block text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sage-dark sm:tracking-[0.18em]"
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
                      className="w-full border-b border-sage-dark/60 bg-transparent py-3 text-center font-display text-xl text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep sm:text-2xl"
                    />
                  </div>
                )}

                <fieldset>
                  <legend className="mb-5 block w-full text-center font-display text-2xl leading-tight text-sage-dark sm:text-3xl">
                    Will you be joining us?
                  </legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                          className={`min-h-14 w-full border px-4 font-display text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep sm:text-lg ${
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
                  <motion.fieldset initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                    <legend className="mb-3 block w-full text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sage-dark sm:tracking-[0.18em]">
                      Number of guests
                    </legend>
                    <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                      {Array.from({ length: maximumPartySize }, (_, index) => index + 1).map((number) => {
                        const selected = formData.partySize === number;

                        return (
                          <button
                            key={number}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setFormData({ ...formData, partySize: number })}
                            className={`min-h-12 w-full border px-2 text-center font-display text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep sm:px-3 sm:text-lg ${
                              selected
                                ? 'border-sage-dark bg-sage-dark text-ivory shadow-md shadow-sage-deep/25'
                                : 'border-gold/60 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
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
                  className="min-h-12 w-full bg-sage-dark px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory shadow-md shadow-sage-deep/25 transition-colors hover:bg-pink-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:tracking-[0.18em]"
                >
                  {submitting ? 'Sending response...' : 'Send response'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="relative bg-cream px-4 py-12 text-center text-sage-dark sm:py-16">
        <StarDivider tone="sage" />
        <p className="font-script mt-7 text-[clamp(3rem,14vw,4.5rem)] leading-tight text-sage-dark">
          {bride} <span className="text-pink-deep">&amp;</span> {groom}
        </p>
        <p className="mx-auto mt-4 max-w-xs text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.18em] text-charcoal-soft sm:max-w-none sm:tracking-[0.22em]">
          {eventDate} · Insha&apos;Allah
        </p>
        <a href="/admin" className="mt-8 inline-block text-xs font-medium text-charcoal-soft transition-colors hover:text-pink-deep">
          Manage invitations
        </a>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeContent />
    </Suspense>
  );
}
