'use client';

import { Reveal } from '../../hooks/use-scroll-reveal';
import { CropMarks, ParallaxImage } from '../../ui';
import { story } from './story.data';

export function StoryMedia() {
  return (
    <Reveal direction="left">
      <figure className="relative aspect-[4/5] overflow-hidden border border-neutral-200 bg-white">
        <ParallaxImage
          src={story.image}
          alt={story.alt}
          sizes="(min-width: 1024px) 40vw, 100vw"
          speed={0.06}
          className="z-0"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(17,24,39,0.76),rgba(17,24,39,0.04)_58%)]"
        />
        
        <div className="relative z-20">
          <CropMarks tone="dark" />
        </div>

        <figcaption className="relative z-20 absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75 sm:p-6">
          <span>{story.code}</span>
          <span>{story.caption}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}