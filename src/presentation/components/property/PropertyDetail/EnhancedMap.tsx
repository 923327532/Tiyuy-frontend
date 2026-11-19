'use client';

import { PropertyLocation as Location } from '@/core/domain/entities/Property';
import { useEffect, useRef } from 'react';

interface EnhancedMapProps {
  location: Location;
  propertyId: number;
}

export function EnhancedMap({ location, propertyId }: EnhancedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!location.latitude || !location.longitude || !mapRef.current) return;

    if (mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (cancelled || !mapRef.current) return;

      const lat = Number(location.latitude);
      const lng = Number(location.longitude);

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.circle([lat, lng], {
        radius: 200,
        color: '#3B82F6',
        weight: 2,
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
      }).addTo(map);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:16px;height:16px;background:#3B82F6;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup(location.fullAddress || `${location.district}, ${location.province}`);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '288px', display: 'block' }}
    />
  );
}
