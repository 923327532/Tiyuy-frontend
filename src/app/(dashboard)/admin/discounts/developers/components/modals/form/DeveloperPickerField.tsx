/**
 * Developer (inmobiliaria) picker field with search dropdown
 */

import { Input } from '@/presentation/components/ui/Input';
import { DeveloperOption } from './formConfig';

interface DeveloperPickerFieldProps {
  developerSearch: string;
  setDeveloperSearch: (value: string) => void;
  showDeveloperDropdown: boolean;
  setShowDeveloperDropdown: (value: boolean) => void;
  filteredDevelopers: DeveloperOption[];
  onSelect: (dev: DeveloperOption) => void;
  onClearSelection: () => void;
  error?: string;
  disabled: boolean;
}

export default function DeveloperPickerField({
  developerSearch,
  setDeveloperSearch,
  showDeveloperDropdown,
  setShowDeveloperDropdown,
  filteredDevelopers,
  onSelect,
  onClearSelection,
  error,
  disabled,
}: DeveloperPickerFieldProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-gray-700">Inmobiliaria *</label>
        <div className="relative">
          <Input
            type="text"
            value={developerSearch}
            onChange={(e) => {
              setDeveloperSearch(e.target.value);
              setShowDeveloperDropdown(true);
              if (!e.target.value) onClearSelection();
            }}
            onFocus={() => setShowDeveloperDropdown(true)}
            onBlur={() => setTimeout(() => setShowDeveloperDropdown(false), 200)}
            placeholder="Buscar por nombre o RUC..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={disabled}
          />
          {showDeveloperDropdown && filteredDevelopers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
              {filteredDevelopers.map(dev => (
                <button
                  key={dev.id}
                  type="button"
                  onClick={() => onSelect(dev)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-xs flex-shrink-0">
                    {dev.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{dev.name}</div>
                    {dev.ruc && <div className="text-[10px] text-gray-500 truncate">RUC: {dev.ruc}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDeveloperDropdown && developerSearch && filteredDevelopers.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3 text-center text-gray-500 text-sm">
              No se encontraron inmobiliarias
            </div>
          )}
        </div>
        {error && (
          <p className="text-[10px] text-red-600 mt-1">{error}</p>
        )}
      </div>
      <p className="text-[10px] text-gray-500">La inmobiliaria beneficiaria del descuento</p>
    </>
  );
}
