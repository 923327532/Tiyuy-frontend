'use client';

import { Reveal, useElementProgressVar, useScrollReveal } from '../../hooks/use-scroll-reveal';
import { HighlightsRow } from './HighlightsRow';
import { StoryMedia } from './StoryMedia';
import { features, story, type Feature } from './story.data';

function TimelineChapter({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>({
    once: false,
    threshold: 0.35,
    rootMargin: '-12% 0px -28% 0px',
  });
  const Icon = feature.icon;

  return (
    <li ref={ref} className="relative grid grid-cols-[44px_1fr] gap-6 md:gap-10">
      <span
        className={`relative z-10 mt-1 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-500 ${
          isVisible
            ? 'border-neutral-950 bg-neutral-950 text-white'
            : 'border-neutral-300 bg-white text-neutral-400'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <div className="flex items-start justify-between gap-6 border-b border-neutral-200 pb-10 md:pb-14">
        <div
          className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-40'}`}
        >
          <h3 className="text-2xl font-medium tracking-[-0.025em] text-neutral-950 md:text-3xl">
            {feature.title}
          </h3>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-600">
            {feature.description}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`hidden text-6xl font-medium leading-none tracking-[-0.05em] tabular-nums transition-colors duration-500 sm:block md:text-7xl ${
            isVisible ? 'text-neutral-950' : 'text-neutral-200'
          }`}
        >
          0{index + 1}
        </span>
      </div>
    </li>
  );
}

function TimelineRail() {
  const railRef = useElementProgressVar<HTMLDivElement>('--about-progress', 0.12);

  return (
    <div ref={railRef} className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-14 left-[21px] top-2 w-px bg-neutral-200"
      />
      <span
        aria-hidden="true"
        className="about-timeline-fill absolute bottom-14 left-[21px] top-2 w-px bg-neutral-950"
      />
      <ol className="relative space-y-16 md:space-y-20 pt-2">
        {features.map((feature, index) => (
          <TimelineChapter key={feature.title} feature={feature} index={index} />
        ))}
      </ol>
    </div>
  );
}

export function StorySection() {
  return (
    <section
      id="origen"
      aria-labelledby="story-title"
      className="relative bg-white py-20 md:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <h2
            id="story-title"
            className="max-w-5xl text-balance text-[clamp(3rem,8vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-neutral-950"
          >
            Cómo empezó todo.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          
          <div className="relative lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <StoryMedia />
            
            <Reveal className="mt-10">
              <blockquote className="border-t border-neutral-950 pt-6">
                <p className="text-balance text-2xl font-medium leading-snug tracking-[-0.025em] text-neutral-950 md:text-3xl">
                  {story.quote}
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={100} className="mt-6">
              <p className="max-w-md text-base leading-relaxed text-neutral-600">{story.note}</p>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <TimelineRail />
          </div>
        </div>

        <Reveal delay={120} className="mt-20 border-t border-neutral-200 pt-12 lg:mt-28">
          <HighlightsRow />
        </Reveal>
      </div>
    </section>
  );
}