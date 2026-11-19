'use client';

import { Badge } from '@/presentation/components/ui/Badge';

import type { GroupItem, GroupsViewType } from '../types';
import { getItemMemberCount, isChannelItem } from '../types';
import { RowActions } from './GroupsTable';

interface GroupCardViewProps {
  items: GroupItem[];
  viewType: GroupsViewType;
  onViewDetail: (item: GroupItem) => void;
  onToggleStatus: (item: GroupItem) => void;
  onSuspend: (item: GroupItem) => void;
  onViolation: (item: GroupItem) => void;
  onReactivate: (item: GroupItem) => void;
}

export function GroupCardView({
  items,
  viewType,
  onViewDetail,
  onToggleStatus,
  onSuspend,
  onViolation,
  onReactivate,
}: GroupCardViewProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <article
            className={`flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8CED5] hover:shadow-md ${
              !item.isActive ? 'bg-slate-50/60' : ''
            }`}
          >
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {item.avatar ? (
                    <img src={item.avatar} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-900" title={item.name}>
                      {item.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500" title={item.description}>
                      {item.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge variant={isChannelItem(item) ? 'info' : 'brand'} size="xs">
                    {isChannelItem(item) ? 'Canal' : 'Grupo'}
                  </Badge>
                  <Badge
                    variant={
                      item.suspensionType === 'violation' ||
                      (!isChannelItem(item) && item.hasViolation)
                        ? 'danger'
                        : item.isActive
                          ? 'success'
                          : 'warning'
                    }
                    size="xs"
                    dot
                  >
                    {item.suspensionType === 'violation' ||
                    (!isChannelItem(item) && item.hasViolation)
                      ? 'Violación'
                      : item.isActive
                        ? 'Activo'
                        : 'Suspendido'}
                  </Badge>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <dt className="text-slate-400">{viewType === 'channels' ? 'Suscriptores' : 'Miembros'}</dt>
                  <dd className="mt-0.5 font-semibold text-slate-700">
                    {getItemMemberCount(item).toLocaleString('es-PE')}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">{isChannelItem(item) ? 'Ciudad' : 'Administrador'}</dt>
                  <dd className="mt-0.5 truncate font-semibold text-slate-700">
                    {isChannelItem(item) ? item.city : item.adminName}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-w-0 items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <span className="min-w-0 truncate text-[11px] font-medium text-slate-400" title={item.adminEmail}>
                {item.adminEmail}
              </span>
              <div className="shrink-0">
                <RowActions
                  item={item}
                  isSuspendedView={viewType === 'suspended'}
                  onViewDetail={onViewDetail}
                  onToggleStatus={onToggleStatus}
                  onSuspend={onSuspend}
                  onViolation={onViolation}
                  onReactivate={onReactivate}
                />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
