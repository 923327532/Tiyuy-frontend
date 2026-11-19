'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { NAVIGATION_LINKS } from '../constants';

interface MobileMenuNavigationProps {
  pathname: string;
  onClose: () => void;
}

export function MobileMenuNavigation({
  pathname,
  onClose,
}: MobileMenuNavigationProps) {
  return (
    <section aria-labelledby="navigation-title">
      <h3
        id="navigation-title"
        className="
          mb-2 px-2
          text-[10px] font-bold uppercase
          tracking-[0.16em] text-slate-400
        "
      >
        Navegación
      </h3>

      <nav className="space-y-1">
        {NAVIGATION_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={`
                group flex items-center gap-3
                rounded-xl px-3 py-3
                text-sm transition
                ${
                  isActive
                    ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                    : 'text-white/75 hover:bg-white/[0.07] hover:text-white'
                }
              `}
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                aria-hidden="true"
              />

              <span className="flex-1">{link.label}</span>

              <ChevronRight
                className="
                  h-4 w-4 opacity-40
                  transition group-hover:translate-x-1
                "
              />
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
