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

export function StarDivider({ tone = 'gold' }: { tone?: 'gold' | 'navy' }) {
  const line = tone === 'gold' ? 'bg-gold/45' : 'bg-navy/25';
  const star = tone === 'gold' ? 'text-gold' : 'text-navy/60';
  return (
    <div className={`flex items-center justify-center gap-3 ${star}`} aria-hidden="true">
      <span className={`h-px w-10 ${line}`} />
      <span className="text-xs">✦</span>
      <span className={`h-px w-10 ${line}`} />
    </div>
  );
}

export const navyRadial = {
  background: 'radial-gradient(130% 90% at 50% 22%, #12315a 0%, #0a2038 48%, #051220 100%)',
};
