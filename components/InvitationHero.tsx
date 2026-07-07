'use client';

import { motion } from 'framer-motion';
import BaroqueWings from './BaroqueWings';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative flex flex-col items-center text-center px-6 pt-12 pb-8 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #fffdf8 0%, #fdf6e8 100%)' }}
    >
      {/* Ornate border lines */}
      <div className="absolute inset-[10px] border border-gold/25 pointer-events-none rounded-sm" />
      <div className="absolute inset-[16px] border border-gold/12 pointer-events-none rounded-sm" />

      {/* Corner flourishes */}
      {[
        'top-2 left-2',
        'top-2 right-2 scale-x-[-1]',
        'bottom-2 left-2 scale-y-[-1]',
        'bottom-2 right-2 [transform:scale(-1,-1)]',
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} opacity-50`}>
          <svg width="44" height="44" viewBox="0 0 54 54" fill="none">
            <path d="M2 2 Q2 27 27 27 Q2 27 2 52" stroke="#b89b6e" strokeWidth="1" fill="none" opacity="0.7"/>
            <path d="M2 2 Q27 2 27 27 Q27 2 52 2" stroke="#b89b6e" strokeWidth="1" fill="none" opacity="0.7"/>
            <circle cx="2" cy="2" r="1.5" fill="#b89b6e" opacity="0.8"/>
          </svg>
        </div>
      ))}

      {/* Bismillah */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
        className="text-2xl mb-3"
        style={{ fontFamily: 'var(--font-arabic), serif', direction: 'rtl', color: '#9a7340' }}
      >
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </motion.p>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        className="eyebrow text-charcoal mb-6"
      >
        Engagement Invitation
      </motion.p>

      {/* Baroque Wings + Seal Row */}
      <div className="relative flex items-center justify-center w-full mb-4" style={{ height: 120 }}>
        {/* Left wing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute left-0"
          style={{ width: '45%' }}
        >
          <BaroqueWings width={160} />
        </motion.div>

        {/* Wax seal center */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: 90, height: 90,
            background: 'radial-gradient(circle at 32% 28%, #d4b57a, #8a6230)',
            boxShadow: '0 6px 30px rgba(138,98,48,0.45), inset 0 1px 3px rgba(255,240,200,0.5)',
          }}
        >
          <div className="absolute inset-[7px] rounded-full border border-white/25" />
          <div className="absolute inset-[12px] rounded-full border border-white/15" />
          <span style={{ fontFamily: 'var(--font-script), cursive', color: 'rgba(255,248,220,0.95)', fontSize: 20, textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            {bride[0]}&{groom[0]}
          </span>
        </motion.div>

        {/* Right wing */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute right-0"
          style={{ width: '45%' }}
        >
          <BaroqueWings width={160} flip />
        </motion.div>
      </div>

      {/* Gold divider */}
      <div className="flex items-center gap-2 w-full max-w-xs mb-5">
        <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to right, transparent, #b89b6e)' }} />
        <span style={{ color: '#b89b6e', fontSize: 9 }}>✦ ◆ ✦</span>
        <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to left, transparent, #b89b6e)' }} />
      </div>

      {/* Names */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="flex flex-col items-center mb-5"
      >
        <p className="text-4xl text-charcoal" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{bride}</p>
        <p className="text-2xl my-1" style={{ fontFamily: 'var(--font-script), cursive', color: '#b89b6e' }}>and</p>
        <p className="text-4xl text-charcoal" style={{ fontFamily: 'var(--font-cormorant), serif' }}>{groom}</p>
      </motion.div>

      {/* Gold divider */}
      <div className="flex items-center gap-2 w-full max-w-xs mb-5">
        <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to right, transparent, #b89b6e)' }} />
        <span style={{ color: '#b89b6e', fontSize: 9 }}>✦ ◆ ✦</span>
        <div className="flex-1" style={{ height: 1, background: 'linear-gradient(to left, transparent, #b89b6e)' }} />
      </div>

      {/* Date */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
        className="flex flex-col items-center"
      >
        <p className="eyebrow text-gold mb-1">Save the Date</p>
        <p className="text-3xl text-charcoal" style={{ fontFamily: 'var(--font-cormorant), serif', letterSpacing: '0.1em' }}>
          09.19.26
        </p>
      </motion.div>
    </motion.div>
  );
}
