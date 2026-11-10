'use client';

import { ArrowDownRight } from 'lucide-react';
import { HERO_INDEX } from './hero.data';

interface HeroIndexProps {
  items?: readonly {
    code: string;
    label: string;
    href: string;
  }[];
}

export function HeroIndex({ items = HERO_INDEX }: HeroIndexProps) {
  return (
    <nav
      aria-label="Índice de secciones"
      className="hero-index hero-fade hero-delay-1200 relative z-10 border-t border-white/15 bg-[#111827]/75 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-5 px-5 py-5 sm:px-8 lg:px-12">
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Explorar
          </span>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {items.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="hero-link group flex w-fit flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
              >
                <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-[var(--brand-primary)]">
                  {item.code}
                  {index === 0 && (
                    <ArrowDownRight
                      className="h-3 w-3"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className="text-sm font-medium text-white/75 transition-colors duration-300 group-hover:text-white">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}