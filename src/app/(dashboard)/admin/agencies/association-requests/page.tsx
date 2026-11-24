'use client';

import { useAssociationRequests } from '@/presentation/components/admin/associations/hooks/useAssociationRequests';
import { AssociationRequestsHeader } from '@/presentation/components/admin/associations/components/AssociationRequestsHeader';
import { AssociationRequestsStats } from '@/presentation/components/admin/associations/components/AssociationRequestsStats';
import { AssociationRequestsListPanel } from '@/presentation/components/admin/associations/components/AssociationRequestsListPanel';

export default function AssociationRequestsPage() {
  const data = useAssociationRequests();

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <AssociationRequestsHeader />
      <AssociationRequestsStats counts={data.counts} />
      <AssociationRequestsListPanel data={data} />
    </div>
  );
}
