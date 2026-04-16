interface EmptyStateProps {
  title: string;
  copy: string;
}

export function EmptyState({ title, copy }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.02] px-6 py-14 text-center">
      <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Signal Feed</div>
      <div className="mt-4 text-2xl font-semibold text-white">{title}</div>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">{copy}</p>
    </div>
  );
}
