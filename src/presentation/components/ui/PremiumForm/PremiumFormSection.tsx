'use client';

import type { ReactNode } from 'react';

interface PremiumFormSectionProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export function PremiumFormSection({
  icon,
  title,
  description,
  children,
  columns = 1,
  className = '',
}: PremiumFormSectionProps) {
  return (
    <section className={`premium-form__section ${className}`.trim()}>
      <header className="premium-form__section-header">
        {icon ? <span className="premium-form__section-icon">{icon}</span> : null}
        <div>
          <h2 className="premium-form__section-title">{title}</h2>
          {description ? <p className="premium-form__section-description">{description}</p> : null}
        </div>
      </header>

      <div className={`premium-form__grid ${columns === 2 ? 'premium-form__grid--two' : ''}`.trim()}>
        {children}
      </div>
    </section>
  );
}
