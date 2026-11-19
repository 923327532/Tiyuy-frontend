'use client';

interface LogoutDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutDialog({
  onCancel,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center
        justify-center p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-logout-title"
    >
      <button
        type="button"
        className="fixed inset-0 bg-slate-950/60"
        aria-label="Cerrar diálogo"
        onClick={onCancel}
      />

      <div
        className="
          relative w-full max-w-sm rounded-xl
          border border-slate-200 bg-white p-6 shadow-xl
        "
      >
        <h3
          id="admin-logout-title"
          className="text-lg font-semibold text-slate-900"
        >
          Cerrar sesión
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          ¿Estás seguro de que quieres cerrar la sesión
          administrativa?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg border border-slate-200 px-4 py-2
              text-sm font-medium text-slate-700
              transition hover:bg-slate-50
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              rounded-lg bg-rose-600 px-4 py-2
              text-sm font-medium text-white
              transition hover:bg-rose-700
            "
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
