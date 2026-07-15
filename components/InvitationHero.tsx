'use client';

import { CornerFrame, StarDivider } from '@/components/ornaments';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <section className="relative overflow-hidden bg-sage-deep px-5 py-10 text-center text-ivory sm:px-8 sm:py-14">
      <div className="relative mx-auto max-w-3xl border border-gold/50 px-5 py-10 sm:px-10 sm:py-14">
        <CornerFrame borderColor="border-gold/60" />

        <p className="font-arabic text-xl text-gold-soft sm:text-2xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

        <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pink-pale">
          Engagement invitation
        </p>

        <h1 className="mt-5 font-display text-6xl font-normal leading-none text-ivory sm:text-7xl">
          {bride} <span className="font-script mx-1 align-middle text-4xl text-pink-light sm:text-5xl">&amp;</span> {groom}
        </h1>

        <div className="mx-auto mt-7 max-w-[240px]">
          <StarDivider />
        </div>

        <time
          dateTime="2026-10-17"
          aria-label="Saturday, October 17, 2026"
          className="mt-8 block font-display text-2xl text-ivory sm:text-3xl"
        >
          Saturday, October 17, 2026
        </time>
        <p className="mt-2 font-display text-lg italic text-ivory/85">Insha&apos;Allah</p>

        <div className="mx-auto mt-8 h-px w-28 bg-gold/60" aria-hidden="true" />

        <div className="mt-7 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ivory/85">
            1204 Middle Ave, Waterford Works, NJ
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center border border-gold/65 px-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-soft transition-colors hover:bg-gold hover:text-sage-dark"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
