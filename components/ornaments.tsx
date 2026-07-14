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

export function StarDivider({ tone = 'gold' }: { tone?: 'gold' | 'sage' | 'pink' }) {
  const styles = {
    gold: { line: 'bg-gold/45', star: 'text-gold' },
    sage: { line: 'bg-sage-deep/30', star: 'text-sage-deep/70' },
    pink: { line: 'bg-pink-deep/35', star: 'text-pink-deep/80' },
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
  background: 'linear-gradient(145deg, #314d3a 0%, #4f6f5b 46%, #8fa884 72%, #d78fa3 135%)',
};

export const creamGoldWash = {
  background: 'linear-gradient(180deg, #fffaf2 0%, #f6eddb 58%, #ead9bd 100%)',
};

export const navyRadial = sageBlushRadial;
