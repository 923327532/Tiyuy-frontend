'use client';

import { PropertyLocation as Location } from '@/core/domain/entities/Property';
import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/utils/googleMapsLoader';

interface EnhancedMapProps {
  location: Location;
  propertyId: number;
}

export function EnhancedMap({ location }: EnhancedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!location.latitude || !location.longitude || !mapRef.current) return;

    let cancelled = false;
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    const w = window as any;

    // Google llama a esta función si la key es inválida, está restringida o la API no está habilitada.
    w.gm_authFailure = () => {
      if (!cancelled) setFailed(true);
    };

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !mapRef.current) return;

        const center = { lat, lng };

        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 16,
          streetViewControl: false,
          mapTypeControl: false,
          styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        });

        new google.maps.Circle({
          map,
          center,
          radius: 200,
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
        });

        new google.maps.Marker({
          position: center,
          map,
          title: location.fullAddress || `${location.district}, ${location.province}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
      })
      .catch((error) => {
        console.error('[EnhancedMap]', error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [location.latitude, location.longitude, location.fullAddress, location.district, location.province]);

  if (failed && location.latitude && location.longitude) {
    return (
      <div className="flex h-72 w-full flex-col items-center justify-center gap-2 bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
        <p>No se pudo cargar el mapa.</p>
        <a
          href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline"
        >
          Ver en Google Maps
        </a>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '288px', display: 'block' }} />;
}
