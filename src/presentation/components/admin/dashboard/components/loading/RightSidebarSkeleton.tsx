'use client';

import { AttentionSkeleton } from './AttentionSkeleton';
import { AiInsightsSkeleton } from './AiInsightsSkeleton';

export function RightSidebarSkeleton() {
  return (
    <aside className="min-w-0 space-y-6">
      {/* ATTENTION / ALERTS */}
      <AttentionSkeleton />

      {/* AI INSIGHTS */}
      <AiInsightsSkeleton />
    </aside>
  );
}