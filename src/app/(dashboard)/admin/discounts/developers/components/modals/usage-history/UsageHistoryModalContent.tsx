/**
 * Usage history modal shell for developer subscription discounts
 */

import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { LoadingState, EmptyState } from '@/presentation/components/admin/AdminUIStates';
import { X, Download, RefreshCw } from 'lucide-react';
import { DiscountUsageHistory, DeveloperSubscriptionDiscount } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { PaginatedResponse } from '@/core/domain/repositories/IAdminRepository';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';
import { exportUsageHistory } from './usageHistoryExport';
import UsageHistoryTable from './UsageHistoryTable';

interface UsageHistoryModalContentProps {
  isOpen: boolean;
  onClose: () => void;
  discount: DeveloperSubscriptionDiscount | null;
}

export default function UsageHistoryModalContent({
  isOpen,
  onClose,
  discount,
}: UsageHistoryModalContentProps) {
  const [usageHistory, setUsageHistory] = useState<PaginatedResponse<DiscountUsageHistory> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    if (isOpen && discount) {
      fetchUsageHistory();
    }
  }, [isOpen, discount]);

  const fetchUsageHistory = async () => {
    if (!discount) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminRepository.getDeveloperSubscriptionDiscountUsageHistory(discount.id, currentPage, pageSize);
      setUsageHistory(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar historial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => exportUsageHistory(usageHistory, discount);

  if (!isOpen) return null;

  const totalPages = usageHistory?.totalPages || 0;
  const totalElements = usageHistory?.totalElements || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white rounded-2xl p-0 max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-teal-800" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-white truncate">Historial de Uso</h3>
                <p className="text-[10px] sm:text-xs text-teal-100 truncate">
                  Descuento ID: {discount?.id} • {discount?.developerName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {usageHistory?.content?.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  className="text-white hover:bg-teal-600"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar CSV
                </Button>
              )}
              <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-teal-600 rounded-lg transition-colors text-white flex-shrink-0">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingState message="Cargando historial..." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-600">
              Error: {error}
              <Button variant="outline" size="sm" className="ml-2" onClick={fetchUsageHistory}>Reintentar</Button>
            </div>
          ) : !usageHistory?.content?.length ? (
            <div className="flex items-center justify-center h-64">
              <EmptyState title="Sin historial de uso" description="Este descuento no ha sido utilizado aún" />
            </div>
          ) : (
            <UsageHistoryTable
              usageHistory={usageHistory}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalElements={totalElements}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
