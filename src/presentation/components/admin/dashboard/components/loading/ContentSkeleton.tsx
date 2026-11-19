'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';

export function ContentSkeleton() {
  return (
    <LoadingCard className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E8EAF6] animate-pulse" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>

            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </LoadingCard>
  );
}