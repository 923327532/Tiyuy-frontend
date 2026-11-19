'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import type { ModerationQueueItem } from './Config';
import { SEVERITY_STYLES } from './Config';

interface QueueItemProps {
  item: ModerationQueueItem;
  index: number;
}

export function QueueItem({ item, index }: QueueItemProps) {
  const styles = SEVERITY_STYLES[item.severity];
  const Icon = item.icon;

  return (
    <li
      className="moderation-queue-item flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4 transition-colors duration-200 hover:bg-[#F8FAFC] rounded-xl mx-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex min-w-0 items-center gap-3 w-full sm:w-auto">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBackground}`}>
          <Icon className={`h-4.5 w-4.5 ${styles.iconColor}`} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-800">{item.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{item.description}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 w-full sm:w-auto sm:justify-end mt-3 sm:mt-0">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tabular-nums ${styles.badge}`}>
          {item.count}
        </span>
        <Link
          href={item.href}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors duration-200"
          style={{ backgroundColor: styles.iconBackground, color: styles.iconColor }}
        >
          {item.actionLabel}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}