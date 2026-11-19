'use client';

export function ProjectSkeleton() {
  return (
    <div className="space-y-3" aria-label="Cargando proyectos">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-xl border border-slate-100 p-3"
        >
          <div className="h-14 w-16 shrink-0 rounded-xl bg-slate-100" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-slate-100" />
            <div className="h-2.5 w-1/3 rounded bg-slate-100" />
          </div>

          <div className="h-6 w-16 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}