'use client';

const CARD = 'animate-pulse rounded-2xl border border-slate-200/80 bg-white';

export function PropertyAnalyticsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-busy="true">
      <span className="sr-only">Cargando analítica de propiedades…</span>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={`${CARD} p-4`}>
            <div className="h-10 w-10 rounded-full bg-slate-100" />
            <div className="mt-4 h-7 w-16 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
            <div className="mt-2 h-2.5 w-20 rounded bg-slate-50" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${CARD} p-6`}>
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-56 rounded bg-slate-50" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="mb-1.5 flex justify-between">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-12 rounded bg-slate-100" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-50" />
              </div>
            ))}
          </div>
        </div>

        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className={`${CARD} p-6`}>
            <div className="h-4 w-36 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-48 rounded bg-slate-50" />
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-36 w-36 shrink-0 rounded-full bg-slate-100" />
              <div className="w-full space-y-2.5">
                {Array.from({ length: 5 }).map((__, row) => (
                  <div key={row} className="flex justify-between gap-2">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-12 rounded bg-slate-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}