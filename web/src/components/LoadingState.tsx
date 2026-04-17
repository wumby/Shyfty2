export function LoadingState() {
  return (
    <div className="animate-pulse">
      {[0, 1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="grid grid-cols-[minmax(0,1fr),120px] items-center gap-4 border-b border-slate-800 px-3 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr),140px] sm:px-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-14 rounded-full bg-slate-800" />
              <div className="h-4 w-12 rounded-full bg-slate-800/60" />
            </div>
            <div className="h-5 w-44 rounded-full bg-slate-800" />
            <div className="h-3.5 w-full max-w-xl rounded-full bg-slate-800/60" />
            <div className="h-3 w-40 rounded-full bg-slate-800/60" />
          </div>
          <div className="justify-self-end space-y-2 text-right">
            <div className="ml-auto h-7 w-16 rounded-full bg-slate-800" />
            <div className="ml-auto h-3 w-24 rounded-full bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
