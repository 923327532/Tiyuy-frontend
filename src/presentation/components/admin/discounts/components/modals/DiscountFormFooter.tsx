'use client';

interface Props {
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
  label: string;
  pendingLabel?: string;
  disabled?: boolean;
  tone?: 'executive' | 'emerald';
}

/** Pie de formulario consistente con el tono del modal. */
export function DiscountFormFooter({
  onClose, onSubmit, isPending, label, pendingLabel = 'Procesando...', disabled = false, tone = 'executive',
}: Props) {
  const emerald = tone === 'emerald';

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={
          emerald
            ? 'h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50'
            : 'inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
        }
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending || disabled}
        className={
          emerald
            ? 'h-10 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50'
            : 'inline-flex h-10 items-center justify-center rounded-xl bg-[#0f2e3a] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#164e63] disabled:opacity-50'
        }
      >
        {isPending ? pendingLabel : label}
      </button>
    </>
  );
}
