'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { ADMIN_SEARCH_ROUTES } from '../AdminShell/adminNavigation';

export function AdminSearch() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const { isSuperAdmin, hasPermission } = usePermissions();

  const filteredRoutes = query.trim()
    ? ADMIN_SEARCH_ROUTES.filter((route) => {
        if (route.permission && !isSuperAdmin && !hasPermission(route.permission)) {
          return false;
        }

        const term = query.toLowerCase();
        return (
          route.label.toLowerCase().includes(term) ||
          route.keywords.some((keyword) => keyword.includes(term)) ||
          route.href.toLowerCase().includes(term)
        );
      })
    : [];

  const selectRoute = (href: string) => {
    setQuery('');
    setShowResults(false);
    router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && filteredRoutes.length > 0) {
      selectRoute(filteredRoutes[0].href);
    }

    if (event.key === 'Escape') {
      setShowResults(false);
      event.currentTarget.blur();
    }
  };

  return (
    <div className="relative ml-2 min-w-0 max-w-md flex-1 sm:ml-4 md:ml-8 lg:max-w-xl">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Buscar módulos..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setShowResults(event.target.value.trim().length > 0);
        }}
        onFocus={() => setShowResults(query.trim().length > 0)}
        onBlur={() => setTimeout(() => setShowResults(false), 150)}
        onKeyDown={handleKeyDown}
        aria-label="Buscar en el panel administrativo"
        className="w-full rounded-lg border border-white/10 bg-white/10 py-1.5 pl-9 pr-9 text-xs text-white placeholder-slate-400 transition focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 sm:py-2 sm:pl-10 sm:text-sm"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300 sm:block">
        /
      </kbd>

      {showResults && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg sm:max-h-80">
          {filteredRoutes.length === 0 ? (
            <p className="px-4 py-4 text-center text-xs text-slate-500 sm:text-sm">
              No se encontraron resultados para “{query}”.
            </p>
          ) : (
            filteredRoutes.map((route) => {
              const Icon = route.icon;

              return (
                <button
                  key={`${route.href}-${route.label}`}
                  type="button"
                  onMouseDown={() => selectRoute(route.href)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs transition hover:bg-slate-50 sm:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#0f2e3a]" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-slate-900">
                      {route.label}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{route.href}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
