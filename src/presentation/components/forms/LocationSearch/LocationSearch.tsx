'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/presentation/components/ui/Input/Input';
import { useLocationSearch } from '@/presentation/hooks/useLocationSearch';
import { MapPin, AlertCircle } from 'lucide-react';

interface LocationSearchProps {
  onLocationSelect: (location: {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
  }) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = "Buscar distrito o provincia...",
  defaultValue = "",
  className = "",
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const { predictions, loading } = useLocationSearch(query);

  useEffect(() => {
    if (predictions.length > 0) setShowDropdown(true);
  }, [predictions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleLocationClick = (prediction: any) => {
    const mainText = prediction.structured_formatting.main_text;
    const secondaryText = prediction.structured_formatting.secondary_text;

    setQuery(mainText);
    setShowDropdown(false);

    onLocationSelect({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText,
      secondaryText,
    });
  };

  const handleInputFocus = () => {
    if (query) setShowDropdown(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={`pr-10 bg-[var(--bg-card)] ${className}`}
        leftIcon={
          <MapPin className="w-5 h-5 text-blue-500" />
        }
        rightIcon={
          loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : null
        }
      />

      {/* Dropdown de predicciones */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-[9999] w-full mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-3 hover:bg-[var(--bg-tertiary)] cursor-pointer border-b border-[var(--border-light)] last:border-b-0 transition-colors"
              onClick={() => handleLocationClick(prediction)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[var(--text-primary)] truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de error si no hay API key */}
      {!API_KEY && (
        <div className="absolute z-50 w-full mt-1 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">
              Google Places API key no configurada. Agrega NEXT_PUBLIC_GOOGLE_PLACES_API_KEY a tu .env.local
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
