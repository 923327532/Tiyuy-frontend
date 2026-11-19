'use client';

export interface UserActionUser {
  id: number;
  enabled: boolean;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

interface UserActionsProps<T extends UserActionUser = UserActionUser> {
  user: T;
  onViewDetail: (user: T) => void;
  onToggleStatus?: (user: T) => void;
  onDelete?: (user: T) => void;
  canManage?: boolean;
  canDelete?: boolean;
}

export function UserActions<T extends UserActionUser = UserActionUser>({
  user,
  onViewDetail,
  onToggleStatus,
  onDelete,
  canManage,
  canDelete,
}: UserActionsProps<T>) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div className="flex items-center gap-2 border-t border-slate-100 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
      <button
        type="button"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#164E63] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F3D50] transition-colors"
        onClick={() => onViewDetail(user)}
      >
        Ver detalle
      </button>

      {(canManage || canDelete) && (
        <div className="flex items-center gap-1.5">
          {canManage && onToggleStatus && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label={user.enabled ? `Suspender a ${fullName}` : `Reactivar a ${fullName}`}
              title={user.enabled ? 'Suspender' : 'Reactivar'}
              onClick={() => onToggleStatus(user)}
            >
              {user.enabled ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          )}

          {canDelete && onDelete && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-colors"
              aria-label={`Eliminar a ${fullName}`}
              title="Eliminar"
              onClick={() => onDelete(user)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
