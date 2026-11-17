'use client';

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  /** Width */
  width?: string | number;
  /** Height */
  height?: string | number;
  /** Animation */
  animation?: 'pulse' | 'wave' | 'none';
  /** Custom className */
  className?: string;
}

const baseStyles = 'bg-slate-200 rounded animate-pulse';

const variantStyles = {
  text: 'h-4 rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-lg',
  card: 'rounded-xl',
};

const animationStyles = {
  pulse: 'animate-pulse',
  wave: 'animate-[wave_1.5s_ease-in-out_infinite]',
  none: '',
};

export function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

/** Pre-built skeleton components for common patterns */

export function SkeletonText({ lines = 3, className = '', ...props }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%' } />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '', ...props }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 space-y-4 ${className}`} {...props}>
      <div className="flex items-center justify-between gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width="80px" />
      </div>
      <SkeletonText lines={2} />
      <div className="flex items-center gap-2">
        <Skeleton variant="text" width="60px" />
        <Skeleton variant="text" width="40px" />
      </div>
    </div>
  );
}

export function SkeletonKpiCard({ className = '', ...props }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Skeleton variant="text" width="80px" />
          <Skeleton variant="text" width="100px" className="mt-2 h-8" />
        </div>
        <Skeleton variant="circular" width={44} height={44} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Skeleton variant="text" width="80px" height={20} />
        <Skeleton variant="text" width="60px" height={20} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = '', ...props }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="w-full" role="table">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton variant="text" width="80%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <Skeleton variant="text" width="80%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonChart({ height = 300, className = '', ...props }: { height?: number; className?: string }) {
  // Fixed heights for consistent SSR/CSR rendering
  const fixedHeights = [45, 67, 34, 89, 56, 78, 23, 91, 42, 76, 38, 65];

  return (
    <div className={`${className}`} style={{ height }} {...props}>
      <div className="h-full flex items-end justify-center gap-2 p-4">
        {fixedHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 max-w-[40px] rounded-t bg-slate-200 animate-pulse"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}