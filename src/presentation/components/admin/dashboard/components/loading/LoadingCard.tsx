'use client';

import { Spinner } from '@/presentation/components/ui/Spinner';

interface LoadingCardProps {
  children?: React.ReactNode;
  className?: string;
}

export function LoadingCard({ children, className = '' }: LoadingCardProps) {
  return (
    <div
      aria-busy="true"
      className={`
        min-w-0 overflow-hidden
        rounded-2xl border border-[#E2EAF0]
        bg-[#F8FAFC] p-5
        shadow-sm shadow-[#164E63]/[0.03]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function LoadingCardWithSpinner({ className = '' }: { className?: string }) {
  return (
    <LoadingCard className={className}>
      <div className="flex h-11 items-center justify-center">
        <Spinner size="lg" />
      </div>
    </LoadingCard>
  );
}