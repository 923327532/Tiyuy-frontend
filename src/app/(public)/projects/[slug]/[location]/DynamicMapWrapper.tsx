'use client';

import dynamic from 'next/dynamic';

const PropertyMapWrapper = dynamic(
  () => import('@/presentation/features/property-map/components/PropertyMapWrapper').then(m => ({ default: m.PropertyMapWrapper })),
  {
    ssr: false,
    loading: () => (
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm" disabled>
        Cargar mapa...
      </button>
    ),
  }
);

export default PropertyMapWrapper;