interface EmptyStateProps {
  title: string;
  copy: string;
}

export function EmptyState({ title, copy }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] bg-white/[0.03] px-6 py-14 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Signal Feed</div>
      <div className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-ink">{title}</div>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{copy}</p>
    </div>
  );
}
