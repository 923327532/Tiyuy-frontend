/**
 * Estándar único de exportación Excel del panel TIYUY.
 * Todos los botones de exportación existentes usan este generador.
 */

import type { CellValue } from 'exceljs';

export type ModernExcelColumnType =
  | 'text' | 'integer' | 'number' | 'currency'
  | 'percent' | 'date' | 'datetime' | 'status';

export type ModernExcelStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface ModernExcelColumn<T> {
  header: string;
  type?: ModernExcelColumnType;
  value: (row: T) => unknown;
  /** Símbolo usado cuando type es currency. */
  currency?: 'S/' | '$';
  /** Incluye esta columna en la fila de totales con =SUM(...). */
  total?: boolean;
  /** Texto de la primera columna en la fila de totales. */
  totalLabel?: string;
  /** Ancho explícito; por defecto se calcula por contenido. */
  width?: number;
  /** Permite mapear estados propios a un color semántico. */
  statusTone?: (value: unknown, row: T) => ModernExcelStatusTone | undefined;
}

export interface ModernExcelExportOptions<T> {
  title: string;
  fileName: string;
  rows: T[];
  columns: ModernExcelColumn<T>[];
  sheetName?: string;
  /** Descripción legible de los filtros activos al exportar. */
  filters?: string | string[] | Record<string, unknown>;
  generatedAt?: Date;
}

const HEADER_FILL = 'FF0F172A';
const STRIPE_FILL = 'FFF8FAFC';
const BORDER_COLOR = 'FFE2E8F0';

const TONES: Record<ModernExcelStatusTone, { fill: string; font: string }> = {
  success: { fill: 'FFDCFCE7', font: 'FF166534' },
  warning: { fill: 'FFFEF3C7', font: 'FF92400E' },
  danger: { fill: 'FFFEE2E2', font: 'FF991B1B' },
  info: { fill: 'FFDBEAFE', font: 'FF1D4ED8' },
  neutral: { fill: 'FFF1F5F9', font: 'FF475569' },
};

function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function horizontalAlign(column: ModernExcelColumn<unknown>): 'left' | 'center' | 'right' {
  if (column.type === 'status') return 'center';
  if (['integer', 'number', 'currency', 'percent'].includes(column.type ?? 'text')) return 'right';
  return 'left';
}

function inferStatusTone(value: unknown): ModernExcelStatusTone {
  const text = String(value ?? '').trim().toLowerCase();
  if (/^(activo|activa|publicado|publicada|aprobado|aprobada|enabled|active|válido|válida|sí|si)$/.test(text)) return 'success';
  if (/pendiente|borrador|pausad|draft|pending|revisión|revision/.test(text)) return 'warning';
  if (/rechazad|expirad|suspendid|deshabilitad|inactiv|cancelad|inactive|disabled|no$/.test(text)) return 'danger';
  if (/info|recomendad|destacad/.test(text)) return 'info';
  return 'neutral';
}

function numberFormat(column: ModernExcelColumn<unknown>): string | undefined {
  switch (column.type) {
    case 'integer': return '#,##0';
    case 'number': return '#,##0.00';
    case 'currency': return `"${column.currency ?? 'S/'}" #,##0.00`;
    case 'percent': return '0.00"%"';
    case 'date': return 'dd mmm yyyy';
    case 'datetime': return 'dd mmm yyyy hh:mm';
    default: return undefined;
  }
}

function displayText(raw: unknown, column: ModernExcelColumn<unknown>): string {
  if (raw == null || raw === '') return '';
  if (column.type === 'date' || column.type === 'datetime') {
    const date = toDate(raw);
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      ...(column.type === 'datetime' ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(date);
  }
  if (['integer', 'number', 'currency', 'percent'].includes(column.type ?? '')) {
    return `${column.currency ?? ''}${toNumber(raw).toLocaleString('es-PE')}`;
  }
  return String(raw);
}

function resolveCellValue(raw: unknown, column: ModernExcelColumn<unknown>): CellValue {
  if (['integer', 'number', 'currency', 'percent'].includes(column.type ?? '')) return toNumber(raw);
  if (column.type === 'date' || column.type === 'datetime') return (toDate(raw) ?? '') as CellValue;
  return raw == null ? '' : String(raw);
}

function filterText(filters: ModernExcelExportOptions<unknown>['filters']): string {
  if (!filters) return 'Filtros activos: ninguno';
  if (Array.isArray(filters)) {
    const values = filters.filter(Boolean);
    return values.length ? `Filtros activos: ${values.join(' · ')}` : 'Filtros activos: ninguno';
  }
  if (typeof filters === 'string') return `Filtros activos: ${filters}`;
  const values = Object.entries(filters)
    .filter(([, value]) => value !== '' && value != null && value !== 'all' && value !== 'Todos')
    .map(([key, value]) => `${key}: ${value}`);
  return values.length ? `Filtros activos: ${values.join(' · ')}` : 'Filtros activos: ninguno';
}

function columnLetter(index: number): string {
  let letter = '';
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    current = Math.floor((current - 1) / 26);
  }
  return letter;
}

function estimateWidth<T>(column: ModernExcelColumn<T>, rows: T[]): number {
  const longest = rows.reduce((max, row) => {
    const length = displayText(column.value(row), column as ModernExcelColumn<unknown>).length;
    return Math.max(max, length);
  }, column.header.length);
  const minimum = column.type === 'date' || column.type === 'datetime' ? 14 : 10;
  return Math.min(48, Math.max(minimum, longest + 4));
}

function generatedAtText(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

/** Genera y descarga un XLSX con el diseño corporativo compartido. */
export async function exportToModernExcel<T>(options: ModernExcelExportOptions<T>): Promise<void> {
  const { title, fileName, rows, columns, sheetName = 'Reporte' } = options;
  if (columns.length === 0) throw new Error('El reporte no tiene columnas');

  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TIYUY';
  workbook.created = options.generatedAt ?? new Date();

  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 5, activeCell: 'A6' }],
  });
  const lastColumn = columns.length;
  const lastLetter = columnLetter(lastColumn);

  const titleRow = sheet.getRow(1);
  titleRow.height = 32;
  sheet.mergeCells(`A1:${lastLetter}1`);
  const titleCell = titleRow.getCell(1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 16, color: { argb: HEADER_FILL } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

  const subtitleRow = sheet.getRow(2);
  subtitleRow.height = 20;
  sheet.mergeCells(`A2:${lastLetter}2`);
  subtitleRow.getCell(1).value = `Generado: ${generatedAtText(options.generatedAt ?? new Date())}`;
  subtitleRow.getCell(1).font = { size: 10, color: { argb: 'FF64748B' } };

  const filtersRow = sheet.getRow(3);
  filtersRow.height = 20;
  sheet.mergeCells(`A3:${lastLetter}3`);
  filtersRow.getCell(1).value = filterText(options.filters as ModernExcelExportOptions<unknown>['filters']);
  filtersRow.getCell(1).font = { size: 10, italic: true, color: { argb: 'FF475569' } };

  sheet.getRow(4).height = 8;

  const headerRow = sheet.getRow(5);
  headerRow.height = 28;
  columns.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = column.header;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: horizontalAlign(column as ModernExcelColumn<unknown>), wrapText: true };
    cell.border = { bottom: { style: 'thin', color: { argb: BORDER_COLOR } } };
  });

  const firstDataRow = 6;
  rows.forEach((row, rowIndex) => {
    const sheetRow = sheet.getRow(firstDataRow + rowIndex);
    sheetRow.height = 20;
    columns.forEach((column, columnIndex) => {
      const raw = column.value(row);
      const cell = sheetRow.getCell(columnIndex + 1);
      cell.value = resolveCellValue(raw, column as ModernExcelColumn<unknown>);
      const format = numberFormat(column as ModernExcelColumn<unknown>);
      if (format) cell.numFmt = format;
      cell.alignment = { vertical: 'middle', horizontal: horizontalAlign(column as ModernExcelColumn<unknown>) };
      cell.font = { size: 10, color: { argb: HEADER_FILL } };
      cell.border = {
        top: { style: 'hair', color: { argb: BORDER_COLOR } },
        bottom: { style: 'hair', color: { argb: BORDER_COLOR } },
        left: { style: 'hair', color: { argb: BORDER_COLOR } },
        right: { style: 'hair', color: { argb: BORDER_COLOR } },
      };
      if (rowIndex % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STRIPE_FILL } };
      }
      if (column.type === 'status') {
        const tone = column.statusTone?.(raw, row) ?? inferStatusTone(raw);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TONES[tone].fill } };
        cell.font = { size: 10, bold: true, color: { argb: TONES[tone].font } };
      }
    });
  });

  const lastDataRow = firstDataRow + rows.length - 1;
  if (rows.length > 0) {
    sheet.autoFilter = {
      from: { row: 5, column: 1 },
      to: { row: lastDataRow, column: lastColumn },
    };
  }

  if (rows.length > 0 && columns.some((column) => column.total)) {
    const totalRow = sheet.getRow(lastDataRow + 1);
    totalRow.height = 24;
    columns.forEach((column, index) => {
      const cell = totalRow.getCell(index + 1);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      cell.font = { bold: true, size: 10, color: { argb: HEADER_FILL } };
      cell.border = { top: { style: 'medium', color: { argb: 'FFCBD5E1' } } };
      cell.alignment = { vertical: 'middle', horizontal: horizontalAlign(column as ModernExcelColumn<unknown>) };
      if (column.total) {
        const letter = columnLetter(index + 1);
        cell.value = { formula: `SUM(${letter}${firstDataRow}:${letter}${lastDataRow})` };
        const format = numberFormat(column as ModernExcelColumn<unknown>);
        if (format) cell.numFmt = format;
      } else if (index === 0) {
        cell.value = column.totalLabel ?? 'TOTAL';
      }
    });
  }

  columns.forEach((column, index) => {
    sheet.getColumn(index + 1).width = column.width ?? estimateWidth(column, rows);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
