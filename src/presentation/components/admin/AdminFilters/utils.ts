import type {
  DateRangeValue,
  FilterValue,
} from './types';

export function isActiveValue(
  value: FilterValue | undefined,
): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Boolean(value.from || value.to);
  }

  return value !== undefined && value !== '';
}

export function asStringValue(
  value: FilterValue | undefined,
): string {
  return typeof value === 'string' ? value : '';
}

export function asArrayValue(
  value: FilterValue | undefined,
): string[] {
  return Array.isArray(value) ? value : [];
}

export function asRangeValue(
  value: FilterValue | undefined,
): DateRangeValue {
  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value;
  }

  return { from: '', to: '' };
}
