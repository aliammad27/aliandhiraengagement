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
    sage: { line: 'bg-sage/30', star: 'text-sage/80' },
    pink: { line: 'bg-pink/35', star: 'text-pink/85' },
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
  background:
    'radial-gradient(ellipse at -10% -20%, rgba(168,196,162,0.34) 0%, transparent 68%), radial-gradient(ellipse at 110% 112%, rgba(212,135,138,0.28) 0%, transparent 70%), linear-gradient(145deg, #5f7d62 0%, #7d9b76 48%, #d4878a 140%)',
};

export const creamGoldWash = {
  background:
    'radial-gradient(ellipse at -10% -20%, rgba(168,196,162,0.18) 0%, transparent 70%), radial-gradient(ellipse at 110% 110%, rgba(212,135,138,0.15) 0%, transparent 70%), linear-gradient(180deg, #f7f4ef 0%, #faf8f4 58%, #f5e0e1 100%)',
};

export const navyRadial = sageBlushRadial;
