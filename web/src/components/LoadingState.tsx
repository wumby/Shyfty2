export function LoadingState() {
  return (
    <div className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-24 rounded-3xl bg-white/5" />
        <div className="h-24 rounded-3xl bg-white/5" />
        <div className="h-24 rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}
