'use client';

import { Badge } from '@/presentation/components/ui/Badge';

interface VerifiedMarkProps {
  verified: boolean;
}

export function VerifiedMark({ verified }: VerifiedMarkProps) {
  return (
    <Badge variant={verified ? 'success' : 'warning'} size="xs" dot>
      {verified ? 'Verificado' : 'Sin verificar'}
    </Badge>
  );
}