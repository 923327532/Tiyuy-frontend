interface CropMarksProps {
  tone?: 'light' | 'dark';
  className?: string;
}

export function CropMarks({
  tone = 'light',
  className = '',
}: CropMarksProps) {
  const color =
    tone === 'dark' ? 'border-white/35' : 'border-[var(--text-tertiary)]';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-4 ${className}`}
    >
      <span className={`absolute left-0 top-0 h-3 w-3 border-l border-t ${color}`} />
      <span className={`absolute right-0 top-0 h-3 w-3 border-r border-t ${color}`} />
      <span
        className={`absolute bottom-0 left-0 h-3 w-3 border-b border-l ${color}`}
      />
      <span
        className={`absolute bottom-0 right-0 h-3 w-3 border-b border-r ${color}`}
      />
    </div>
  );
}
