'use client';

import { useState } from 'react';

import type { Coordinates } from './useUserLocation';
import { buildAddressText, extractDistrict } from './locationUtils';

export function useReverseGeocode(
  onResolved: (district: string, address: string) => void,
) {
  const [isResolving, setIsResolving] = useState(false);

  const resolve = async ({ lat, lng }: Coordinates) => {
    setIsResolving(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`,
      );
      const data = await response.json();
      const place = data.address ?? {};
      const district = extractDistrict(place);
      const address = buildAddressText(data.display_name, place.country);

      if (district || address) onResolved(district, address);
    } catch {
      // Si falla la geocodificación inversa, el usuario puede escribir los campos manualmente.
    } finally {
      setIsResolving(false);
    }
  };

  return { resolve, isResolving };
}
