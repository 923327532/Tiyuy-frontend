'use client';

import { useAdminSearch } from './hooks/useAdminSearch';
import { SearchInput, SearchResults } from './components';

export function AdminSearch() {
  const {
    query,
    shouldShowResults,
    filteredRoutes,
    hasResults,
    activeIndex,
    inputRef,
    containerRef,
    handleChange,
    handleKeyDown,
    handleFocus,
    clearSearch,
    selectRoute,
    setActiveIndex,
  } = useAdminSearch();

  return (
    <div
      ref={containerRef}
      className="
        relative w-full min-w-0 max-w-md
        lg:max-w-xl
      "
    >
      <SearchInput
        inputRef={inputRef}
        query={query}
        shouldShowResults={shouldShowResults}
        hasResults={hasResults}
        activeIndex={activeIndex}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onClear={clearSearch}
      />

      <SearchResults
        shouldShowResults={shouldShowResults}
        hasResults={hasResults}
        query={query}
        routes={filteredRoutes}
        activeIndex={activeIndex}
        onHover={setActiveIndex}
        onSelect={selectRoute}
      />
    </div>
  );
}
