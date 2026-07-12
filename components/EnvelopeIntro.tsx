'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  groom: string;
  bride: string;
  onOpen?: () => void;
}

// Gold arabesque SVG corner flourish
function Corner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="54" height="54" viewBox="0 0 54 54" fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M2 2 Q2 27 27 27 Q2 27 2 52" stroke="#c5a25a" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M2 2 Q27 2 27 27 Q27 2 52 2" stroke="#c5a25a" strokeWidth="1" fill="none" opacity="0.7"/>
      <path d="M8 2 Q8 20 27 20 Q8 20 8 38" stroke="#ead8aa" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M2 8 Q20 8 20 27 Q20 8 38 8" stroke="#ead8aa" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <circle cx="2" cy="2" r="1.5" fill="#c5a25a" opacity="0.8"/>
      <circle cx="27" cy="27" r="1" fill="#c5a25a" opacity="0.5"/>
    </svg>
  );
}

// Horizontal ornamental divider
function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, #c5a25a)' }} />
      <span style={{ color: '#c5a25a', fontSize: 10 }}>✦</span>
      <span style={{ color: '#ead8aa', fontSize: 7 }}>◆</span>
      <span style={{ color: '#c5a25a', fontSize: 10 }}>✦</span>
      <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, #c5a25a)' }} />
    </div>
  );
}

const SPARKLE_COUNT = 24;

function SparkleCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 420;
    canvas.height = 420;
    const cx = 210, cy = 260;
    const particles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
      const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
      const speed = Math.random() * 4 + 1.5;
      return { x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1.2,
        size: Math.random() * 5 + 2, opacity: 1,
        color: Math.random() > 0.5 ? '#c5a25a' : '#f0deb4', gravity: 0.06 };
    });
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.opacity -= 0.016;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color; ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <canvas ref={canvasRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
      style={{ width: 420, height: 420 }} />
  );
}

export default function EnvelopeIntro({ groom, bride, onOpen }: Props) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'done'>('closed');

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    onOpen?.();
    setTimeout(() => setPhase('done'), 2800);
  };

  const initials = `${bride?.[0] || 'H'}&${groom?.[0] || 'A'}`;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer select-none px-6 text-ivory navy-vellum"
          onClick={handleOpen}
          role="button"
          aria-label="Tap to open your invitation"
        >
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,162,90,0.22),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 islamic-pattern opacity-[0.14]" />

          {/* Corner ornaments */}
          <div className="absolute top-4 left-4 opacity-60"><Corner /></div>
          <div className="absolute top-4 right-4 opacity-60"><Corner flip /></div>
          <div className="absolute bottom-4 left-4 opacity-60" style={{ transform: 'scaleY(-1)' }}><Corner /></div>
          <div className="absolute bottom-4 right-4 opacity-60" style={{ transform: 'scale(-1,-1)' }}><Corner /></div>

          {/* Bismillah */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: phase === 'closed' ? 1 : 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-arabic text-gold text-2xl mb-2 text-center"
            style={{ fontFamily: 'var(--font-arabic), serif', direction: 'rtl' }}
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase === 'closed' ? 1 : 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="eyebrow text-gold mb-8"
          >
            You are cordially invited
          </motion.p>

          {/* Envelope + card — card is a sibling so its transforms are independent */}
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 200 }}>
            <SparkleCanvas active={phase === 'opening'} />

            {/* Card — sits behind envelope when closed, rises above when opening */}
            <motion.div
              initial={{ y: 0 }}
              animate={phase === 'opening' ? { y: -330 } : { y: 0 }}
              transition={{ delay: 0.45, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 mx-auto overflow-hidden flex flex-col shadow-2xl"
              style={{
                width: 270, bottom: 4,
                height: 390,
                background: 'linear-gradient(175deg, #fffaf0 0%, #f2e6cf 100%)',
                border: '1px solid rgba(197,162,90,0.45)',
                zIndex: phase === 'opening' ? 60 : 15,
              }}
            >
              <div className="absolute inset-[5px] pointer-events-none" style={{ border: '1px solid rgba(197,162,90,0.45)' }} />
              <div className="absolute inset-[9px] pointer-events-none" style={{ border: '0.5px solid rgba(234,216,170,0.35)' }} />
              <div className="absolute top-1 left-1"><Corner /></div>
              <div className="absolute top-1 right-1"><Corner flip /></div>
              <div className="absolute bottom-1 left-1" style={{ transform: 'scaleY(-1)' }}><Corner /></div>
              <div className="absolute bottom-1 right-1" style={{ transform: 'scale(-1,-1)' }}><Corner /></div>

              <div className="flex flex-col items-center pt-9 px-4">
                <p className="text-center mb-1"
                  style={{ fontFamily: 'var(--font-arabic), serif', direction: 'rtl', color: '#c5a25a', fontSize: 14 }}>
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
              </div>
              <div className="px-6 my-2"><OrnamentDivider /></div>
              <div className="mx-5 overflow-hidden flex-1" style={{ borderRadius: 2 }}>
                <img src="/photos/together-young.jpg" alt="Hira & Ali"
                  className="w-full h-full object-cover object-top" />
              </div>
              <div className="px-6 my-2"><OrnamentDivider /></div>
              <div className="flex flex-col items-center pb-5">
                <p className="text-2xl text-navy leading-none" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{bride}</p>
                <p className="text-lg my-1" style={{ fontFamily: 'var(--font-script), cursive', color: '#c5a25a' }}>and</p>
                <p className="text-2xl text-navy leading-none" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{groom}</p>
                <div className="flex items-center gap-1 mt-2 px-6 w-full">
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #c5a25a)' }} />
                  <span style={{ color: '#c5a25a', fontSize: 8 }}>✦</span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #c5a25a)' }} />
                </div>
                <p className="mt-2 text-base text-navy" style={{ fontFamily: 'var(--font-cormorant), serif' }}>09.19.26</p>
              </div>
            </motion.div>

            {/* Envelope — bobs independently, no compound transforms affecting card */}
            <motion.div
              animate={phase === 'closed' ? { y: [0, -6, 0] } : { y: -10 }}
              transition={phase === 'closed'
                ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 rounded-sm shadow-xl z-0"
                style={{ background: 'linear-gradient(160deg, #092342, #031225)', border: '1px solid rgba(197,162,90,0.45)' }} />
              <div className="absolute inset-0 z-20"
                style={{ clipPath: 'polygon(0 0, 0 100%, 50% 58%)', background: 'linear-gradient(135deg, #12355c, #061b35)' }} />
              <div className="absolute inset-0 z-20"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 58%)', background: 'linear-gradient(225deg, #17446f, #092342)' }} />
              <div className="absolute inset-0 z-30"
                style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 58%)', background: 'linear-gradient(0deg, #031225, #0c2a4c)' }} />
              <motion.div
                initial={{ rotateX: 0 }}
                animate={phase === 'opening' ? { rotateX: -178 } : { rotateX: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                className="absolute inset-x-0 top-0 z-40"
                style={{ height: '58%', transformOrigin: 'top center', transformStyle: 'preserve-3d',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(180deg, #12355c, #061b35)' }}
              />
              {/* Wax seal */}
              <motion.div
                animate={phase === 'opening' ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center"
                style={{ width: 80, height: 80 }}
              >
                <div className="absolute inset-0 rounded-full"
                  style={{ background: 'radial-gradient(circle at 35% 28%, #f1d791, #9d7336)', boxShadow: '0 4px 18px rgba(3,18,37,0.55), inset 0 1px 2px rgba(255,240,200,0.4)' }} />
                <div className="absolute inset-[7px] rounded-full" style={{ border: '1px solid rgba(255,230,160,0.4)' }} />
                <div className="absolute inset-[11px] rounded-full" style={{ border: '0.5px solid rgba(255,220,130,0.25)' }} />
                <span className="relative z-10 text-xl"
                  style={{ fontFamily: 'var(--font-script), cursive', color: 'rgba(255,248,220,0.95)', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                  {initials}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Tap prompt */}
          <motion.div
            animate={{ opacity: phase === 'closed' ? [0.4, 1, 0.4] : 0 }}
            transition={{ duration: 2.4, repeat: phase === 'closed' ? Infinity : 0, ease: 'easeInOut' }}
            className="mt-12 flex flex-col items-center gap-2"
          >
            <span className="eyebrow text-ivory/70 text-[0.65rem]">Tap to open</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="text-gold text-lg">↓</motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
