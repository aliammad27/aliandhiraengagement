'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';
import { CornerFrame, StarDivider, navyRadial } from '@/components/ornaments';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
  const eventDate = 'October 17, 2026';
  const photos = config?.photos?.filter(Boolean) || [];

  return (
    <main className="overflow-hidden bg-ivory text-charcoal">
      <InvitationCardIntro bride={bride} groom={groom} />

      <header className="absolute inset-x-0 top-0 z-50 text-navy">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
          <a href="#top" className="font-display text-2xl font-medium">
            H<span className="text-gold">&amp;</span>A
          </a>
          <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
            <a href="#details" className="hidden text-navy/70 transition-colors hover:text-navy sm:inline">
              The date
            </a>
            <Link
              href="/invite"
              className="inline-flex min-h-10 items-center border border-navy/70 px-3 text-[0.7rem] font-medium uppercase text-navy transition-colors hover:bg-navy hover:text-ivory sm:px-4"
            >
              RSVP
            </Link>
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[82svh] items-center justify-center px-6 pb-12 pt-20 text-center text-charcoal sm:min-h-[88svh] sm:px-8 sm:pb-16 sm:pt-24"
        style={{ background: 'radial-gradient(120% 80% at 50% 0%, #fdfbf6 0%, #f8f5ef 55%, #efe9dd 100%)' }}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col items-center">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" className="font-arabic text-lg text-gold sm:text-2xl">
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
            className="text-[0.66rem] font-medium uppercase tracking-[0.28em] text-navy/60"
          >
            With the blessings of their families
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 font-display whitespace-nowrap text-6xl font-normal leading-none text-navy sm:text-8xl"
          >
            {bride} <span className="font-script mx-1 align-middle text-4xl text-gold sm:text-6xl">&amp;</span> {groom}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6 w-full max-w-[320px] font-display italic text-lg leading-7 text-charcoal-soft sm:max-w-md sm:text-2xl sm:leading-relaxed"
          >
            With love and gratitude, we invite you to celebrate our engagement.
          </motion.p>

          <motion.time
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            dateTime="2026-10-17"
            aria-label={eventDate}
            className="mt-9 block w-full max-w-[320px]"
          >
            <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-gold/40 py-4">
              <span className="flex flex-col gap-1">
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-charcoal-soft">Day</span>
                <span className="font-display text-xl text-navy">Saturday</span>
              </span>
              <span className="flex flex-col border-x border-gold/30">
                <span className="font-display text-5xl leading-none text-gold">17</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-charcoal-soft">Month</span>
                <span className="font-display text-xl text-navy">October</span>
              </span>
            </span>
            <span aria-hidden="true" className="mt-3 block font-display text-base italic text-charcoal-soft">
              2026 · Insha&apos;Allah
            </span>
          </motion.time>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="mt-8 text-center">
            <p className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-charcoal-soft">
              1204 Middle Ave, Waterford Works, NJ
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-10 items-center border border-navy/30 px-5 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-navy transition-colors hover:border-gold hover:text-gold"
            >
              Get directions
            </a>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="border-y border-charcoal/10 bg-cream px-5 py-16 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.figure
                key={photo}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                className="aspect-[4/5] overflow-hidden bg-charcoal/5"
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

      <section id="details" className="border-t border-charcoal/10 bg-cream px-5 py-20 text-center sm:px-8 sm:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto max-w-2xl bg-ivory px-6 py-14 shadow-xl shadow-navy/10 sm:px-14 sm:py-16"
        >
          <CornerFrame borderColor="border-gold/50" />

          <p className="font-script text-3xl text-gold sm:text-4xl">Save the date</p>

          <h2 className="mt-5 font-display text-4xl font-normal text-navy sm:text-6xl">
            October 17, 2026
          </h2>

          <div className="mx-auto mt-4 max-w-[240px]">
            <StarDivider />
          </div>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 border-y border-gold/35 py-5">
            <div>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-charcoal-soft">Day</p>
              <p className="mt-2 font-display text-xl text-navy sm:text-2xl">Saturday</p>
            </div>
            <div className="border-x border-gold/25">
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-charcoal-soft">Date</p>
              <p className="mt-2 font-display text-xl text-gold sm:text-2xl">17</p>
            </div>
            <div>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.24em] text-charcoal-soft">Year</p>
              <p className="mt-2 font-display text-xl text-navy sm:text-2xl">2026</p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-md font-display text-lg italic leading-8 text-charcoal-soft">
            We would be honoured to celebrate with you, insha&apos;Allah. Your personal invitation includes the full event details and RSVP.
          </p>

          <Link
            href="/invite"
            className="mt-9 inline-flex min-h-12 items-center justify-center bg-navy px-9 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ivory shadow-md shadow-navy/25 transition-colors hover:bg-navy-soft"
          >
            Open your invitation
          </Link>
        </motion.div>
      </section>

      <footer className="relative px-5 py-16 text-center text-ivory" style={navyRadial}>
        <StarDivider />
        <p className="font-script mt-7 text-5xl leading-tight text-ivory">
          {bride} <span className="text-gold">&amp;</span> {groom}
        </p>
        <p className="mt-4 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-gold-soft/80">
          October 17, 2026 · Insha&apos;Allah
        </p>
        <Link href="/admin" className="mt-8 inline-block text-xs text-ivory/30 transition-colors hover:text-ivory/60">
          Manage invitations
        </Link>
      </footer>
    </main>
  );
}
