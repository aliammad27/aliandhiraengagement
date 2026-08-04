'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { getEngagementConfig, getGuestByToken, recordRSVP } from '@/lib/database';
import { EngagementConfig, Guest } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';
import { ArchApex, CornerFrame, FloralCorners, InsetRule, StarDivider } from '@/components/ornaments';

const easeOut = [0.22, 1, 0.36, 1] as const;
const sectionViewport = { once: true, amount: 0.2 } as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: easeOut },
  }),
};

const heroGroup: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const headerReveal: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.18, ease: easeOut },
  },
};

const FALLBACK_ENGAGEMENT_DATE = new Date('2026-10-10T12:00:00Z');
const RSVP_BY_DATE = 'September 12, 2026';
const EVENT_TIME = '2:00 PM';
const EVENT_ADDRESS = '1204 Middle Ave, Waterford Works, NJ';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ';

const toasterStyle = {
  style: {
    background: '#6f699e',
    borderRadius: '4px',
    color: '#fffcf6',
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="border border-gold/50 bg-cream px-4 py-4 text-center text-charcoal sm:px-5"
    >
      <p className="font-display text-xl leading-tight text-sage-dark">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-charcoal-soft">{message}</p>
    </motion.div>
  );
}

export default function OnePageInvitation({ initialToken }: OnePageInvitationProps) {
  const token = initialToken;
  const reduceMotion = useReducedMotion();

  const [introComplete, setIntroComplete] = useState(false);
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
    'Joyfully invite you to an intimate celebration of their engagement with family and friends.';
  const maximumPartySize = guest ? Math.max(2, Number(guest.partySize) || 1) : 2;
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
      window.requestAnimationFrame(() => {
        document.getElementById('rsvp')?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const pressAnimation = reduceMotion ? undefined : { scale: 0.98 };
  const hoverLift = reduceMotion ? undefined : { y: -1 };

  return (
    <main className="invitation-canvas w-full overflow-hidden bg-cream text-charcoal">
      <Toaster position="top-center" toastOptions={toasterStyle} />
      <InvitationCardIntro
        bride={bride}
        groom={groom}
        eventDate={eventDate}
        eventWeekday={eventWeekday}
        eventTime={EVENT_TIME}
        onOpened={() => setIntroComplete(true)}
      />

      <motion.header
        variants={headerReveal}
        initial="hidden"
        animate={introComplete ? 'visible' : 'hidden'}
        className="absolute inset-x-0 top-0 z-50 text-sage-dark"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
          <a href="#top" className="font-display text-2xl font-semibold text-sage-dark">
            H<span className="foil-text">&amp;</span>A
          </a>
          <nav className="flex items-center gap-4 text-sm sm:gap-6" aria-label="Main navigation">
            <a href="#details" className="hidden text-sage-dark transition-colors hover:text-pink-deep sm:inline">
              Details
            </a>
            <a
              href="#rsvp"
              className="inline-flex min-h-10 items-center justify-center border border-sage-dark px-3 text-[0.7rem] font-semibold uppercase text-sage-dark transition-colors hover:border-sage-light hover:bg-sage-light hover:text-charcoal sm:px-4"
            >
              RSVP
            </a>
          </nav>
        </div>
      </motion.header>

      <section
        id="top"
        className="section-frame relative flex min-h-[100svh] items-center justify-center bg-cream px-4 pb-8 pt-14 text-center text-charcoal sm:min-h-[92svh] sm:px-8 sm:pb-14 sm:pt-20"
      >
        <div className="panel-frame relative w-full max-w-3xl border border-gold/30 bg-ivory/40 px-5 py-6 shadow-lg shadow-sage-deep/5 sm:px-14 sm:py-14">
          <CornerFrame borderColor="border-gold/45" topCorners={false} />
          <InsetRule borderColor="border-gold/20" />
          <ArchApex tone="text-gold" />
          <FloralCorners tone="text-pink-deep/35" />

          <motion.div
            variants={heroGroup}
            initial="hidden"
            animate={introComplete ? 'visible' : 'hidden'}
            className="mx-auto flex w-full flex-col items-center"
          >
            <motion.p variants={heroItem} className="font-arabic text-xl text-gold sm:text-3xl">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </motion.p>

            <motion.div variants={heroItem} className="my-4">
              <StarDivider />
            </motion.div>

            <motion.p
              variants={heroItem}
              className="max-w-xs text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.2em] text-pink-deep sm:max-w-none sm:tracking-[0.26em]"
            >
              With the blessings of their families
            </motion.p>

            <motion.h1
              variants={heroItem}
              className="mt-5 max-w-full font-display text-[clamp(3.5rem,16vw,6rem)] font-normal leading-none text-sage-dark [text-wrap:balance] sm:text-8xl"
            >
              {bride} <span className="font-script foil-text mx-1 align-middle text-[0.68em]">&amp;</span> {groom}
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 w-full max-w-[350px] font-display italic text-[1.35rem] leading-8 text-charcoal sm:max-w-xl sm:text-3xl sm:leading-relaxed"
            >
              {story}
            </motion.p>

            <motion.time
              variants={heroItem}
              dateTime={`${eventIsoDate}T14:00`}
              aria-label={`${eventDate} at ${EVENT_TIME}`}
              className="mt-8 block w-full max-w-[360px]"
            >
              <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-gold/40 py-4">
                <span className="flex min-w-0 flex-col gap-1 px-1">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-pink-deep sm:tracking-[0.2em]">Day</span>
                  <span className="truncate font-display text-lg text-sage-dark sm:text-2xl">{eventWeekday}</span>
                </span>
                <span className="flex min-w-0 flex-col border-x border-gold/40 px-1">
                  <span className="font-display text-5xl leading-none text-sage-dark">{eventDay}</span>
                </span>
                <span className="flex min-w-0 flex-col gap-1 px-1">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-pink-deep sm:tracking-[0.2em]">Month</span>
                  <span className="truncate font-display text-lg text-sage-dark sm:text-2xl">{eventMonth}</span>
                </span>
              </span>
              <span aria-hidden="true" className="mt-4 flex items-center justify-center gap-3 font-display text-lg italic text-charcoal-soft">
                <span className="divider-line w-8 text-gold" />
                <span>{eventYear} · {EVENT_TIME} · Insha&apos;Allah</span>
                <span className="divider-line w-8 text-gold" />
              </span>
            </motion.time>

            <motion.div variants={heroItem} className="mt-7 w-full text-center">
              <p className="mx-auto max-w-xs text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.15em] text-charcoal-soft sm:max-w-none sm:tracking-[0.2em]">
                {EVENT_ADDRESS}
              </p>
              <div className="mx-auto mt-5 grid w-full max-w-xs grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2 sm:justify-center">
                <motion.a
                  href="#rsvp"
                  whileTap={pressAnimation}
                  whileHover={hoverLift}
                  className="inline-flex min-h-11 items-center justify-center bg-sage-light px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-charcoal shadow-md shadow-sage-deep/20 transition-colors hover:bg-pink-deep hover:text-ivory sm:tracking-[0.18em]"
                >
                  RSVP below
                </motion.a>
                <motion.a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={pressAnimation}
                  whileHover={hoverLift}
                  className="inline-flex min-h-11 items-center justify-center border border-gold/70 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:tracking-[0.18em]"
                >
                  Get directions
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="details" className="section-frame border-y border-gold/25 bg-warm-white px-4 py-16 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="panel-frame relative border border-gold/50 bg-ivory px-5 py-12 text-center shadow-xl shadow-sage-deep/10 sm:px-10 sm:py-16"
          >
            <CornerFrame borderColor="border-pink-deep/55" topCorners={false} />
            <InsetRule borderColor="border-pink-deep/20" />
            <ArchApex tone="text-pink-deep" />
            <FloralCorners tone="text-pink-deep/45" />
            <p className="font-script text-3xl text-pink-deep sm:text-4xl">The invitation</p>
            <h2 className="mt-6 font-display text-[clamp(2.35rem,11vw,4rem)] font-normal leading-tight text-sage-dark">
              {eventDate}
            </h2>
            <div className="mx-auto mt-6 max-w-[240px]">
              <StarDivider tone="sage" />
            </div>
            <p className="mx-auto mt-8 max-w-sm font-display text-xl italic leading-8 text-charcoal sm:text-2xl sm:leading-9">
              We would be honored to celebrate with you, insha&apos;Allah.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            custom={1}
            className="flex flex-col justify-center gap-4"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="detail-card detail-card--when bg-pink-pale/75 p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">When</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">{eventWeekday}</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">{eventMonth} {eventDay}, {eventYear}</p>
                <p className="mt-3 border-t border-pink-deep/20 pt-3 text-xs font-semibold uppercase tracking-[0.14em] text-pink-deep">
                  {EVENT_TIME}
                </p>
              </div>
              <div className="detail-card detail-card--where bg-sage-pale/75 p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Where</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">Waterford Works</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">{EVENT_ADDRESS}</p>
              </div>
              <div className="detail-card detail-card--respond bg-gold-soft/25 p-5 shadow-sm shadow-sage-deep/5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-pink-deep">Respond</p>
                <p className="mt-3 font-display text-2xl leading-tight text-sage-dark">Kindly RSVP</p>
                <p className="mt-1 text-sm leading-6 text-charcoal-soft">Use the form below so we can plan for you.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="#rsvp"
                whileTap={pressAnimation}
                whileHover={hoverLift}
                className="inline-flex min-h-12 flex-1 items-center justify-center bg-sage-light px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-charcoal shadow-md shadow-sage-deep/20 transition-colors hover:bg-pink-deep hover:text-ivory sm:tracking-[0.18em]"
              >
                RSVP now
              </motion.a>
              <motion.a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={pressAnimation}
                whileHover={hoverLift}
                className="inline-flex min-h-12 flex-1 items-center justify-center border border-gold/70 px-6 text-center text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:tracking-[0.18em]"
              >
                Directions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section-frame border-y border-sage-deep/10 bg-ivory px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.figure
                key={photo}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={sectionViewport}
                custom={index}
                className="aspect-[4/5] overflow-hidden border border-gold/30 bg-sage-deep/5"
              >
                <img src={photo} alt={`${bride} and ${groom}`} className="h-full w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      <section id="rsvp" className="section-frame border-y border-gold/25 bg-cream px-4 py-16 text-charcoal sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="text-center lg:sticky lg:top-8 lg:text-left"
          >
            <div className="mx-auto mb-6 max-w-[210px] lg:mx-0">
              <StarDivider tone="pink" />
            </div>
            <p className="font-script text-4xl text-pink-deep sm:text-5xl">Kindly respond</p>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,12vw,4.6rem)] font-normal leading-none text-sage-dark">
              {guest ? `Dear ${guest.name},` : 'Will you join us?'}
            </h2>
            <p className="mt-6 max-w-xl font-display text-xl italic leading-8 text-charcoal sm:text-2xl sm:leading-9 lg:max-w-md">
              Please let us know whether you will be able to join us for {bride} and {groom}&apos;s engagement.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-pink-deep">
              Please RSVP by {RSVP_BY_DATE}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            custom={1}
            className="panel-frame relative border border-gold-soft/60 bg-ivory px-4 py-10 text-charcoal shadow-2xl shadow-sage-dark/30 sm:px-8 sm:py-14"
          >
            <CornerFrame borderColor="border-pink-deep/55" topCorners={false} />
            <InsetRule borderColor="border-pink-deep/20" />
            <ArchApex tone="text-pink-deep" />
            <FloralCorners tone="text-pink-deep/45" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: easeOut }}
                  className="mx-auto max-w-xl py-8 text-center"
                >
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.08, ease: easeOut }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-light text-2xl text-charcoal shadow-lg shadow-sage-deep/25"
                    aria-hidden="true"
                  >
                    ✓
                  </motion.div>
                  <h3 className="mt-7 font-display text-[clamp(2.4rem,10vw,3.75rem)] leading-tight text-sage-dark">
                    {formData.rsvpStatus === 'accepted' ? 'We look forward to celebrating with you.' : 'You will be missed.'}
                  </h3>
                  <p className="mx-auto mt-5 max-w-md text-base font-semibold leading-7 text-charcoal">
                    Thank you, your RSVP has been received.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-base leading-7 text-charcoal-soft">
                    {formData.rsvpStatus === 'accepted'
                      ? 'We will share any final details with you directly.'
                      : 'Thank you for letting us know. You will be in our thoughts on the day.'}
                  </p>
                  <motion.a
                    href="#top"
                    whileTap={pressAnimation}
                    whileHover={hoverLift}
                    className="mt-8 inline-flex min-h-11 w-full max-w-xs items-center justify-center border border-gold/70 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sage-dark transition-colors hover:border-pink-deep hover:text-pink-deep sm:w-auto sm:tracking-[0.18em]"
                  >
                    Back to invitation
                  </motion.a>
                </motion.div>
              ) : rsvpLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[360px] items-center justify-center"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border border-sage-dark/40 border-t-gold" />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: easeOut }}
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-2xl space-y-8"
                >
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
                          <motion.button
                            key={option.value}
                            type="button"
                            aria-pressed={selected}
                            whileTap={pressAnimation}
                            whileHover={hoverLift}
                            onClick={() => setFormData({ ...formData, rsvpStatus: option.value })}
                            className={`min-h-14 w-full border px-4 font-display text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep sm:text-lg ${
                              selected
                                ? 'border-sage-light bg-sage-light text-charcoal shadow-md shadow-sage-deep/25'
                                : 'border-gold/60 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
                            }`}
                          >
                            {option.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <AnimatePresence initial={false}>
                    {formData.rsvpStatus === 'accepted' && (
                      <motion.fieldset
                        key="party-size"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: easeOut }}
                        className="overflow-hidden"
                      >
                        <legend className="mb-3 block w-full text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sage-dark sm:tracking-[0.18em]">
                          Will you be bringing a guest?
                        </legend>
                        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5 sm:gap-3">
                          {[
                            { value: 1, label: 'Just myself' },
                            { value: 2, label: 'I will bring a guest' },
                          ].map((option) => {
                            const selected = formData.partySize === option.value;

                            return (
                              <motion.button
                                key={option.value}
                                type="button"
                                aria-pressed={selected}
                                whileTap={pressAnimation}
                                whileHover={hoverLift}
                                onClick={() => setFormData({ ...formData, partySize: option.value })}
                                className={`min-h-12 w-full border px-2 text-center font-display text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep sm:px-3 sm:text-lg ${
                                  selected
                                    ? 'border-sage-light bg-sage-light text-charcoal shadow-md shadow-sage-deep/25'
                                    : 'border-gold/60 bg-cream text-charcoal hover:border-pink-deep hover:text-pink-deep'
                                }`}
                              >
                                {option.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.fieldset>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileTap={submitting ? undefined : pressAnimation}
                    className="min-h-12 w-full bg-sage-light px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-charcoal shadow-md shadow-sage-deep/25 transition-colors hover:bg-pink-deep hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:tracking-[0.18em]"
                  >
                    {submitting ? 'Sending response...' : 'Send response'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <footer className="relative bg-cream px-4 py-16 text-center text-sage-dark sm:py-20">
        <StarDivider tone="sage" />
        <p className="font-script mt-8 text-[clamp(3rem,14vw,4.5rem)] leading-tight text-sage-dark">
          {bride} <span className="foil-text">&amp;</span> {groom}
        </p>
        <p className="mx-auto mt-5 max-w-xs text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.2em] text-charcoal-soft sm:max-w-none sm:tracking-[0.24em]">
          <span className="block">{eventDate} · {EVENT_TIME}</span>
          <span className="mt-1 block">Insha&apos;Allah</span>
        </p>
        <a href="/admin" className="mt-9 inline-block text-xs font-medium text-charcoal-soft transition-colors hover:text-pink-deep">
          Manage invitations
        </a>
      </footer>
    </main>
  );
}
