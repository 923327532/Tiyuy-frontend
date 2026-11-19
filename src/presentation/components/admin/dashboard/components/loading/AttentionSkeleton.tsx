'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';

export function AttentionSkeleton() {
  return (
    <LoadingCard className="space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="h-8 w-8 rounded-lg bg-[#E0F2FE] animate-pulse" />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="
            flex items-start gap-3
            rounded-xl border border-[#E2EAF0]
            bg-[#F8FAFC] p-3
          "
        >
          <div className="h-9 w-9 shrink-0 rounded-lg bg-[#DCEAE9] animate-pulse" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-2/3" />
          </div>
        </div>
      ))}
    </LoadingCard>
  );
}