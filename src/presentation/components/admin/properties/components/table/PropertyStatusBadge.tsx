'use client';

import { Badge } from '@/presentation/components/ui/Badge';
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_VARIANTS,
} from '../../config/properties.constants';

interface PropertyStatusBadgeProps {
  status: string;
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  return (
    <Badge
      variant={PROPERTY_STATUS_VARIANTS[status] ?? 'default'}
      size="sm"
      dot
    >
      {PROPERTY_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
