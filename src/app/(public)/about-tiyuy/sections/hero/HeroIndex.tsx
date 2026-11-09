import { HERO_INDEX } from './hero.data';

interface HeroIndexProps {
  items?: readonly { label: string; href: string }[];
}

export function HeroIndex({ items = HERO_INDEX }: HeroIndexProps) {
  return (
    <nav
      aria-label="Secciones de la página"
      className="hero-fade hero-delay-1200 relative z-10 border-t border-white/20 bg-white/[0.08] backdrop-blur-md"
    >
      <ul className="hero-scroll mx-auto flex max-w-[1600px] items-center gap-8 overflow-x-auto whitespace-nowrap px-5 py-4 text-sm font-medium text-white/75 [scrollbar-width:none] sm:px-8 lg:justify-between lg:gap-4 lg:px-12">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="hero-link pb-1 hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}