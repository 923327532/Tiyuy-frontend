import { Badge } from '@/presentation/components/ui/Badge';

import type { GroupItem } from '../../types';
import { isChannelItem } from '../../types';

export function StatusBadge({ item }: { item: GroupItem }) {
  const hasViolation =
    item.suspensionType === 'violation' || (!isChannelItem(item) && Boolean(item.hasViolation));

  if (hasViolation) {
    return (
      <Badge variant="danger" size="sm" dot>
        Violación
      </Badge>
    );
  }

  if (!item.isActive) {
    return (
      <Badge variant="warning" size="sm" dot>
        Suspendido
      </Badge>
    );
  }

  return (
    <Badge variant="success" size="sm" dot>
      Activo
    </Badge>
  );
}
