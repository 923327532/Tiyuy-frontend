/** Exportación Excel del panel de banners, alineada con Campañas/Usuarios. */

import type { Banner } from '@/core/domain/entities/Admin';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';
import { PLACEMENT_LABELS } from '../config/banners.config';
import {
  BANNER_STATUS_LABELS,
  getBannerStatus,
} from './bannerFormat';

const COLUMNS: ModernExcelColumn<Banner>[] = [
  { header: 'ID', type: 'integer', value: (banner) => banner.id, totalLabel: 'TOTAL' },
  { header: 'Banner', value: (banner) => banner.title },
  { header: 'Descripción', value: (banner) => banner.description ?? '' },
  { header: 'Ubicación', value: (banner) => PLACEMENT_LABELS[banner.placement] ?? banner.placement },
  {
    header: 'Modo',
    value: (banner) => (banner.displayMode === 'SOLO_BANNER' ? 'Individual' : 'Carrusel'),
  },
  { header: 'Estado', type: 'status', value: (banner) => BANNER_STATUS_LABELS[getBannerStatus(banner)] },
  { header: 'Impresiones', type: 'integer', value: (banner) => banner.impressions ?? 0, total: true },
  { header: 'Clics', type: 'integer', value: (banner) => banner.clicks ?? 0, total: true },
  { header: 'CTR', type: 'percent', value: (banner) => (banner.ctr ?? 0) },
  { header: 'Inicio', type: 'date', value: (banner) => banner.startDate },
  { header: 'Fin', type: 'date', value: (banner) => banner.endDate ?? '' },
  { header: 'Creado', type: 'datetime', value: (banner) => banner.createdAt },
];

export function exportBannersExcel(
  banners: Banner[],
  filters?: Record<string, unknown>
): void {
  if (banners.length === 0) return;

  void exportToModernExcel({
    title: 'Reporte de Banners Publicitarios — TIYUY',
    fileName: `banners_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Banners',
    rows: banners,
    columns: COLUMNS,
    filters,
  });
}
