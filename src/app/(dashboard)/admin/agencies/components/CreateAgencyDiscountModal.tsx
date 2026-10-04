import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { DeveloperDiscountTarget } from '@/core/domain/entities/Admin';
import { X } from 'lucide-react';

interface NewDiscount {
  code: string;
  discountPercentage: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
}

interface CreateAgencyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgency: DeveloperDiscountTarget | null;
  newDiscount: NewDiscount;
  setNewDiscount: (discount: NewDiscount) => void;
  onCreate: () => void;
  isPending: boolean;
}

export default function CreateAgencyDiscountModal({
  isOpen,
  onClose,
  selectedAgency,
  newDiscount,
  setNewDiscount,
  onCreate,
  isPending
}: CreateAgencyDiscountModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-2xl p-0 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700 px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 ring-1 ring-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Crear Código de Descuento</h3>
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

        {/* Form scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Código de Descuento</label>
            <input
              type="text"
              value={newDiscount.code}
              onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
              placeholder="Ej: INMO20OFF"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-[10px] text-gray-500">Este código será único para esta inmobiliaria</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Porcentaje de Descuento (%)</label>
            <div className="relative">
              <input
                type="number" min="0.01" max="100" step="0.01"
                value={newDiscount.discountPercentage}
                onChange={(e) => setNewDiscount({ ...newDiscount, discountPercentage: e.target.value })}
                placeholder="Ej: 20"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 font-bold text-sm">%</span>
            </div>
            <p className="text-[10px] text-gray-500">Si el plan cuesta S/100, con 20% descuento costará S/80</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Inicio</label>
              <input
                type="date"
                value={newDiscount.startDate}
                onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Fecha Fin</label>
              <input
                type="date"
                value={newDiscount.endDate}
                onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Límite de Usos (opcional)</label>
            <input
              type="number" min="1"
              value={newDiscount.usageLimit}
              onChange={(e) => setNewDiscount({ ...newDiscount, usageLimit: e.target.value })}
              placeholder="Dejar vacío para ilimitado"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-gray-500">Cuántas veces puede usar este código la inmobiliaria</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium">
            Cancelar
          </Button>
          <Button
            onClick={onCreate}
            disabled={isPending}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30"
          >
            {isPending ? 'Creando...' : 'Crear Descuento'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
