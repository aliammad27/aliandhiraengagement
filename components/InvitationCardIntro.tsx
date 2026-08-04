'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CornerFrame, StarDivider } from '@/components/ornaments';

interface Props {
  bride: string;
  groom: string;
  onOpened?: () => void;
}

type Phase = 'closed' | 'opening' | 'done';

export default function InvitationCardIntro({ bride, groom, onOpened }: Props) {
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

  const finishOpening = useCallback(() => {
    setPhase('done');
    onOpened?.();
    window.requestAnimationFrame(() => {
      document.getElementById('top')?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, [onOpened, reduceMotion]);

  const openCard = useCallback(() => {
    if (phase !== 'closed') return;

    window.scrollTo({ top: 0, behavior: 'auto' });
    setPhase('opening');
    timerRef.current = setTimeout(
      finishOpening,
      reduceMotion ? 450 : 1850,
    );
  }, [finishOpening, phase, reduceMotion]);

  const opening = phase === 'opening';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-cream px-4 py-5 sm:px-5 sm:py-7"
        >
          <motion.button
            type="button"
            onClick={openCard}
            disabled={opening}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileTap={reduceMotion || opening ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group flex w-[min(90vw,calc((100svh-2.5rem)*0.8),430px)] max-w-full flex-col items-center bg-transparent outline-none disabled:cursor-default"
            aria-label="Open Hira and Ali's engagement invitation"
          >
            <div className="relative aspect-[4/5] w-full [perspective:1400px]">
              <motion.div
                initial={false}
                animate={{ opacity: opening ? 1 : 0, scale: opening ? 1 : 0.96 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.7, delay: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden border border-gold/55 bg-ivory p-6 text-sage-deep shadow-2xl shadow-sage-dark/20 sm:p-10"
              >
                <CornerFrame borderColor="border-pink-deep/35" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <p className="font-arabic text-xl text-gold sm:text-2xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-5 text-xs font-semibold uppercase text-pink-deep sm:mt-7">You are invited</p>
                  <p className="mt-4 font-display text-[clamp(2.6rem,12vw,3.75rem)] leading-none">
                    {bride} <span className="text-pink-deep">&amp;</span> {groom}
                  </p>
                  <p className="mt-4 max-w-[240px] font-display text-xl leading-6 text-charcoal sm:mt-5 sm:text-2xl sm:leading-7">
                    to celebrate their engagement
                  </p>
                  <span className="my-5 h-px w-20 bg-gold/70 sm:my-6" aria-hidden="true" />
                  <p className="font-display text-xl text-sage-dark sm:text-2xl">October 10, 2026</p>
                  <p className="mt-2 text-xs font-medium uppercase text-charcoal-soft">Insha'Allah</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ rotateY: opening ? -108 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1, delay: opening && !reduceMotion ? 0.28 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left border-y border-l border-gold/70 bg-ivory [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <motion.div
                initial={false}
                animate={{ rotateY: opening ? 108 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1, delay: opening && !reduceMotion ? 0.28 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right border-y border-r border-gold/70 bg-ivory [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />

              <motion.div
                initial={false}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.35, delay: opening && !reduceMotion ? 0.18 : 0 }}
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center overflow-hidden border border-gold/70 bg-ivory text-center text-sage-deep shadow-2xl shadow-sage-dark/20"
              >
                <CornerFrame borderColor="border-gold/65" />

                <div className="relative z-10 flex w-full flex-col items-center px-6 pt-9 sm:px-10 sm:pt-14">
                  <p className="font-arabic text-xl text-gold sm:text-2xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

                  <div className="mt-6 w-full max-w-[220px] sm:mt-8 sm:max-w-[240px]">
                    <StarDivider tone="pink" />
                  </div>

                  <p className="mt-6 text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.18em] text-sage-dark sm:mt-7 sm:text-[0.72rem] sm:tracking-[0.2em]">
                    An invitation from
                  </p>
                  <p className="mt-3 max-w-full font-display text-[clamp(3rem,14vw,4.5rem)] leading-none text-sage-deep sm:mt-4">
                    {bride} <span className="text-pink-deep">&amp;</span> {groom}
                  </p>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    opening
                      ? { scale: reduceMotion ? 1 : 1.14, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: reduceMotion ? 0.05 : 0.34, ease: 'easeIn' }}
                  className="absolute left-1/2 z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2 sm:h-20 sm:w-20"
                  style={{ top: '62%' }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute -inset-3 rounded-full bg-pink-deep/20 blur-md"
                    animate={
                      reduceMotion || opening
                        ? { opacity: 0.25 }
                        : { opacity: [0.2, 0.36, 0.2], scale: [1, 1.06, 1] }
                    }
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-full bg-pink-deep text-ivory shadow-lg shadow-sage-dark/25">
                    <span className="font-display text-lg sm:text-xl">H&amp;A</span>
                    <span className="h-px w-7 bg-ivory/55" aria-hidden="true" />
                  </span>
                </motion.div>

                <p className="absolute inset-x-0 bottom-[4.7rem] px-5 font-display text-sm italic text-charcoal-soft sm:bottom-[5.2rem] sm:text-base">
                  Saturday, October 10, 2026
                </p>

                <motion.p
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [0.72, 1, 0.72] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 bottom-8 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold sm:bottom-10 sm:text-[0.72rem] sm:tracking-[0.2em]"
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
