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
      reduceMotion ? 450 : 2050,
    );
  }, [phase, reduceMotion]);

  const opening = phase === 'opening';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-cream px-5 py-7"
        >
          <button
            type="button"
            onClick={openCard}
            disabled={opening}
            className="group flex w-[min(78vw,300px)] flex-col items-center bg-transparent outline-none disabled:cursor-default"
            aria-label="Open Hira and Ali's engagement invitation"
          >
            <div className="relative aspect-[3/4] w-full [perspective:1400px]">
              <div className="absolute inset-0 overflow-hidden border border-gold/55 bg-ivory p-6 text-navy shadow-xl shadow-navy/15">
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
              </div>

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
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-7 text-center text-ivory"
              >
                <div className="absolute inset-3 border border-gold/45" />
                <p className="font-arabic relative text-lg text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                <p className="relative mt-8 text-[0.65rem] font-medium uppercase text-ivory/55">Engagement invitation</p>
                <p className="font-display relative mt-4 text-6xl leading-none">
                  H<span className="mx-2 text-3xl text-gold">&amp;</span>A
                </p>
                <p className="font-display relative mt-5 text-xl text-ivory/80">{bride} &amp; {groom}</p>
                <span className="relative my-6 h-px w-16 bg-gold/55" aria-hidden="true" />
                <p className="font-display relative text-lg text-gold-soft">10.17.25</p>
              </motion.div>
            </div>

            <motion.span
              initial={false}
              animate={{ opacity: opening ? 0 : 1, y: opening ? 4 : 0 }}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-navy px-7 text-sm font-medium text-ivory transition-colors group-hover:bg-navy-soft group-focus-visible:bg-navy-soft"
            >
              Open invitation
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
