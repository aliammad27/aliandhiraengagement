'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CornerFrame, StarDivider } from '@/components/ornaments';

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
      reduceMotion ? 450 : 2000,
    );
  }, [phase, reduceMotion]);

  const opening = phase === 'opening';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-cream px-5 py-7"
        >
          <motion.button
            type="button"
            onClick={openCard}
            disabled={opening}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group flex w-[min(88vw,430px)] flex-col items-center bg-transparent outline-none disabled:cursor-default"
            aria-label="Open Hira and Ali's engagement invitation"
          >
            <div className="relative aspect-[4/5] w-full [perspective:1400px]">
              <motion.div
                initial={false}
                animate={{ opacity: opening ? 1 : 0, scale: opening ? 1 : 0.96 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.7, delay: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden border border-gold/55 bg-ivory p-8 text-sage-deep shadow-2xl shadow-sage-dark/20 sm:p-10"
              >
                <CornerFrame borderColor="border-pink-deep/35" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <p className="font-arabic text-2xl text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-7 text-xs font-semibold uppercase text-pink-deep">You are invited</p>
                  <p className="mt-4 font-display text-5xl leading-none sm:text-6xl">
                    {bride} <span className="text-pink-deep">&amp;</span> {groom}
                  </p>
                  <p className="mt-5 max-w-[260px] font-display text-2xl leading-7 text-charcoal">
                    to celebrate their engagement
                  </p>
                  <span className="my-6 h-px w-20 bg-gold/70" aria-hidden="true" />
                  <p className="font-display text-2xl text-sage-dark">October 17, 2026</p>
                  <p className="mt-2 text-xs font-medium uppercase text-charcoal-soft">Insha'Allah</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ rotateY: opening ? -116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, delay: opening && !reduceMotion ? 0.32 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left border-y border-l border-gold/70 bg-ivory [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <motion.div
                initial={false}
                animate={{ rotateY: opening ? 116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, delay: opening && !reduceMotion ? 0.32 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right border-y border-r border-gold/70 bg-ivory [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />

              <motion.div
                initial={false}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.35, delay: opening && !reduceMotion ? 0.2 : 0 }}
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center overflow-hidden border border-gold/70 bg-ivory text-center text-sage-deep shadow-2xl shadow-sage-dark/20"
              >
                <CornerFrame borderColor="border-gold/65" />

                <span
                  aria-hidden="true"
                  className="font-script pointer-events-none absolute inset-x-0 top-[47%] z-0 flex select-none items-center justify-center text-[12rem] leading-none text-sage-pale"
                  style={{ transform: 'translateY(-50%) rotate(-12deg)' }}
                >
                  &amp;
                </span>

                <div className="relative z-10 flex w-full flex-col items-center px-8 pt-12 sm:px-10 sm:pt-14">
                  <p className="font-arabic text-2xl text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

                  <div className="mt-8 w-full max-w-[240px]">
                    <StarDivider tone="pink" />
                  </div>

                  <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-sage-dark">
                    An invitation from
                  </p>
                  <p className="mt-4 font-display text-6xl leading-none text-sage-deep sm:text-7xl">
                    {bride} <span className="text-pink-deep">&amp;</span> {groom}
                  </p>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    opening
                      ? { scale: reduceMotion ? 1 : 1.18, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: reduceMotion ? 0.05 : 0.34, ease: 'easeIn' }}
                  className="absolute left-1/2 z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: '61%' }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-full bg-pink-deep/20 blur-md"
                    animate={
                      reduceMotion || opening
                        ? { opacity: 0.25 }
                        : { opacity: [0.2, 0.4, 0.2], scale: [1, 1.08, 1] }
                    }
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-full bg-pink-deep text-ivory shadow-lg shadow-sage-dark/25">
                    <span className="font-display text-xl">H&amp;A</span>
                    <span className="h-px w-7 bg-ivory/55" aria-hidden="true" />
                  </span>
                </motion.div>

                <p className="absolute inset-x-0 bottom-[5.2rem] font-display text-base italic text-charcoal-soft">
                  Saturday, October 17, 2026
                </p>

                <motion.p
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 bottom-10 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  Open the invitation
                </motion.p>
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
