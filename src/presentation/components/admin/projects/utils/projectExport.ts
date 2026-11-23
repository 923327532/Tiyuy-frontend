import type { ProjectAdminItem } from '@/core/domain/entities/Admin';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  ACTIVE: 'Activo',
  PAUSED: 'Pausado',
  COMPLETED: 'Completado',
  SUSPENDED: 'Suspendido',
  CANCELLED: 'Cancelado',
};

const COLUMNS: ModernExcelColumn<ProjectAdminItem>[] = [
  { header: 'ID', type: 'integer', value: (p) => p.id, totalLabel: 'TOTAL' },
  { header: 'Nombre del Proyecto', value: (p) => p.name },
  { header: 'Desarrollador', value: (p) => p.developerName ?? '' },
  { header: 'Email del Desarrollador', value: (p) => p.developerEmail ?? '' },
  { header: 'Tipo', value: (p) => p.type },
  { header: 'Estado', type: 'status', value: (p) => STATUS_LABELS[p.status] ?? p.status },
  { header: 'Ciclo de Vida', value: (p) => p.lifecycleStatus },
  { header: 'Fase', value: (p) => p.phase },
  { header: 'Precio Mínimo', type: 'currency', value: (p) => p.priceRange?.min ?? 0 },
  { header: 'Precio Máximo', type: 'currency', value: (p) => p.priceRange?.max ?? 0 },
  { header: 'Unidades Totales', type: 'integer', value: (p) => p.totalUnits ?? 0, total: true },
  { header: 'Unidades Vendidas', type: 'integer', value: (p) => p.soldUnits ?? 0, total: true },
  { header: 'Unidades Disponibles', type: 'integer', value: (p) => p.availableUnits ?? 0, total: true },
  { header: 'Avance Construcción', type: 'percent', value: (p) => p.constructionProgress ?? 0 },
  { header: 'Vistas', type: 'integer', value: (p) => p.viewsCount ?? 0, total: true },
  { header: 'Destacado', type: 'status', value: (p) => (p.isFeatured ? 'Sí' : 'No') },
  { header: 'Fecha de Creación', type: 'date', value: (p) => p.createdAt ?? '' },
];

export function exportProjectsExcel(
  projects: ProjectAdminItem[],
  filters?: Record<string, unknown>
): void {
  if (projects.length === 0) return;
  void exportToModernExcel({
    title: 'Reporte de Proyectos — TIYUY',
    fileName: `proyectos_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Proyectos',
    rows: projects,
    columns: COLUMNS,
    filters,
  });
}
