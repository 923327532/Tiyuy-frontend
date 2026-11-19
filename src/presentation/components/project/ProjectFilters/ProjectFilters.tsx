'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X } from 'lucide-react';

interface ProjectFiltersProps {
  initialFilters: any;
  onFilterChange: (filters: any) => void;
  projectType: string;
}

const PHASES = [
  { value: 'PRE_SALE', label: 'Preventa' },
  { value: 'SALE', label: 'Venta' },
  { value: 'DELIVERY', label: 'Entrega' },
];

export function ProjectFilters({ initialFilters, onFilterChange, projectType }: ProjectFiltersProps) {
  const [filters, setFilters] = useState({
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    minArea: initialFilters?.minArea || '',
    maxArea: initialFilters?.maxArea || '',
    phase: initialFilters?.phase || '',
    isFeatured: initialFilters?.isFeatured,
    isVerified: initialFilters?.isVerified,
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange({
      ...filters,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      minArea: filters.minArea ? Number(filters.minArea) : undefined,
      maxArea: filters.maxArea ? Number(filters.maxArea) : undefined,
      phase: filters.phase || undefined,
      isFeatured: filters.isFeatured,
      isVerified: filters.isVerified,
    });
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      phase: '',
      isFeatured: undefined,
      isVerified: undefined,
    });
    onFilterChange({});
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.minArea || filters.maxArea || filters.phase || filters.isFeatured !== undefined || filters.isVerified !== undefined;

  const filterContent = (
    <div className="space-y-6">
      {/* Rango de Precio */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Precio</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Desde"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Hasta"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      {/* Rango de Área */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Área (m²)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Desde"
            value={filters.minArea}
            onChange={(e) => updateFilter('minArea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Hasta"
            value={filters.maxArea}
            onChange={(e) => updateFilter('maxArea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      {/* Etapa del proyecto */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Etapa</h3>
        <div className="space-y-2">
          {PHASES.map((phase) => (
            <label key={phase.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="phase"
                checked={filters.phase === phase.value}
                onChange={() => updateFilter('phase', filters.phase === phase.value ? '' : phase.value)}
                className="w-4 h-4 text-brand border-gray-300 focus:ring-brand"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{phase.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Proyectos Destacados */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isFeatured === true}
              onChange={() => updateFilter('isFeatured', filters.isFeatured === true ? undefined : true)}
              className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Destacados</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.isVerified === true}
              onChange={() => updateFilter('isVerified', filters.isVerified === true ? undefined : true)}
              className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">Verificados</span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-2 pt-2">
        <button
          onClick={applyFilters}
          className="w-full py-2.5 bg-brand text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Aplicar filtros
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Botón móvil - se oculta cuando el modal está abierto */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-brand text-white p-2.5 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-brand font-semibold hover:underline">
              Limpiar
            </button>
          )}
        </div>
        {filterContent}
      </div>

      {/* Modal móvil - z-index extremadamente alto para superponerse a cualquier card */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Quitamos lg:hidden para asegurar que funcione incluso si hay conflictos de responsive */}
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto z-[99999]">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
