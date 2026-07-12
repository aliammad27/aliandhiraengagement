'use client';

import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ThenAndNow() {
  return (
    <section id="story" className="bg-cream px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16">
        <motion.figure
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="aspect-[4/5] overflow-hidden bg-charcoal/5"
        >
          <img
            src="/photos/together-young.jpg"
            alt="Hira and Ali when they were young"
            className="h-full w-full object-cover object-top"
          />
        </motion.figure>

        <div className="max-w-xl md:pr-8">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-medium uppercase text-sage-deep"
          >
            Our story
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-5 font-display text-5xl font-normal leading-tight sm:text-6xl"
          >
            We go way back.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="mt-7 text-base leading-8 text-charcoal-soft sm:text-lg"
          >
            Long before the ring, we were two kids with no idea where life would lead us. Alhamdulillah, it led us back to each other.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="mt-9 flex items-center gap-4 text-gold"
            aria-hidden="true"
          >
            <span className="h-px w-16 bg-gold" />
            <span className="text-sm">✦</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
