'use client';

import { LABEL_STYLES } from '../constants';
import type { AdminFilterConfig, FilterValue } from '../types';
import {
  asArrayValue,
  asRangeValue,
  asStringValue,
} from '../utils';
import { FilterDate } from './FilterDate';
import { FilterDateRange } from './FilterDateRange';
import { FilterMultiSelect } from './FilterMultiSelect';
import { FilterSelect } from './FilterSelect';

interface FilterFieldProps {
  filter: AdminFilterConfig;
  value: FilterValue | undefined;
  onChange: (key: string, value: FilterValue | undefined) => void;
}

export function FilterField({
  filter,
  value,
  onChange,
}: FilterFieldProps) {
  const id = `admin-filter-${filter.key}`;

  return (
    <div className="min-w-0">
      {filter.type === 'daterange' ? (
        <span className={LABEL_STYLES}>{filter.label}</span>
      ) : (
        <label htmlFor={id} className={LABEL_STYLES}>
          {filter.label}
        </label>
      )}

      {filter.type === 'select' && (
        <FilterSelect
          id={id}
          label={filter.label}
          options={filter.options}
          value={asStringValue(value)}
          onChange={(nextValue) =>
            onChange(filter.key, nextValue)
          }
        />
      )}

      {filter.type === 'multiselect' && (
        <FilterMultiSelect
          id={id}
          label={filter.label}
          options={filter.options}
          value={asArrayValue(value)}
          onChange={(nextValues) =>
            onChange(filter.key, nextValues)
          }
        />
      )}

      {filter.type === 'date' && (
        <FilterDate
          id={id}
          value={asStringValue(value)}
          onChange={(nextValue) =>
            onChange(filter.key, nextValue)
          }
        />
      )}

      {filter.type === 'daterange' && (
        <FilterDateRange
          label={filter.label}
          value={asRangeValue(value)}
          onChange={(nextRange) =>
            onChange(filter.key, nextRange)
          }
        />
      )}
    </div>
  );
}
