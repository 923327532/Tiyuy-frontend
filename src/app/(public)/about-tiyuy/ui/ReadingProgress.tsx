'use client';
import { type CSSProperties } from 'react';
import { useScrollProgress } from '../hooks/use-scroll-reveal';

export function ReadingProgress() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="about-reading-progress__bar h-full origin-left bg-[var(--brand-primary-hover)] transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ '--about-reading-progress': progress } as CSSProperties}
      />
    </div>
  );
}
