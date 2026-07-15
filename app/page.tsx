'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';
import { CornerFrame, StarDivider } from '@/components/ornaments';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FALLBACK_ENGAGEMENT_DATE = new Date('2026-10-17T12:00:00Z');

function engagementDisplayDate(value: EngagementConfig['engagementDate'] | undefined) {
  const date = value ? new Date(value) : FALLBACK_ENGAGEMENT_DATE;
  return Number.isNaN(date.getTime()) ? FALLBACK_ENGAGEMENT_DATE : date;
}

function formatEngagementDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });
}

export default function Home() {
  const [config, setConfig] = useState<EngagementConfig | null>(null);

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

  return (
    <main className="overflow-hidden bg-cream text-charcoal">
      <InvitationCardIntro bride={bride} groom={groom} />

      <header className="absolute inset-x-0 top-0 z-50 text-ivory">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
          <a href="#top" className="font-display text-2xl font-semibold text-ivory">
            H<span className="text-pink-light">&amp;</span>A
          </a>
          <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
            <a href="#details" className="hidden text-ivory transition-colors hover:text-gold-soft sm:inline">
              The date
            </a>
            <Link
              href="/invite"
              className="inline-flex min-h-10 items-center border border-ivory px-3 text-[0.7rem] font-semibold uppercase text-ivory transition-colors hover:bg-ivory hover:text-sage-dark sm:px-4"
            >
              RSVP
            </Link>
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[82svh] items-center justify-center bg-sage-dark px-6 pb-12 pt-20 text-center text-ivory sm:min-h-[88svh] sm:px-8 sm:pb-16 sm:pt-24"
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
            className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-soft"
          >
            With the blessings of their families
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 font-display whitespace-nowrap text-6xl font-normal leading-none text-ivory sm:text-8xl"
          >
            {bride} <span className="font-script mx-1 align-middle text-4xl text-pink-light sm:text-6xl">&amp;</span> {groom}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6 w-full max-w-[360px] font-display italic text-xl leading-8 text-ivory sm:max-w-lg sm:text-3xl sm:leading-relaxed"
          >
            With love and gratitude, we invite you to celebrate our engagement.
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
              <span className="flex flex-col gap-1">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Day</span>
                <span className="font-display text-xl text-ivory sm:text-2xl">{eventWeekday}</span>
              </span>
              <span className="flex flex-col border-x border-gold-soft/50">
                <span className="font-display text-5xl leading-none text-pink-light">{eventDay}</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-soft">Month</span>
                <span className="font-display text-xl text-ivory sm:text-2xl">{eventMonth}</span>
              </span>
            </span>
            <span aria-hidden="true" className="mt-3 block font-display text-lg italic text-ivory">
              {eventYear} · Insha&apos;Allah
            </span>
          </motion.time>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mt-8 text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ivory">
              1204 Middle Ave, Waterford Works, NJ
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center border border-gold-soft px-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-soft transition-colors hover:bg-gold-soft hover:text-sage-dark"
            >
              Get directions
            </a>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="border-y border-sage-deep/10 bg-cream px-5 py-16 sm:px-8">
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
                <img
                  src={photo}
                  alt={`${bride} and ${groom}`}
                  className="h-full w-full object-cover"
                />
              </motion.figure>
            ))}
          </div>
        </section>
      )}

      <section id="details" className="border-t border-sage-deep/10 bg-cream px-5 py-20 text-center sm:px-8 sm:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto max-w-2xl border border-gold/35 bg-ivory px-6 py-14 shadow-xl shadow-sage-deep/10 sm:px-14 sm:py-16"
        >
          <CornerFrame borderColor="border-pink-deep/60" />

          <p className="font-script text-3xl text-pink-deep sm:text-4xl">Save the date</p>

          <h2 className="mt-5 font-display text-4xl font-normal text-sage-dark sm:text-6xl">
            {eventDate}
          </h2>

          <div className="mx-auto mt-4 max-w-[240px]">
            <StarDivider tone="sage" />
          </div>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 border-y border-gold/50 py-5">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal-soft">Day</p>
              <p className="mt-2 font-display text-xl text-sage-dark sm:text-2xl">{eventWeekday}</p>
            </div>
            <div className="border-x border-gold/35">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal-soft">Date</p>
              <p className="mt-2 font-display text-xl text-pink-deep sm:text-2xl">{eventDay}</p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal-soft">Year</p>
              <p className="mt-2 font-display text-xl text-sage-dark sm:text-2xl">{eventYear}</p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-md font-display text-lg italic leading-8 text-charcoal">
            We would be honoured to celebrate with you, insha&apos;Allah. Your personal invitation includes the full event details and RSVP.
          </p>

          <Link
            href="/invite"
            className="mt-9 inline-flex min-h-12 items-center justify-center bg-sage-dark px-9 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ivory shadow-md shadow-sage-deep/25 transition-colors hover:bg-pink-deep"
          >
            Open your invitation
          </Link>
        </motion.div>
      </section>

      <footer className="relative bg-sage-dark px-5 py-16 text-center text-ivory">
        <StarDivider />
        <p className="font-script mt-7 text-5xl leading-tight text-ivory">
          {bride} <span className="text-pink-light">&amp;</span> {groom}
        </p>
        <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-soft">
          {eventDate} · Insha&apos;Allah
        </p>
        <Link href="/admin" className="mt-8 inline-block text-xs font-medium text-ivory transition-colors hover:text-gold-soft">
          Manage invitations
        </Link>
      </footer>
    </main>
  );
}
