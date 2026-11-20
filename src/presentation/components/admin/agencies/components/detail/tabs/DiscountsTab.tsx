'use client';

import { ChevronRight, Tag, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { InmobiliariaDiscount } from '@/core/domain/entities/Admin';
import type { DetailTabProps } from '@/presentation/components/admin/agencies/types/agencies.types';
import '../styles/DiscountsTab.css';

interface DiscountRowProps {
  discount: InmobiliariaDiscount;
  onClick: () => void;
}

function DiscountRow({ discount, onClick }: DiscountRowProps) {
  const isActive = discount.isValid && discount.status === 'ACTIVE' && (!discount.validUntil || new Date(discount.validUntil) >= new Date());

  return (
    <button
      type="button"
      onClick={onClick}
      className="agc-discount-row"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="agc-discount-row__code">
        <Tag className="w-4 h-4" aria-hidden="true" />
        <span className="agc-discount-row__code-value">{discount.code}</span>
      </div>
      <div className="agc-discount-row__info">
        <p className="agc-discount-row__percentage">{discount.discountPercent}% de descuento</p>
        <p className="agc-discount-row__validity">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          Válido: {discount.validFrom ? new Date(discount.validFrom).toLocaleDateString('es-PE') : '—'}
          {discount.validUntil ? ` — ${new Date(discount.validUntil).toLocaleDateString('es-PE')}` : ' — Sin expiración'}
        </p>
      </div>
      <div className="agc-discount-row__status">
        <span className={`agc-discount-row__badge ${isActive ? 'agc-discount-row__badge--active' : 'agc-discount-row__badge--inactive'}`}>
          {isActive ? (
            <>
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              Activo
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" aria-hidden="true" />
              Inactivo
            </>
          )}
        </span>
        <ChevronRight className="agc-discount-row__chevron w-4 h-4" aria-hidden="true" />
      </div>
    </button>
  );
}

export function DiscountsTab({ discounts }: DetailTabProps) {
  const handleViewDiscount = (discount: InmobiliariaDiscount) => {
    // TODO: Implement discount detail view
    console.log('View discount:', discount);
  };

  return (
    <div className="agc-discounts-tab">
      {discounts.length === 0 ? (
        <div className="agc-discounts-tab__empty">
          <Tag className="w-12 h-12 text-slate-300" aria-hidden="true" />
          <p className="agc-discounts-tab__empty-title">No hay descuentos</p>
          <p className="agc-discounts-tab__empty-text">Esta inmobiliaria no tiene códigos de descuento registrados.</p>
        </div>
      ) : (
        <div className="agc-discounts-tab__list" role="list">
          {discounts.map((discount) => (
            <DiscountRow
              key={discount.id}
              discount={discount}
              onClick={() => handleViewDiscount(discount)}
            />
          ))}
        </div>
      )}
    </div>
  );
}