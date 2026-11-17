'use client';

import { Crown } from 'lucide-react';
import { formatCurrency } from '@/presentation/components/admin/dashboard/utils/dashboard.utils';

interface TopAgentsProps {
  topAgents: Array<{
    agentId: string;
    firstName?: string;
    lastName?: string;
    email: string;
    currentPlan: string;
    monthlyRevenue?: number;
  }>;
}

export function TopAgents({ topAgents }: TopAgentsProps) {
  if (topAgents.length === 0) return null;

  return (
    <section className="border-t border-[#E2EAF0]">
      <div className="flex items-center gap-2 px-6 pb-3 pt-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8EAF6]">
          <Crown className="h-4 w-4 text-[#7183B8]" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Corredores destacados</h3>
          <p className="text-xs text-slate-500">Mayor facturación mensual</p>
        </div>
      </div>

      <ul className="divide-y divide-[#EAF0F4]">
        {topAgents.map((agent, index) => {
          const fullName = [agent.firstName, agent.lastName].filter(Boolean).join(' ') || agent.email;

          return (
            <li key={agent.agentId} className="agents-top-agent flex items-center justify-between gap-4 px-6 py-3.5 transition-colors duration-200 hover:bg-[#F8FAFC]" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  index === 0 ? 'bg-[#DCEAE9] text-[#36866C]' : index === 1 ? 'bg-[#E8EAF6] text-[#7183B8]' : 'bg-[#E0F2FE] text-[#164E63]'
                }`}>
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{fullName}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{agent.currentPlan}</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[#164E63]">
                {formatCurrency(agent.monthlyRevenue ?? 0)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}