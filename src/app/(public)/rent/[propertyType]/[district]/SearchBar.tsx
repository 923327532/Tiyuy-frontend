'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Check, Search } from 'lucide-react';
import { LocationSearch } from '@/presentation/components/forms/LocationSearch/LocationSearch';

export function SearchBar({ propertyType, district }: { propertyType: string; district: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'venta' | 'alquiler'>('alquiler');
  const [selectedType, setSelectedType] = useState(propertyType);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tipos = [
    { value: 'departamentos', label: 'Departamento' },
    { value: 'casas', label: 'Casa' },
    { value: 'terrenos', label: 'Terreno / Lote' },
    { value: 'locales', label: 'Local comercial' },
    { value: 'oficinas', label: 'Oficina comercial' },
    { value: 'habitaciones', label: 'Habitación' },
  ];

  useEffect(() => {
    setSelectedType(propertyType);
  }, [propertyType]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const currentFilters = ['minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'minArea', 'maxArea', 'parking'];
    
    currentFilters.forEach(filter => {
      if (searchParams.get(filter)) params.set(filter, searchParams.get(filter)!);
    });

    /* Convierte texto a formato slug legible por URLs (ej: "Miraflores" -> "miraflores") */
    const slug = selectedLocation
      ? selectedLocation.mainText.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : district;

    if (selectedLocation) params.set('filtered', '1');
    
    localStorage.setItem('lastSearch', JSON.stringify({
      transactionType: transactionType === 'venta' ? 'sale' : 'rent',
      type: selectedType,
      district: selectedLocation ? selectedLocation.mainText.toLowerCase() : district,
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      minArea: searchParams.get('minArea') || '',
    }));
    
    const routeTransactionType = transactionType === 'venta' ? 'sale' : 'rent';
    const finalUrl = `/${routeTransactionType}/${selectedType}/${slug}?${params.toString()}`;
    
    window.location.href = finalUrl;
  };

  const selectedLabel = tipos.find(t => t.value === selectedType)?.label || 'Tipo';

  return (
    <div className="w-full max-w-8xl mx-auto bg-[var(--bg-card)] p-4 rounded-xl shadow-md border-2 border-[var(--border-color)] mb-6 antialiased text-[var(--text-primary)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">

        <div className="flex shrink-0 border-2 border-[var(--border-color)] rounded-xl overflow-hidden text-sm font-semibold h-12">
          <button
            onClick={() => setTransactionType('venta')}
            className={`flex-1 lg:flex-none px-5 py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              transactionType === 'venta' ? 'bg-brand text-white font-bold' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {transactionType === 'venta' && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            Venta
          </button>
          <button
            onClick={() => setTransactionType('alquiler')}
            className={`flex-1 lg:flex-none px-5 py-3 flex items-center justify-center gap-2 border-l-2 border-[var(--border-color)] transition-colors cursor-pointer ${
              transactionType === 'alquiler' ? 'bg-brand text-white font-bold' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {transactionType === 'alquiler' && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            Alquiler
          </button>
        </div>

        <div className="relative shrink-0 h-12" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full lg:w-auto h-full px-4 border-2 border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-secondary)] bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)] focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none flex items-center justify-between lg:justify-start gap-4 cursor-pointer transition-colors"
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-xl shadow-lg z-50 w-full lg:min-w-[240px] py-2">
              <p className="px-4 py-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tipo de inmueble</p>
              <div className="max-h-60 overflow-y-auto">
                {tipos.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { 
                      setSelectedType(t.value); 
                      localStorage.setItem('selectedPropertyType', t.value);
                      setDropdownOpen(false); 
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] transition-colors text-left group cursor-pointer"
                  >
                    <span className={`w-4 h-4 border-2 rounded flex items-center justify-center shrink-0 transition-colors ${
                      selectedType === t.value ? 'bg-brand border-brand' : 'border-[var(--border-color)] group-hover:border-[var(--text-muted)] bg-[var(--bg-card)]'
                    }`}>
                      {selectedType === t.value && <Check className="w-3 h-3 text-white" strokeWidth={3.5} />}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="border-t-2 border-[var(--border-light)] mt-2 pt-2 px-3 pb-1 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedType('');
                    localStorage.removeItem('selectedPropertyType');
                    setDropdownOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-bold text-[var(--text-muted)] border-2 border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 h-12">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            placeholder="Distrito o zona..."
            defaultValue={district}
            className="w-full h-full"
          />
        </div>

        <button
          onClick={handleSearch}
          className="h-12 px-10 bg-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4" strokeWidth={2.5} />
          BUSCAR
        </button>

      </div>
    </div>
  );
}