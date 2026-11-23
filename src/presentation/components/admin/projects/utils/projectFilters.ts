import type { ProjectAdminItem } from '@/core/domain/entities/Admin';

export interface ProjectsFilterCriteria {
  lifecycleFilter: string;
  typeFilter: string;
  locationFilter: string;
  maxPrice: number;
  unitsFilter: string;
}

export const EMPTY_PROJECTS_FILTERS: ProjectsFilterCriteria = {
  lifecycleFilter: '',
  typeFilter: '',
  locationFilter: '',
  maxPrice: 0,
  unitsFilter: '',
};

function matchesUnits(project: ProjectAdminItem, units: string): boolean {
  const total = project.totalUnits ?? 0;
  if (units === '1-10') return total >= 1 && total <= 10;
  if (units === '11-50') return total >= 11 && total <= 50;
  if (units === '51-100') return total >= 51 && total <= 100;
  if (units === '100+') return total > 100;
  return true;
}

export function filterProjects(
  projects: ProjectAdminItem[],
  criteria: ProjectsFilterCriteria
): ProjectAdminItem[] {
  return projects.filter((project) => {
    const price = project.priceRange?.min ?? 0;
    return (
      (!criteria.lifecycleFilter || project.lifecycleStatus === criteria.lifecycleFilter) &&
      (!criteria.typeFilter || project.type === criteria.typeFilter) &&
      (!criteria.locationFilter ||
        project.city === criteria.locationFilter ||
        project.district === criteria.locationFilter) &&
      (!criteria.maxPrice || price <= criteria.maxPrice) &&
      matchesUnits(project, criteria.unitsFilter)
    );
  });
}

export function hasAdvancedFilters(criteria: ProjectsFilterCriteria): boolean {
  return (
    Boolean(criteria.lifecycleFilter) ||
    Boolean(criteria.typeFilter) ||
    Boolean(criteria.locationFilter) ||
    criteria.maxPrice > 0 ||
    Boolean(criteria.unitsFilter)
  );
}
