import Link from 'next/link';
import { FolderGit, Home, Users } from 'lucide-react';
import type { AgencyDetail } from '../types';

interface AgencyActivityMetricsProps {
  agency: AgencyDetail;
}

export default function AgencyActivityMetrics({ agency }: AgencyActivityMetricsProps) {
  const metrics = [
    { title: 'Agentes asociados', value: agency.agentsCount, Icon: Users },
    {
      title: 'Proyectos activos',
      value: agency.activeProjectsCount,
      Icon: FolderGit,
      href: agency.projectsUrl?.trim() || undefined,
    },
    {
      title: 'Inmuebles activos',
      value: agency.activePropertiesCount,
      Icon: Home,
      href: agency.propertiesUrl?.trim() || undefined,
    },
  ];

  return (
    <section aria-label="Actividad de la agencia" className="grid gap-3 sm:grid-cols-3">
      {metrics.map(({ title, value, Icon, href }) => {
        const content = (
          <div className="flex min-h-[112px] items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--text-primary)]">
                {value}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{title}</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
        );
        const cardClass =
          'block rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-colors';

        return href && value > 0 ? (
          <Link
            key={title}
            href={href}
            className={`${cardClass} group hover:border-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2`}
          >
            {content}
            <span className="sr-only">Ver {title.toLowerCase()}</span>
          </Link>
        ) : (
          <div key={title} className={cardClass}>
            {content}
          </div>
        );
      })}
    </section>
  );
}
