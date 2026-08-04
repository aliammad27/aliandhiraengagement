export function CornerFrame({ borderColor }: { borderColor: string }) {
  return (
    <>
      <span className={`pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t ${borderColor}`} />
      <span className={`pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t ${borderColor}`} />
      <span className={`pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l ${borderColor}`} />
      <span className={`pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r ${borderColor}`} />
    </>
  );
}

export function FloralCorner({
  className = '',
  tone = 'text-gold/70',
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      className={`pointer-events-none absolute h-14 w-14 sm:h-20 sm:w-20 ${tone} ${className}`}
      fill="none"
    >
      <path
        d="M6 6 C 34 8, 46 20, 48 48 C 49 62, 56 70, 70 72"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M20 12 C 26 20, 24 28, 16 32" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M12 20 C 20 24, 26 22, 32 16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <ellipse cx="34" cy="34" rx="6" ry="3.2" transform="rotate(40 34 34)" fill="currentColor" opacity="0.55" />
      <ellipse cx="44" cy="46" rx="5" ry="2.6" transform="rotate(35 44 46)" fill="currentColor" opacity="0.45" />
      <g transform="translate(70 72)">
        <circle r="2.6" fill="currentColor" />
        <circle cx="6" r="1.6" fill="currentColor" opacity="0.7" />
        <circle cx="-6" r="1.6" fill="currentColor" opacity="0.7" />
        <circle cy="6" r="1.6" fill="currentColor" opacity="0.7" />
        <circle cy="-6" r="1.6" fill="currentColor" opacity="0.7" />
      </g>
    </svg>
  );
}

export function FloralCorners({ tone = 'text-gold/70' }: { tone?: string }) {
  return (
    <>
      <FloralCorner tone={tone} className="left-0 top-0" />
      <FloralCorner tone={tone} className="right-0 top-0 rotate-90" />
      <FloralCorner tone={tone} className="bottom-0 right-0 rotate-180" />
      <FloralCorner tone={tone} className="bottom-0 left-0 -rotate-90" />
    </>
  );
}

export function InsetRule({ borderColor = 'border-gold/30' }: { borderColor?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-2 border ${borderColor} sm:inset-3`}
    />
  );
}

export function StarDivider({ tone = 'gold' }: { tone?: 'gold' | 'sage' | 'pink' }) {
  const styles = {
    gold: { line: 'bg-gold/55', star: 'text-gold' },
    sage: { line: 'bg-sage-dark/40', star: 'text-sage-dark' },
    pink: { line: 'bg-pink-deep/40', star: 'text-pink-deep' },
  }[tone];

  return (
    <div className={`flex items-center justify-center gap-3 ${styles.star}`} aria-hidden="true">
      <span className={`h-px w-10 ${styles.line}`} />
      <span className="text-xs">✦</span>
      <span className={`h-px w-10 ${styles.line}`} />
    </div>
  );
}

export const sageBlushRadial = {
  background: '#6f699e',
};

export const creamGoldWash = {
  background: '#faf6ef',
};

export const navyRadial = sageBlushRadial;
