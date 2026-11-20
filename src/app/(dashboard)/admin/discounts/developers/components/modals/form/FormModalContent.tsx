/**
 * Form modal shell for creating/editing developer subscription discounts
 */

import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { X, RefreshCw } from 'lucide-react';
import { DeveloperSubscriptionDiscountFormModalProps } from './formConfig';
import { useDiscountForm } from './useDiscountForm';
import DeveloperPickerField from './DeveloperPickerField';
import DiscountFormFields from './DiscountFormFields';

export default function FormModalContent({
  isOpen,
  onClose,
  editingDiscount,
  onSubmit,
  isPending,
}: DeveloperSubscriptionDiscountFormModalProps) {
  const {
    formData,
    setFormData,
    errors,
    developerSearch,
    setDeveloperSearch,
    showDeveloperDropdown,
    setShowDeveloperDropdown,
    filteredDevelopers,
    handleSubmit,
    handleDeveloperSelect,
  } = useDiscountForm({ isOpen, onClose, editingDiscount, onSubmit, isPending });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl p-0 max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-teal-800 font-bold text-base sm:text-lg">D</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-white truncate">
                  {editingDiscount ? 'Editar Descuento de Suscripción' : 'Crear Descuento de Suscripción'}
                </h3>
                <p className="text-[10px] sm:text-xs text-teal-100 truncate">
                  Descuento directo para contratación/renovación de planes de inmobiliaria
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-teal-600 rounded-lg transition-colors text-white flex-shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          <DeveloperPickerField
            developerSearch={developerSearch}
            setDeveloperSearch={setDeveloperSearch}
            showDeveloperDropdown={showDeveloperDropdown}
            setShowDeveloperDropdown={setShowDeveloperDropdown}
            filteredDevelopers={filteredDevelopers}
            onSelect={handleDeveloperSelect}
            onClearSelection={() => setFormData(prev => ({ ...prev, developerId: '' }))}
            error={errors.developerId}
            disabled={!!editingDiscount}
          />
          <DiscountFormFields formData={formData} setFormData={setFormData} errors={errors} />

          {/* Footer */}
          <div className="flex gap-3 sm:gap-4 pt-4 border-t border-gray-200 flex-shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-2.5 text-sm font-medium">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-sm font-medium shadow-lg shadow-teal-500/30"
            >
              {isPending ? (
                <span className="flex items-center gap-2 justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Guardando...
                </span>
              ) : editingDiscount ? (
                'Actualizar Descuento'
              ) : (
                'Crear Descuento'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
