'use client';

import { CornerFrame, StarDivider } from '@/components/ornaments';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <section className="relative overflow-hidden bg-sage-dark px-4 py-8 text-center text-ivory sm:px-8 sm:py-14">
      <div className="relative mx-auto max-w-3xl border border-gold-soft/70 px-4 py-9 sm:px-10 sm:py-14">
        <CornerFrame borderColor="border-gold-soft" />

        <p className="font-arabic text-xl text-gold-soft sm:text-2xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

        <p className="mx-auto mt-6 max-w-xs text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.18em] text-gold-soft sm:max-w-none sm:tracking-[0.24em]">
          Engagement invitation
        </p>

        <h1 className="mx-auto mt-5 max-w-full font-display text-[clamp(3.25rem,15vw,4.5rem)] font-normal leading-none text-ivory [text-wrap:balance] sm:text-7xl">
          {bride} <span className="font-script mx-1 align-middle text-[0.68em] text-pink-light">&amp;</span> {groom}
        </h1>

        <div className="mx-auto mt-7 max-w-[220px] sm:max-w-[240px]">
          <StarDivider />
        </div>

        <time
          dateTime="2026-10-10"
          aria-label="Saturday, October 10, 2026"
          className="mx-auto mt-8 block max-w-xs font-display text-[1.65rem] leading-tight text-ivory sm:max-w-none sm:text-3xl"
        >
          Saturday, October 10, 2026
        </time>
        <p className="mt-2 font-display text-lg italic text-ivory">Insha&apos;Allah</p>

        <div className="mx-auto mt-8 h-px w-28 bg-gold-soft" aria-hidden="true" />

        <div className="mt-7 text-center">
          <p className="mx-auto max-w-xs text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.13em] text-ivory sm:max-w-none sm:tracking-[0.18em]">
            1204 Middle Ave, Waterford Works, NJ
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 w-full max-w-xs items-center justify-center border border-gold-soft px-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-soft transition-colors hover:bg-gold-soft hover:text-sage-dark sm:w-auto sm:tracking-[0.18em]"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
