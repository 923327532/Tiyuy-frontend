'use client';

import { HardHat, Image as ImageIcon } from 'lucide-react';

import type { ProgressItemConfig } from './Config';
import { ProgressItem } from './ProgressItem';

export function ProjectsProgress({ stats }: { stats: { averageConstructionProgress?: number; coveragePercentage?: number } }) {
  const progressItems: (ProgressItemConfig & { value: number })[] = [
    {
      label: 'Avance promedio de obra',
      icon: HardHat,
      iconBackground: 'bg-[#E8EAF6]',
      iconColor: 'text-[#7183B8]',
      description: 'Progreso de construcción',
      value: stats.averageConstructionProgress ?? 0,
    },
    {
      label: 'Cobertura de imágenes',
      icon: ImageIcon,
      iconBackground: 'bg-[#E8F0F3]',
      iconColor: 'text-[#164E63]',
      description: 'Proyectos con imagen de portada',
      value: stats.coveragePercentage ?? 0,
    },
  ];

  return (
    <section className="space-y-5 border-t border-[#E2EAF0] px-6 py-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8EAF6]">
          <HardHat className="h-4 w-4 text-[#7183B8]" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Seguimiento de proyectos</h3>
          <p className="text-xs text-slate-500">Indicadores de gestión inmobiliaria</p>
        </div>
      </div>
      {progressItems.map((item, index) => (
        <ProgressItem
          key={item.label}
          index={index}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconBackground={item.iconBackground}
          iconColor={item.iconColor}
          description={item.description}
        />
      ))}
    </section>
  );
}