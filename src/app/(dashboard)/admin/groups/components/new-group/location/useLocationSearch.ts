'use client';

import { useState } from 'react';

import type { Coordinates } from './useUserLocation';
import { buildAddressText, extractDistrict, type NominatimAddress } from './locationUtils';

export interface LocationSearchResult {
  coordinates: Coordinates;
  district: string;
  address: string;
  label: string;
}

interface NominatimHit {
  lat: string;
  lon: string;
  display_name?: string;
  address?: NominatimAddress;
}

const mapHit = (hit: NominatimHit, term: string): LocationSearchResult => {
  const place = hit.address ?? {};
  const district = extractDistrict(place);

  return {
    coordinates: { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) },
    district,
    address: buildAddressText(hit.display_name, place.country),
    label: district || hit.display_name?.split(',')[0]?.trim() || term,
  };
};

export function useLocationSearch(onResult: (result: LocationSearchResult) => void) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const updateQuery = (value: string) => {
    setQuery(value);
    setShowResults(false);
  };

  const search = async () => {
    const term = query.trim();
    if (!term) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=es&q=${encodeURIComponent(term)}`,
      );
      const data: NominatimHit[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setResults([]);
        setShowResults(true);
        setSearchError('No se encontró esa ubicación.');
        return;
      }

      setResults(data.map((hit) => mapHit(hit, term)));
      setShowResults(true);
    } catch {
      setSearchError('No se pudo buscar. Inténtalo de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result: LocationSearchResult) => {
    onResult(result);
    setQuery(result.label);
    setShowResults(false);
    setSearchError(null);
  };

  return {
    query,
    updateQuery,
    search,
    results,
    showResults,
    selectResult,
    closeResults: () => setShowResults(false),
    isSearching,
    searchError,
  };
}
