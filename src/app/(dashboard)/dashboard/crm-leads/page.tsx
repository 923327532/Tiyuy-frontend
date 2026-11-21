'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import {
  useReceivedLeads,
  useUnreadLeadsCount,
  useMarkLeadAsRead,
  useUpdateLeadStatus,
  getStatusLabel,
  getStatusColor,
  getStatusIcon,
  Lead
} from '@/presentation/hooks/useLeads';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import Link from 'next/link';
import { toast } from '@/presentation/store/toastStore';
import { AlignJustify, ChevronDown, ChevronRight, Download, Grid, Mail, MessageCircle, Phone } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  ALL: 'bg-[var(--text-muted)]',
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-yellow-500',
  SCHEDULED: 'bg-purple-500',
  NEGOTIATING: 'bg-orange-500',
  CLOSED_WON: 'bg-[var(--brand-primary)]',
  CLOSED_LOST: 'bg-[var(--text-muted)]',
};

// Function to get status options - static Spanish labels
const getStatusOptions = () => [
  { value: 'ALL', label: 'Todos', color: STATUS_COLORS.ALL },
  { value: 'NEW', label: 'Nuevo', color: STATUS_COLORS.NEW },
  { value: 'CONTACTED', label: 'Contactado', color: STATUS_COLORS.CONTACTED },
  { value: 'SCHEDULED', label: 'Agendado', color: STATUS_COLORS.SCHEDULED },
  { value: 'NEGOTIATING', label: 'Negociando', color: STATUS_COLORS.NEGOTIATING },
  { value: 'CLOSED_WON', label: 'Ganado', color: STATUS_COLORS.CLOSED_WON },
  { value: 'CLOSED_LOST', label: 'Perdido', color: STATUS_COLORS.CLOSED_LOST },
];

// NOTA: El Sidebar se hereda del layout padre (dashboard/layout.tsx)
// No duplicar sidebar aquí

// Stat Card Component (estilo Creatio) - Responsive
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  trend
}: { 
  title: string; 
  value: number | string; 
  subtitle?: string;
  icon: string; 
  color: string;
  trend?: { value: number; positive: boolean };
}) {
  const iconMap: Record<string, string> = {
    'Users': '👥',
    'Fire': '🔥',
    'Handshake': '🤝',
    'Chart': '📊',
  };
  const displayIcon = iconMap[icon] || '📋';

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-3">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-[var(--text-muted)] mb-0.5 truncate">{title}</p>
          <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">{value}</h3>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${color}20` }}>
          <span style={{ color: color }}>{displayIcon}</span>
        </div>
      </div>
      {subtitle && (
        <p className="text-[11px] text-[var(--text-muted)] truncate">{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[11px] font-medium ${trend.positive ? 'text-[var(--brand-primary)]' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Pipeline Funnel Component
function PipelineFunnel({ leads }: { leads: Lead[] }) {
  const stages = [
    { status: 'NEW', label: 'Nuevo', color: 'bg-blue-500', width: '100%' },
    { status: 'CONTACTED', label: 'Contactado', color: 'bg-yellow-500', width: '85%' },
    { status: 'SCHEDULED', label: 'Visita Agendada', color: 'bg-purple-500', width: '70%' },
    { status: 'NEGOTIATING', label: 'Negociando', color: 'bg-orange-500', width: '55%' },
    { status: 'CLOSED_WON', label: 'Ganado', color: 'bg-green-500', width: '40%' },
  ];

  const getCount = (status: string) => leads.filter(l => l.status === status).length;
  const total = leads.length || 1;

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-4">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Pipeline de Leads</h3>
      <div className="space-y-2">
        {stages.map((stage) => {
          const count = getCount(stage.status);
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={stage.status} className="flex items-center gap-2">
              <div className="w-20 text-xs font-medium text-[var(--text-secondary)] flex-shrink-0">{stage.label}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-7 bg-[var(--bg-secondary)] rounded overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: count > 0 ? `${Math.max((count / Math.max(...stages.map(s => getCount(s.status)))) * 100, 10)}%` : '0%' }}
                    >
                      {count > 0 && (
                        <span className="text-white font-semibold text-xs">{count}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-10 flex-shrink-0">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Lead Row Component (tabla profesional)
function LeadRow({ 
  lead, 
  onMarkAsRead, 
  onStatusChange,
  isUpdating,
  statusOptions
}: { 
  lead: Lead; 
  onMarkAsRead: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  isUpdating: boolean;
  statusOptions: {value: string; label: string; color: string}[];
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <tr className={`border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors ${!lead.isRead ? 'bg-blue-50/30' : ''}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <UserAvatar 
            user={{ firstName: lead.interestedUserName || '', lastName: '' }} 
            size="sm" 
          />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--text-primary)] text-sm truncate">
              {lead.interestedUserName || 'Usuario Anonimo'}
              {!lead.isRead && (
                <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">{lead.contactEmail}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {lead.propertyCoverPhoto ? (
            <img 
              src={lead.propertyCoverPhoto} 
              alt={lead.propertyTitle}
              className="w-10 h-8 object-cover rounded flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-8 bg-[var(--bg-secondary)] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-base"></span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-[var(--text-primary)] text-xs truncate">{lead.propertyTitle}</p>
            <Link 
              href={`/property/${lead.propertySlug || lead.propertyId}`}
              target="_blank"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver →
            </Link>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={isUpdating}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)} transition-colors`}
          >
            <span>{getStatusIcon(lead.status)}</span>
            {getStatusLabel(lead.status)}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] z-20 py-1">
              <p className="px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] border-b border-[var(--border-light)]">
                Cambiar Estado
              </p>
              {statusOptions.filter(s => s.value !== 'ALL').map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(lead.id, status.value);
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2 ${
                    lead.status === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {lead.contactPhone && (
            <a
              href={`https://wa.me/${lead.contactPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={`mailto:${lead.contactEmail}`}
            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
            title="Email"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </td>

      <td className="px-4 py-3">
        <p className="text-xs text-[var(--text-secondary)]">
          {new Date(lead.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
          })}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {new Date(lead.createdAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {!lead.isRead && (
            <button
              onClick={() => onMarkAsRead(lead.id)}
              disabled={isUpdating}
              className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Leído
            </button>
          )}
          <button
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex-shrink-0"
            title="Ver Detalles"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Lead Card Component (vista de tarjetas) - Responsive
function LeadCard({ 
  lead, 
  onMarkAsRead, 
  onStatusChange,
  isUpdating,
  statusOptions
}: { 
  lead: Lead; 
  onMarkAsRead: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  isUpdating: boolean;
  statusOptions: {value: string; label: string; color: string}[];
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <div className={`bg-[var(--bg-card)] rounded-lg border-2 p-3 hover:shadow-md transition-all ${
      !lead.isRead ? 'border-blue-300 ring-1 ring-blue-100' : 'border-[var(--border-color)]'
    }`}>
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <UserAvatar 
            user={{ firstName: lead.interestedUserName || '', lastName: '' }} 
            size="sm" 
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">
              {lead.interestedUserName || 'Usuario Anonimo'}
              {!lead.isRead && (
                <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </h3>
            <p className="text-xs text-[var(--text-muted)] truncate">{lead.contactEmail}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)} flex-shrink-0`}>
          {getStatusIcon(lead.status)} {getStatusLabel(lead.status)}
        </span>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded p-2 mb-2">
        <div className="flex items-center gap-2">
          {lead.propertyCoverPhoto ? (
            <img 
              src={lead.propertyCoverPhoto} 
              alt={lead.propertyTitle}
              className="w-12 h-10 object-cover rounded flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-10 bg-[var(--bg-card)] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-xl"></span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-[var(--text-primary)] text-xs truncate">{lead.propertyTitle}</p>
            <Link 
              href={`/property/${lead.propertySlug || lead.propertyId}`}
              target="_blank"
              className="text-xs text-blue-600 hover:underline"
            >
              Ver →
            </Link>
          </div>
        </div>
      </div>

      {lead.message && (
        <div className="bg-yellow-50 border-l-2 border-yellow-400 p-2 rounded-r mb-2">
          <p className="text-xs text-yellow-800 italic line-clamp-2">
            &ldquo;{lead.message}&rdquo;
          </p>
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-2 text-xs text-[var(--text-muted)]">
        {lead.contactPhone && (
          <span className="flex items-center gap-1 truncate">
            <Phone className="w-3 h-3 flex-shrink-0" />
            {lead.contactPhone}
          </span>
        )}
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-2">
        {new Date(lead.createdAt).toLocaleString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <div className="flex items-center gap-1.5">
        {!lead.isRead && (
          <button
            onClick={() => onMarkAsRead(lead.id)}
            disabled={isUpdating}
            className="flex-1 px-2 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50 transition-colors truncate"
          >
            Leído
          </button>
        )}
        
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={isUpdating}
            className="px-2 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs font-medium rounded hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            Estado
          </button>

          {showStatusMenu && (
            <div className="absolute bottom-full right-0 mb-1 w-40 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] z-20 py-1">
              {statusOptions.filter(s => s.value !== 'ALL').map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(lead.id, status.value);
                    setShowStatusMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1 text-xs hover:bg-[var(--bg-secondary)] transition-colors ${
                    lead.status === status.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {lead.contactPhone && (
          <a
            href={`https://wa.me/${lead.contactPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// Main Page Component
export default function CRMLeadsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [lastCount, setLastCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const statusOptions = getStatusOptions();
  
  const { data: leadsData, isLoading, error } = useReceivedLeads();
  const { data: unreadData } = useUnreadLeadsCount();
  const markAsRead = useMarkLeadAsRead();
  const updateStatus = useUpdateLeadStatus();

  const unreadCount = unreadData?.unreadCount || 0;
  const leads = leadsData?.content || [];

  // New leads notification
  useEffect(() => {
    if (unreadCount > lastCount && lastCount > 0) {
      const newLeads = unreadCount - lastCount;
      toast.success(`${newLeads} nuevo${newLeads > 1 ? 's' : ''} lead${newLeads > 1 ? 's' : ''} recibido${newLeads > 1 ? 's' : ''}!`);
    }
    setLastCount(unreadCount);
  }, [unreadCount, lastCount]);

  // Filter leads
  const filteredLeads = selectedStatus === 'ALL' 
    ? leads 
    : leads.filter(lead => lead.status === selectedStatus);

  // Statistics
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    unread: leads.filter(l => !l.isRead).length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    negotiating: leads.filter(l => l.status === 'NEGOTIATING').length,
    won: leads.filter(l => l.status === 'CLOSED_WON').length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'CLOSED_WON').length / leads.length) * 100) : 0,
  };

  const handleMarkAsRead = (leadId: number) => {
    markAsRead.mutate(leadId);
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateStatus.mutate({ leadId, status: newStatus });
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-8 text-center m-4 sm:m-8">
          <div className="text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error cargando leads</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-[var(--bg-secondary)] min-h-full">
        <main>
          <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] sticky top-0 z-10">
            <div className="px-4 py-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">CRM Leads</h1>
                  <p className="text-xs text-[var(--text-muted)]">
                    Gestiona tus prospectos
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                        {unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-700 rounded border border-green-200">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">En vivo</span>
                  </div>
                  <button className="px-2.5 py-1.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard 
                title="Total Leads" 
                value={stats.total} 
                subtitle={`${stats.unread} no leido${stats.unread !== 1 ? 's' : ''}`}
                icon="Users" 
                color="#3b82f6"
                trend={{ value: 12, positive: true }}
              />
              <StatCard 
                title="Nuevos" 
                value={stats.new} 
                subtitle="Este mes"
                icon="Fire" 
                color="#f97316"
              />
              <StatCard 
                title="Negociando" 
                value={stats.negotiating} 
                subtitle="Oportunidades activas"
                icon="Handshake" 
                color="#a855f7"
              />
              <StatCard 
                title="Tasa de Conversion" 
                value={`${stats.conversionRate}%`}
                subtitle={`${stats.won} leads ganados`}
                icon="Chart" 
                color="#10b981"
                trend={{ value: 5, positive: true }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 overflow-hidden">
                <PipelineFunnel leads={leads} />
              </div>
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Actividad Reciente</h3>
                <div className="space-y-2">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-primary)] font-medium truncate">
                          Nuevo lead de {lead.interestedUserName || 'anonimo'}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(lead.createdAt).toLocaleString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <p className="text-xs text-[var(--text-muted)] text-center py-2">
                      Sin actividad reciente
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-[var(--text-secondary)] mr-1">Filtrar:</span>
                {statusOptions.map(status => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedStatus === status.value 
                        ? 'bg-[var(--text-primary)] text-[var(--bg-card)]' 
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {status.value !== 'ALL' && (
                      <span className={`w-1.5 h-1.5 rounded-full ${status.color}`}></span>
                    )}
                    {status.label}
                    <span className={`px-1 py-0 rounded text-xs ${
                      selectedStatus === status.value ? 'bg-white/20' : 'bg-white'
                    }`}>
                      {status.value === 'ALL' ? leads.length : leads.filter(l => l.status === status.value).length}
                    </span>
                  </button>
                ))}

                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Cargando leads...</p>
                </div>
              </div>
            )}

            {!isLoading && filteredLeads.length === 0 && (
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] p-8 text-center">
                <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl text-[var(--text-muted)]">Vacio</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                  {selectedStatus === 'ALL' ? 'No hay leads aun' : 'No hay leads en este estado'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  Los prospectos interesados en tus propiedades apareceran aqui automaticamente
                </p>
                {selectedStatus !== 'ALL' && (
                  <button
                    onClick={() => setSelectedStatus('ALL')}
                    className="mt-3 px-3 py-1.5 text-xs text-blue-600 font-medium hover:underline"
                  >
                    Ver todos los leads
                  </button>
                )}
              </div>
            )}

            {!isLoading && filteredLeads.length > 0 && viewMode === 'table' && (
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Lead
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Propiedad
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredLeads.map((lead) => (
                        <LeadRow
                          key={lead.id}
                          lead={lead}
                          onMarkAsRead={handleMarkAsRead}
                          onStatusChange={handleStatusChange}
                          isUpdating={markAsRead.isPending || updateStatus.isPending}
                          statusOptions={statusOptions}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoading && filteredLeads.length > 0 && viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onMarkAsRead={handleMarkAsRead}
                    onStatusChange={handleStatusChange}
                    isUpdating={markAsRead.isPending || updateStatus.isPending}
                    statusOptions={statusOptions}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}