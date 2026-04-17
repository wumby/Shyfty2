export function LoadingState() {
  return (
    <div className="rounded-[28px] bg-white/[0.03] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
      <div className="animate-pulse space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded-full bg-white/10" />
          <div className="h-8 w-32 rounded-full bg-white/5" />
        </div>
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[24px] bg-white/[0.035] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-7 w-32 rounded-full bg-white/10" />
                <div className="h-8 w-52 rounded-full bg-white/10" />
                <div className="h-4 w-full max-w-2xl rounded-full bg-white/5" />
                <div className="h-4 w-full max-w-xl rounded-full bg-white/5" />
              </div>
              <div className="h-28 w-full rounded-[22px] bg-white/[0.04] lg:max-w-[260px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
