'use client';

import React from 'react';
import { 
  X, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Eye,
  BarChart3,
  Calendar,
  Crown,
  UserX
} from 'lucide-react';
import {
  useChannelStatistics,
  useChannelCollaborators,
  useRevokePublishingPermission,
  type ChannelCollaborator,
} from '@/presentation/hooks/useContacts';
import { toast } from '@/presentation/store/toastStore';

interface ChannelStatisticsModalProps {
  channelId: number;
  channelName: string;
  isOpen: boolean;
  onClose: () => void;
  isChannelAdmin: boolean;
}

export function ChannelStatisticsModal({
  channelId,
  channelName,
  isOpen,
  onClose,
  isChannelAdmin,
}: ChannelStatisticsModalProps) {
  const { data: statistics, isLoading: statsLoading } = useChannelStatistics(channelId);
  const { data: collaborators, isLoading: collaboratorsLoading } = useChannelCollaborators(channelId);
  const revokePermission = useRevokePublishingPermission();

  if (!isOpen) return null;

  const handleRevoke = async (userId: number) => {
    try {
      await revokePermission.mutateAsync({ channelId, userId });
    } catch (error) {
      // Error handled by hook
    }
  };

  // Calculate max values for chart scaling
  const maxPosts = statistics?.dailyActivity?.length 
    ? Math.max(...statistics.dailyActivity.map(d => d.posts), 1)
    : 1;
  const maxComments = statistics?.dailyActivity?.length 
    ? Math.max(...statistics.dailyActivity.map(d => d.comments), 1)
    : 1;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-brand text-white">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6" />
          <div>
            <h2 className="text-xl font-semibold">Estadísticas del Canal</h2>
            <p className="text-blue-100 text-sm">{channelName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : statistics ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5 text-brand" />}
                label="Suscriptores"
                value={statistics.subscriberCount}
                color="blue"
              />
              <StatCard
                icon={<Users className="w-5 h-5 text-green-600" />}
                label="Colaboradores"
                value={statistics.collaboratorCount}
                color="green"
              />
              <StatCard
                icon={<MessageSquare className="w-5 h-5 text-purple-600" />}
                label="Total Posts"
                value={statistics.totalPosts}
                color="purple"
              />
              <StatCard
                icon={<Eye className="w-5 h-5 text-orange-600" />}
                label="Comentarios"
                value={statistics.totalComments}
                color="orange"
              />
            </div>

            {/* Activity Chart */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-brand" />
                <h3 className="font-semibold text-gray-900">Actividad Diaria (Últimos 7 días)</h3>
              </div>

              {statistics.dailyActivity?.length > 0 ? (
                <div className="space-y-4">
                  {/* Posts Chart */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Posts publicados</span>
                      <span className="text-sm text-gray-500">
                        Total últimos 7 días: {statistics.postsLast7Days}
                      </span>
                    </div>
                    <div className="flex gap-2 h-24 items-end">
                      {statistics.dailyActivity.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-brand/100 rounded-t-lg transition-all hover:bg-brand"
                            style={{ 
                              height: `${Math.max((day.posts / maxPosts) * 100, 4)}%`,
                              minHeight: day.posts > 0 ? '4px' : '0'
                            }}
                          />
                          <span className="text-xs text-gray-500">
                            {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                          </span>
                          <span className="text-xs font-medium text-brand">{day.posts}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments Chart */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Comentarios recibidos</span>
                      <span className="text-sm text-gray-500">
                        Total últimos 7 días: {statistics.commentsLast7Days}
                      </span>
                    </div>
                    <div className="flex gap-2 h-24 items-end">
                      {statistics.dailyActivity.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-teal-500 rounded-t-lg transition-all hover:bg-teal-600"
                            style={{ 
                              height: `${Math.max((day.comments / maxComments) * 100, 4)}%`,
                              minHeight: day.comments > 0 ? '4px' : '0'
                            }}
                          />
                          <span className="text-xs text-gray-500">
                            {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
                          </span>
                          <span className="text-xs font-medium text-teal-600">{day.comments}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos de actividad disponibles</p>
              )}
            </div>

            {/* Active Users Info */}
            <div className="bg-brand/10 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand/20 rounded-lg">
                  <Users className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Usuarios activos últimos 7 días</p>
                  <p className="text-2xl font-bold text-brand">{statistics.activeUsersLast7Days}</p>
                </div>
              </div>
            </div>

            {/* Collaborators List with Revoke Option */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Administradores y Colaboradores</h3>
                {collaborators && (
                  <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {collaborators.length + 1} total
                  </span>
                )}
              </div>

              <div className="divide-y divide-gray-200">
                {collaboratorsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : collaborators && collaborators.length > 0 ? (
                  collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-semibold">
                        {collaborator.userAvatar ? (
                          <img
                            src={collaborator.userAvatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          collaborator.firstName?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {collaborator.firstName} {collaborator.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{collaborator.email}</p>
                        {collaborator.dni && (
                          <p className="text-xs text-gray-400">DNI: {collaborator.dni}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-brand/20 text-brand-dark text-xs rounded-full font-medium">
                          Colaborador
                        </span>
                        {isChannelAdmin && (
                          <button
                            onClick={() => handleRevoke(collaborator.userId)}
                            disabled={revokePermission.isPending}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                            title="Revocar permisos"
                          >
                            {revokePermission.isPending ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No hay colaboradores con permisos de publicación
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard
                label="Posts últimos 30 días"
                value={statistics.postsLast30Days}
                trend={statistics.postsLast7Days}
              />
              <SummaryCard
                label="Comentarios últimos 30 días"
                value={statistics.commentsLast30Days}
                trend={statistics.commentsLast7Days}
              />
              <SummaryCard
                label="Interacciones totales"
                value={statistics.dailyActivity?.reduce((sum, d) => sum + d.interactions, 0) || 0}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No se pudieron cargar las estadísticas
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-brand/10 border-blue-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
    orange: 'bg-orange-50 border-orange-100',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend?: number;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {trend !== undefined && (
        <p className="text-xs text-gray-500 mt-1">
          {trend} en los últimos 7 días
        </p>
      )}
    </div>
  );
}
