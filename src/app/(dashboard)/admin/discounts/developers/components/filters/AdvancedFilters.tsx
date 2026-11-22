/**
 * Advanced Filters Component
 * Expanded filter options for the discounts list
 */

import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { X, ChevronUp } from 'lucide-react';
import { DeveloperSubscriptionDiscountFilters } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

interface AdvancedFiltersProps {
  filters: DeveloperSubscriptionDiscountFilters;
  onFilterChange: (key: keyof DeveloperSubscriptionDiscountFilters, value: string | number) => void;
  onSortChange: (sort: string) => void;
  onApply: () => void;
  onClose: () => void;
  sortBy: string;
}

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Más recientes' },
  { value: 'createdAt,asc', label: 'Más antiguos' },
  { value: 'validFrom,desc', label: 'Vigencia más reciente' },
  { value: 'validFrom,asc', label: 'Vigencia más antigua' },
  { value: 'percentage,desc', label: 'Mayor descuento %' },
  { value: 'amountPen,desc', label: 'Mayor importe PEN' },
];

export default function AdvancedFilters({
  filters,
  onFilterChange,
  onSortChange,
  onApply,
  onClose,
  sortBy,
}: AdvancedFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium">Filtros Avanzados</h3>
        <Button variant="ghost" size="xs" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Fecha desde</label>
          <Input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Fecha hasta</label>
          <Input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-1">Ordenar por</label>
          <Select
            value={sortBy}
            onChange={(v: string) => onSortChange(v)}
            options={SORT_OPTIONS}
            placeholder="Ordenar"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm"
            onClick={onApply}
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}