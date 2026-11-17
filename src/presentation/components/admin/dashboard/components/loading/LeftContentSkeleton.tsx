'use client';

import { Skeleton } from './Skeleton';
import { LoadingCard } from './LoadingCard';
import { ChartSkeleton } from './ChartSkeleton';
import { ContentSkeleton } from './ContentSkeleton';

export function LeftContentSkeleton() {
  return (
    <div className="min-w-0 space-y-6">
      {/* REVENUE / ANALYTICS */}
      <ChartSkeleton />

      {/* TWO COLUMN CARDS */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <ContentSkeleton />
        <ContentSkeleton />
      </div>

      {/* PROJECTS AND MODERATION */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <LoadingCard className="space-y-5 p-6">
          <Skeleton className="h-4 w-40" />

          <div className="flex items-center justify-center py-5">
            <div className="h-32 w-32 rounded-full border-[14px] border-[#E8EAF6] border-r-[#DCEAE9] animate-pulse" />
          </div>

          <div className="flex justify-center gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </LoadingCard>

        <ContentSkeleton />
      </div>

      {/* CAMPAIGN FUNNEL */}
      <LoadingCard className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        <div className="space-y-3">
          {[100, 82, 64, 43].map((width, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />

              <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#F1F5F9]">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-[#E0F2FE] to-[#DCEAE9] animate-pulse"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </LoadingCard>
    </div>
  );
}