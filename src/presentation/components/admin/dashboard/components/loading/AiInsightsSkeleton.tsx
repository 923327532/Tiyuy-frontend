'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';

export function AiInsightsSkeleton() {
  return (
    <LoadingCard
      className="
        space-y-5
        border-[#DCEAE9]
        bg-gradient-to-br
        from-[#F8FAFC] to-[#EDF5F5]
      "
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EAF6] animate-pulse">
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>

      <div className="rounded-xl border border-[#DCEAE9] bg-[#F8FAFC]/80 p-4 space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      <Skeleton className="h-9 w-full rounded-xl" />
    </LoadingCard>
  );
}