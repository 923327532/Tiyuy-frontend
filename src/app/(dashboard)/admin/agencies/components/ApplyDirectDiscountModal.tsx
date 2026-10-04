import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { DeveloperDiscountTarget } from '@/core/domain/entities/Admin';
import { X } from 'lucide-react';

interface DirectDiscount {
  discountPercentage: string;
  reason: string;
  notifyAgency: boolean;
  applyToAllAgents: boolean;
  maxAgents: string;
  expiresAt: string;
}

interface ApplyDirectDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgency: DeveloperDiscountTarget | null;
  directDiscount: DirectDiscount;
  setDirectDiscount: (discount: DirectDiscount) => void;
  onApply: () => void;
  isPending: boolean;
}

export default function ApplyDirectDiscountModal({
  isOpen,
  onClose,
  selectedAgency,
  directDiscount,
  setDirectDiscount,
  onApply,
  isPending
}: ApplyDirectDiscountModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 ring-1 ring-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Aplicar Descuento Directo</h3>
                <p className="text-xs text-white/80">
                  Para: {selectedAgency?.name} (RUC: {selectedAgency?.ruc})
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/15 rounded-lg transition-colors text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>⚠️ Nota:</strong> Este descuento se aplicará directamente al plan actual de la inmobiliaria. 
              El descuento será inmediato y afectará el próximo cobro.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Porcentaje de Descuento (%)</label>
            <div className="relative">
              <input
                type="number" min="0.01" max="100" step="0.01"
                value={directDiscount.discountPercentage}
                onChange={(e) => setDirectDiscount({ ...directDiscount, discountPercentage: e.target.value })}
                placeholder="Ej: 15"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 font-bold text-sm">%</span>
            </div>
            <p className="text-[10px] text-gray-500">
              Plan actual: <span className="font-semibold">{selectedAgency?.currentPlan || 'Sin plan'}</span>
              <br />
              Ingresos últimos 30 días: <span className="font-semibold">S/ {selectedAgency?.revenue30Days?.toLocaleString() || '0'}</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Motivo del Descuento</label>
            <textarea
              value={directDiscount.reason}
              onChange={(e) => setDirectDiscount({ ...directDiscount, reason: e.target.value })}
              placeholder="Ej: Descuento por fidelidad, compensación por servicio, promoción especial..."
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-[10px] text-gray-500">Este motivo quedará registrado en el historial de la inmobiliaria</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={directDiscount.notifyAgency}
              onChange={(e) => setDirectDiscount({ ...directDiscount, notifyAgency: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Notificar a la inmobiliaria por email</span>
          </label>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="applyToAllAgents"
                checked={directDiscount.applyToAllAgents}
                onChange={(e) => setDirectDiscount({ ...directDiscount, applyToAllAgents: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="applyToAllAgents" className="text-xs font-semibold text-gray-700 block">
                  Aplicar descuento a todos los agentes de esta inmobiliaria
                </label>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  El descuento se asignará automáticamente a cada agente activo
                </p>
              </div>
            </div>

            {directDiscount.applyToAllAgents && (
              <div className="mt-3 ml-7 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Cantidad máxima de agentes</label>
                  <input
                    type="number" min="1"
                    value={directDiscount.maxAgents}
                    onChange={(e) => setDirectDiscount({ ...directDiscount, maxAgents: e.target.value })}
                    placeholder="Ej: 15 (vacío = todos)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-gray-500">
                    Máximo de agentes que pueden acceder a este descuento
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Fecha de expiración</label>
                  <input
                    type="datetime-local"
                    value={directDiscount.expiresAt}
                    onChange={(e) => setDirectDiscount({ ...directDiscount, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-gray-500">Después de esta fecha, el descuento no podrá ser usado</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium">
            Cancelar
          </Button>
          <Button
            onClick={onApply}
            disabled={isPending || !directDiscount.discountPercentage || !directDiscount.reason}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30"
          >
            {isPending ? 'Aplicando...' : 'Aplicar Descuento'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
