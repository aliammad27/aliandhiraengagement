'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import InvitationCardIntro from '@/components/InvitationCardIntro';
import ThenAndNow from '@/components/ThenAndNow';

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
  const eventDate = 'October 17, 2025';
  const photos = config?.photos?.filter(Boolean) || [];

  return (
    <main className="overflow-hidden bg-ivory text-charcoal">
      <InvitationCardIntro bride={bride} groom={groom} />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/95 text-ivory backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display text-xl font-medium sm:text-2xl">
            {bride} <span className="text-gold">&amp;</span> {groom}
          </a>
          <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
            <a href="#story" className="hidden text-ivory/70 transition-colors hover:text-ivory sm:inline">
              Our story
            </a>
            <a href="#details" className="hidden text-ivory/70 transition-colors hover:text-ivory sm:inline">
              The date
            </a>
            <Link
              href="/invite"
              className="rounded-sm border border-gold px-4 py-2 text-xs font-medium uppercase text-ivory transition-colors hover:bg-gold hover:text-navy"
            >
              RSVP
            </Link>
          </nav>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[88svh] items-center justify-center bg-navy px-5 pb-14 pt-24 text-center text-ivory"
      >
        <div className="invitation-arch pointer-events-none absolute inset-x-5 bottom-8 top-20 mx-auto max-w-[580px] opacity-60" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          <p className="font-arabic text-xl text-gold sm:text-2xl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          <div
            className="my-7 flex items-center gap-4 text-gold"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-gold/55" />
            <span className="text-sm">✦</span>
            <span className="h-px w-12 bg-gold/55" />
          </div>

          <p className="mb-5 text-xs font-medium uppercase text-ivory/65">
            Together with their families
          </p>

          <h1 className="font-display whitespace-nowrap text-5xl font-normal leading-none sm:text-8xl lg:text-9xl">
            {bride} <span className="font-light text-gold">&amp;</span> {groom}
          </h1>

          <p className="mt-7 w-full max-w-sm font-display text-xl leading-relaxed text-ivory/80 sm:max-w-md sm:text-2xl">
            invite you to celebrate their engagement
          </p>

          <p className="mt-7 border-y border-gold/35 px-8 py-3 font-display text-xl text-gold-soft sm:text-2xl">
            {eventDate}
          </p>

          <div className="mt-9">
            <Link
              href="/invite"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-ivory px-8 text-sm font-medium text-navy transition-colors hover:bg-gold-soft"
            >
              View invitation
            </Link>
          </div>
        </div>
      </section>

      <ThenAndNow />

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
            October 17, 2025
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
              <p className="mt-2 font-display text-xl sm:text-2xl">Friday</p>
            </div>
            <div className="border-x border-charcoal/15">
              <p className="text-xs uppercase text-charcoal-soft">Date</p>
              <p className="mt-2 font-display text-xl sm:text-2xl">17</p>
            </div>
            <div>
              <p className="text-xs uppercase text-charcoal-soft">Year</p>
              <p className="mt-2 font-display text-xl sm:text-2xl">2025</p>
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
            We would be honoured to celebrate with you, in sha Allah. Your personal invitation includes the full event details and RSVP.
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
        <p className="mt-3 text-xs text-ivory/50">10.17.25</p>
        <Link href="/admin" className="mt-7 inline-block text-xs text-ivory/30 transition-colors hover:text-ivory/60">
          Manage invitations
        </Link>
      </footer>
    </main>
  );
}
