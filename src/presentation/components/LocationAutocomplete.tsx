'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useLocationSearch, LocationPrediction } from '@/presentation/hooks/useLocationSearch';

interface LocationAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: LocationPrediction) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({ 
  value, 
  onChange, 
  onPlaceSelected, 
  placeholder = "Buscar distrito o ciudad...",
  className = "" 
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const { predictions, loading } = useLocationSearch(inputValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setShowDropdown(val.length >= 2);
  };

  const handleSelect = (prediction: LocationPrediction) => {
    const mainText = prediction.structured_formatting.main_text;
    setInputValue(mainText);
    onChange(mainText);
    setShowDropdown(false);
    if (onPlaceSelected) {
      onPlaceSelected(prediction);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${className}`}
      />
      <div className="absolute right-3 top-2.5 text-gray-400">
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSelect(prediction)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
