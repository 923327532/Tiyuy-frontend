'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
} from 'lucide-react';

/**
 * BaseCard - Foundational card component for the design system
 * All specialized cards (KpiCard, ChartCard, etc.) should compose this
 */
export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether card has hover effect (for interactive variant) */
  hover?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-white border border-slate-200',
  bordered: 'bg-white border-2 border-slate-200',
  elevated: 'bg-white border border-slate-100 shadow-card',
  interactive:
    'bg-white border border-slate-200 transition-all duration-200 hover:border-brand-300 hover:shadow-card-hover cursor-pointer',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(
  ({ variant = 'default', padding = 'md', hover = false, className = '', children, ...props }, ref) => {
    const isInteractive = variant === 'interactive' || hover;

    return (
      <div
        ref={ref}
        className={`
          min-w-0 rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${isInteractive ? 'hover:shadow-card-hover hover:border-brand-300' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BaseCard.displayName = 'BaseCard';

/**
 * Card - Simple card component (alias for BaseCard with default props)
 */
export type CardProps = BaseCardProps;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <BaseCard
        ref={ref}
        variant={variant}
        padding={padding}
        className={className}
        {...props}
      >
        {children}
      </BaseCard>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader - Consistent header for cards
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 mb-4 ${className}`}
        {...props}
      >
        <div className="min-w-0 flex-1">
          {title && <h3 className="text-lg font-semibold text-slate-900 truncate">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">{action}</div>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardContent - Consistent content wrapper
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter - Consistent footer for cards
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * CardTitle - Title component for CardHeader (Radix UI pattern)
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={`text-lg font-semibold text-slate-900 ${className}`} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription - Description component for CardHeader (Radix UI pattern)
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p ref={ref} className={`text-sm text-slate-500 ${className}`} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

/**
 * KPI Card - For key metrics display with animated values and sparklines
 */
export interface KpiCardProps extends Omit<BaseCardProps, 'variant' | 'padding' | 'children'> {
  /** Icon component */
  icon: React.ReactNode;
  /** Main value */
  value: string | number;
  /** Label/title */
  label: string;
  /** Secondary hint text */
  hint?: string;
  /** Growth percentage (positive/negative) */
  growth?: number;
  /** Href for link behavior */
  href?: string;
  /** Loading state */
  loading?: boolean;
  /** Unavailable state */
  unavailable?: boolean;
  /** Color theme for the card */
  color?: 'cyan' | 'indigo' | 'sage' | 'emerald' | 'slate';
  /** Animation index for staggered entrance */
  index?: number;
  /** @deprecated Use color prop instead */
  iconBg?: string;
  /** @deprecated Use color prop instead */
  iconColor?: string;
  /** @deprecated Progress value (0-100) */
  progress?: number;
  /** @deprecated Progress label */
  progressLabel?: string;
  /** @deprecated Click handler */
  onClick?: () => void;
}

const colorStyles = {
  cyan: {
    icon: 'bg-[#E0F2FE] text-[#164E63]',
    line: '#0891B2',
    glow: 'group-hover:shadow-cyan-900/5',
    accent: 'bg-[#E0F2FE]',
  },
  indigo: {
    icon: 'bg-[#E8EAF6] text-[#5965A8]',
    line: '#818CF8',
    glow: 'group-hover:shadow-indigo-900/5',
    accent: 'bg-[#E8EAF6]',
  },
  sage: {
    icon: 'bg-[#DCEAE9] text-[#477A72]',
    line: '#61988C',
    glow: 'group-hover:shadow-teal-900/5',
    accent: 'bg-[#DCEAE9]',
  },
  emerald: {
    icon: 'bg-[#DCFCE7] text-[#16845B]',
    line: '#34A876',
    glow: 'group-hover:shadow-emerald-900/5',
    accent: 'bg-[#DCFCE7]',
  },
  slate: {
    icon: 'bg-[#EAF0F6] text-[#52677F]',
    line: '#64748B',
    glow: 'group-hover:shadow-slate-900/5',
    accent: 'bg-[#EAF0F6]',
  },
} as const;

function AnimatedValue({
  value,
  enabled,
}: {
  value: string;
  enabled: boolean;
}) {
  const [display, setDisplay] = useState(() => value);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const match = value.match(/^([^0-9]*)([\d,.]+)(.*)$/);

    if (!match) {
      return;
    }

    const prefix = match[1];
    const numberText = match[2];
    const suffix = match[3];

    const target = Number(numberText.replace(/,/g, '').replace(/\./g, ''));

    if (!Number.isFinite(target) || target === 0) {
      return;
    }

    let frame = 0;
    const totalFrames = 35;

    const timer = window.setInterval(() => {
      frame++;

      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      const current = Math.round(target * progress);

      setDisplay(prefix + current.toLocaleString('en-US') + suffix);

      if (frame >= totalFrames) {
        window.clearInterval(timer);
        setDisplay(value);
      }
    }, 25);

    return () => window.clearInterval(timer);
  }, [value, enabled]);

  return <>{display}</>;
}

function MiniSparkline({
  color,
  index,
}: {
  color: string;
  index: number;
}) {
  const variations = [
    [8, 12, 9, 17, 13, 23, 19, 29],
    [10, 17, 13, 21, 16, 25, 22, 31],
    [7, 13, 11, 18, 16, 22, 20, 28],
    [11, 9, 16, 14, 22, 19, 27, 30],
    [8, 14, 12, 19, 15, 23, 21, 27],
  ];

  const values = variations[index % variations.length];

  const points = values
    .map((value, i) => `${i * 13},${35 - value}`)
    .join(' ');

  return (
    <svg
      viewBox="0 0 91 38"
      className="h-10 w-[91px] overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".8"
        className="sparkline-path"
      />
    </svg>
  );
}

export function KpiCard({
  icon,
  value,
  label,
  hint,
  growth,
  href,
  loading = false,
  unavailable = false,
  color = 'cyan',
  index = 0,
  className = '',
  // Deprecated props for backwards compatibility
  iconBg,
  iconColor,
  progress,
  progressLabel,
  onClick,
  ...props
}: KpiCardProps) {
  const reducedMotion = useReducedMotion();

  const styles = colorStyles[color] ?? colorStyles.cyan;
  const resolvedIconBg = iconBg ?? styles.icon.split(' ')[0];
  const resolvedIconColor = iconColor ?? styles.icon.split(' ')[1];
  const positiveGrowth = typeof growth === 'number' && growth >= 0;

  if (loading) {
    return (
      <div className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-10 w-10 rounded-xl bg-slate-100" />
          </div>
          <div className="h-8 w-32 rounded bg-slate-100" />
          <div className="h-3 w-24 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const cardContent = (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: reducedMotion ? 0 : index * 0.09,
        ease: 'easeOut',
      }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      className={`
        group relative h-full min-w-0
        overflow-hidden rounded-2xl
        border border-slate-200/80
        bg-white p-5
        shadow-sm shadow-slate-200/40
        transition-shadow duration-300
        hover:border-slate-300
        hover:shadow-xl
        ${styles.glow}
        ${className}
      `}
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute
          -right-10 -top-10
          h-32 w-32 rounded-full
          opacity-40 blur-3xl
          ${styles.accent}
        `}
      />

      <div className="relative">
        {/* Card header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold leading-5 text-slate-500">
              {label}
            </p>
          </div>

          <motion.div
            whileHover={reducedMotion ? undefined : { rotate: 8, scale: 1.08 }}
            transition={{ duration: 0.2 }}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${resolvedIconBg} ${resolvedIconColor}`}
          >
            {icon}
          </motion.div>
        </div>

        {/* Value */}
        <div className="mt-5 flex min-w-0 items-end justify-between gap-2">
          <h3 className="min-w-0 truncate text-[27px] font-bold tracking-tight text-slate-800 tabular-nums">
            <AnimatedValue
              value={String(value)}
              enabled={!reducedMotion}
            />
          </h3>

          {!unavailable && (
            <MiniSparkline color={styles.line} index={index} />
          )}
        </div>

        {/* Hint */}
        <p className="mt-2 truncate text-xs font-medium text-slate-400">
          {hint}
        </p>

        {/* Footer */}
        <div className="mt-5 flex min-w-0 items-center justify-between border-t border-slate-100 pt-3">
          {typeof growth === 'number' && !unavailable ? (
            <div className={`flex items-center gap-1 text-xs font-semibold ${positiveGrowth ? 'text-emerald-600' : 'text-rose-500'}`}>
              {positiveGrowth ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(growth).toFixed(1)}%
              <span className="ml-1 font-normal text-slate-400">crecimiento</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <BarChart2 className="h-3.5 w-3.5" />
              {unavailable ? 'Acceso restringido' : 'Indicador TIYUY'}
            </div>
          )}

          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-600" />
        </div>

        {unavailable && (
          <div className="absolute inset-0 z-10 cursor-not-allowed rounded-2xl bg-white/40" />
        )}
      </div>
    </motion.div>
  );

  if (unavailable) {
    return cardContent;
  }

  const wrapperClassName = `block min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        className={wrapperClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div onClick={onClick} className={wrapperClassName} {...props}>
      {cardContent}
    </div>
  );
}

/** Growth indicator chip */
export interface GrowthChipProps {
  value: number;
  label?: string;
}

export function GrowthChip({ value, label }: GrowthChipProps) {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${isPositive
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
        }
      `}
      aria-label={`${isPositive ? 'Crecimiento' : 'Decrecimiento'} de ${absValue}%${label ? ` (${label})` : ''}`}
    >
      <span className="flex items-center" aria-hidden="true">
        {isPositive ? '▲' : '▼'}
      </span>
      <span>{absValue.toFixed(1)}%</span>
      {label && <span className="text-xs opacity-80">{label}</span>}
    </span>
  );
}

/** Chart Card - For data visualization */
export interface ChartCardProps extends Omit<BaseCardProps, 'variant' | 'padding'> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

export function ChartCard({
  title,
  description,
  action,
  children,
  footer,
  loading = false,
  error,
  className = '',
  ...props
}: ChartCardProps) {
  return (
    <BaseCard variant="default" padding="md" className={className} {...props}>
      <CardHeader title={title} description={description} action={action} />
      <CardContent>
        {error && (
          <div className="flex items-center justify-center p-8 text-center">
            <div className="text-red-600">
              <p className="font-medium">Error al cargar el gráfico</p>
              <p className="text-sm text-slate-500 mt-1">{error}</p>
            </div>
          </div>
        )}
        {!error && (
          <div className={loading ? 'animate-pulse' : ''}>
            {children}
          </div>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </BaseCard>
  );
}

/** Summary Card - For grouped information */
export interface SummaryCardProps extends Omit<BaseCardProps, 'variant' | 'padding'> {
  title: string;
  description?: string;
  items: Array<{
    label: string;
    value: string | number;
    trend?: number;
    icon?: React.ReactNode;
  }>;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export function SummaryCard({
  title,
  description,
  items,
  action,
  footer,
  className = '',
  ...props
}: SummaryCardProps) {
  return (
    <BaseCard variant="default" padding="md" className={className} {...props}>
      <CardHeader title={title} description={description} action={action} />
      <CardContent>
        <dl className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <div className="flex-shrink-0 p-2 rounded-lg bg-white border border-slate-100">
                    {item.icon}
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-slate-600 truncate">{item.label}</dt>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <dd className="text-lg font-semibold text-slate-900 tabular-nums">{item.value}</dd>
                {item.trend !== undefined && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.trend >= 0
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {item.trend >= 0 ? '▲' : '▼'} {Math.abs(item.trend).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </BaseCard>
  );
}

/** Attention Card - For items requiring action */
export interface AttentionCardProps extends Omit<BaseCardProps, 'variant' | 'padding'> {
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    count: number;
    severity: 'critical' | 'warning' | 'info';
    href: string;
    actionLabel: string;
  }>;
  overflow?: number;
  onViewAll?: () => void;
}

export function AttentionCard({
  title,
  description,
  items,
  overflow,
  onViewAll,
  className = '',
  ...props
}: AttentionCardProps) {
  const severityStyles = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const severityIcons = {
    critical: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.525-1.516 2.525H3.72c-1.347 0-2.189-1.358-1.515-2.525L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 102 0V9a1 1 0 00-2 0z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <BaseCard variant="bordered" padding="md" className={className} {...props}>
      <CardHeader
        title={title}
        description={description}
        action={onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Ver todos
          </button>
        )}
      />
      <CardContent className="space-y-3 min-w-0 overflow-x-auto">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
              ${severityStyles[item.severity]}
              hover:bg-opacity-80 hover:shadow-sm
            `}
          >
            <div className="flex-shrink-0 p-1.5 rounded-lg bg-white/50" aria-hidden="true">
              {severityIcons[item.severity]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs mt-0.5 opacity-80 truncate">{item.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums
                ${item.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  item.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'}
              `}>
                {item.count}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-white/50">
                {item.actionLabel}
              </span>
            </div>
          </a>
        ))}
        {overflow && overflow > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onViewAll}
              className="w-full text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2"
            >
              + {overflow} elemento{overflow > 1 ? 's' : ''} más
            </button>
          </div>
        )}
      </CardContent>
    </BaseCard>
  );
}