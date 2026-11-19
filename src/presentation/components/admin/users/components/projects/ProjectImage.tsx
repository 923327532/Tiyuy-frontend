'use client';

import { ImageOff } from 'lucide-react';

interface ProjectImageProps {
  src?: string | null;
  name: string;
}

export function ProjectImage({ src, name }: ProjectImageProps) {
  if (!src) {
    return (
      <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-[#E8F0F3]">
        <ImageOff
          className="h-5 w-5 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Imagen del proyecto ${name}`}
      loading="lazy"
      decoding="async"
      className="h-14 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}