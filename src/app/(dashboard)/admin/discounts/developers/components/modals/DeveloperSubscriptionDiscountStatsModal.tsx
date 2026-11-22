/**
 * Developer Subscription Discount Stats Modal
 * View statistics for a specific developer
 */

import { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { LoadingState, EmptyState } from '@/presentation/components/admin/AdminUIStates';
import { X, Download, DollarSign, CreditCard, RefreshCw, TrendingUp, Users, Award } from 'lucide-react';
import { format } from 'date-fns';
import { DeveloperSubscriptionDiscountStats } from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import { InmobiliariaWithStats } from '@/core/domain/entities/Admin';
import { adminRepository } from '@/infrastructure/repositories/AdminRepository';

interface DeveloperSubscriptionDiscountStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: InmobiliariaWithStats | null;
}

export default function DeveloperSubscriptionDiscountStatsModal({
  isOpen,
  onClose,
  developer,
}: DeveloperSubscriptionDiscountStatsModalProps) {
  const [stats, setStats] = useState<DeveloperSubscriptionDiscountStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && developer) {
      fetchStats();
    }
  }, [isOpen, developer]);

  const fetchStats = async () => {
    if (!developer) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminRepository.getDeveloperSubscriptionDiscountStats(developer.id);
      setStats(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-2xl p-0 max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-teal-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-teal-800" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-white truncate">Estadísticas de Descuentos</h3>
                <p className="text-[10px] sm:text-xs text-teal-100 truncate">
                  {developer?.name}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-teal-600 rounded-lg transition-colors text-white flex-shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingState message="Cargando estadísticas..." />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-600">
              Error: {error}
              <Button variant="outline" size="sm" className="ml-2" onClick={fetchStats}>Reintentar</Button>
            </div>
          ) : !stats ? (
            <div className="flex items-center justify-center h-64">
              <EmptyState title="Sin estadísticas" description="No hay datos disponibles para esta inmobiliaria" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Total descuentos"
                  value={stats.totalDiscounts}
                  color="text-gray-900"
                  bgColor="bg-gray-50"
                  iconColor="text-gray-600"
                />
                <StatCard
                  icon={<Award className="h-5 w-5" />}
                  label="Activos"
                  value={stats.activeDiscounts}
                  color="text-emerald-600"
                  bgColor="bg-emerald-50"
                  iconColor="text-emerald-600"
                />
                <StatCard
                  icon={<RefreshCw className="h-5 w-5" />}
                  label="Total usos"
                  value={stats.totalUsage}
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                  iconColor="text-blue-600"
                />
                <StatCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  label="Usos este mes"
                  value={stats.currentMonthUsage}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                  iconColor="text-purple-600"
                />
              </div>

              {/* Amount Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  icon={<DollarSign className="h-5 w-5" />}
                  label="Descuento total PEN"
                  value={`S/${stats.totalDiscountGivenPen.toLocaleString()}`}
                  color="text-teal-700"
                  bgColor="bg-teal-50"
                  iconColor="text-teal-700"
                />
                <StatCard
                  icon={<DollarSign className="h-5 w-5" />}
                  label="Descuento total USD"
                  value={`$${stats.totalDiscountGivenUsd.toLocaleString()}`}
                  color="text-blue-700"
                  bgColor="bg-blue-50"
                  iconColor="text-blue-700"
                />
                <StatCard
                  icon={<DollarSign className="h-5 w-5" />}
                  label="Descuento mes PEN"
                  value={`S/${stats.currentMonthDiscountPen.toLocaleString()}`}
                  color="text-emerald-700"
                  bgColor="bg-emerald-50"
                  iconColor="text-emerald-700"
                />
                <StatCard
                  icon={<DollarSign className="h-5 w-5" />}
                  label="Descuento mes USD"
                  value={`$${stats.currentMonthDiscountUsd.toLocaleString()}`}
                  color="text-indigo-700"
                  bgColor="bg-indigo-50"
                  iconColor="text-indigo-700"
                />
              </div>

              {/* Developer Info */}
              <div className="bg-gray-50 rounded-lg p-4 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Información de la Inmobiliaria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] text-gray-400">Nombre</div>
                    <div className="font-medium text-gray-900">{developer?.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">RUC</div>
                    <div className="font-medium text-gray-900">{developer?.ruc || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Plan actual</div>
                    <div className="font-medium text-gray-900">{developer?.currentPlan || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Estado suscripción</div>
                    <div className="font-medium text-gray-900">{developer?.subscriptionStatus || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Agentes totales</div>
                    <div className="font-medium text-gray-900">{developer?.totalAgents}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Agentes activos</div>
                    <div className="font-medium text-gray-900">{developer?.activeAgents}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Ingresos 30 días</div>
                    <div className="font-medium text-gray-900">S/{developer?.revenue30Days?.toLocaleString() || '0'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400">Ingresos totales</div>
                    <div className="font-medium text-gray-900">S/{developer?.revenueTotal?.toLocaleString() || '0'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  iconColor: string;
}

function StatCard({ icon, label, value, color, bgColor, iconColor }: StatCardProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-3 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-lg font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
      </div>
    </div>
  );
}