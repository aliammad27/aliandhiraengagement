'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';

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
        className="relative flex min-h-[82svh] items-center justify-center bg-ivory px-6 pb-10 pt-20 text-center text-charcoal sm:min-h-[88svh] sm:px-8 sm:pb-14 sm:pt-24"
      >
        <div className="mx-auto flex w-full max-w-lg flex-col items-center">
          <p className="font-arabic text-lg text-gold sm:text-2xl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          <div className="my-5 flex items-center gap-3 text-gold" aria-hidden="true">
            <span className="h-px w-10 bg-gold/45" />
            <span className="text-xs">✦</span>
            <span className="h-px w-10 bg-gold/45" />
          </div>

          <p className="text-[0.68rem] font-medium uppercase text-navy/60">
            With the blessings of their families
          </p>

          <h1 className="mt-5 font-display whitespace-nowrap text-6xl font-normal leading-none text-navy sm:text-8xl">
            {bride} <span className="font-light text-gold">&amp;</span> {groom}
          </h1>

          <p className="mt-5 w-full max-w-[310px] font-display text-lg leading-7 text-charcoal-soft sm:max-w-md sm:text-2xl sm:leading-relaxed">
            With love and gratitude, we invite you to celebrate our engagement.
          </p>

          <time dateTime="2026-10-17" aria-label={eventDate} className="mt-7 block w-full max-w-[300px]">
            <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-navy/20 py-3">
              <span className="font-display text-xl text-navy/80">Saturday</span>
              <span className="border-x border-navy/15 font-display text-4xl text-gold">17</span>
              <span className="font-display text-xl text-navy/80">October</span>
            </span>
            <span aria-hidden="true" className="mt-3 block text-[0.68rem] text-charcoal-soft">2026 · In sha'Allah</span>
          </time>

          <div className="mt-7 text-center">
            <p className="text-[0.68rem] font-medium uppercase text-charcoal-soft">1204 Middle Ave, Waterford Works, NJ</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[0.68rem] uppercase text-navy underline decoration-navy/40 underline-offset-4 transition-colors hover:text-gold"
            >
              Get directions
            </a>
          </div>
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

      <section id="details" className="bg-ivory px-5 py-24 text-center sm:px-8 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-medium uppercase text-sage-deep"
          >
            The engagement
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-5 font-display text-5xl font-normal sm:text-7xl"
          >
            October 17, 2026
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="mx-auto my-10 grid max-w-2xl grid-cols-3 border-y border-charcoal/15 py-6"
          >
            <div>
              <p className="text-xs uppercase text-charcoal-soft">Day</p>
              <p className="mt-2 font-display text-xl sm:text-2xl">Saturday</p>
            </div>
            <div className="border-x border-charcoal/15">
              <p className="text-xs uppercase text-charcoal-soft">Date</p>
              <p className="mt-2 font-display text-xl sm:text-2xl">17</p>
            </div>
            <div>
              <p className="text-xs uppercase text-charcoal-soft">Year</p>
              <p className="mt-2 font-display text-xl sm:text-2xl">2026</p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="mx-auto max-w-lg text-base leading-7 text-charcoal-soft"
          >
            We would be honoured to celebrate with you, in sha'Allah. Your personal invitation includes the full event details and RSVP.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="mt-9"
          >
            <Link
              href="/invite"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-navy px-8 text-sm font-medium text-ivory transition-colors hover:bg-navy-soft"
            >
              Open your invitation
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-navy px-5 py-12 text-center text-ivory">
        <p className="font-display text-3xl">{bride} <span className="text-gold">&amp;</span> {groom}</p>
        <p className="mt-3 text-xs text-ivory/50">10.17.26</p>
        <Link href="/admin" className="mt-7 inline-block text-xs text-ivory/30 transition-colors hover:text-ivory/60">
          Manage invitations
        </Link>
      </footer>
    </main>
  );
}
