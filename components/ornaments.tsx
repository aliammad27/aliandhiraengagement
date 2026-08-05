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
      className={`pointer-events-none absolute h-20 w-20 sm:h-28 sm:w-28 ${tone} ${className}`}
      fill="none"
    >
      <path
        d="M6 116 C 20 104, 27 88, 31 68 C 35 48, 46 33, 68 15"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path d="M31 68 C 38 66, 44 62, 48 55" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />
      <path d="M46 39 C 52 37, 56 33, 58 27" stroke="currentColor" strokeWidth="0.65" strokeLinecap="round" />
      <path d="M18 92 C 24 92, 29 88, 31 82" stroke="currentColor" strokeWidth="0.55" strokeLinecap="round" opacity="0.85" />

      <path
        d="M17 98 C 23 96, 27 91, 27 84 C 22 87, 17 90, 12 93 C 13 96, 15 98, 17 98 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.85"
      />
      <path
        d="M37 57 C 43 55, 47 51, 47 45 C 42 48, 38 51, 33 54 C 34 56, 36 57, 37 57 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.85"
      />
      <path
        d="M50 33 C 55 32, 58 28, 58 23 C 54 26, 51 28, 47 31 C 48 32, 49 33, 50 33 Z"
        stroke="currentColor"
        strokeWidth="0.45"
        opacity="0.8"
      />

      <Blossom x={31} y={82} size={0.5} />
      <Blossom x={48} y={55} size={0.65} />
      <Blossom x={68} y={15} size={0.95} />
      <circle cx="58" cy="27" r="1.3" fill="currentColor" opacity="0.6" />
      <circle cx="22" cy="88" r="0.9" fill="currentColor" opacity="0.4" />
      <circle cx="41" cy="63" r="0.8" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function MiniSprig({ className = '', mirror = false }: { className?: string; mirror?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`inline-block h-5 w-5 shrink-0 ${mirror ? '-scale-x-100' : ''} ${className}`}
      fill="none"
    >
      <path d="M2 21 C 6 17, 8 12, 9 7" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.75" />
      <path d="M9 12 C 6 13, 4 13, 2 11" stroke="currentColor" strokeWidth="0.55" strokeLinecap="round" opacity="0.7" />
      <path
        d="M6 18 C 8 17.4, 9.4 16, 9.4 14.2 C 7.8 15, 6.2 15.8, 4.6 16.6 C 5 17.4, 5.6 18, 6 18 Z"
        stroke="currentColor"
        strokeWidth="0.45"
        opacity="0.7"
      />
      <Blossom x={9} y={7} size={0.42} />
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
    <div className={`flex items-center justify-center gap-2 ${styles.star}`} aria-hidden="true">
      <MiniSprig />
      <span className={`divider-line w-8 ${styles.line}`} />
      <span className="geo-diamond gold-glyph text-[0.6rem] tracking-widest">✦</span>
      <span className={`divider-line w-8 ${styles.line}`} />
      <MiniSprig mirror />
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
