'use client';

import { Building2, Calendar, Mail, MapPin, Shield, UserCheck, Users } from 'lucide-react';
import { AdminDetailShell } from '@/presentation/components/admin/shared/detail-shell/AdminDetailShell';
import { CARD, Row, RowList, StatusChip } from '@/presentation/components/admin/users/components/detail/ui/detailParts';

import type { Channel, Group, ViewType } from '../../types';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Group | Channel | null;
  viewType: ViewType;
}

export function ViewDetailsModal({ isOpen, onClose, item }: ViewDetailsModalProps) {
  if (!item) return null;

  const isChannel = 'city' in item;
  const memberCount = isChannel ? (item as Channel).subscriberCount : (item as Group).memberCount;
  const memberLabel = isChannel ? 'Suscriptores' : 'Miembros';
  const adminName = item.adminName;
  const adminEmail = item.adminEmail;
  const initials = (item.name?.trim().slice(0, 2) || 'GR').toUpperCase();
  const createdFormatted = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return (
    <AdminDetailShell
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={item.name}
      subtitle={
        <>
          <Users className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span>
            {isChannel ? 'Canal por ciudad' : 'Grupo social'} · {memberCount}{' '}
            {memberLabel.toLowerCase()}
          </span>
        </>
      }
      avatarFallback={initials}
      avatarDisabled={!item.isActive}
      badges={
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-100 ring-1 ring-white/20">
            {isChannel ? 'Canal' : 'Grupo'}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
              item.isActive
                ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/30'
                : 'bg-rose-500/20 text-rose-200 ring-rose-400/30'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                item.isActive ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            {item.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </>
      }
      footerLeft={<span className="hidden sm:inline">ID: #{item.id}</span>}
    >
      <div className="space-y-4">
        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Users className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500">{memberLabel}</p>
              <p className="text-base font-bold tabular-nums text-[#0f2e3a]">{memberCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#164e63]">
              <Calendar className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500">Registro</p>
              <p className="truncate text-sm font-bold text-[#0f2e3a]">{createdFormatted}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:col-span-1">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              {isChannel ? <MapPin className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500">
                {isChannel ? 'Ciudad' : 'Visibilidad'}
              </p>
              <p className="truncate text-sm font-bold text-[#0f2e3a]">
                {isChannel ? (item as Channel).city || 'General' : 'Comunidad'}
              </p>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <section className={`${CARD} p-4`}>
          <h4 className="mb-3 text-sm font-semibold tracking-tight text-[#0f2e3a]">
            Información general
          </h4>
          <RowList>
            <Row
              label="Estado"
              value={
                <StatusChip tone={item.isActive ? 'success' : 'danger'}>
                  {item.isActive ? 'Activo' : 'Inactivo'}
                </StatusChip>
              }
            />
            <Row label={memberLabel} value={String(memberCount)} />
            {isChannel && <Row label="Ciudad" value={(item as Channel).city || '—'} />}
            <Row
              label="Administrador"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                  {adminName || 'No disponible'}
                </span>
              }
            />
            <Row
              label="Correo"
              value={
                <span className="inline-flex items-center gap-1.5 break-all">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {adminEmail || 'No disponible'}
                </span>
              }
            />
            <Row label="Creado" value={createdFormatted} />
          </RowList>
        </section>

        {/* Descripción */}
        <section className={`${CARD} p-4`}>
          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold tracking-tight text-[#0f2e3a]">
            <Building2 className="h-4 w-4 text-teal-700" />
            Descripción
          </h4>
          <p className="text-sm leading-relaxed text-slate-600">
            {item.description || 'Sin descripción registrada.'}
          </p>
        </section>
      </div>
    </AdminDetailShell>
  );
}

export default ViewDetailsModal;