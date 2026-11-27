'use client';

export interface PlanDiscountData {
  discountPercentage: string;
  customPrice: string;
  startDate: string;
  endDate: string;
}

export interface SelectedPlan {
  code: string;
  name: string;
  price: string;
  color: string;
}

interface Props {
  selectedPlan: SelectedPlan;
  planDiscount: PlanDiscountData;
  setPlanDiscount: (data: PlanDiscountData) => void;
}

const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700';
const inputClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15';

/** Formulario del descuento por plan, separado del contenedor del modal. */
export function PlanDiscountForm({ selectedPlan, planDiscount, setPlanDiscount }: Props) {
  const originalPrice = parseInt(selectedPlan.price.replace('S/', ''), 10) || 0;
  const savings = originalPrice - (planDiscount.customPrice ? parseFloat(planDiscount.customPrice) : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${selectedPlan.color}`}>
          {selectedPlan.code[0]}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{selectedPlan.name}</p>
          <p className="text-base font-bold text-slate-900">{selectedPlan.price}</p>
          <p className="text-[10px] text-slate-500">Precio original del plan</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Porcentaje de Descuento (%)</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="100"
            value={planDiscount.discountPercentage}
            onChange={(e) => {
              const percentage = e.target.value;
              const price = originalPrice * (1 - (parseFloat(percentage) || 0) / 100);
              setPlanDiscount({
                ...planDiscount,
                discountPercentage: percentage,
                customPrice: price > 0 ? price.toFixed(2) : '',
              });
            }}
            placeholder="Ej: 20"
            className={`${inputClass} pr-10 font-semibold tabular-nums`}
          />
          <span className="absolute right-3.5 top-2.5 text-sm font-bold text-slate-400">%</span>
        </div>
      </div>

      {planDiscount.discountPercentage && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
          <p className="text-xs text-slate-600">Precio con descuento:</p>
          <p className="text-lg font-bold text-emerald-700">S/{planDiscount.customPrice}</p>
          <p className="text-[10px] text-slate-500">Ahorro: S/{savings.toFixed(2)}</p>
        </div>
      )}

      <div>
        <label className={labelClass}>Duración del Descuento</label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '12h', hours: 12 },
            { label: '24h', hours: 24 },
            { label: '3d', hours: 72 },
            { label: '7d', hours: 168 },
            { label: '30d', hours: 720 },
          ].map((option) => (
            <button
              key={option.hours}
              type="button"
              onClick={() => {
                const start = new Date();
                const end = new Date(start.getTime() + option.hours * 60 * 60 * 1000);
                setPlanDiscount({
                  ...planDiscount,
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0],
                });
              }}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 transition-colors hover:border-emerald-500 hover:bg-emerald-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Fecha Inicio</label>
          <input
            type="datetime-local"
            value={planDiscount.startDate ? new Date(planDiscount.startDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setPlanDiscount({ ...planDiscount, startDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fecha Fin</label>
          <input
            type="datetime-local"
            value={planDiscount.endDate ? new Date(planDiscount.endDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setPlanDiscount({ ...planDiscount, endDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
