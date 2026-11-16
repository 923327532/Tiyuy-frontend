'use client';

import { Building2, FolderOpen } from 'lucide-react';

interface ModalHeaderProps {
  totalProjects: number;
}

export function ModalHeader({ totalProjects }: ModalHeaderProps) {
  return (
    <div>
      {/* HEADER */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-[#F0F6F7] to-white px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCEAE9]">
            <Building2
              className="h-5 w-5 text-[#164E63]"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Proyectos del usuario
            </h3>

            <p className="mt-0.5 text-sm text-slate-500">
              Consulta los proyectos asociados a esta cuenta.
            </p>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-[#E2EAF0] bg-[#F8FAFB] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0F3]">
              <FolderOpen
                className="h-4 w-4 text-[#164E63]"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Total de proyectos
              </p>

              <p className="text-xs text-slate-500">
                Proyectos registrados
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold tabular-nums text-[#164E63]">
            {totalProjects}
          </span>
        </div>
      </div>
    </div>
  );
}