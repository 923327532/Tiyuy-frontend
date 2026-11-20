'use client';

import { useAssociationRequests } from '@/presentation/components/admin/associations/hooks/useAssociationRequests';
import { AssociationRequestsHeader } from '@/presentation/components/admin/associations/components/AssociationRequestsHeader';
import { AssociationRequestsStats } from '@/presentation/components/admin/associations/components/AssociationRequestsStats';
import { AssociationRequestsListPanel } from '@/presentation/components/admin/associations/components/AssociationRequestsListPanel';

export default function AssociationRequestsPage() {
  const data = useAssociationRequests();

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-3 sm:py-4">
      <AssociationRequestsHeader />
      <AssociationRequestsStats counts={data.counts} />
      <AssociationRequestsListPanel data={data} />
    </div>
  );
}
