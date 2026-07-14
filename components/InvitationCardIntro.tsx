'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CornerFrame, sageBlushRadial } from '@/components/ornaments';

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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-5 py-7"
          style={sageBlushRadial}
        >
          <motion.button
            type="button"
            onClick={openCard}
            disabled={opening}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="group flex w-[min(78vw,300px)] flex-col items-center bg-transparent outline-none disabled:cursor-default"
            aria-label="Open Hira and Ali's engagement invitation"
          >
            <div className="relative aspect-[3/4] w-full [perspective:1400px]">
              <motion.div
                initial={false}
                animate={{ opacity: opening ? 1 : 0, scale: opening ? 1 : 0.94 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.7, delay: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden bg-ivory p-6 text-sage-deep shadow-2xl shadow-sage-dark/35"
              >
                <CornerFrame borderColor="border-pink-deep/35" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <p className="font-arabic text-lg text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-7 text-[0.65rem] font-medium uppercase text-pink-deep">You are invited</p>
                  <p className="mt-4 font-display text-4xl leading-none">
                    {bride} <span className="text-pink-deep">&amp;</span> {groom}
                  </p>
                  <p className="mt-4 max-w-[220px] font-display text-lg leading-6 text-charcoal-soft">
                    to celebrate their engagement
                  </p>
                  <span className="my-5 h-px w-16 bg-gold/65" aria-hidden="true" />
                  <p className="font-display text-xl text-sage-dark">October 17, 2026</p>
                  <p className="mt-2 text-[0.65rem] text-charcoal-soft">Insha'Allah</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ rotateY: opening ? -116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, delay: opening && !reduceMotion ? 0.32 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left border-y border-l border-gold/60 bg-sage-deep [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />
              <motion.div
                initial={false}
                animate={{ rotateY: opening ? 116 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 1.05, delay: opening && !reduceMotion ? 0.32 : 0, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right border-y border-r border-gold/60 bg-sage-deep [transform-style:preserve-3d]"
                style={{ backfaceVisibility: 'hidden' }}
              />

              <motion.div
                initial={false}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.35, delay: opening && !reduceMotion ? 0.2 : 0 }}
                className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center overflow-hidden text-center text-ivory"
              >
                <CornerFrame borderColor="border-gold/55" />

                <span
                  aria-hidden="true"
                  className="font-script pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center text-[13rem] leading-none text-blush/15"
                  style={{ transform: 'rotate(-14deg)' }}
                >
                  &amp;
                </span>

                <div className="relative z-10 flex w-full flex-col items-center px-8 pt-10">
                  <p className="font-arabic text-lg text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <p className="mt-5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-blush/75">
                    A love letter from
                  </p>
                  <p className="font-script mt-3 text-5xl leading-none text-ivory">
                    {bride} &amp; {groom}
                  </p>
                </div>

                <motion.div
                  initial={false}
                  animate={
                    opening
                      ? { scale: reduceMotion ? 1 : 1.2, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: reduceMotion ? 0.05 : 0.34, ease: 'easeIn' }}
                  className="absolute left-1/2 z-20 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: '58%' }}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-full bg-blush/40 blur-md"
                    animate={
                      reduceMotion || opening
                        ? { opacity: 0.25 }
                        : { opacity: [0.18, 0.45, 0.18], scale: [1, 1.1, 1] }
                    }
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span
                    className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 35% 28%, #f2cbd3 0%, #d78fa3 45%, #b85f7b 100%)',
                      boxShadow:
                        'inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.35), 0 6px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span className="font-display text-base text-ivory">H&amp;A</span>
                    <span className="h-px w-5 bg-ivory/45" aria-hidden="true" />
                  </span>
                </motion.div>

                <p className="absolute inset-x-0 bottom-[4.5rem] font-display text-sm italic text-ivory/70">
                  Saturday, October 17, 2026
                </p>

                <motion.p
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-x-0 bottom-10 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-soft"
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
