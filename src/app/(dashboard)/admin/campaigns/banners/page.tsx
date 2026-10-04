/**
 * Marketing Banners Page
 * Premium SaaS-style CRUD for promotional banners
 */

'use client';

import { useState, useMemo, useRef } from 'react';
import { useBanners, useCreateBannerWithUpload, useUpdateBanner, useToggleBanner, useDeleteBanner } from '@/presentation/hooks/useAdmin';
import type { Banner } from '@/core/domain/entities/Admin';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { LoadingState, EmptyState, ErrorState } from '@/presentation/components/admin/AdminUIStates';
import { Image, Plus, Search, Edit3, Trash2, Eye, EyeOff, Upload, Clock } from 'lucide-react';


export default function MarketingBannersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: bannersData, isLoading, error, refetch } = useBanners();
  const createMutation = useCreateBannerWithUpload();
  const updateMutation = useUpdateBanner();
  const toggleMutation = useToggleBanner();
  const deleteMutation = useDeleteBanner();

  const bannersList = Array.isArray(bannersData) ? bannersData : [];
  const filteredBanners = bannersList.filter(banner =>
    banner.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: {
    image: File;
    title: string;
    placement: string;
    displayMode?: 'SOLO_BANNER' | 'INTEGRATED';
    description?: string;
    linkUrl?: string;
    durationDays?: number;
    displayOrder?: number;
  }) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (formData: Record<string, unknown>) => {
    if (!selectedBanner) return;
    try {
      await updateMutation.mutateAsync({ id: selectedBanner.id, request: formData });
      setIsEditModalOpen(false);
      setSelectedBanner(null);
      refetch();
    } catch (error) {
      console.error('Failed to update banner:', error);
    }
  };

  const handleDelete = async (bannerId: number) => {
    if (!confirm('¿Eliminar este banner?')) return;
    try {
      await deleteMutation.mutateAsync(bannerId);
      refetch();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await toggleMutation.mutateAsync(banner.id);
      refetch();
    } catch (error) {
      console.error('Failed to toggle banner:', error);
    }
  };

  if (isLoading) return <LoadingState message="Cargando banners..." />;
  if (error) return <ErrorState message="Error al cargar banners." retry={refetch} />;

  if (filteredBanners.length === 0) {
    return (
      <>
        <div className="space-y-4 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Banners Publicitarios</h1>
              <p className="text-sm text-gray-500 mt-0.5">Administra banners promocionales</p>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all">
              <Plus className="w-4 h-4" /> Crear Banner
            </button>
          </div>
          <EmptyState
            title="Sin banners"
            description={searchQuery ? "Ajusta tu búsqueda." : "Crea tu primer banner publicitario."}
            action={{ label: "Crear Banner", onClick: () => setIsCreateModalOpen(true) }}
          />
        </div>
        <BannerModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          title="Crear Banner"
        />
      </>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Banners Publicitarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Administra banners promocionales</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all">
          <Plus className="w-4 h-4" /> Crear Banner
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          placeholder="Buscar banners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            {banner.imageUrl && (
              <div className="h-36 bg-gray-50 overflow-hidden">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${banner.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Image className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{banner.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      banner.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {banner.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              {banner.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{banner.description}</p>
              )}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ubicación</span>
                  <span className="font-medium text-gray-700">{banner.placement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inicio</span>
                  <span className="font-medium text-gray-700">{new Date(banner.startDate).toLocaleDateString('es-PE')}</span>
                </div>
                {banner.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fin</span>
                    <span className="font-medium text-gray-700">{new Date(banner.endDate).toLocaleDateString('es-PE')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Rendimiento</span>
                  <span className="font-medium text-gray-700">{(banner.impressions || 0).toLocaleString('es-PE')} imp / {(banner.clicks || 0).toLocaleString('es-PE')} clics</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button onClick={() => handleEdit(banner)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit3 className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => handleToggleStatus(banner)} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  {banner.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {banner.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => handleDelete(banner.id)} className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BannerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title="Crear Banner"
      />

      {selectedBanner && (
        <BannerModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedBanner(null); }}
          onSubmit={(data) => handleUpdate(data)}
          title="Editar Banner"
          banner={selectedBanner}
        />
      )}
    </div>
  );
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  banner?: Banner;
}

function BannerModal({ isOpen, onClose, onSubmit, title, banner }: BannerModalProps) {
  const [titleField, setTitleField] = useState(banner?.title || '');
  const [description, setDescription] = useState(banner?.description || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(banner?.imageUrl || '');
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || '');
  const [placement, setPlacement] = useState(banner?.placement || 'SLIDER');
  const [displayMode, setDisplayMode] = useState<'SOLO_BANNER' | 'INTEGRATED'>(banner?.displayMode || 'INTEGRATED');
  const [durationDays, setDurationDays] = useState(banner?.durationDays || 30);
  const [displayOrder, setDisplayOrder] = useState(banner?.displayOrder || 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      // Edit mode: send JSON (existing behavior)
      onSubmit({
        title: titleField,
        description,
        imageUrl: imagePreview,
        linkUrl,
        placement,
        displayMode,
        durationDays,
        displayOrder,
      });
    } else {
      // Create mode: send file + fields
      if (!imageFile) {
        alert('Debes seleccionar una imagen para el banner.');
        return;
      }
      onSubmit({
        image: imageFile,
        title: titleField,
        placement,
        displayMode,
        description,
        linkUrl,
        durationDays,
        displayOrder,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" value={titleField} onChange={(e) => setTitleField(e.target.value)} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {banner ? 'URL de Imagen (o sube una nueva)' : 'Imagen del Banner'}
            </label>
            {imagePreview && (
              <div className="mb-2 rounded-lg overflow-hidden h-28 bg-gray-50">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
              >
                <Upload className="w-4 h-4" />
                {imageFile ? imageFile.name : 'Seleccionar Imagen'}
              </button>
              {banner && !imageFile && (
                <span className="text-xs text-gray-400">(deja vacío para mantener la actual)</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Destino <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">Solo si el banner debe redirigir a un enlace al hacer clic. Déjalo vacío si es solo decorativo.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all">
              <option value="HOME_MAIN">Home - Principal</option>
              <option value="HOME_SPOTLIGHT">Home - Spotlight</option>
              <option value="HOME_BANNER">Home - Banner</option>
              <option value="SEARCH_RESULTS">Resultados de Búsqueda</option>
              <option value="PROPERTY_DETAIL">Detalle de Propiedad</option>
              <option value="PROJECT_DETAIL">Detalle de Proyecto</option>
              <option value="PROPERTY_LIST">Lista de Propiedades</option>
              <option value="PROJECT_LIST">Lista de Proyectos</option>
              <option value="SIDEBAR">Barra Lateral</option>
              <option value="SLIDER">Slider</option>
              <option value="BANNER_TOP">Banner Superior</option>
              <option value="BANNER_BOTTOM">Banner Inferior</option>
              <option value="RECOMMENDED">Recomendado</option>
              <option value="CATEGORY_PAGE">Página de Categoría</option>
            </select>
          </div>

          {/* Tipo de visualización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de visualización</label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${displayMode === 'INTEGRATED' ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/20' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="displayMode"
                  value="INTEGRATED"
                  checked={displayMode === 'INTEGRATED'}
                  onChange={() => setDisplayMode('INTEGRATED')}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Integrar al carrusel principal</p>
                  <p className="text-xs text-gray-500">El banner se mezcla con las imágenes estáticas del carrusel del home</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${displayMode === 'SOLO_BANNER' ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500/20' : 'border-gray-200 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="displayMode"
                  value="SOLO_BANNER"
                  checked={displayMode === 'SOLO_BANNER'}
                  onChange={() => setDisplayMode('SOLO_BANNER')}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Solo Banner</p>
                  <p className="text-xs text-gray-500">Se muestra únicamente como banner individual, no se agrega al carrusel</p>
                </div>
              </label>
            </div>
          </div>

          {/* Duration in days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duración (días)
              </span>
            </label>
            <input
              type="number"
              min={1}
              max={365}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">El banner se desactivará automáticamente después de este período.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all">
              {banner ? 'Actualizar' : 'Crear'} Banner
            </button>
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}


