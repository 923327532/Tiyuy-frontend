'use client';

import Link from 'next/link';
import type { DashboardRecentActivityProps } from '@/presentation/components/admin/dashboard/types/dashboard.types';
import { ChartCard } from '@/presentation/components/ui/Card';
import { formatFullDate, formatRelativeTime } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';
import { EmptyActivity } from '@/presentation/components/ui/EmptyState';
import { SkeletonText } from '@/presentation/components/ui/Skeleton';

export function DashboardRecentActivity({
  items,
  isLoading,
}: DashboardRecentActivityProps) {
  return (
    <ChartCard
      title="Actividad reciente"
      description="Últimos avisos registrados en el sistema."
      action={
        <Link
          href="/admin/notifications"
          className="shrink-0 rounded text-xs font-medium text-slate-700 hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50"
        >
          Ver todo
        </Link>
      }
      loading={isLoading}
    >
      {isLoading ? (
        <div className="flex-1 space-y-4" aria-busy="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <SkeletonText lines={1} />
              <SkeletonText lines={1} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyActivity />
      ) : (
        <ul className="flex-1 divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className={`px-5 py-4 ${item.read ? '' : 'bg-slate-50/60'}`}>
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    item.read ? 'bg-slate-300' : 'bg-brand-500'
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm text-slate-900 ${
                      item.read ? 'font-medium' : 'font-semibold'
                    }`}
                  >
                    <span className="sr-only">{item.read ? 'Leído: ' : 'No leído: '}</span>
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                  <time
                    dateTime={item.createdAt}
                    title={formatFullDate(item.createdAt)}
                    className="mt-1 block text-[11px] text-slate-400"
                  >
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}