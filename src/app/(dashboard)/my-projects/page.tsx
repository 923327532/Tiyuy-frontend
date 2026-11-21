'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, FolderKanban, CheckCircle2, TrendingUp, Hammer, Search, Building2, MapPin, DollarSign, Layers, MoreVertical, Eye, Edit2, Trash2, Star, Upload } from 'lucide-react';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import { useProjects } from '@/presentation/hooks/useProjects';
import { useActiveSubscription } from '@/presentation/hooks/useFinance';
import { TrialGuard } from '@/presentation/components/guards/TrialGuard/TrialGuard';
import { TrialWarningBanner } from '@/presentation/components/guards/TrialGuard/TrialWarningBanner';
import { PlanExpiredModal } from '@/presentation/components/modals/PlanExpiredModal';
import { toast } from '@/presentation/store/toastStore';
import { Footer } from '@/presentation/components/layout/Footer/Footer';

export default function MyProjectsPage() {
  const { user } = useAuthStore();
  const { myProjects, publishProject, featureProject, deleteProject } = useProjects();
  const { data: activeSubscription } = useActiveSubscription();
  const [activeTab, setActiveTab] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'COMPLETED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlanExpiredModal, setShowPlanExpiredModal] = useState(false);
  const [planExpiredMessage, setPlanExpiredMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  // Query para obtener proyectos
  const { data: projectsData, isLoading, refetch } = myProjects(currentPage, pageSize);

  // Mutations
  const publishMutation = publishProject();
  const featureMutation = featureProject();
  const deleteMutation = deleteProject();

  // Calculate if user can publish
  const publishedProjectsCount = useMemo(() => {
    return (projectsData?.content || []).filter((p: any) => p.status === 'PUBLISHED').length;
  }, [projectsData]);

  const canPublish = useMemo(() => {
    if (activeSubscription) {
      // Has plan: use plan logic (remainingPublications)
      return activeSubscription.remainingPublications > 0;
    }
    
    // WITHOUT SUBSCRIPTION: up to 1 FREE PUBLISHED project
    // Once user publishes 1 project, FREE is permanently blocked
    return publishedProjectsCount < 1;
  }, [activeSubscription, publishedProjectsCount]);


  // Function to publish project
  const handlePublish = async (projectId: number, status: string) => {
    if (status === 'DRAFT' && !canPublish) {
      setPlanExpiredMessage('Has alcanzado el límite de publicaciones de tu plan actual. Revisa los planes disponibles para publicar este proyecto.');
      setShowPlanExpiredModal(true);
      return;
    }
    try {
      await publishMutation.mutateAsync(projectId);
      toast.success('Proyecto publicado exitosamente!');
    } catch (error: any) {
      if (error.message?.includes('suscripción activa')) {
        setPlanExpiredMessage(status === 'PAUSED'
          ? 'Para reactivar este proyecto necesitas una suscripción ENTERPRISE. Revisa los planes disponibles para continuar.'
          : 'No tienes una suscripción activa para publicar este proyecto. Revisa los planes disponibles para continuar.');
        setShowPlanExpiredModal(true);
        return;
      }
      toast.error(error.message || 'Error al publicar proyecto');
    }
  };


  // Function to feature project
  const handleFeature = async (projectId: number) => {
    try {
      await featureMutation.mutateAsync({ projectId, featured: true });
      toast.success('Proyecto destacado exitosamente!');
    } catch (error: any) {
      toast.error(error.message || 'Error al destacar proyecto');
    }
  };

  // Function to delete project
  const handleDelete = async (projectId: number) => {
    if (!confirm('Estas seguro de eliminar este proyecto? Esta accion no se puede deshacer.')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(projectId);
      toast.success('Proyecto eliminado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar proyecto');
    }
  };

  const projects = projectsData?.content || [];
  const totalPages = projectsData?.totalPages || 0;
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'DRAFT':
        return matchesSearch && project.status === 'DRAFT';
      case 'PUBLISHED':
        return matchesSearch && project.status === 'PUBLISHED';
      case 'PAUSED':
        return matchesSearch && project.status === 'PAUSED';
      case 'COMPLETED':
        return matchesSearch && project.status === 'COMPLETED';
      default:
        return matchesSearch;
    }
  });

  const getStatusColor = (status: string, lifecycleStatus?: string, remainingGraceDays?: number) => {
    // Show amber for grace period
    if (lifecycleStatus === 'GRACE_PERIOD' && remainingGraceDays !== undefined && remainingGraceDays > 0) {
      return 'bg-amber-100 text-amber-800';
    }
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-amber-100 text-amber-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string, lifecycleStatus?: string, remainingGraceDays?: number) => {
    if (lifecycleStatus === 'GRACE_PERIOD' && remainingGraceDays !== undefined && remainingGraceDays > 0) {
      return `Pausado - ${remainingGraceDays} dias`;
    }
    switch (status) {
      case 'DRAFT': return 'Borrador';
      case 'PUBLISHED': return 'Publicado';
      case 'PAUSED': return 'Pausado';
      case 'COMPLETED': return 'Completado';
      default: return status;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'PRE_SALE': return 'bg-purple-100 text-purple-800';
      case 'SALE': return 'bg-orange-100 text-orange-800';
      case 'DELIVERY': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'PRE_SALE': return 'Pre-venta';
      case 'SALE': return 'En Venta';
      case 'DELIVERY': return 'Entrega';
      default: return phase;
    }
  };

  // In real estate context, we allow access to authorized users
  // Role-specific validation is handled at ProtectedRoute level

  return (
    <ProtectedRoute>

      <TrialGuard>
        <div className="min-h-screen bg-[var(--bg-secondary)] py-6">
          <div className="max-w-9xl mx-auto px-6 xl:px-12">
            {/* Trial warning banner */}
            <TrialWarningBanner />
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Mis Proyectos</h1>
                <p className="text-[var(--text-secondary)] mt-1">Administra tus proyectos inmobiliarios y desarrollos</p>
              </div>

              <Link
                href="/dashboard/projects/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] text-white font-semibold rounded-xl shadow-lg shadow-[var(--brand-primary)]/20 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                Nuevo Proyecto
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">Total Proyectos</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{projects.length}</p>
                </div>
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                  <FolderKanban className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">Publicados</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {projects.filter((p: any) => p.status === 'PUBLISHED').length}
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg shadow-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">Unidades Vendidas</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {projects.reduce((total: number, p: any) => total + (p.soldUnits || 0), 0)}
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">En Construcción</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {projects.filter((p: any) => p.phase === 'SALE').length}
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                  <Hammer className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>


          {/* Search and Tabs */}
          <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors"
                  />
                </div>
                <div className="overflow-x-auto scrollbar-none flex-1">
                  <div className="flex space-x-6 min-w-max">
                    {[
                      { key: 'ALL', label: 'Todos', count: projects.length },
                      { key: 'DRAFT', label: 'Borradores', count: projects.filter((p: any) => p.status === 'DRAFT').length },
                      { key: 'PUBLISHED', label: 'Publicados', count: projects.filter((p: any) => p.status === 'PUBLISHED').length },
                      { key: 'PAUSED', label: 'Pausados', count: projects.filter((p: any) => p.status === 'PAUSED').length },
                      { key: 'COMPLETED', label: 'Completados', count: projects.filter((p: any) => p.status === 'COMPLETED').length },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.key
                            ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                            : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary)]/20 mb-4">
                <div className="w-8 h-8 border-3 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-[var(--text-secondary)] font-medium">Cargando proyectos...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Building2 className="w-10 h-10 text-[var(--brand-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos aún'}</h3>
              <p className="text-[var(--text-tertiary)] mb-6 max-w-md mx-auto">{searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza creando tu primer proyecto inmobiliario y gestiona todo desde aquí'}</p>
              {!searchTerm && (
                <Link
                  href="/dashboard/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Crear Primer Proyecto
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project: any) => (
                <div key={project.id} className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden hover:shadow-lg hover:border-[var(--brand-primary)]/30 transition-all group">
                  {/* Project Image */}
                  <div className="aspect-video bg-[var(--bg-tertiary)] relative overflow-hidden">
                    {project.coverImageUrl ? (
                      <img
                        src={`/api/images/proxy?url=${encodeURIComponent(project.coverImageUrl)}`}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.error('Error loading project image:', project.coverImageUrl);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center w-full h-full"><svg class="w-12 h-12 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
                        <Building2 className="w-12 h-12 text-[var(--text-tertiary)]" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(project.status, project.lifecycleStatus, project.remainingGraceDays)}`}>
                        {getStatusText(project.status, project.lifecycleStatus, project.remainingGraceDays)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${getPhaseColor(project.phase)}`}>
                        {getPhaseText(project.phase)}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1.5 line-clamp-1 text-lg">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-2.5 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="text-[var(--text-secondary)] truncate">{project.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="text-[var(--text-secondary)]">{project.totalUnits} unidades</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="text-[var(--text-secondary)]">Desde S/ {project.priceFrom?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                        <span className="text-[var(--text-secondary)] truncate">{project.district}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[var(--border-color)]">
                      {/* Debug to verify project status */}
                      <div className="text-xs text-red-600 mb-2 hidden">
                        DEBUG: status={project.status}, isFeatured={project.isFeatured}
                      </div>
                      
                      {/* Primary action button */}
                      <div className="flex gap-2 mb-2">
                        <Link
                          href={project.status === 'DRAFT' ? `/dashboard/projects/${project.id}/edit` : `/projects/detail/${project.slug}`}
                          target={project.status === 'DRAFT' ? '_self' : '_blank'}
                          className="flex-1 text-center px-3 py-2.5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] text-white rounded-lg hover:shadow-md text-sm font-medium flex items-center justify-center gap-1.5 transition-all"
                        >
                          {project.status === 'DRAFT' ? (
                            <>
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Ver Proyecto
                            </>
                          )}
                        </Link>
                      </div>

                      {/* Secondary actions */}
                      <div className="flex gap-2">
                        {project.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(project.id, project.status)}
                            disabled={publishMutation.isPending}
                            className="flex-1 text-center px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            {publishMutation.isPending ? '...' : 'Publicar'}
                          </button>
                        )}
                        {project.status === 'PAUSED' && (
                          <button
                            onClick={() => handlePublish(project.id, project.status)}
                            disabled={publishMutation.isPending}
                            className="flex-1 text-center px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {publishMutation.isPending ? '...' : 'Reactivar'}
                          </button>
                        )}
                        {project.status === 'PUBLISHED' && !project.isFeatured && (
                          <button
                            onClick={() => handleFeature(project.id)}
                            disabled={featureMutation.isPending}
                            className="flex-1 text-center px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            {featureMutation.isPending ? '...' : 'Destacar'}
                          </button>
                        )}
                        {project.status === 'PUBLISHED' && project.isFeatured && (
                          <span className="flex-1 text-center px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                            <Star className="w-4 h-4 fill-current" />
                            Destacado
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleteMutation.isPending ? '...' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] shadow-sm"
                >
                  Anterior
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i;
                    } else if (currentPage <= 3) {
                      pageNum = i;
                    } else if (currentPage >= totalPages - 4) {
                      pageNum = totalPages - 7 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-[var(--brand-primary)] text-white shadow-md'
                            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] shadow-sm"
                >
                  Siguiente
                </button>
              </div>
            )}

        </div>
      </div>
      </TrialGuard>
      
      {/* Plan expired modal */}
      <PlanExpiredModal 
        isOpen={showPlanExpiredModal}
        onClose={() => setShowPlanExpiredModal(false)}
        message={planExpiredMessage}
      />
      <Footer />
    </ProtectedRoute>
    
  );
}
