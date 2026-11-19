import Image from 'next/image';
import type { ReactNode } from 'react';

type PublicPageHeroProps = {
  eyebrow: string;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageFit?: 'cover' | 'contain';
  imageBadge?: ReactNode;
  children?: ReactNode;
};

export function PublicPageHero({
  eyebrow,
  icon,
  title,
  description,
  imageSrc,
  imageAlt,
  imageFit = 'cover',
  imageBadge,
  children,
}: PublicPageHeroProps) {
  const containImage = imageFit === 'contain';

  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--border-light)] bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_22%,rgba(74,154,62,0.12),transparent_38%),linear-gradient(135deg,var(--bg-primary),var(--bg-secondary))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#4A9A3E_1px,transparent_1px),linear-gradient(to_bottom,#4A9A3E_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:px-10 lg:py-20">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/8 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-primary)]">
            {icon}
            {eyebrow}
          </div>
          <h1 className="text-balance text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
            {description}
          </p>
          {children ? <div className="mt-7">{children}</div> : null}
        </div>

        <div
          className={`relative mx-auto aspect-[4/3] w-full max-w-[38rem] overflow-hidden rounded-[1.75rem] border shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:rounded-[2rem] ${
            containImage
              ? 'border-[var(--border-light)] bg-[var(--bg-card)]'
              : 'border-white/50 bg-[var(--bg-secondary)]'
          }`}
        >
          {containImage ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,154,62,0.09),transparent_68%)]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 bg-gradient-to-t from-black/10 via-transparent to-white/10"
            />
          )}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className={containImage ? 'object-contain p-5 sm:p-8' : 'object-cover'}
          />
          {imageBadge ? (
            <div className="absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)]">
              {imageBadge}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
