'use client';

import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

export default function ThenAndNow() {
  return (
    <section id="story" className="py-28 sm:py-40 px-6 relative overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute inset-0 islamic-pattern opacity-[0.05]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(197,162,90,0.10),_transparent_70%)]" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Heading */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="eyebrow text-gold mb-4"
        >
          A little history
        </motion.p>
        <motion.h2
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="font-display text-4xl sm:text-6xl mb-6"
        >
          We go way back
        </motion.h2>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
          className="text-charcoal-soft font-light text-lg max-w-xl mx-auto mb-14"
        >
          Long before the ring, long before the question — there were two kids who had no idea what was coming.
        </motion.p>

        {/* Single photo — centred, portrait, generous size */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
          className="relative group mx-auto overflow-hidden rounded-sm border border-gold/30 shadow-2xl shadow-navy/15"
          style={{ maxWidth: 480 }}
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="/photos/together-young.jpg"
              alt="Hira & Ali"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Caption overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal/70 to-transparent p-8">
            <p className="font-script text-ivory text-4xl leading-none mb-1">Hira & Ali</p>
            <p className="eyebrow text-ivory/70 text-[0.6rem]">Before we even knew</p>
          </div>

          <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-colors duration-500 rounded-sm pointer-events-none" />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}
          className="flex items-center gap-6 mt-14 justify-center"
        >
          <span className="hairline w-20" />
          <span className="font-script text-2xl text-gold">and now, forever</span>
          <span className="hairline w-20" />
        </motion.div>
      </div>
    </section>
  );
}
