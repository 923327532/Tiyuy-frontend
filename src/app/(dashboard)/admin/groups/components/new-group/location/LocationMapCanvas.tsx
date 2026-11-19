'use client';

import { useEffect } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';

import { LeafletMap } from '@/presentation/components/shared/Map/LeafletMap';

import type { Coordinates } from './useUserLocation';

interface LocationMapCanvasProps {
  center: [number, number];
  onPick: (coordinates: Coordinates) => void;
}

function MapClickHandler({ onPick }: { onPick: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click(event) {
      onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  const [lat, lng] = center;

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [map, lat, lng]);

  return null;
}

export default function LocationMapCanvas({ center, onPick }: LocationMapCanvasProps) {
  return (
    <LeafletMap center={center} zoom={15} className="ngp-location__map">
      <MapCenterUpdater center={center} />
      <MapClickHandler onPick={onPick} />
      <Marker position={center} />
    </LeafletMap>
  );
}
