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
    </section>
  );
}
