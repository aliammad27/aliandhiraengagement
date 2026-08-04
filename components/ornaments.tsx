export function CornerFrame({
  borderColor,
  topCorners = true,
}: {
  borderColor: string;
  topCorners?: boolean;
}) {
  return (
    <>
      {topCorners && (
        <>
          <span className={`pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t ${borderColor}`} />
          <span className={`pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t ${borderColor}`} />
        </>
      )}
      <span className={`pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l ${borderColor}`} />
      <span className={`pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r ${borderColor}`} />
    </>
  );
}

export function ArchApex({ tone = 'text-gold' }: { tone?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 ${tone} sm:top-3`}
    >
      <span className="geo-diamond gold-glyph text-[0.55rem]">✦</span>
    </span>
  );
}

function Blossom({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  const petalCount = 6;
  const petalLength = 4.2 * size;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: petalCount }, (_, i) => (360 / petalCount) * i).map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy={-petalLength * 0.62}
          rx={1.5 * size}
          ry={petalLength}
          transform={`rotate(${angle})`}
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      ))}
      <circle r={0.9 * size} fill="currentColor" opacity="0.75" />
    </g>
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
      className={`pointer-events-none absolute h-16 w-16 sm:h-24 sm:w-24 ${tone} ${className}`}
      fill="none"
    >
      <path
        d="M8 112 C 22 98, 29 80, 33 60 C 37 40, 48 27, 68 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path d="M33 60 C 40 58, 46 54, 50 47" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />
      <path d="M48 33 C 54 31, 58 27, 60 21" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />

      <path
        d="M19 90 C 25 88, 29 83, 29 76 C 24 79, 19 82, 14 85 C 15 88, 17 90, 19 90 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.85"
      />
      <path
        d="M39 51 C 45 49, 49 45, 49 39 C 44 42, 40 45, 35 48 C 36 50, 38 51, 39 51 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.85"
      />

      <Blossom x={50} y={47} size={0.62} />
      <Blossom x={68} y={15} size={0.9} />
      <circle cx="60" cy="21" r="1.3" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="72" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function WatercolorWash({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-28 w-28 opacity-70 blur-2xl sm:h-36 sm:w-36 ${className}`}
      style={{
        background:
          'radial-gradient(circle at 32% 30%, rgba(183,177,217,0.5), transparent 60%), radial-gradient(circle at 68% 52%, rgba(230,217,188,0.4), transparent 62%), radial-gradient(circle at 45% 78%, rgba(255,252,246,0.55), transparent 68%)',
      }}
    />
  );
}

export function FloralCorners({ tone = 'text-gold/70' }: { tone?: string }) {
  return (
    <>
      <WatercolorWash className="-left-6 -top-6" />
      <WatercolorWash className="-right-6 -top-6" />
      <WatercolorWash className="-bottom-6 -right-6" />
      <WatercolorWash className="-bottom-6 -left-6" />
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
      className={`arch-inset pointer-events-none absolute inset-2 border ${borderColor} sm:inset-3`}
    />
  );
}

export function StarDivider({ tone = 'gold' }: { tone?: 'gold' | 'sage' | 'pink' }) {
  const styles = {
    gold: { line: 'text-gold', star: 'text-gold' },
    sage: { line: 'text-sage-dark', star: 'text-sage-dark' },
    pink: { line: 'text-pink-deep', star: 'text-pink-deep' },
  }[tone];

  return (
    <div className={`flex items-center justify-center gap-4 ${styles.star}`} aria-hidden="true">
      <span className={`divider-line w-12 ${styles.line}`} />
      <span className="geo-diamond gold-glyph text-[0.6rem] tracking-widest">✦</span>
      <span className={`divider-line w-12 ${styles.line}`} />
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
