'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  bride: string;
  groom: string;
}

type Phase = 'closed' | 'opening' | 'done';

export default function InvitationCardIntro({ bride, groom }: Props) {
  const [phase, setPhase] = useState<Phase>('closed');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (phase !== 'done') document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const openCard = useCallback(() => {
    if (phase !== 'closed') return;

    window.scrollTo({ top: 0, behavior: 'auto' });
    setPhase('opening');
    timerRef.current = setTimeout(
      () => setPhase('done'),
      reduceMotion ? 450 : 1500,
    );
  }, [phase, reduceMotion]);

  const opening = phase === 'opening';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-navy px-5 py-7"
        >
          <button
            type="button"
            onClick={openCard}
            disabled={opening}
            className="group flex w-[min(78vw,300px)] flex-col items-center bg-transparent outline-none disabled:cursor-default"
            aria-label="Open Hira and Ali's engagement invitation"
          >
            <div className="relative aspect-[3/4] w-full [perspective:1400px]">
              <motion.div
                initial={false}
                animate={{ opacity: opening ? 1 : 0, scale: opening ? 1 : 0.94 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.7, delay: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden border border-gold/55 bg-ivory p-6 text-navy shadow-2xl shadow-black/40"
              >
                <div className="absolute inset-3 border border-gold/35" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <p className="font-arabic text-lg text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-7 text-[0.65rem] font-medium uppercase text-sage-deep">You are invited</p>
                  <p className="mt-4 font-display text-4xl leading-none">
                    {bride} <span className="text-gold">&amp;</span> {groom}
                  </p>
                  <p className="mt-4 max-w-[220px] font-display text-lg leading-6 text-charcoal-soft">
                    to celebrate their engagement
                  </p>
                  <span className="my-5 h-px w-16 bg-gold/65" aria-hidden="true" />
                  <p className="font-display text-xl text-charcoal">October 17, 2025</p>
                  <p className="mt-2 text-[0.65rem] text-charcoal-soft">In sha Allah</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ rotateY: opening ? -116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left border-y border-l border-r border-gold/60 border-r-gold/20 bg-navy [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <motion.div
                initial={false}
                animate={{ rotateY: opening ? 116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right border-y border-l border-r border-gold/60 border-l-gold/20 bg-navy [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />

              <motion.div
                initial={false}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.3 }}
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center text-center text-ivory"
              >
                <div className="absolute inset-3 border border-gold/45" />

                <svg
                  viewBox="0 0 300 400"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <line x1="14" y1="14" x2="150" y2="232" stroke="rgba(183,154,94,0.55)" strokeWidth="1" />
                  <line x1="286" y1="14" x2="150" y2="232" stroke="rgba(183,154,94,0.55)" strokeWidth="1" />
                  {[0.25, 0.4, 0.55, 0.7, 0.85].map((t) => {
                    const x = 14 + 136 * t;
                    const y = 14 + 218 * t;
                    return (
                      <g key={t}>
                        <circle cx={x} cy={y} r="2.2" fill="rgba(183,154,94,0.55)" />
                        <circle cx={300 - x} cy={y} r="2.2" fill="rgba(183,154,94,0.55)" />
                      </g>
                    );
                  })}
                </svg>

                <div className="relative z-10 flex w-full flex-col items-center px-8 pt-10">
                  <p className="font-arabic text-lg text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ivory/55">
                    A love letter from
                  </p>
                  <p className="font-script mt-3 text-5xl leading-none text-ivory">
                    {bride} &amp; {groom}
                  </p>
                </div>

                <div
                  className="absolute left-1/2 z-20 flex h-16 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-gold bg-navy shadow-lg shadow-black/30"
                  style={{ top: '58%' }}
                >
                  <span className="font-display text-base text-gold">H&amp;A</span>
                  <span className="h-px w-5 bg-gold/50" aria-hidden="true" />
                </div>

                <p className="absolute inset-x-0 bottom-10 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold">
                  Open the invitation
                </p>
              </motion.div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
