'use client';

import { useAgencies } from './_hooks/useAgencies';
import AgenciesHero from './_components/AgenciesHero';
import AgenciesFilters from './_components/AgenciesFilters';
import AgencyCard from './_components/AgencyCard';
import AgenciesPagination from './_components/AgenciesPagination';
import { LoadingState, EmptyState, ErrorState } from './_components/AgenciesStates';

export default function AgenciesPage() {
  const {
    draft, setDraft, filters, data, loading, error, hasFilters,
    submitSearch, setCity, setPage, clearFilters, retry,
  } = useAgencies();

  const total = data?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <AgenciesHero />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 -mt-14 relative z-20">
        <AgenciesFilters
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={submitSearch}
          city={filters.city}
          onCityChange={setCity}
        />

        <div className="mt-12 lg:mt-16">
          {error ? (
            <ErrorState onRetry={retry} />
          ) : !data && loading ? (
            <LoadingState />
          ) : !data || data.content.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <p className="text-sm text-[var(--text-secondary)] mb-8">
                {total} {total === 1 ? 'inmobiliaria encontrada' : 'inmobiliarias encontradas'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.content.map((a) => <AgencyCard key={a.id} agency={a} />)}
              </div>
              <AgenciesPagination page={filters.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}