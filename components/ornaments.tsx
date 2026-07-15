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
  background: '#4f6f5b',
};

export const creamGoldWash = {
  background: '#faf8f4',
};

export const navyRadial = sageBlushRadial;
