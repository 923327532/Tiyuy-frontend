'use client';

interface SendButtonProps {
  isPending: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SendButton({ isPending, onClick, disabled = false }: SendButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onClick}
        disabled={disabled || isPending}
        className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/30 text-sm"
      >
        {isPending ? 'Enviando...' : 'Enviar Notificación'}
      </button>
    </div>
  );
}