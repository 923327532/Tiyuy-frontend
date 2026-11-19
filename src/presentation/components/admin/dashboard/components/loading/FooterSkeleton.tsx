'use client';

export function FooterSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <div className="h-1.5 w-1.5 rounded-full bg-[#164E63] animate-pulse" />
      <p className="text-xs font-medium text-[#64748B]">
        Preparando tu espacio de administración TIYUY...
      </p>
    </div>
  );
}