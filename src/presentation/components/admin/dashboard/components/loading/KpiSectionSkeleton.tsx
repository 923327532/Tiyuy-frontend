'use client';

import { Skeleton } from './Skeleton';
import { KpiSkeleton } from './KpiSkeleton';

export function KpiSectionSkeleton() {
  return (
    <section aria-label="Cargando indicadores">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>

        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>

      <div className="
        grid min-w-0 grid-cols-1 gap-4
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-5
      ">
        {Array.from({ length: 5 }).map((_, index) => (
          <KpiSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}