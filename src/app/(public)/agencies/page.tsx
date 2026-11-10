'use client';

import { useAgencies } from './_hooks/useAgencies';
import AgenciesHero from './_components/AgenciesHero';
import AgenciesFilters from './_components/AgenciesFilters';
import AgencyCard from './_components/AgencyCard';
import AgenciesPagination from './_components/AgenciesPagination';
import { LoadingState, EmptyState, ErrorState } from './_components/AgenciesStates';

export default function AgenciesPage() {
  const {
    draft, setDraft, cityDraft, setCityDraft, filters, data, loading, error, hasFilters,
    submitSearch, setPage, clearFilters, retry,
  } = useAgencies();

  const total = data?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <AgenciesHero />

      <main id="directorio" className="mx-auto max-w-[1440px] scroll-mt-6 px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-12">
        <AgenciesFilters
          draft={draft}
          onDraftChange={setDraft}
          cityDraft={cityDraft}
          onCityDraftChange={setCityDraft}
          onSubmit={submitSearch}
          loading={loading}
        />

        <section aria-labelledby="agency-results-title" className="mt-12 sm:mt-16">
          <div className="mb-6 flex flex-col gap-3 border-b border-[var(--border-color)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-primary-hover)]">
                Selección TIYUY
              </p>
              <h2 id="agency-results-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl">
                Agencias inmobiliarias
              </h2>
            </div>
            {data && (
              <div className="flex flex-wrap items-center gap-3">
                <p className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]" aria-live="polite">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--brand-primary-light)] px-2 text-xs font-bold tabular-nums text-[var(--brand-primary-hover)]">
                    {total}
                  </span>
                  {total === 1 ? 'agencia encontrada' : 'agencias encontradas'}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="min-h-9 rounded-lg px-2 text-xs font-semibold text-[var(--brand-primary-hover)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {error ? (
            <ErrorState onRetry={retry} />
          ) : !data && loading ? (
            <LoadingState />
          ) : !data || data.content.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
          ) : (
            <div aria-busy={loading} className={loading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {data.content.map((a) => <AgencyCard key={a.id} agency={a} />)}
              </div>
              <AgenciesPagination page={filters.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}