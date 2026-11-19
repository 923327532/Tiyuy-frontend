'use client';

import { useCallback } from 'react';
import { LocateFixed, MapPin, Search } from 'lucide-react';

import { LocationMap } from './LocationMap';
import type { Coordinates } from './useUserLocation';
import { useUserLocation } from './useUserLocation';
import { useReverseGeocode } from './useReverseGeocode';
import { useLocationSearch } from './useLocationSearch';

import './styles/location.css';
import './styles/searchResults.css';

const DEFAULT_CENTER: [number, number] = [-12.0464, -77.0428];

interface LocationFieldProps {
  district: string;
  address: string;
  coordinates: Coordinates | null;
  onDistrictChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export function LocationField({
  district,
  address,
  coordinates,
  onDistrictChange,
  onAddressChange,
  onCoordinatesChange,
}: LocationFieldProps) {
  const { resolve, isResolving } = useReverseGeocode((district, address) => {
    if (district) onDistrictChange(district);
    if (address) onAddressChange(address);
  });

  const handleCoordinates = useCallback(
    (next: Coordinates) => {
      onCoordinatesChange(next);
      void resolve(next);
    },
    [onCoordinatesChange, resolve],
  );

  const { isLocating, locationError, requestLocation } = useUserLocation(handleCoordinates);

  const {
    query,
    updateQuery,
    search,
    results,
    showResults,
    selectResult,
    closeResults,
    isSearching,
    searchError,
  } = useLocationSearch(({ coordinates: found, district, address, label }) => {
    onCoordinatesChange(found);
    const nextDistrict = district || label;
    if (nextDistrict) onDistrictChange(nextDistrict);
    if (address) onAddressChange(address);
  });

  const center: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : DEFAULT_CENTER;

  const errorMessage = locationError || searchError;

  return (
    <div className="ngp-location">
      <div className="ngp-location__head">
        <h3 className="ngp-location__title">
          <MapPin className="ngp-form__section-icon" aria-hidden="true" />
          Ubicación
        </h3>
        <span className="ngp-location__attribution">Ciudad · Leaflet | © OpenStreetMap</span>
      </div>

      <div className="ngp-location__map-frame">
        <LocationMap center={center} onPick={handleCoordinates} />

        <div className="ngp-location__map-tools">
          <div className="ngp-location__search-wrap">
            <div className="ngp-location__search">
              <Search className="ngp-location__search-icon" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void search();
                  } else if (event.key === 'Escape') {
                    closeResults();
                  }
                }}
                placeholder="Buscar distrito o ciudad..."
                aria-label="Buscar distrito o ciudad"
                className="ngp-location__search-input"
              />
              <button
                type="button"
                onClick={() => void search()}
                disabled={isSearching}
                className="ngp-location__search-button"
              >
                {isSearching ? '...' : 'Buscar'}
              </button>
            </div>

            {showResults && results.length > 0 && (
              <div className="ngp-location__results" role="listbox">
                {results.map((result, index) => (
                  <button
                    key={`${result.coordinates.lat}-${result.coordinates.lng}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => selectResult(result)}
                    className="ngp-location__result"
                  >
                    <span className="ngp-location__result-label">{result.label}</span>
                    {result.address && result.address !== result.label && (
                      <span className="ngp-location__result-address">{result.address}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={requestLocation}
            disabled={isLocating}
            className="ngp-location__locate"
            title="Usar mi ubicación"
          >
            <LocateFixed className="ngp-location__locate-icon" aria-hidden="true" />
            <span>{isLocating ? '...' : 'Usar mi ubicación'}</span>
          </button>
        </div>

        {(errorMessage || isResolving) && (
          <div className="ngp-location__map-status" role="status">
            {isResolving ? 'Buscando distrito...' : errorMessage}
          </div>
        )}
      </div>

      <p className="ngp-location__prompt">Toca el mapa o usa tu ubicación</p>
      <p className="ngp-location__hint">
        Opcional: toca el mapa donde está tu casa o usa el botón de ubicación.
      </p>

      <div className="ngp-location__fields">
        <div className="ngp-form__group">
          <label htmlFor="district" className="ngp-form__label">
            Distrito o ciudad
          </label>
          <input
            type="text"
            id="district"
            name="district"
            value={district}
            onChange={(event) => onDistrictChange(event.target.value)}
            className="ngp-form__input"
            placeholder="Ej. Trujillo"
          />
        </div>

        <div className="ngp-form__group">
          <label htmlFor="address" className="ngp-form__label">
            Dirección o referencia
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            className="ngp-form__input"
            placeholder="Ej. Av. Principal 123"
          />
        </div>
      </div>
    </div>
  );
}
