export interface ProjectOption {
  value: string;
  label: string;
}

export const PROJECT_STATUS_OPTIONS: ProjectOption[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'PAUSED', label: 'Pausado' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'SUSPENDED', label: 'Suspendido' },
];

export const PROJECT_LIFECYCLE_OPTIONS: ProjectOption[] = [
  { value: '', label: 'Todos los ciclos' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PRE_SALE', label: 'Pre venta' },
  { value: 'SALE', label: 'En venta' },
  { value: 'CONSTRUCTION', label: 'En construcción' },
  { value: 'COMPLETED', label: 'Completado' },
];

export const PROJECT_TYPE_OPTIONS: ProjectOption[] = [
  { value: '', label: 'Todos los tipos' },
  { value: 'RESIDENTIAL', label: 'Residencial' },
  { value: 'COMMERCIAL', label: 'Comercial' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'MIXED_USE', label: 'Mixto' },
];

export const PROJECT_LOCATION_OPTIONS: ProjectOption[] = [
  { value: '', label: 'Todas las ubicaciones' },
  { value: 'Lima', label: 'Lima' },
  { value: 'Arequipa', label: 'Arequipa' },
  { value: 'Trujillo', label: 'Trujillo' },
  { value: 'Cusco', label: 'Cusco' },
];

export const PROJECT_UNITS_OPTIONS: ProjectOption[] = [
  { value: '', label: 'Todas' },
  { value: '1-10', label: '1 - 10' },
  { value: '11-50', label: '11 - 50' },
  { value: '51-100', label: '51 - 100' },
  { value: '100+', label: '100+' },
];
