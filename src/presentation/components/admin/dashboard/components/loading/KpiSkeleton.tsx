'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';

export function KpiSkeleton() {
  return (
    <LoadingCard className="h-[154px]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E0F2FE] animate-pulse" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-14 rounded-full" />
      </div>
    </LoadingCard>
  );
}