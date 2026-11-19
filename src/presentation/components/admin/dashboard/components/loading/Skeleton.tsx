'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse rounded-xl
        bg-gradient-to-r
        from-[#E8EEF3] via-[#F1F5F9] to-[#E8EEF3]
        ${className}
      `}
    />
  );
}