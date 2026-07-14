'use client';

import { CornerFrame, StarDivider, sageBlushRadial } from '@/components/ornaments';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <section className="relative px-6 py-12 text-center text-ivory shadow-lg shadow-sage-deep/15 sm:px-12 sm:py-16" style={sageBlushRadial}>
      <CornerFrame borderColor="border-gold/55" />

      <p className="font-arabic text-lg text-gold sm:text-xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

      <p className="mt-6 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-blush/80">
        Engagement invitation
      </p>

      <h1 className="mt-5 font-display whitespace-nowrap text-5xl font-normal leading-none sm:text-6xl">
        {bride} <span className="font-script mx-1 align-middle text-3xl text-blush sm:text-4xl">&amp;</span> {groom}
      </h1>

      <div className="mx-auto mt-6 max-w-[220px]">
        <StarDivider />
      </div>

      <time dateTime="2026-10-17" aria-label="Saturday, October 17, 2026" className="mx-auto mt-6 block max-w-[300px]">
        <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-gold/35 py-4">
          <span className="font-display text-lg text-ivory/82">Saturday</span>
          <span className="border-x border-gold/30 font-display text-4xl leading-none text-blush">17</span>
          <span className="font-display text-lg text-ivory/82">October</span>
        </span>
        <span aria-hidden="true" className="mt-3 block font-display text-base italic text-ivory/70">
          2026 · Insha&apos;Allah
        </span>
      </time>

      <div className="mt-8 text-center">
        <p className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-ivory/65">
          1204 Middle Ave, Waterford Works, NJ
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-10 items-center border border-gold/55 px-5 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-gold-soft transition-colors hover:bg-gold hover:text-sage-dark"
        >
          Get directions
        </a>
      </div>
    </section>
  );
}
