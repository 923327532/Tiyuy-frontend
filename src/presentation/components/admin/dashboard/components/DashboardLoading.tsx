'use client';

import {
  HeaderSkeleton,
  KpiSectionSkeleton,
  LeftContentSkeleton,
  RightSidebarSkeleton,
  FooterSkeleton,
} from './loading';

export function DashboardLoading() {
  return (
    <main
      role="status"
      aria-label="Cargando dashboard administrativo"
      className="
        min-h-screen w-full min-w-0
        bg-[#F1F5F9]
        p-4 sm:p-6 xl:p-8
      "
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6">
        {/* HEADER */}
        <HeaderSkeleton />

        {/* KPI SECTION */}
        <KpiSectionSkeleton />

        {/* MAIN DASHBOARD */}
        <div className="
          grid min-w-0 gap-6
          xl:grid-cols-[minmax(0,1fr)_340px]
          2xl:grid-cols-[minmax(0,1fr)_380px]
        ">
          {/* LEFT CONTENT */}
          <LeftContentSkeleton />

          {/* RIGHT SIDEBAR */}
          <RightSidebarSkeleton />
        </div>

        {/* FOOTER */}
        <FooterSkeleton />
      </div>
    </main>
  );
}