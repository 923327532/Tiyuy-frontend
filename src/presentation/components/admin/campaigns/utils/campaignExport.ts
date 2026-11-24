/** Exportación Excel local, alineada con el resto del panel admin. */

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import {
  exportToModernExcel,
  type ModernExcelColumn,
} from '@/utils/modernExcelExport';
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_TYPE_LABELS } from '../config/campaigns.config';

const COLUMNS: ModernExcelColumn<PromotionCampaign>[] = [
  { header: 'ID', type: 'integer', value: (c) => c.id, totalLabel: 'TOTAL' },
  { header: 'Campaña', value: (c) => c.title },
  { header: 'Anunciante', value: (c) => c.ownerName || c.ownerRole || '-' },
  { header: 'Estado', type: 'status', value: (c) => CAMPAIGN_STATUS_LABELS[c.status] || c.status },
  { header: 'Tipo', value: (c) => CAMPAIGN_TYPE_LABELS[c.promotionType] || c.promotionType },
  { header: 'Inversión', type: 'currency', value: (c) => c.pricePaid ?? 0, total: true },
  { header: 'Impresiones', type: 'integer', value: (c) => c.impressions ?? 0, total: true },
  { header: 'Clics', type: 'integer', value: (c) => c.clicks ?? 0, total: true },
  { header: 'Conversiones', type: 'integer', value: (c) => c.conversions ?? 0, total: true },
  { header: 'Fecha inicio', type: 'date', value: (c) => c.startDate ?? '' },
  { header: 'Fecha fin', type: 'date', value: (c) => c.endDate ?? '' },
];

export function exportCampaignsExcel(
  campaigns: PromotionCampaign[],
  filters?: Record<string, unknown>
): void {
  if (campaigns.length === 0) return;
  void exportToModernExcel({
    title: 'Reporte de Campañas — TIYUY',
    fileName: `campanas_${new Date().toISOString().slice(0, 10)}`,
    sheetName: 'Campañas',
    rows: campaigns,
    columns: COLUMNS,
    filters,
  });
}
