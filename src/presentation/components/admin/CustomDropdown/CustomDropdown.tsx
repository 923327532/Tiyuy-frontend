/**
 * Custom Dropdown Component
 * Dropdown personalizado con estilos elegantes
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  minWidth?: string;
}

export function CustomDropdown({ value, onChange, options, placeholder, minWidth = '160px' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50 transition-all cursor-pointer text-sm shadow-sm flex items-center justify-between"
        style={{ minWidth: `clamp(120px, 40vw, ${minWidth})` }}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-[9999] overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2.5 cursor-pointer text-sm transition-colors border-b border-gray-100 last:border-b-0 ${
                value === option.value
                  ? 'bg-blue-500 text-white font-medium'
                  : 'hover:bg-blue-100 text-gray-800'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
