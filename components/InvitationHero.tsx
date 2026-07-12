'use client';

interface Props {
  groom: string;
  bride: string;
}

export default function InvitationHero({ groom, bride }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy px-6 py-12 text-center text-ivory sm:px-12 sm:py-16">
      <div className="invitation-arch pointer-events-none absolute inset-x-5 bottom-5 top-5 mx-auto max-w-md opacity-55 sm:inset-x-10 sm:bottom-8 sm:top-8" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center px-3 py-5 sm:px-8">
        <p className="font-arabic text-xl text-gold sm:text-2xl">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>

        <p className="mt-6 text-xs font-medium uppercase text-ivory/60">
          Engagement invitation
        </p>

        <h1 className="mt-8 font-display text-6xl font-normal leading-none sm:text-7xl">
          {bride}
          <span className="my-2 block text-3xl font-light text-gold">&amp;</span>
          {groom}
        </h1>

        <div
          className="my-8 flex w-full items-center gap-4 text-gold"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-gold/45" />
          <span className="text-sm">✦</span>
          <span className="h-px flex-1 bg-gold/45" />
        </div>

        <p className="font-display text-2xl text-gold-soft">
          Friday, October 17, 2025
        </p>
        <p className="mt-3 text-xs text-ivory/55">In sha Allah</p>
      </div>
    </section>
  );
}
