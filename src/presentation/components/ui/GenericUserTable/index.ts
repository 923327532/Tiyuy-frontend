export { GenericUserTable } from './GenericUserTable';
export type {
  GenericUser,
  UserType,
  GenericColumn,
  GenericAction,
  UserTypeConfig,
  SearchConfig,
  GenericUserTableProps,
} from './types';
export {
  DEFAULT_REGULAR_SEARCH_CONFIG,
  DEFAULT_INTERNATIONAL_SEARCH_CONFIG,
} from './types';

// User type configurations
export {
  REGULAR_USER_CONFIG,
  INTERNATIONAL_USER_CONFIG,
  isInternationalUser,
  isRegularUser,
  getUserTypeConfig,
  createRegularUserActions,
  createInternationalUserActions,
  ROLE_LABELS,
  ROLE_BADGE_VARIANTS,
} from './userTypeConfigs';