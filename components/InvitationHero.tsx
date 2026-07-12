'use client';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <section className="bg-navy px-6 py-10 text-center text-ivory sm:px-12 sm:py-14">
      <p className="font-arabic text-lg text-gold sm:text-xl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
      <p className="mt-5 text-[0.68rem] font-medium uppercase text-ivory/55">Engagement invitation</p>
      <h1 className="mt-5 font-display whitespace-nowrap text-5xl font-normal leading-none sm:text-6xl">
        {bride} <span className="text-gold">&amp;</span> {groom}
      </h1>

      <time dateTime="2025-10-17" aria-label="Friday, October 17, 2025" className="mx-auto mt-7 block max-w-[300px]">
        <span aria-hidden="true" className="grid grid-cols-3 items-center border-y border-gold/35 py-3">
          <span className="font-display text-lg text-ivory/75">Friday</span>
          <span className="border-x border-gold/30 font-display text-3xl text-gold-soft">17</span>
          <span className="font-display text-lg text-ivory/75">October</span>
        </span>
        <span aria-hidden="true" className="mt-3 block text-[0.68rem] text-ivory/50">2025 · In sha Allah</span>
      </time>

      <div className="mt-7 text-center">
        <p className="text-[0.68rem] font-medium uppercase text-ivory/55">1204 Middle Ave, Waterford Works, NJ</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=1204+Middle+Ave+Waterford+Works+NJ"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[0.68rem] uppercase text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-soft"
        >
          Get directions
        </a>
      </div>
    </section>
  );
}
