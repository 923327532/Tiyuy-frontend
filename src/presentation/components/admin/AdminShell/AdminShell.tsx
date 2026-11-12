/**
 * Admin shell: responsive sidebar, institutional header and scrollable content.
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, TriangleAlert } from 'lucide-react';
import { useAdminProfile } from '@/presentation/hooks/useAdminProfile';
import { useAuthStore } from '@/presentation/store/authStore';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { Card } from '@/presentation/components/ui/Card';
import { AdminHeader } from '@/presentation/components/admin/AdminHeader/AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { adminProfile, isLoading, error } = useAdminProfile();
  const { setAdminProfile } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    const isDesktop =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      setCollapsed((value) => !value);
    } else {
      setMobileOpen((value) => !value);
    }
  };

  useEffect(() => {
    if (adminProfile) {
      setAdminProfile(
        adminProfile.roleType,
        adminProfile.departments,
        adminProfile.permissions || adminProfile.additionalPermissions || [],
        adminProfile.active,
      );
    }
  }, [adminProfile, setAdminProfile]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-slate-500">Cargando perfil de administrador...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5] p-4">
        <Card className="mx-auto max-w-md p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
              <TriangleAlert className="h-7 w-7 text-rose-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Error de perfil admin</h2>
            <p className="mt-2 text-sm text-slate-600">
              No se pudo cargar el perfil de administrador. Vuelve a intentarlo.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-[#0f2e3a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#164453]"
            >
              Recargar página
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!adminProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5] p-4">
        <Card className="mx-auto max-w-md p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <ShieldAlert className="h-7 w-7 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Acceso restringido</h2>
            <p className="mt-2 text-sm text-slate-600">
              No tienes privilegios de administrador o tu cuenta no está activa.
            </p>
            <Link
              href="/dashboard"
              className="mt-5 inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Volver al dashboard
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f5]">
      <AdminHeader onToggleSidebar={handleToggleSidebar} />

      <div className="relative flex h-[calc(100vh-56px)] overflow-hidden">
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
            aria-label="Cerrar menú de navegación"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={[
            'fixed inset-y-0 left-0 top-14 z-40 flex h-[calc(100vh-56px)] w-[248px] flex-col overflow-hidden bg-[#0f2e3a] transition-transform duration-200 ease-in-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
            'md:static md:top-0 md:z-auto md:h-full md:shrink-0 md:translate-x-0 md:transition-[width]',
            collapsed ? 'md:w-[64px]' : 'md:w-[248px]',
          ].join(' ')}
          aria-label="Menú administrativo"
        >
          <AdminSidebar collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
        </aside>

        <main className="h-full flex-1 overflow-y-auto bg-[#f6f7f5]">
          {children}
        </main>
      </div>
    </div>
  );
}
