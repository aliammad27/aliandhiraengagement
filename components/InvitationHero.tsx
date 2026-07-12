'use client';

import { motion } from 'framer-motion';
import BaroqueWings from './BaroqueWings';

interface Props {
  groom: string;
  bride: string;
}

function CornerFlourish({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="74" height="74" viewBox="0 0 74 74" fill="none" aria-hidden="true">
      <path d="M5 6C5 33 18 47 45 47" stroke="currentColor" strokeWidth="1.2" opacity="0.72" />
      <path d="M5 6C32 6 47 19 47 46" stroke="currentColor" strokeWidth="1.2" opacity="0.72" />
      <path d="M14 6C14 27 25 37 47 37" stroke="currentColor" strokeWidth="0.8" opacity="0.46" />
      <path d="M6 15C27 15 37 26 37 47" stroke="currentColor" strokeWidth="0.8" opacity="0.46" />
      <circle cx="5" cy="6" r="2.3" fill="currentColor" opacity="0.9" />
      <circle cx="47" cy="47" r="1.6" fill="currentColor" opacity="0.58" />
      <path d="M56 54C62 51 66 47 68 41C69 50 65 58 57 64C49 58 45 50 46 41C48 47 51 51 56 54Z" fill="currentColor" opacity="0.16" />
    </svg>
  );
}

function StarDivider() {
  return (
    <div className="flex items-center gap-3 w-full" aria-hidden="true">
      <span className="hairline flex-1" />
      <span className="text-gold text-sm">✦</span>
      <span className="w-1.5 h-1.5 rotate-45 bg-gold/70" />
      <span className="text-gold text-sm">✦</span>
      <span className="hairline flex-1" />
    </div>
  );
}

export default function InvitationHero({ groom, bride }: Props) {
  const initials = `${bride[0] || 'H'}&${groom[0] || 'A'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative flex flex-col items-center overflow-hidden px-5 py-8 text-center text-ivory navy-vellum"
    >
      <div className="absolute inset-0 islamic-pattern opacity-[0.16]" />
      <div className="absolute inset-[10px] rounded-sm border border-gold/40 pointer-events-none" />
      <div className="absolute inset-[16px] rounded-sm border border-gold/20 pointer-events-none" />
      <div className="floral-corner top-2 right-2 opacity-70" />
      <div className="floral-corner bottom-2 left-2 rotate-180 opacity-60" />
      <CornerFlourish className="absolute left-3 top-3 text-gold/80" />
      <CornerFlourish className="absolute right-3 top-3 scale-x-[-1] text-gold/80" />
      <CornerFlourish className="absolute bottom-3 left-3 scale-y-[-1] text-gold/70" />
      <CornerFlourish className="absolute bottom-3 right-3 [transform:scale(-1,-1)] text-gold/70" />

      <div className="relative z-10 w-full max-w-[390px] rounded-[2rem] border-[9px] border-midnight bg-midnight/80 p-2 shadow-2xl">
        <div className="relative overflow-hidden rounded-[1.35rem] px-5 py-7 text-charcoal parchment-vellum">
          <div className="absolute inset-0 islamic-pattern opacity-[0.08]" />
          <div className="absolute inset-[8px] rounded-[1rem] border border-gold/35 pointer-events-none" />
          <div className="absolute inset-[14px] rounded-[0.75rem] border border-gold/15 pointer-events-none" />
          <div className="floral-corner -right-4 -top-4 opacity-75" />
          <div className="floral-corner -bottom-5 -left-5 rotate-180 opacity-65" />

          <div className="relative z-10 mx-auto max-w-[295px]">
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-arabic mb-2 text-2xl text-gold"
            >
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="eyebrow mb-5 text-navy"
            >
              Engagement Invitation
            </motion.p>

            <div
              className="relative mx-auto mb-5 border-x border-t border-gold/50 px-5 pb-7 pt-10"
              style={{ borderRadius: '999px 999px 14px 14px' }}
            >
              <div
                className="absolute inset-x-4 top-4 h-28 border-x border-t border-gold/25"
                style={{ borderRadius: '999px 999px 0 0' }}
              />

              <div className="relative mb-2 flex h-16 items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="absolute left-0 top-3"
                >
                  <BaroqueWings width={110} color="#c5a25a" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8, type: 'spring', stiffness: 100 }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 32% 28%, #f1d791, #9d7336)',
                    boxShadow: '0 8px 24px rgba(7,26,52,0.22), inset 0 1px 3px rgba(255,240,200,0.6)',
                  }}
                >
                  <div className="absolute inset-[6px] rounded-full border border-white/35" />
                  <span
                    className="relative z-10 text-lg text-ivory"
                    style={{ fontFamily: 'var(--font-script), cursive', textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
                  >
                    {initials}
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="absolute right-0 top-3"
                >
                  <BaroqueWings width={110} color="#c5a25a" flip />
                </motion.div>
              </div>

              <StarDivider />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.9 }}
                className="flex flex-col items-center py-5"
              >
                <p className="font-display text-5xl leading-none text-navy">{bride}</p>
                <p className="font-script my-2 text-3xl leading-none text-gold">and</p>
                <p className="font-display text-5xl leading-none text-navy">{groom}</p>
              </motion.div>

              <StarDivider />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="mb-5 grid grid-cols-3 gap-2"
            >
              <div className="rounded-sm border border-gold/35 bg-navy px-2 py-3 text-ivory">
                <p className="eyebrow text-gold-soft">Saturday</p>
                <p className="font-display text-2xl leading-none">Sep</p>
              </div>
              <div className="rounded-sm border border-gold/50 bg-gold px-2 py-3 text-navy">
                <p className="eyebrow">Date</p>
                <p className="font-display text-4xl leading-none">19</p>
              </div>
              <div className="rounded-sm border border-gold/35 bg-navy px-2 py-3 text-ivory">
                <p className="eyebrow text-gold-soft">Year</p>
                <p className="font-display text-2xl leading-none">2026</p>
              </div>
            </motion.div>

            <p className="font-display text-lg leading-snug text-navy">
              With dua, love, and the blessings of family, we invite you to celebrate our engagement.
            </p>
            <p className="eyebrow mt-4 text-gold">Formal invitation to follow</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
