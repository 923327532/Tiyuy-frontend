'use client';

import type { DonutSegment, DonutStage } from './Config';
import { CIRCUMFERENCE } from './Config';

interface SegmentBase {
  id: string;
  label: string;
  hint: string;
  value: number;
  color: string;
  icon: DonutStage['icon'];
  iconBackground: string;
  iconColor: string;
}

export function sumStatuses(
  byStatus: Record<string, number>,
  statuses: readonly string[],
): number {
  return statuses.reduce(
    (sum, status) => sum + (byStatus[status] ?? 0),
    0,
  );
}

export function buildSegments(
  source: Record<string, number>,
  stages: readonly DonutStage[],
  inactiveSegment: Omit<DonutSegment, 'value' | 'offset' | 'length' | 'percentage'>,
  total: number,
): DonutSegment[] {
  const grouped: SegmentBase[] = stages.map((stage) => ({
    ...stage,
    value: sumStatuses(source, stage.statuses),
  }));

  const groupedTotal = grouped.reduce((sum, stage) => sum + stage.value, 0);
  const inactive = Math.max(0, total - groupedTotal);

  const segments: SegmentBase[] = [
    ...grouped,
    { ...inactiveSegment, value: inactive },
  ];

  const chartSegments = segments.reduce<DonutSegment[]>((result, segment) => {
    const previousLength =
      result.length > 0
        ? result[result.length - 1].offset +
          result[result.length - 1].length
        : 0;

    const length =
      total > 0 ? (segment.value / total) * CIRCUMFERENCE : 0;

    const percentage =
      total > 0 ? Math.round((segment.value / total) * 100) : 0;

    result.push({
      ...segment,
      offset: previousLength,
      length,
      percentage,
    });

    return result;
  }, []);

  return chartSegments;
}

export function getTotalProperties(
  stats: { totalProperties?: number; publishedProperties?: number; pendingProperties?: number } | undefined,
  byStatus: Record<string, number> | undefined,
  authoritativeTotal?: number,
): number {
  if (
    typeof authoritativeTotal === 'number' &&
    Number.isFinite(authoritativeTotal)
  ) {
    return authoritativeTotal;
  }

  return byStatus
    ? Object.values(byStatus).reduce((sum, value) => sum + (value ?? 0), 0)
    : stats?.totalProperties ?? 0;
}

export function getSource(
  stats: { publishedProperties?: number; pendingProperties?: number } | undefined,
  byStatus: Record<string, number> | undefined,
): Record<string, number> {
  return byStatus ?? {
    PUBLISHED: stats?.publishedProperties ?? 0,
    PENDING: stats?.pendingProperties ?? 0,
  };
}