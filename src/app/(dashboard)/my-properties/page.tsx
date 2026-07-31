'use client';

import { useMyProperties, useDeleteProperty, usePublishProperty, useUnpublishProperty } from '@/presentation/hooks/useProperties';
import { useActiveSubscription } from '@/presentation/hooks/useFinance';
import Link from 'next/link';
import Image from 'next/image';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UpgradePlanModal } from '@/presentation/components/modals/UpgradePlanModal';
import { PlanExpiredModal } from '@/presentation/components/modals/PlanExpiredModal';
import { useQueryClient } from '@tanstack/react-query';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { Eye, FolderOpen, History, Home, ImageIcon, ImageOff, MapPin, Plus, RefreshCw, Search, Star } from 'lucide-react';;

export default function MyPropertiesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;
  const { data, isLoading, refetch } = useMyProperties(currentPage, pageSize);
  const deleteMutation = useDeleteProperty();
  const publishMutation = usePublishProperty();
  const unpublishMutation = useUnpublishProperty();
  const { data: activeSubscription, refetch: refetchSubscription } = useActiveSubscription();
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'RENTED' | 'SOLD' | 'PAUSED' | 'INACTIVE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; title: string }>({
    isOpen: false,
    id: null,
    title: '',
  });
  const [pauseModal, setPauseModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPlanExpiredModal, setShowPlanExpiredModal] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [previousPlan, setPreviousPlan] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Detect plan change
  useEffect(() => {
    if (activeSubscription && activeSubscription.plan) {
      const currentPlan = activeSubscription.plan.name;
      
      // If there is a previous plan and it is different from the current one
      if (previousPlan && previousPlan !== currentPlan) {
        setShowWelcomeMessage(true);
        
        // Hide message after 5 seconds
        const timer = setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
      
      // Save current plan as previous for future comparisons
      setPreviousPlan(currentPlan);
    }
  }, [activeSubscription, previousPlan]);

  // Force data reload when component mounts
  useEffect(() => {
    refetch();
    refetchSubscription();
    
    // Force cache invalidation
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
  }, [refetch, refetchSubscription, queryClient]);

  // Force reload when upgrade modal closes
  useEffect(() => {
    if (!showUpgradeModal) {
      setTimeout(() => {
        refetch();
        refetchSubscription();
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
      }, 1000);
    }
  }, [showUpgradeModal, refetch, refetchSubscription, queryClient]);

  // Periodic refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetchSubscription();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, refetchSubscription]);

  const properties = data?.properties || [];
  const totalPages = data?.pagination?.totalPages || 0;
  const totalElements = data?.pagination?.totalElements || 0;

  const normalizedProperties = useMemo(() => {
    return (properties as any[]).map((p) => {
      const status = normalizeStatus(p?.status);
      return { ...p, status };
    });
  }, [properties]);

  const publishedCount = useMemo(() => {
    return normalizedProperties.filter((p: any) => p.status === 'PUBLISHED').length;
  }, [normalizedProperties]);

  // Enhanced logic with FREE plan permanent blocking
  const canPublish = useMemo(() => {
    if (activeSubscription) {
      // Has plan: use plan logic (remainingPublications)
      return activeSubscription.remainingPublications > 0;
    }
    
    // WITHOUT SUBSCRIPTION: up to 1 FREE PUBLISHED property
    // Once user publishes 1 property, FREE is permanently blocked
    return publishedCount < 1;
  }, [activeSubscription, publishedCount]);

  // To display in the UI
  const maxPublications = activeSubscription?.plan?.maxPublications || 1;
  const remainingPublications = activeSubscription?.remainingPublications ?? (1 - publishedCount);

  const counts = useMemo(() => {
    const base = {
      ALL: normalizedProperties.length,
      PUBLISHED: 0,
      DRAFT: 0,
      RENTED: 0,
      SOLD: 0,
      PAUSED: 0,
      INACTIVE: 0,
    };

    for (const p of normalizedProperties as any[]) {
      const status = p.status as string;
      if ((base as any)[status] !== undefined) (base as any)[status] += 1;
    }

    return base;
  }, [normalizedProperties]);

  useEffect(() => {
    // Debug info removed - kept for future use if needed
  }, [data, properties, activeSubscription, publishedCount, maxPublications, remainingPublications, canPublish, counts]);

  const searchedProperties = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return normalizedProperties;

    return (normalizedProperties as any[]).filter((p) => {
      const title = String(p?.title || '').toLowerCase();
      const district = String(p?.district || '').toLowerCase();
      const province = String(p?.province || '').toLowerCase();
      return title.includes(q) || district.includes(q) || province.includes(q);
    });
  }, [normalizedProperties, searchTerm]);

  const filteredProperties = useMemo(() => {
    if (activeTab === 'ALL') return searchedProperties;
    return searchedProperties.filter((p: any) => p.status === activeTab);
  }, [searchedProperties, activeTab]);

  const handleEdit = (id: unknown) => {
    const parsedId = typeof id === 'number' ? id : Number(id);
    if (!parsedId || Number.isNaN(parsedId)) {
      toast.error('No se pudo abrir edicion: falta ID de propiedad');
      return;
    }
    router.push(`/my-properties/${parsedId}/edit`);
  };

  const handleDeleteClick = (id: number, title: string, status: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const handlePauseClick = (id: number) => {
    setPauseModal({ isOpen: true, id });
  };

  const handleConfirmPause = async () => {
    if (pauseModal.id) {
      try {
        await unpublishMutation.mutateAsync(pauseModal.id);
        toast.success('Propiedad pausada (pasó a borrador)');
        setPauseModal({ isOpen: false, id: null });
        refetch();
      } catch (e) {
        toast.error('Error al pausar');
        setPauseModal({ isOpen: false, id: null });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await deleteMutation.mutateAsync(deleteModal.id);
        setDeleteModal({ isOpen: false, id: null, title: '' });
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  const handlePublish = async (id: unknown) => {
    const parsedId = typeof id === 'number' ? id : Number(id);
    if (!parsedId || Number.isNaN(parsedId)) {
      toast.error('No se pudo publicar: falta ID de propiedad');
      return;
    }
    if (!canPublish) {
      setShowPlanExpiredModal(true);
      return;
    }
    
    publishMutation.mutate(parsedId, {
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 402) {
          setShowPlanExpiredModal(true);
        }
      }
    });
  };


  const goToPublishedHistory = () => {
    setSearchTerm('');
    setActiveTab('PUBLISHED');
  };

  const handleRefresh = () => {
    // Clear cache completely
    queryClient.clear();
    
    // Refresh everything
    refetch();
    refetchSubscription();
    
    toast.info('Forzando actualizacion completa...');
    
    // Refresh again after 2 seconds
    setTimeout(() => {
      refetch();
      refetchSubscription();
    }, 2000);
  };

  // Function to feature property
  const handleFeatureProperty = async (propertyId: number) => {
    try {
      // Create repository instance
      const propertyRepo = new PropertyRepository();
      
      // Call backend to feature property
      await propertyRepo.featureProperty(propertyId);
      
      // Show success
      toast.success('Propiedad destacada exitosamente!');
      
      // Refresh properties
      refetch();
      
    } catch (error: any) {
      console.error('Error featuring property:', error);
      
      // Handle specific errors
      if (error.response?.status === 403) {
        toast.error('No tienes permiso para destacar esta propiedad');
        return;
      }
      
      // Generic error message for other errors
      toast.error('Error al destacar propiedad. Intenta nuevamente.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-9xl mx-auto py-8 px-8 xl:px-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Mis Propiedades</h1>
            <p className="text-[var(--text-secondary)] mt-1.5 text-sm">
              {counts.PUBLISHED} de {data?.pagination.totalElements || 0} propiedades publicadas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] shadow-sm active:scale-95"
              disabled={isLoading}
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[var(--brand-primary)]' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
            <button
              type="button"
              onClick={goToPublishedHistory}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] shadow-sm active:scale-95"
            >
              <History className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="hidden sm:inline">Historial</span>
              <span className="bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs py-0.5 px-2 rounded-full font-semibold">{counts.PUBLISHED}</span>
            </button>

            <Link
              href="/my-properties/new"
              className={`
                flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm
                ${canPublish
                  ? 'text-white hover:-translate-y-0.5 hover:shadow-md active:scale-95'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border-color)]'
                }
              `}
              style={{
                backgroundColor: canPublish ? 'var(--brand-primary)' : undefined
              }}
            >
              <Plus className="w-5 h-5" />
              Nueva Propiedad
            </Link>
          </div>
        </div>

        {/* Tabs */}
        {!isLoading && properties.length > 0 && (
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-5 mb-8">
            <div className="flex flex-col gap-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título, distrito o provincia..."
                  className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--brand-primary)]/20 focus:border-[var(--brand-primary)] transition-all outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-[var(--border-color)] pt-5">
                <TabButton
                  label="Todas"
                  count={counts.ALL}
                  isActive={activeTab === 'ALL'}
                  onClick={() => setActiveTab('ALL')}
                />
                <TabButton
                  label="Publicadas"
                  count={counts.PUBLISHED}
                  isActive={activeTab === 'PUBLISHED'}
                  onClick={() => setActiveTab('PUBLISHED')}
                />
                <TabButton
                  label="Borradores"
                  count={counts.DRAFT}
                  isActive={activeTab === 'DRAFT'}
                  onClick={() => setActiveTab('DRAFT')}
                />
                <TabButton
                  label="Alquiladas"
                  count={counts.RENTED}
                  isActive={activeTab === 'RENTED'}
                  onClick={() => setActiveTab('RENTED')}
                />
                <TabButton
                  label="Vendidas"
                  count={counts.SOLD}
                  isActive={activeTab === 'SOLD'}
                  onClick={() => setActiveTab('SOLD')}
                />
                <TabButton
                  label="Inactivas"
                  count={counts.INACTIVE}
                  isActive={activeTab === 'INACTIVE'}
                  onClick={() => setActiveTab('INACTIVE')}
                />
                <TabButton
                  label="Pausadas"
                  count={counts.PAUSED}
                  isActive={activeTab === 'PAUSED'}
                  onClick={() => setActiveTab('PAUSED')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Welcome message for new plan */}
        {showWelcomeMessage && activeSubscription && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-pulse">
            <p className="text-green-800 font-medium">
              🎉 ¡Felicidades! Ahora tienes el plan {activeSubscription.plan.name} con acceso a {activeSubscription.plan.maxPublications} publicaciones.
              ¡Aprovecha al máximo tus nuevos beneficios!
            </p>
          </div>
        )}

        {!canPublish && !showWelcomeMessage && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[var(--brand-primary)] text-lg font-bold">!</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--text-primary)] mb-1">
                Límite de publicaciones alcanzado
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {activeSubscription && activeSubscription.plan
                  ? `Has alcanzado el límite de ${activeSubscription.plan.maxPublications} publicaciones de tu plan ${activeSubscription.plan.name}.` 
                  : 'Has alcanzado el límite de 1 propiedad gratis.'}
                {' '}Para seguir publicando, actualiza o renueva tu plan.
              </p>
              <Link
                href="/plans"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        )}

        
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] mt-4">
            <div className="w-20 h-20 bg-[var(--brand-primary-light)]/80 rounded-full flex items-center justify-center mb-6 ring-8 ring-[var(--brand-primary-light)]/30">
              <Home className="w-10 h-10 text-[var(--brand-primary)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
              Aún no tienes propiedades
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto text-base leading-relaxed">
              Publica tu primera propiedad y empieza a recibir contactos interesados inmediatamente en nuestra plataforma.
            </p>
            <Link
              href="/my-properties/new"
              className="flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <Plus className="w-5 h-5" />
              Publicar Primera Propiedad
            </Link>
          </div>
        )}

        {/* Empty tab state */}
        {!isLoading && properties.length > 0 && filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[var(--bg-card)] rounded-xl shadow-sm border-2 border-dashed border-[var(--border-color)]">
            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-5">
              <FolderOpen className="w-10 h-10 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No tienes propiedades en esta sección
            </h3>
            <p className="text-[var(--text-secondary)] mb-8">
              Cambia de pestaña o crea una nueva propiedad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab('ALL')}
                className="px-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg font-semibold hover:bg-[var(--bg-tertiary)] transition-all duration-200 active:scale-95"
              >
                Ver todas
              </button>
              <Link
                href="/my-properties/new"
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Plus className="w-4 h-4" />
                Nueva Propiedad
              </Link>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && properties.length > 0 && (
          <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProperties.map((property: any) => (
                <div key={property.id} className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group">
                  {/* Imagen */}
                  <div className="relative h-44 bg-[var(--bg-secondary)] overflow-hidden">
                    {property.coverPhotoUrl ? (
                    <img
                      src={`/api/images/proxy?url=${encodeURIComponent(property.coverPhotoUrl)}`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Error loading image:', property.coverPhotoUrl);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML = '<ImageIcon className="" />';
                      }}
                    />
                  ) : property.media && property.media.length > 0 ? (
                    <img
                      src={`/api/images/proxy?url=${encodeURIComponent(property.media.find((m: any) => m.isCover)?.url || property.media[0].url)}`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Error loading media image:', property.media[0]?.url);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML = '<ImageIcon className="" />';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)] gap-2">
                      <ImageOff className="w-8 h-8 opacity-50 text-[var(--text-secondary)]" />
                      <span className="text-xs font-medium opacity-70">Sin imagen</span>
                    </div>
                  )}
                    
                    {/* Status badge */}
                    {/* Status badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {property.publishedAt && (
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-black/60 text-white rounded-md shadow-sm flex items-center gap-1 backdrop-blur-sm">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Publicado: {new Date(property.publishedAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md shadow-sm text-white uppercase tracking-wider border border-white/20 backdrop-blur-sm ${
                        property.status === 'PUBLISHED' ? 'bg-emerald-500/90' :
                        property.status === 'DRAFT' ? 'bg-gray-600/90' :
                        property.status === 'PAUSED' ? 'bg-amber-500/90' :
                        property.status === 'INACTIVE' ? 'bg-rose-500/90' :
                        property.status === 'RENTED' ? 'bg-purple-500/90' :
                        property.status === 'SOLD' ? 'bg-blue-600/90' :
                        'bg-gray-500/90'
                      }`}>
                        {property.status === 'PUBLISHED' ? 'Publicada' :
                         property.status === 'DRAFT' ? 'Borrador' :
                         property.status === 'PAUSED' ? 'Pausada' :
                         property.status === 'INACTIVE' ? 'Inactiva' :
                         property.status === 'RENTED' ? 'Alquilada' :
                         property.status === 'SOLD' ? 'Vendida' : property.status}
                      </span>
                      
                      {property.status === 'PUBLISHED' && property.isFeatured && (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-400/90 text-amber-950 rounded-md shadow-sm flex items-center gap-1 w-max uppercase tracking-wider border border-amber-300/50 backdrop-blur-sm">
                          <Star className="w-3 h-3 fill-amber-950" />
                          Destacada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2.5 flex flex-col flex-grow">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] mb-1 line-clamp-2 leading-tight min-h-[2.2rem]">
                      {property.title}
                    </h3>
                    
                    <p className="text-[10px] text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[var(--text-secondary)] flex-shrink-0" />
                      <span className="truncate">{property.district}, {property.province}</span>
                    </p>
                    
                    <div className="flex items-center justify-between mb-2 bg-[var(--bg-secondary)] p-1.5 rounded-md border border-[var(--border-color)]">
                      <span className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
                        {property.currency === 'USD' ? 'US$' : 'S/'} {property.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 font-medium">
                        <Eye className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                        {property.viewsCount}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 mt-auto">
                      {/* Publish / Reactivate Button */}
                      {(property.status === 'DRAFT' || property.status === 'PAUSED') && (
                        <button
                          onClick={() => handlePublish(property.id)}
                          disabled={publishMutation.isPending}
                          className="w-full py-1.5 bg-[var(--brand-primary)] text-white text-[11px] font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          {publishMutation.isPending ? 'Procesando...' : (property.status === 'DRAFT' ? 'Publicar Ahora' : 'Reactivar')}
                        </button>
                      )}

                      {/* Pause button for published properties - changes to DRAFT */}
                      {property.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handlePauseClick(property.id)}
                          disabled={unpublishMutation.isPending}
                          className="w-full py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] text-[11px] font-semibold rounded-md hover:bg-[var(--bg-tertiary)] transition-all flex items-center justify-center gap-1"
                        >
                          Pausar
                        </button>
                      )}

                      {/* Featured button */}
                      {property.status === 'PUBLISHED' && !property.isFeatured && (
                        <button
                          onClick={() => handleFeatureProperty(property.id)}
                          className="w-full py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold rounded-md hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <Star className="w-2.5 h-2.5" />
                          Destacar anuncio
                        </button>
                      )}

                      <div className="flex gap-1">
                        {property.status === 'PUBLISHED' && (
                          <Link
                            href={`/property/${property.slug || property.id}`}
                            target="_blank"
                            className="flex-1 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[11px] font-semibold rounded-md hover:bg-[var(--bg-tertiary)] transition-all flex items-center justify-center border border-[var(--border-color)]"
                          >
                            Ver página
                          </Link>
                        )}
                        
                        <Link
                          href={`/my-properties/${property.id}/edit`}
                          className="flex-1 py-1.5 bg-amber-500 text-white text-[11px] font-semibold rounded-md hover:bg-amber-600 transition-all flex items-center justify-center shadow-sm"
                        >
                          Editar
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteClick(property.id, property.title, property.status)}
                          disabled={deleteMutation.isPending}
                          className="py-1.5 px-2 bg-red-600 text-white text-[11px] font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 transition-all whitespace-nowrap shadow-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] shadow-sm"
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
                  className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] shadow-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Plan upgrade modal */}
      <UpgradePlanModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      
      {/* Plan expired modal */}
      <PlanExpiredModal 
        isOpen={showPlanExpiredModal}
        onClose={() => setShowPlanExpiredModal(false)}
      />

      {/* Pause Confirmation Modal */}
      {pauseModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 text-center">Pausar propiedad</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 text-center">
              La propiedad pasará a estado <strong>Borrador</strong>. Podrás volver a publicarla cuando quieras.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPauseModal({ isOpen: false, id: null })}
                className="px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                disabled={unpublishMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPause}
                disabled={unpublishMutation.isPending}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                style={{ backgroundColor: '#f97316' }}
                onMouseEnter={e => !unpublishMutation.isPending && (e.currentTarget.style.backgroundColor = '#ea580c')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f97316')}
              >
                {unpublishMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Pausando...
                  </span>
                ) : 'Sí, pausar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Eliminar propiedad</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              ¿Estás seguro de eliminar la propiedad <span className="font-semibold text-[var(--text-primary)]">"{deleteModal.title}"</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

function normalizeStatus(status: unknown): 'PUBLISHED' | 'DRAFT' | 'RENTED' | 'SOLD' | 'PAUSED' | 'INACTIVE' {
  const normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'PUBLISHED') return 'PUBLISHED';
  if (normalized === 'RENTED') return 'RENTED';
  if (normalized === 'SOLD') return 'SOLD';
  if (normalized === 'PAUSED') return 'PAUSED';
  if (normalized === 'INACTIVE') return 'INACTIVE';
  return 'DRAFT';
}

function StatusBadge({ status, lifecycleStatus, remainingGraceDays }: { status: string; lifecycleStatus?: string; remainingGraceDays?: number }) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-500', text: 'text-white', label: 'Borrador' },
    PUBLISHED: { bg: 'bg-green-500', text: 'text-white', label: 'Publicada' },
    PAUSED: { bg: 'bg-amber-500', text: 'text-white', label: 'Pausada' },
    INACTIVE: { bg: 'bg-yellow-500', text: 'text-white', label: 'Inactiva' },
    SOLD: { bg: 'bg-red-500', text: 'text-white', label: 'Vendida' },
    RENTED: { bg: 'bg-blue-500', text: 'text-white', label: 'Alquilada' },
  };

  const badge = badges[status] || badges.DRAFT;

  // Show grace period info if applicable
  if (lifecycleStatus === 'GRACE_PERIOD' && remainingGraceDays !== undefined && remainingGraceDays > 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className={`${badge.bg} ${badge.text} text-xs font-bold px-2 py-1 rounded`}>
          {badge.label}
        </span>
        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
          {remainingGraceDays} dias para renovar
        </span>
      </div>
    );
  }

  return (
    <span className={`${badge.bg} ${badge.text} text-xs font-bold px-2 py-1 rounded`}>
      {badge.label}
    </span>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-[var(--bg-tertiary)]" />
      <div className="p-4">
        <div className="h-6 bg-[var(--bg-tertiary)] rounded mb-2" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3 mb-3" />
        <div className="h-8 bg-[var(--bg-tertiary)] rounded mb-4" />
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-[var(--bg-tertiary)] rounded" />
          <div className="flex-1 h-10 bg-[var(--bg-tertiary)] rounded" />
          <div className="w-12 h-10 bg-[var(--bg-tertiary)] rounded" />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
        ${isActive 
          ? 'bg-[var(--brand-primary)] text-white shadow-md' 
          : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'}
      `}
    >
      {label} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs font-bold ${isActive ? 'bg-[var(--brand-primary)]/50 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>{count}</span>
    </button>
  );
}
