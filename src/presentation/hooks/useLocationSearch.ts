import { useState, useEffect } from 'react';

export interface LocationPrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  lat?: number;
  lon?: number;
  address?: any;
}

export function useLocationSearch(query: string) {
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query || query.length < 2) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/google-places/autocomplete?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        setPredictions(data.predictions || []);
      } catch (error) {
        console.error('Error en Nominatim:', error);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { predictions, loading };
}
