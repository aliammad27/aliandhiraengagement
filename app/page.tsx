'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import EnvelopeIntro from '@/components/EnvelopeIntro';
import FloatingPetals from '@/components/FloatingPetals';
import CursorSparkle from '@/components/CursorSparkle';
import ThenAndNow from '@/components/ThenAndNow';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

export default function Home() {
  const [config, setConfig] = useState<EngagementConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementConfig()
      .then((data) => setConfig(data || null))
      .catch((e) => console.error('Error fetching config:', e))
      .finally(() => setLoading(false));
  }, []);

  const groom = config?.coupleNames?.groom || 'Ali';
  const bride = config?.coupleNames?.bride || 'Hira';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border border-gold/30 border-t-gold rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-ivory text-charcoal overflow-hidden">
      <FloatingPetals />
      <CursorSparkle />
      <EnvelopeIntro groom={groom} bride={bride} />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-ivory/70 border-b border-charcoal/5"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <span className="font-script text-2xl text-charcoal">{groom} &amp; {bride}</span>
          <div className="flex items-center gap-8 text-sm">
            <a href="#story" className="hidden sm:inline hover:text-gold transition-colors">Our Story</a>
            <a href="#details" className="hidden sm:inline hover:text-gold transition-colors">Details</a>
            <Link
              href="/invite"
              className="eyebrow text-charcoal border border-charcoal/20 rounded-full px-5 py-2 hover:border-gold hover:text-gold transition-colors"
            >
              RSVP
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Soft decorative glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(184,155,110,0.10),_transparent_60%)]" />

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-2xl mb-3 text-center"
          style={{ fontFamily: 'var(--font-arabic), serif', direction: 'rtl', color: '#9a7340' }}
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.p>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
          className="eyebrow text-gold mb-8"
        >
          Together with their families
        </motion.p>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-display leading-[0.95]"
        >
          <span className="block text-6xl sm:text-8xl md:text-9xl shimmer-name">{groom}</span>
          <span className="block font-script text-gold text-4xl sm:text-6xl my-3 sm:my-4">and</span>
          <span className="block text-6xl sm:text-8xl md:text-9xl shimmer-name" style={{ animationDelay: '1.2s' }}>{bride}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="font-display text-2xl sm:text-3xl text-charcoal-soft mt-10 max-w-xl"
        >
          request the pleasure of your company<br className="hidden sm:block" /> at their engagement celebration
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex items-center gap-5 mt-10 text-charcoal-soft"
        >
          <span className="hairline w-16" />
          <span className="eyebrow whitespace-nowrap">
            {config?.engagementDate
              ? new Date(config.engagementDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : 'Date to be announced'}
          </span>
          <span className="hairline w-16" />
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="mt-14"
        >
          <Link
            href="/invite"
            className="group inline-flex items-center gap-3 bg-charcoal text-ivory rounded-full px-9 py-4 text-sm tracking-wide hover:bg-sage-deep transition-colors duration-500"
          >
            View Your Invitation
            <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="eyebrow text-charcoal-soft text-[0.6rem]">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </section>


      {/* Gallery */}
      {config?.photos && config.photos.length > 0 && (
        <section className="py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.photos.map((photo, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="overflow-hidden rounded-sm aspect-[3/4]"
              >
                <img src={photo} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <ThenAndNow />

      {/* Details / CTA */}
      <section id="details" className="py-28 sm:py-40 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="eyebrow text-gold mb-5"
          >
            The Celebration
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="font-display text-4xl sm:text-6xl mb-8"
          >
            We would be honoured<br />by your presence
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="text-charcoal-soft text-lg font-light mb-12"
          >
            Kindly let us know if you can join us. Your invitation holds all the details.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <Link
              href="/invite"
              className="group inline-flex items-center gap-3 bg-charcoal text-ivory rounded-full px-9 py-4 text-sm tracking-wide hover:bg-sage-deep transition-colors duration-500"
            >
              Respond Now
              <span className="transition-transform duration-500 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 text-center bg-charcoal text-ivory/70">
        <p className="font-script text-3xl text-ivory mb-3">{groom} &amp; {bride}</p>
        <p className="eyebrow text-ivory/40">Forever begins now</p>
        <Link href="/admin" className="inline-block mt-8 text-xs text-ivory/30 hover:text-gold transition-colors">
          Manage
        </Link>
      </footer>
    </div>
  );
}
