/**
 * Aplicador Universal de Descuentos.
 * Orquesta los cinco flujos sin duplicar lógica: cada modal vive en applier/.
 */

'use client';

import { useCallback, useState } from 'react';
import DiscountTypeSections from '@/presentation/components/admin/discounts/components/applier/DiscountTypeSections';
import type { DiscountType } from '@/presentation/components/admin/discounts/components/applier/discountTheme';
import GlobalDiscountModal from './applier/GlobalDiscountModal';
import UserDiscountModal from './applier/UserDiscountModal';
import ReusableDiscountModal from './applier/ReusableDiscountModal';
import AgentDiscountContent from './applier/AgentDiscountContent';
import AgencyDiscountContent from './applier/AgencyDiscountContent';

interface Props {
  onDiscountApplied?: () => void;
}

/** Punto de entrada del panel de descuentos. */
export default function UniversalDiscountApplier({ onDiscountApplied }: Props) {
  const [activeModal, setActiveModal] = useState<DiscountType | null>(null);

  const handleClose = useCallback(() => {
    setActiveModal(null);
    onDiscountApplied?.();
  }, [onDiscountApplied]);

  const isAgentModalOpen = activeModal === 'AGENT' || activeModal === 'PLAN';
  const isAgencyModalOpen = activeModal === 'AGENCY';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Aplicador Universal de Descuentos</h3>
        <p className="text-sm text-gray-500">Selecciona el tipo de descuento que deseas aplicar</p>
      </div>

      <DiscountTypeSections onSelect={setActiveModal} />

      <GlobalDiscountModal isOpen={activeModal === 'GLOBAL'} onClose={handleClose} />
      <UserDiscountModal isOpen={activeModal === 'USER'} onClose={handleClose} />
      {isAgentModalOpen && <AgentDiscountContent onClose={handleClose} />}
      {isAgencyModalOpen && <AgencyDiscountContent isOpen onClose={handleClose} />}
      <ReusableDiscountModal isOpen={activeModal === 'REUSABLE'} onClose={handleClose} />
    </div>
  );
}
