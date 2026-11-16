'use client';

import { Skeleton } from './Skeleton';
import { Spinner } from '@/presentation/components/ui/Spinner';

export function HeaderSkeleton() {
  return (
    <header
      className="
        flex flex-col gap-4
        rounded-2xl border border-[#E2EAF0]
        bg-gradient-to-r
        from-[#F8FAFC] via-[#F0F7FA] to-[#EDF5F5]
        p-5 shadow-sm shadow-[#164E63]/[0.03]
        sm:flex-row sm:items-center
        sm:justify-between sm:p-6
      "
    >
      <div className="space-y-3">
        <Skeleton className="h-7 w-52 bg-[#E0F2FE]" />
        <Skeleton className="h-3.5 w-64 max-w-full" />

        <div className="flex items-center gap-2 pt-1">
          <div className="h-2 w-2 rounded-full bg-[#DCEAE9]" />
          <Skeleton className="h-2.5 w-28" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCEAE9] bg-[#F8FAFC]">
          <Spinner size="lg" />
        </div>
      </div>
    </header>
  );
}