'use client';

export const PLAN_COLORS = [
  { bar: 'bg-[#164E63]', background: 'bg-[#E0F2FE]' },
  { bar: 'bg-[#7183B8]', background: 'bg-[#E8EAF6]' },
  { bar: 'bg-[#61988C]', background: 'bg-[#DCEAE9]' },
  { bar: 'bg-[#8AA6B2]', background: 'bg-[#E8F0F3]' },
  { bar: 'bg-[#9AA8A0]', background: 'bg-[#EDF2EF]' },
];

export function percent(value?: number | null): string {
  return value === undefined || value === null ? '—' : `${value.toFixed(1)}%`;
}