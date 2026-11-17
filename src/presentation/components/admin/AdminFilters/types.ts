export interface FilterOption {
  value: string;
  label: string;
}

export interface DateRangeValue {
  from: string;
  to: string;
}

export type FilterValue = string | string[] | DateRangeValue;

export type AdminFilterType =
  | 'select'
  | 'multiselect'
  | 'date'
  | 'daterange';

export interface AdminFilterConfig {
  key: string;
  label: string;
  type: AdminFilterType;
  options?: FilterOption[];
  value?: FilterValue;
}

export interface AdminFiltersProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Record<string, FilterValue>) => void;
  searchPlaceholder?: string;
  filters?: AdminFilterConfig[];
  onClear?: () => void;
}
