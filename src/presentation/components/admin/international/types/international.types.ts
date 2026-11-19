import type { InternationalStatusFilter } from '../config/international.constants';

export interface InternationalCounts {
  ALL: number;
  PENDING: number;
  VERIFIED: number;
  REJECTED: number;
}

export interface InternationalFiltersState {
  statusFilter: InternationalStatusFilter;
}
