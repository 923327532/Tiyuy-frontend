'use client';

import dynamic from 'next/dynamic';

import type { Coordinates } from './useUserLocation';

const LocationMapCanvas = dynamic(() => import('./LocationMapCanvas'), {
  ssr: false,
  loading: () => <div className="ngp-location__map ngp-location__map--loading" />,
});

interface LocationMapProps {
  center: [number, number];
  onPick: (coordinates: Coordinates) => void;
}

export function LocationMap({ center, onPick }: LocationMapProps) {
  return <LocationMapCanvas center={center} onPick={onPick} />;
}
