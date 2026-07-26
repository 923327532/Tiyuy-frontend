'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { LocationSearch } from '@/presentation/components/forms/LocationSearch/LocationSearch';
import { useGooglePlaces } from '@/presentation/hooks/useGooglePlaces';
import { AlertCircle, Info, MapPin, Crosshair, Map } from 'lucide-react';

interface LocationStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  propertyId?: number;
  validationErrors?: Record<string, string>;
}

export function LocationStep({ formData, onChange, validationErrors }: LocationStepProps) {
  const [locationInput, setLocationInput] = useState(
    formData.district && formData.province 
      ? `${formData.district}, ${formData.province}` 
      : ''
  );
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [useManualCoords, setUseManualCoords] = useState(
    formData.manualCoordinates === true || 
    (formData.latitude && formData.longitude && !formData.street && !formData.streetNumber)
  );
  const [latInput, setLatInput] = useState(formData.latitude?.toString() || '');
  const [lngInput, setLngInput] = useState(formData.longitude?.toString() || '');
  
  // ✅ Refs para mapa y marcador
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { getPlaceDetails, loading, error } = useGooglePlaces();

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-gray-50 outline-none';

  // Función para actualizar con logging
  const handleChangeWithLog = (field: string, value: any) => {
    console.log(`📝 LocationStep - Actualizando ${field}:`, value);
    onChange(field, value);
  };

  const toggleManualCoords = (useManual: boolean) => {
    setUseManualCoords(useManual);
    onChange('manualCoordinates', useManual);
    
    // Si activa manual y ya hay coordenadas, mostrar el mapa
    if (useManual && formData.latitude && formData.longitude) {
      const lat = Number(formData.latitude);
      const lng = Number(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
      }
    }
  };

  const handleLatChange = (value: string) => {
    setLatInput(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
      onChange('latitude', parsed);
      const lng = parseFloat(lngInput);
      if (!isNaN(lng) && lng >= -180 && lng <= 180) {
        setMapCenter({ lat: parsed, lng });
      }
    }
  };

  const handleLngChange = (value: string) => {
    setLngInput(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
      onChange('longitude', parsed);
      const lat = parseFloat(latInput);
      if (!isNaN(lat) && lat >= -90 && lat <= 90) {
        setMapCenter({ lat, lng: parsed });
      }
    }
  };

  // ✅ fullAddress como valor derivado con useMemo (EVITA BUCLE INFINITO)
  const fullAddress = useMemo(() => {
    if (useManualCoords && formData.latitude && formData.longitude) {
      return `${formData.latitude}, ${formData.longitude}${formData.district ? ` - ${formData.district}` : ''}${formData.province ? `, ${formData.province}` : ''}`;
    }
    return [
      formData.street,
      formData.streetNumber,
      formData.urbanization,
      formData.district,
      formData.province,
      formData.region
    ].filter(Boolean).join(', ');
  }, [formData.street, formData.streetNumber, formData.urbanization, formData.district, formData.province, formData.region, formData.latitude, formData.longitude, useManualCoords]);

  // Función para geocodificar dirección y actualizar mapa
  const geocodeAddress = async (address: string) => {
    if (!window.google?.maps) return;

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        onChange('latitude', lat);
        onChange('longitude', lng);
        setMapCenter({ lat, lng });
      }
    });
  };

  // ✅ Fix 1: Debounce en updateFullAddress para evitar geocodificar con cada tecla
useEffect(() => {
  if (useManualCoords) return; // No geocodificar en modo manual
  if (!formData.district && !formData.province) return;

  // ✅ Actualizar fullAddress inmediatamente (sin mapa)
  const parts = [
    formData.street,
    formData.streetNumber,
    formData.urbanization,
    formData.district,
    formData.province,
    formData.region,
  ].filter(Boolean);

  const newFullAddress = parts.join(', ');
  if (newFullAddress !== formData.fullAddress && !useManualCoords) {
    onChange('fullAddress', newFullAddress);
    onChange('address', newFullAddress);
  }

  // ✅ Geocodificar con debounce de 1s (solo mueve el mapa después de parar de escribir)
  if (formData.street && formData.streetNumber && formData.district) {
    const timer = setTimeout(() => {
      geocodeAddress(newFullAddress);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [
  formData.district,
  formData.province,
  formData.street,
  formData.streetNumber,
  formData.urbanization,
  formData.region,
  useManualCoords,
]);

  // ✅ Fix 2: Separar la inicialización del mapa del movimiento del centro
// Efecto 1: Inicializar el mapa UNA SOLA VEZ
useEffect(() => {
  if (!mapCenter || !mapRef.current) return;
  if (mapInstanceRef.current) return; // ✅ Ya inicializado, no recrear

  const initializeMap = () => {
    if (!mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 16,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    markerRef.current = new window.google.maps.Marker({
      position: mapCenter,
      map: mapInstanceRef.current,
      draggable: true,
      title: formData.district || 'Ubicación seleccionada',
    });

    markerRef.current.addListener('dragend', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onChange('latitude', lat);
      onChange('longitude', lng);
      setLatInput(lat.toString());
      setLngInput(lng.toString());
      setMapCenter({ lat, lng });
    });

    setMapReady(true);
  };

  if (window.google?.maps) {
    initializeMap();
    return;
  }

  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
    const interval = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(interval);
        initializeMap();
      }
    }, 100);
    return () => clearInterval(interval);
  }

  window.initMap = initializeMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}, [mapCenter !== null]); // ✅ Solo cuando pasa de null a tener valor

// Efecto 2: Solo MOVER el mapa cuando cambia el centro (sin reinicializar)
useEffect(() => {
  if (!mapCenter || !mapInstanceRef.current || !markerRef.current) return;

  // ✅ Pan suave al nuevo centro sin recrear el mapa
  mapInstanceRef.current.panTo(mapCenter);
  markerRef.current.setPosition(mapCenter);
}, [mapCenter]);

  const handleLocationSelect = async (location: {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
  }) => {
    setLocationInput(location.mainText);

    const locationData = await getPlaceDetails(location.placeId);

    if (locationData) {
      const lat = Number(locationData.coordinates.lat);
      const lng = Number(locationData.coordinates.lng);

      onChange('district', locationData.district || location.mainText);
      onChange('province', locationData.province || location.secondaryText);
      onChange('region', locationData.region || 'Perú');

      // Forzar el mapa con coords válidas
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        setLatInput(lat.toString());
        setLngInput(lng.toString());
      }
    }
  };

  // El mapa se muestra solo si tenemos coordenadas
  const showMap = mapCenter !== null && !isNaN(mapCenter.lat) && !isNaN(mapCenter.lng);

  return (
    <div className="space-y-8">

      {/* ── BUSCAR UBICACIÓN ── */}
      {!useManualCoords && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            ¿Dónde está ubicado tu inmueble?
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Escribe el nombre del distrito o provincia
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Buscar ubicación
            </label>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Ej: Miraflores, San Miguel, Piura..."
              defaultValue={locationInput}
              className="w-full"
            />

            {loading && (
              <div className="mt-2.5 flex items-center gap-2 text-sm" style={{ color: '#00a63e' }}>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                  style={{ borderColor: '#00a63e', borderTopColor: 'transparent' }}
                />
                Obteniendo detalles de la ubicación...
              </div>
            )}

            {error && (
              <div className="mt-2.5 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TOGGLE: COORDENADAS MANUALES ── */}
      <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
        <Crosshair className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">
            ¿No tiene dirección exacta?
          </p>
          <p className="text-xs text-gray-400">
            Para lotes, terrenos o zonas alejadas, puedes ingresar las coordenadas manualmente
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleManualCoords(!useManualCoords)}
          className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
            useManualCoords ? 'bg-teal-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
              useManualCoords ? 'translate-x-7' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* ── CAMPOS DE COORDENADAS MANUALES ── */}
      {useManualCoords && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-teal-600" />
            Coordenadas del proyecto
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Ingresa las coordenadas exactas del proyecto. Puedes usar Google Maps para obtenerlas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Latitud <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={latInput}
                  onChange={(e) => handleLatChange(e.target.value)}
                  placeholder="Ej: -12.046374"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
                  °S
                </span>
              </div>
              {validationErrors?.latitude && <p className="mt-1 text-sm text-red-600">{validationErrors.latitude}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Longitud <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lngInput}
                  onChange={(e) => handleLngChange(e.target.value)}
                  placeholder="Ej: -77.042793"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">
                  °W
                </span>
              </div>
              {validationErrors?.longitude && <p className="mt-1 text-sm text-red-600">{validationErrors.longitude}</p>}
            </div>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>
              ¿No sabes las coordenadas? Abre{' '}
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google Maps
              </a>
              , haz clic derecho en la ubicación exacta y selecciona "¿Qué hay aquí?" — las coordenadas aparecerán abajo.
            </span>
          </div>

          {/* Distrito para modo manual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Distrito</label>
              <input 
                type="text" 
                value={formData.district || ''} 
                onChange={(e) => onChange('district', e.target.value)}
                placeholder="Ej: Chilca, Mala" 
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
              {validationErrors?.district && <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Provincia</label>
              <input 
                type="text" 
                value={formData.province || ''} 
                onChange={(e) => onChange('province', e.target.value)}
                placeholder="Ej: Cañete" 
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
              {validationErrors?.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Región / Departamento</label>
              <input 
                type="text" 
                value={formData.region || ''} 
                onChange={(e) => onChange('region', e.target.value)}
                placeholder="Ej: Lima" 
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
              {validationErrors?.region && <p className="mt-1 text-sm text-red-600">{validationErrors.region}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Urbanización <span className="text-gray-300 font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.urbanization || ''}
                onChange={(e) => onChange('urbanization', e.target.value)}
                placeholder="Ej: Sector Los Olivos"
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CAMPOS DE DIRECCIÓN (solo en modo normal) ── */}
      {!useManualCoords && (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Distrito</label>
              <input type="text" value={formData.district || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.district && <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Provincia</label>
              <input type="text" value={formData.province || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Región / Departamento</label>
              <input type="text" value={formData.region || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.region && <p className="mt-1 text-sm text-red-600">{validationErrors.region}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Urbanización <span className="text-gray-300 font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.urbanization || ''}
                onChange={(e) => onChange('urbanization', e.target.value)}
                placeholder="Ej: Monterrico, La Molina"
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Calle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => onChange('street', e.target.value)}
                placeholder="Ej: Av. Principal, Jr. Lima"
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
              {validationErrors?.street && <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetNumber || ''}
                onChange={(e) => onChange('streetNumber', e.target.value)}
                placeholder="Ej: 123, 456-A"
                className={inputClass.replace('bg-gray-50', 'bg-white')}
              />
              {validationErrors?.streetNumber && <p className="mt-1 text-sm text-red-600">{validationErrors.streetNumber}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Dirección completa <span className="text-gray-300 font-normal normal-case">(se autocompleta)</span>
            </label>
            <input
              type="text"
              value={formData.fullAddress || ''}
              readOnly
              placeholder="Se autocompleta con calle, número y distrito"
              className={inputClass}
            />
          </div>
        </section>
      )}

      {/* ── MAPA ── */}
      {showMap && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              {useManualCoords ? '¿Está correcta la ubicación?' : '¿Cómo quieres mostrar tu ubicación?'}
            </h3>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {useManualCoords 
                ? `${formData.latitude?.toFixed(6)}, ${formData.longitude?.toFixed(6)}`
                : `${formData.district}, ${formData.province}`
              }
            </span>
          </div>

          {/* Radio Exacta / Aproximada */}
          {!useManualCoords && (
            <div className="flex items-center gap-6 mb-4">
              {[{ label: 'Exacta', value: true }, { label: 'Aproximada', value: false }].map((opt) => {
                const isSelected = formData.showExactAddress === opt.value;
                return (
                  <label
                    key={opt.label}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => onChange('showExactAddress', opt.value)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: isSelected ? '#00a63e' : '#d1d5db',
                        backgroundColor: isSelected ? '#00a63e' : 'white',
                      }}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {useManualCoords && (
            <p className="text-xs text-teal-700 mb-3 flex items-center gap-1.5 p-2.5 bg-teal-50 rounded-lg border border-teal-200">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Puedes arrastrar el marcador en el mapa para ajustar la ubicación exacta
            </p>
          )}

          {/* Map — mismo estilo que EnhancedMap de detalle */}
          <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200">
            <div
              ref={mapRef}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {useManualCoords 
              ? 'Arrastra el marcador para ajustar la ubicación exacta del proyecto'
              : 'Puedes arrastrar el marcador para ajustar la ubicación exacta'
            }
          </p>
        </section>
      )}

      {/* ── TIP ── */}
      {!useManualCoords && (
        <div
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm" style={{ color: '#166534' }}>
            <p className="font-semibold mb-1">¿Cómo funciona?</p>
            <ul className="space-y-0.5 text-xs opacity-80">
              <li>• Escribe el nombre del distrito o provincia</li>
              <li>• Selecciona la opción correcta de la lista</li>
              <li>• Los datos y el mapa se autocompletarán automáticamente</li>
              <li>• Funciona con todos los distritos del Perú</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}