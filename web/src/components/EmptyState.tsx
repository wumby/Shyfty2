interface EmptyStateProps {
  title: string;
  copy: string;
}

export function EmptyState({ title, copy }: EmptyStateProps) {
  return (
    <div className="flex min-h-[180px] items-center justify-center px-6 py-10 text-center">
      <div>
        <div className="text-sm font-medium text-slate-300">{title}</div>
        <p className="mt-2 text-sm text-slate-500">{copy}</p>
      </div>
    </div>
  );
}
