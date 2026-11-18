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
  const [useManualCoords, setUseManualCoords] = useState(
    formData.manualCoordinates === true || 
    (formData.latitude && formData.longitude && !formData.street && !formData.streetNumber)
  );
  const [latInput, setLatInput] = useState(formData.latitude?.toString() || '');
  const [lngInput, setLngInput] = useState(formData.longitude?.toString() || '');
  
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { getPlaceDetails, loading, error } = useGooglePlaces();

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-[var(--input-border)] text-sm text-[var(--text-primary)] bg-[var(--bg-card)] outline-none';

  const handleChangeWithLog = (field: string, value: any) => {
    onChange(field, value);
  };

  const toggleManualCoords = (useManual: boolean) => {
    setUseManualCoords(useManual);
    onChange('manualCoordinates', useManual);
    
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

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=pe&limit=1`, {
        headers: { 'User-Agent': 'Tiyuy-Frontend' },
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onChange('latitude', lat);
        onChange('longitude', lng);
        setMapCenter({ lat, lng });
      }
    } catch (err) {
      console.error('Error geocoding:', err);
    }
  };

  useEffect(() => {
    if (useManualCoords) return;
    if (!formData.district && !formData.province) return;

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

  useEffect(() => {
    if (!mapCenter || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      if (cancelled || !mapRef.current) return;

      const lat = mapCenter.lat;
      const lng = mapCenter.lng;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const marker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        onChange('latitude', pos.lat);
        onChange('longitude', pos.lng);
        setLatInput(pos.lat.toString());
        setLngInput(pos.lng.toString());
        setMapCenter({ lat: pos.lat, lng: pos.lng });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    initMap();

    return () => { cancelled = true; };
  }, [mapCenter !== null]);

  useEffect(() => {
    if (!mapCenter || !mapInstanceRef.current || !markerRef.current) return;

    mapInstanceRef.current.panTo([mapCenter.lat, mapCenter.lng]);
    markerRef.current.setLatLng([mapCenter.lat, mapCenter.lng]);
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

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        setLatInput(lat.toString());
        setLngInput(lng.toString());
      }
    }
  };

  const showMap = mapCenter !== null && !isNaN(mapCenter.lat) && !isNaN(mapCenter.lng);

  return (
    <div className="space-y-8">

      {/* ── BUSCAR UBICACIÓN ── */}
      {!useManualCoords && (
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            ¿Dónde está ubicado tu inmueble?
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Escribe el nombre del distrito o provincia
          </p>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
              Buscar ubicación
            </label>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              placeholder="Ej: Miraflores, San Miguel, Piura..."
              defaultValue={locationInput}
              className="w-full"
            />

            {loading && (
              <div className="mt-2.5 flex items-center gap-2 text-sm" style={{ color: 'var(--brand-primary)' }}>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                  style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }}
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
      <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <Crosshair className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            ¿No tiene dirección exacta?
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Para lotes, terrenos o zonas alejadas, puedes ingresar las coordenadas manualmente
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleManualCoords(!useManualCoords)}
          className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
            useManualCoords ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color)]'
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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-[var(--brand-primary)]" />
            Coordenadas del proyecto
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Ingresa las coordenadas exactas del proyecto. Puedes usar OpenStreetMap para obtenerlas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Latitud <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={latInput}
                  onChange={(e) => handleLatChange(e.target.value)}
                  placeholder="Ej: -12.046374"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--input-border)] text-sm text-[var(--text-primary)] bg-[var(--bg-card)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-mono">
                  °S
                </span>
              </div>
              {validationErrors?.latitude && <p className="mt-1 text-sm text-red-600">{validationErrors.latitude}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Longitud <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lngInput}
                  onChange={(e) => handleLngChange(e.target.value)}
                  placeholder="Ej: -77.042793"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--input-border)] text-sm text-[var(--text-primary)] bg-[var(--bg-card)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-mono">
                  °W
                </span>
              </div>
              {validationErrors?.longitude && <p className="mt-1 text-sm text-red-600">{validationErrors.longitude}</p>}
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-4 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
            <Info className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
            <span>
              ¿No sabes las coordenadas? Abre{' '}
              <a 
                href="https://www.openstreetmap.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--brand-primary)] underline hover:opacity-80"
              >
                OpenStreetMap
              </a>
              , haz clic en la ubicación exacta — las coordenadas aparecerán a la izquierda.
            </span>
          </div>

          {/* Distrito para modo manual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Distrito</label>
              <input 
                type="text" 
                value={formData.district || ''} 
                onChange={(e) => onChange('district', e.target.value)}
                placeholder="Ej: Chilca, Mala" 
                className={inputClass}
              />
              {validationErrors?.district && <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Provincia</label>
              <input 
                type="text" 
                value={formData.province || ''} 
                onChange={(e) => onChange('province', e.target.value)}
                placeholder="Ej: Cañete" 
                className={inputClass}
              />
              {validationErrors?.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Región / Departamento</label>
              <input 
                type="text" 
                value={formData.region || ''} 
                onChange={(e) => onChange('region', e.target.value)}
                placeholder="Ej: Lima" 
                className={inputClass}
              />
              {validationErrors?.region && <p className="mt-1 text-sm text-red-600">{validationErrors.region}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Urbanización <span className="text-[var(--text-muted)] font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.urbanization || ''}
                onChange={(e) => onChange('urbanization', e.target.value)}
                placeholder="Ej: Sector Los Olivos"
                className={inputClass}
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
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Distrito</label>
              <input type="text" value={formData.district || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.district && <p className="mt-1 text-sm text-red-600">{validationErrors.district}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Provincia</label>
              <input type="text" value={formData.province || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Región / Departamento</label>
              <input type="text" value={formData.region || ''} readOnly placeholder="Se autocompleta al buscar" className={inputClass} />
              {validationErrors?.region && <p className="mt-1 text-sm text-red-600">{validationErrors.region}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Urbanización <span className="text-[var(--text-muted)] font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.urbanization || ''}
                onChange={(e) => onChange('urbanization', e.target.value)}
                placeholder="Ej: Monterrico, La Molina"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Calle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => onChange('street', e.target.value)}
                placeholder="Ej: Av. Principal, Jr. Lima"
                className={inputClass}
              />
              {validationErrors?.street && <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                Número <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetNumber || ''}
                onChange={(e) => onChange('streetNumber', e.target.value)}
                placeholder="Ej: 123, 456-A"
                className={inputClass}
              />
              {validationErrors?.streetNumber && <p className="mt-1 text-sm text-red-600">{validationErrors.streetNumber}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
              Dirección completa <span className="text-[var(--text-muted)] font-normal normal-case">(se autocompleta)</span>
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
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {useManualCoords ? '¿Está correcta la ubicación?' : '¿Cómo quieres mostrar tu ubicación?'}
            </h3>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
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
                        borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-color)',
                        backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--bg-card)',
                      }}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {useManualCoords && (
            <p className="text-xs text-[var(--brand-primary)] mb-3 flex items-center gap-1.5 p-2.5 bg-[var(--brand-primary-light)] rounded-lg border border-[var(--brand-primary)]/20">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Puedes arrastrar el marcador en el mapa para ajustar la ubicación exacta
            </p>
          )}

          <div className="w-full h-72 rounded-xl overflow-hidden border border-[var(--border-color)]">
            <div
              ref={mapRef}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
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
          style={{ backgroundColor: 'var(--brand-primary-light)', border: '1px solid var(--brand-primary)' }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--brand-primary)]" />
          <div className="text-sm text-[var(--text-primary)]">
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
