import { Building2, LogIn, UserPlus, X } from 'lucide-react';

interface AgencyAuthModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function AgencyAuthModal({
  open,
  onClose,
  onContinue,
}: AgencyAuthModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agency-auth-title"
        className="relative w-full max-w-sm rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-md p-1 text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
          <Building2 aria-hidden="true" className="h-6 w-6" />
        </div>
        <h2 id="agency-auth-title" className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
          Inicia sesión para continuar
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Para contactar o calificar a esta agencia, primero debes iniciar sesión o crear una cuenta.
        </p>
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary-hover)] px-4 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            <LogIn aria-hidden="true" className="h-4 w-4" />
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] px-4 text-sm font-semibold text-[var(--brand-primary-hover)] transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
          >
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
