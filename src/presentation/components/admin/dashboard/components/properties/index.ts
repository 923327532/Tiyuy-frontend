/**
 * Properties Components - Exportaciones centralizadas para cartera de publicaciones
 */

export { DashboardPropertiesDonut } from './DashboardPropertiesDonut';
export { DonutChart } from './DonutChart';
export { DonutLegend } from './DonutLegend';
export { STAGES, INACTIVE_SEGMENT, RADIUS, CIRCUMFERENCE } from './Config';
export { getTotalProperties, getSource, buildSegments } from './utils';
export type { DonutStage, DonutSegment } from './Config';