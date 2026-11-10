import type { AgencyDetail } from '../types';

interface AgencyDescriptionProps {
  description: AgencyDetail['description'];
}

export default function AgencyDescription({ description }: AgencyDescriptionProps) {
  return (
    <section className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-[var(--brand-primary)]" />
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          Perfil institucional
        </h2>
      </div>
      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
        {description?.trim() || 'La agencia aún no ha publicado una descripción institucional.'}
      </p>
    </section>
  );
}
