/**
 * Summary Cards Component
 * Displays key metrics cards for the discounts dashboard
 */

import { Card } from '@/presentation/components/ui/Card';
import { DeveloperSubscriptionDiscountSummary } from '@/core/domain/entities/DeveloperSubscriptionDiscount';

interface SummaryCardsProps {
  summary: DeveloperSubscriptionDiscountSummary | null;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) return null;

  const cards = [
    { label: 'Total', value: summary.total, color: 'text-gray-900', bgColor: 'bg-gray-50', iconColor: 'text-gray-600' },
    { label: 'Activos', value: summary.active, color: 'text-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Inactivos', value: summary.inactive, color: 'text-gray-500', bgColor: 'bg-gray-50', iconColor: 'text-gray-500' },
    { label: 'Expirados', value: summary.expired, color: 'text-amber-600', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'Revocados', value: summary.revoked, color: 'text-red-600', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    { label: 'Agotados', value: summary.exhausted, color: 'text-rose-600', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">{card.label}</p>
          <p className="text-lg sm:text-xl font-bold {card.color} mt-1">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}