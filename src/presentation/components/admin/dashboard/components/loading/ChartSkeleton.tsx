'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';

export function ChartSkeleton() {
  return (
    <LoadingCard className="space-y-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>

        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="flex h-36 items-end gap-3 border-b border-[#E2EAF0] pb-2">
        {[45, 70, 55, 85, 65, 95, 75, 60, 88, 72].map((height, index) => (
          <div
            key={index}
            className="
              flex-1 rounded-t-md
              bg-gradient-to-t
              from-[#DCEAE9] to-[#E0F2FE]
              animate-pulse
            "
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-2 w-8" />
        ))}
      </div>
    </LoadingCard>
  );
}