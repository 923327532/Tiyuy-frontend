'use client';

import { useState } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

const getLocationError = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permiso denegado. Activa la ubicación en tu navegador e inténtalo de nuevo.';
    case error.POSITION_UNAVAILABLE:
      return 'No se pudo obtener tu ubicación. Inténtalo nuevamente.';
    case error.TIMEOUT:
      return 'Se agotó el tiempo para obtener tu ubicación.';
    default:
      return 'No se pudo obtener tu ubicación.';
  }
};

export function useUserLocation(onLocated: (coordinates: Coordinates) => void) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no admite geolocalización.');
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocated({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(getLocationError(error));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return { isLocating, locationError, requestLocation };
}
