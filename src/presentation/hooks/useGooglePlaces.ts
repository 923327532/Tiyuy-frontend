import { useState } from 'react';

interface PlaceDetails {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationData {
  place: PlaceDetails;
  coordinates: Coordinates;
  district?: string;
  province?: string;
  region?: string;
}

export const useGooglePlaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlaceDetails = async (placeId: string): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/google-places/details?place_id=${encodeURIComponent(placeId)}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        
        const addressComponents = result.address_components || [];
        let district = '';
        let province = '';
        let region = '';

        addressComponents.forEach((component: any) => {
          const types = component.types || [];
          
          if (types.includes('locality') || types.includes('sublocality')) {
            district = component.long_name;
          } else if (types.includes('administrative_area_level_2')) {
            province = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            region = component.long_name;
          }
        });

        return {
          place: {
            placeId: result.place_id,
            description: result.formatted_address || '',
            mainText: result.name || '',
            secondaryText: result.formatted_address?.replace(result.name + ', ', '') || '',
          },
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          },
          district,
          province,
          region,
        };
      } else {
        setError(`Error obteniendo detalles: ${data.status}`);
        return null;
      }
    } catch (err) {
      setError('Error al obtener detalles del lugar');
      console.error('Error getting place details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchPredictions = async (query: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/google-places/autocomplete?query=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions || [];
      } else {
        setError(`Error en búsqueda: ${data.status}`);
        return [];
      }
    } catch (err) {
      setError('Error en la búsqueda de lugares');
      console.error('Error searching places:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getPlaceDetails,
    searchPredictions,
    loading,
    error,
  };
};
