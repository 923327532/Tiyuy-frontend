'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { PromotionCampaign } from '@/core/domain/entities/Admin';
import {
  useMarketingStats,
  useNotifyCampaignOwner,
  usePromotionCampaigns,
} from '@/presentation/hooks/useAdmin';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import {
  CAMPAIGN_STATUS_LABELS,
  EMPTY_CAMPAIGNS_FILTERS,
  hasCampaignAdvancedFilters,
  type CampaignsFilterCriteria,
} from '../config/campaigns.config';
import { exportCampaignsExcel } from '../utils/campaignExport';
import { useCampaignsActions, type CampaignModerationAction } from './useCampaignsActions';

const SEARCH_DEBOUNCE_MS = 300;

export function useCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilterState] = useState('all');
  const [advanced, setAdvanced] = useState<CampaignsFilterCriteria>(EMPTY_CAMPAIGNS_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedCampaigns, setSelectedCampaigns] = useState<PromotionCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionCampaign | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [action, setAction] = useState<CampaignModerationAction | null>(null);
  const [reason, setReason] = useState('');
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const { hasPermission } = usePermissions();
  const canModerate = hasPermission('COMMUNICATIONS_MANAGE');

  // La búsqueda viaja al backend solo después de la pausa, evitando una request por tecla.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setKeyword(searchQuery.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const { data: campaignsData, isLoading, refetch, error } = usePromotionCampaigns({
    page: currentPage - 1,
    size: pageSize,
    keyword: keyword || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    promotionType: advanced.promotionType !== 'all' ? advanced.promotionType : undefined,
    ownerRole: advanced.ownerRole !== 'all' ? advanced.ownerRole : undefined,
    startDateFrom: advanced.startDateFrom || undefined,
    startDateTo: advanced.startDateTo || undefined,
  });
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useMarketingStats();
  const notifyOwner = useNotifyCampaignOwner();

  const actions = useCampaignsActions({
    refetch: () => {
      void refetch();
      void refetchStats();
    },
    closeAction: () => setAction(null),
  });

  const campaigns = campaignsData?.content ?? [];
  const hasFilter = Boolean(keyword) || statusFilter !== 'all' || hasCampaignAdvancedFilters(advanced);
  const errorMessage = error instanceof Error ? error.message : undefined;

  const setStatusFilter = (value: string) => {
    setStatusFilterState(value);
    setCurrentPage(1);
  };

  const setAdvancedField = (field: keyof CampaignsFilterCriteria, value: string) => {
    setAdvanced((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setKeyword('');
    setStatusFilterState('all');
    setAdvanced(EMPTY_CAMPAIGNS_FILTERS);
    setCurrentPage(1);
  };

  const handleViewCampaign = (campaign: PromotionCampaign) => {
    setSelectedCampaign(campaign);
    setIsViewModalOpen(true);
  };

  const handleRequestAction = (
    campaign: PromotionCampaign,
    nextAction: CampaignModerationAction
  ) => {
    setSelectedCampaign(campaign);
    setAction(nextAction);
    setReason('');
  };

  const handleConfirmAction = (confirmReason: string) => {
    if (!selectedCampaign || !action) return;
    void actions.handleAction(selectedCampaign, action, confirmReason);
  };

  const handleDetailAction = (nextAction: CampaignModerationAction) => {
    if (selectedCampaign) handleRequestAction(selectedCampaign, nextAction);
  };

  const handleRequestNotify = () => {
    if (selectedCampaign) setIsNotifyOpen(true);
  };

  const handleNotify = (subject: string, message: string, includeDetails: boolean) => {
    if (!selectedCampaign) return;
    const recipient = selectedCampaign.ownerName || 'el anunciante';
    notifyOwner
      .mutateAsync({
        id: selectedCampaign.id,
        request: { subject, message, includeDetails },
      })
      .then(() => {
        setIsNotifyOpen(false);
        toast.success('Notificación enviada', { description: `Correo enviado a ${recipient}` });
      })
      .catch((error: any) => {
        toast.error('No se pudo enviar la notificación', { description: error?.message });
      });
  };

  const handleExport = () => {
    const toExport = selectedCampaigns.length > 0 ? selectedCampaigns : campaigns;
    if (toExport.length === 0) {
      toast.error('No hay campañas para exportar');
      return;
    }
    void exportCampaignsExcel(toExport, {
      Búsqueda: keyword,
      Estado: statusFilter === 'all' ? '' : CAMPAIGN_STATUS_LABELS[statusFilter] ?? statusFilter,
      Tipo: advanced.promotionType === 'all' ? '' : advanced.promotionType,
      Anunciante: advanced.ownerRole === 'all' ? '' : advanced.ownerRole,
      'Desde': advanced.startDateFrom,
      'Hasta': advanced.startDateTo,
    });
    toast.success('Campañas exportadas', {
      description: `${toExport.length} campañas descargadas en Excel`,
    });
  };

  const handleRefresh = () => {
    void refetch();
    void refetchStats();
  };

  const resetKey = useMemo(
    () => `${selectedCampaign?.id ?? 0}-${action ?? 'none'}`,
    [selectedCampaign, action]
  );

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    advanced,
    setAdvancedField,
    showAdvancedFilters,
    setShowAdvancedFilters,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedCampaigns,
    setSelectedCampaigns,
    selectedCampaign,
    isViewModalOpen,
    setIsViewModalOpen,
    action,
    setAction,
    reason,
    setReason,
    isNotifyOpen,
    setIsNotifyOpen,
    isNotifying: notifyOwner.isPending,
    resetKey,
    canModerate,
    campaigns,
    stats,
    statsLoading,
    isLoading,
    error: errorMessage,
    totalElements: campaignsData?.totalElements ?? 0,
    hasFilter,
    pending: actions.pending,
    handleClearFilters,
    handleViewCampaign,
    handleRequestAction,
    handleDetailAction,
    handleConfirmAction,
    handleRequestNotify,
    handleNotify,
    handleExport,
    handleRefresh,
    refetch: handleRefresh,
  };
}
