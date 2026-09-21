'use client';

import { useState } from 'react';
import { HotLeadDTO, useHotLeads } from '@/presentation/hooks/useAgentCRM';
import { Flame, Phone, Mail, Eye, Download, Heart, ChevronLeft, ChevronRight, X, Building2, TrendingUp, Calendar, Clock } from 'lucide-react';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';

const ITEMS_PER_PAGE = 5;

export function HotLeadsPanel() {
  const { data: hotLeads, isLoading } = useHotLeads(30, 3);
  const [page, setPage] = useState(0);
  const [selectedLead, setSelectedLead] = useState<HotLeadDTO | null>(null);

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-orange-50 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Oportunidades Calientes</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[var(--bg-tertiary)] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!hotLeads?.length) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-orange-50 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Oportunidades Calientes</h3>
        </div>
        <p className="text-[var(--text-secondary)] text-center py-3 text-sm">No hay leads calientes detectados</p>
      </div>
    );
  }

  const totalPages = Math.ceil(hotLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = hotLeads.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-50 rounded-lg">
            <Flame className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Oportunidades Calientes</h3>
            <p className="text-xs text-[var(--text-muted)]">{hotLeads.length} leads detectados</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto">
        {paginatedLeads.map((lead, index) => (
          <div
            key={`${lead.clientId}-${lead.propertyId}-${index}`}
            onClick={() => setSelectedLead(lead)}
            className="block p-3 border border-[var(--border-color)] rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <UserAvatar 
                    user={{ firstName: lead.clientName, lastName: '' }} 
                    size="xs" 
                  />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{lead.clientName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">Score: {lead.score}</span>
                </div>
                
                <p className="text-xs text-[var(--text-secondary)] mb-1.5 truncate">{lead.propertyTitle}</p>
                
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                  {lead.clientPhone && (
                    <span className="flex items-center gap-0.5">
                      <Phone className="w-3 h-3" />
                      {lead.clientPhone}
                    </span>
                  )}
                  {lead.clientEmail && (
                    <span className="flex items-center gap-0.5">
                      <Mail className="w-3 h-3" />
                      {lead.clientEmail}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {lead.viewCount > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">
                      <Eye className="w-3 h-3" />
                      {lead.viewCount} vistas
                    </span>
                  )}
                  {lead.downloadedDocuments && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-blue-100 rounded text-blue-600">
                      <Download className="w-3 h-3" />
                      Docs
                    </span>
                  )}
                  {lead.contactRequested && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-green-100 rounded text-green-600">
                      <Phone className="w-3 h-3" />
                      Contacto
                    </span>
                  )}
                  {lead.savedToFavorites && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-pink-100 rounded text-pink-600">
                      <Heart className="w-3 h-3" />
                      Favorito
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3 h-3" />
            Anterior
          </button>
          <span className="text-xs text-[var(--text-muted)]">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Modal de detalle del lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="sm:px-6 px-4 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-gradient-to-r from-orange-50 to-[var(--bg-card)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Detalle del Lead</h3>
                  <p className="text-xs text-[var(--text-muted)]">Información completa de la oportunidad</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1 hover:bg-[var(--bg-tertiary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="sm:p-6 p-4 space-y-5">
              {/* Cliente info */}
              <div className="flex items-start gap-4">
                <UserAvatar 
                  user={{ firstName: selectedLead.clientName, lastName: '' }} 
                  size="md" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">{selectedLead.clientName}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(selectedLead.priority)}`}>
                      {selectedLead.priority}
                    </span>
                  </div>
                  {selectedLead.clientEmail && (
                    <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedLead.clientEmail}
                    </p>
                  )}
                  {selectedLead.clientPhone && (
                    <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedLead.clientPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Score y propiedad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
                  <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Score</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{selectedLead.score}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Puntuación de interés</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-color)]">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Vistas</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{selectedLead.viewCount}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Veces que vio la propiedad</p>
                </div>
              </div>

              {/* Propiedad */}
              <div>
                <div className="flex items-center gap-2 text-[var(--text-primary)] mb-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Propiedad de interés</span>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="font-medium text-[var(--text-primary)] text-sm">{selectedLead.propertyTitle}</p>
                  {selectedLead.lastViewAt && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Última vista: {new Date(selectedLead.lastViewAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Comportamiento */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">Comportamiento</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.contactRequested && (
                    <span className="flex items-center gap-1 text-[11px] px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium">
                      <Phone className="w-3 h-3" />
                      Solicitó contacto
                    </span>
                  )}
                  {selectedLead.downloadedDocuments && (
                    <span className="flex items-center gap-1 text-[11px] px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      <Download className="w-3 h-3" />
                      Descargó documentos
                    </span>
                  )}
                  {selectedLead.savedToFavorites && (
                    <span className="flex items-center gap-1 text-[11px] px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg font-medium">
                      <Heart className="w-3 h-3" />
                      Guardó en favoritos
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sm:px-6 px-4 py-4 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}