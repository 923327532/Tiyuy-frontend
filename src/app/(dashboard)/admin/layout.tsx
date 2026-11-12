/**
 * Admin Layout
 * El header y sidebar están encapsulados dentro de AdminShell
 */

'use client';

import { ReactNode } from 'react';
import { AdminGuard } from '@/presentation/components/guards/AdminGuard';
import { AdminShell } from '@/presentation/components/admin/AdminShell/AdminShell';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminGuard>
  );
}