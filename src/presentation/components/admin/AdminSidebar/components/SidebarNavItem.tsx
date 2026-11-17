'use client';

import Link from 'next/link';

import { ChevronDown, ChevronRight } from 'lucide-react';

import type { SidebarNavItem as SidebarNavItemModel } from '../types';
import { hasActiveChild, isPathActive } from '../utils';

interface SidebarNavItemProps {
  item: SidebarNavItemModel;
  level?: number;
  collapsed: boolean;
  expandedSections: string[];
  pathname: string;
  onSectionClick: (sectionId: string) => void;
  onNavigate?: () => void;
}

const BASE_CLASSES = `
  group flex w-full items-center gap-3 rounded-xl
  px-3 py-2.5 text-left text-sm transition-all duration-200
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-cyan-400
`;

export function SidebarNavItem({
  item,
  level = 0,
  collapsed,
  expandedSections,
  pathname,
  onSectionClick,
  onNavigate,
}: SidebarNavItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isSectionExpanded = expandedSections.includes(item.id);
  const isActive = isPathActive(item.path, pathname, item.exact);
  const isChildActive = hasActiveChild(item, pathname);
  const active = isActive || isChildActive;

  const Icon = item.icon;
  const iconSize = level === 0 ? 'h-5 w-5' : 'h-4 w-4';

  const activeClasses = active
    ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
    : 'border border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white';

  const iconClasses = active
    ? 'text-cyan-400'
    : 'text-slate-400 group-hover:text-cyan-300';

  const itemClasses = `${BASE_CLASSES} ${activeClasses} ${
    level > 0 ? 'pl-3' : ''
  } ${collapsed ? 'justify-center px-0' : ''}`;

  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center ${iconClasses}`}
      >
        <Icon className={iconSize} aria-hidden="true" />
      </span>

      {!collapsed && (
        <>
          <span className="min-w-0 flex-1 truncate font-medium">
            {item.label}
          </span>

          {item.badge !== undefined && item.badge > 0 && (
            <span
              className="
                rounded-full bg-rose-500/15 px-2 py-0.5
                text-[10px] font-semibold text-rose-300
              "
            >
              {item.badge}
            </span>
          )}

          {hasChildren &&
            (isSectionExpanded ? (
              <ChevronDown
                className="h-4 w-4 shrink-0 text-slate-500"
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="h-4 w-4 shrink-0 text-slate-500"
                aria-hidden="true"
              />
            ))}
        </>
      )}
    </>
  );

  return (
    <div className="w-full">
      {hasChildren ? (
        <button
          type="button"
          onClick={() => onSectionClick(item.id)}
          title={collapsed ? item.label : undefined}
          aria-expanded={
            collapsed ? undefined : isSectionExpanded
          }
          className={itemClasses}
        >
          {content}
        </button>
      ) : (
        <Link
          href={item.path || '/admin'}
          title={collapsed ? item.label : undefined}
          aria-current={isActive ? 'page' : undefined}
          onClick={onNavigate}
          className={itemClasses}
        >
          {content}
        </Link>
      )}

      {hasChildren && !collapsed && isSectionExpanded && (
        <div
          className="
            ml-4 mt-1 space-y-1 border-l border-white/10
            pl-2
          "
        >
          {item.children?.map((child) => (
            <SidebarNavItem
              key={child.id}
              item={child}
              level={level + 1}
              collapsed={collapsed}
              expandedSections={expandedSections}
              pathname={pathname}
              onSectionClick={onSectionClick}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
