'use client';

import { useState } from 'react';

import { CARD } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import { useProjectComments, useProjectReports } from '@/presentation/hooks/useAdmin';
import { ProjectCommentsSection } from './ProjectCommentsSection';
import { ProjectReportsSection } from './ProjectReportsSection';

type Tab = 'reports' | 'comments';

export function ProjectActivityCard({ projectId }: { projectId: number }) {
  const [tab, setTab] = useState<Tab>('reports');
  const { data: reports } = useProjectReports(projectId);
  const { data: comments } = useProjectComments(projectId);

  const reportCount = reports?.length ?? 0;
  const commentCount = comments?.length ?? 0;

  const tabClass = (active: boolean) =>
    `relative px-3 pb-2 pt-1 text-xs font-medium transition-colors ${
      active
        ? 'text-[#0f2e3a] after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[#0f2e3a]'
        : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <section className={CARD}>
      <div className="flex items-center gap-1 border-b border-slate-100 px-4">
        <button type="button" className={tabClass(tab === 'reports')} onClick={() => setTab('reports')}>
          Reportes ({reportCount})
        </button>
        <button type="button" className={tabClass(tab === 'comments')} onClick={() => setTab('comments')}>
          Comentarios ({commentCount})
        </button>
      </div>
      <div className="p-4">
        {tab === 'reports' ? (
          <ProjectReportsSection projectId={projectId} compact />
        ) : (
          <ProjectCommentsSection projectId={projectId} compact />
        )}
      </div>
    </section>
  );
}
