'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Trash2, Loader2, Upload, Search, Building2, Home, Image as ImageIcon } from 'lucide-react';
import { TargetEntity } from '@/infrastructure/repositories/DeveloperRepository';
import { useDeveloperUploadCampaignImage } from '@/presentation/hooks/useDeveloper';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CampaignFormData {
  title: string;
  description: string;
  promotionType: string;
  placementLocation: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  linkUrl: string;
  pricePaid: number;
  currency: string;
  targetPropertyId?: number | null;
  targetProjectId?: number | null;
}

export interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  placement: string;
  startDate: string;
  endDate: string;
}

// ─── Campaign Modal ───────────────────────────────────────────────────────────

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => void;
  title: string;
  initialData?: CampaignFormData;
  targetEntities?: TargetEntity[];
  isLoadingEntities?: boolean;
}

export function CampaignModal({ isOpen, onClose, onSubmit, title, initialData, targetEntities, isLoadingEntities }: CampaignModalProps) {
  const [formData, setFormData] = useState<CampaignFormData>(
    initialData || {
      title: '',
      description: '',
      promotionType: 'HOME_SPOTLIGHT',
      placementLocation: 'HOME_MAIN',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      imageUrl: '',
      linkUrl: '',
      pricePaid: 0,
      currency: 'PEN',
      targetPropertyId: null,
      targetProjectId: null,
    }
  );

  const [linkType, setLinkType] = useState<'project' | 'property' | 'none'>(
    initialData?.targetProjectId ? 'project' :
    initialData?.targetPropertyId ? 'property' : 'none'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const uploadImageMutation = useDeveloperUploadCampaignImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter entities based on link type and search
  const filteredEntities = (targetEntities || []).filter(e => {
    if (linkType === 'project' && e.type !== 'PROJECT') return false;
    if (linkType === 'property' && e.type !== 'PROPERTY') return false;
    if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const selectedEntity = linkType !== 'none'
    ? (targetEntities || []).find(e =>
        (linkType === 'project' && e.id === formData.targetProjectId) ||
        (linkType === 'property' && e.id === formData.targetPropertyId)
      )
    : null;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-set endDate to 7 days after startDate
    const start = formData.startDate || new Date().toISOString().split('T')[0];
    const end = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    onSubmit({
      ...formData,
      startDate: start,
      endDate: end,
      targetPropertyId: linkType === 'property' ? formData.targetPropertyId : null,
      targetProjectId: linkType === 'project' ? formData.targetProjectId : null,
    });
  };

  const handleSelectEntity = (entity: TargetEntity) => {
    if (entity.type === 'PROJECT') {
      setFormData({ ...formData, targetProjectId: entity.id, targetPropertyId: null });
    } else {
      setFormData({ ...formData, targetPropertyId: entity.id, targetProjectId: null });
    }
    setShowDropdown(false);
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ── 1. VINCULACIÓN: ¿Qué promocionar? ── */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                1. ¿Qué deseas promocionar?
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => { setLinkType('project'); setFormData({ ...formData, targetProjectId: null, targetPropertyId: null }); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    linkType === 'project'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Proyecto
                </button>
                <button
                  type="button"
                  onClick={() => { setLinkType('property'); setFormData({ ...formData, targetProjectId: null, targetPropertyId: null }); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    linkType === 'property'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Propiedad
                </button>
                <button
                  type="button"
                  onClick={() => { setLinkType('none'); setFormData({ ...formData, targetProjectId: null, targetPropertyId: null }); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    linkType === 'none'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Sin vínculo
                </button>
              </div>

              {/* Selector de entidad (buscador inteligente) */}
              {linkType !== 'none' && (
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white cursor-pointer flex items-center justify-between"
                  >
                    {selectedEntity ? (
                      <div className="flex items-center gap-2">
                        {selectedEntity.imageUrl && (
                          <img src={selectedEntity.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
                        )}
                        <span className="text-sm text-gray-700">{selectedEntity.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          selectedEntity.type === 'PROJECT' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {selectedEntity.type === 'PROJECT' ? 'Proyecto' : 'Propiedad'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        {isLoadingEntities ? 'Cargando...' : `Seleccionar ${linkType === 'project' ? 'proyecto' : 'propiedad'}...`}
                      </span>
                    )}
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>

                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          autoFocus
                        />
                      </div>
                      {filteredEntities.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-400">
                          No hay {linkType === 'project' ? 'proyectos' : 'propiedades'} disponibles
                        </div>
                      ) : (
                        filteredEntities.map((entity) => (
                          <button
                            key={`${entity.type}-${entity.id}`}
                            type="button"
                            onClick={() => handleSelectEntity(entity)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            {entity.imageUrl ? (
                              <img src={entity.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {entity.type === 'PROJECT' ? <Building2 className="w-5 h-5 text-gray-400" /> : <Home className="w-5 h-5 text-gray-400" />}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{entity.title}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {entity.location && `${entity.location} • `}
                                {entity.price && `${entity.price} • `}
                                {entity.status}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── 2. CONFIGURACIÓN DE CAMPAÑA ── */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                2. Configuración de Campaña
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  placeholder="Nombre de la campaña"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={1}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  placeholder="Breve descripción"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.promotionType}
                    onChange={(e) => setFormData({ ...formData, promotionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  >
                    <option value="HOME_SPOTLIGHT">Destacado</option>
                    <option value="PREMIUM_AD">Premium</option>
                    <option value="FEATURED_PROPERTY">Propiedad Destacada</option>
                    <option value="FEATURED_PROJECT">Proyecto Destacado</option>
                    <option value="SLIDER">Slider</option>
                    <option value="RECOMMENDED">Recomendado</option>
                    <option value="BANNER">Banner</option>
                    <option value="SEARCH_BOOST">Boost Búsqueda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <select
                    value={formData.placementLocation}
                    onChange={(e) => setFormData({ ...formData, placementLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  >
                    <option value="HOME_MAIN">Home - Principal</option>
                    <option value="HOME_SPOTLIGHT">Home - Spotlight</option>
                    <option value="SEARCH_RESULTS">Resultados de Búsqueda</option>
                    <option value="PROPERTY_DETAIL">Detalle de Propiedad</option>
                    <option value="PROJECT_DETAIL">Detalle de Proyecto</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                  <input
                    value="7 días"
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ── 3. MATERIAL CREATIVO ── */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                3. Material Creativo
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Campaña</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    formData.imageUrl
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-gray-300 hover:border-emerald-300 hover:bg-gray-100'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingImage(true);
                      try {
                        const imageUrl = await uploadImageMutation.mutateAsync(file);
                        setFormData({ ...formData, imageUrl });
                      } catch (err) {
                        console.error('Error uploading image:', err);
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }}
                  />
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      <p className="text-sm text-gray-500">Subiendo imagen...</p>
                    </div>
                  ) : formData.imageUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full max-h-32 object-contain rounded-lg"
                      />
                      <p className="text-xs text-emerald-600">Imagen subida correctamente</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({ ...formData, imageUrl: '' });
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Eliminar imagen
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        Haz clic para subir una imagen
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP • Máx 10MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino (opcional)</label>
                <input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-700 text-sm"
                  placeholder="https://ejemplo.com/destino"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Si no ingresas una URL, se usará la URL del {linkType === 'project' ? 'proyecto' : linkType === 'property' ? 'inmueble' : 'sitio'} vinculado
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <button
                type="submit"
                className="w-full sm:flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-lg hover:-translate-y-0.5"
              >
                {initialData ? 'Guardar Cambios' : 'Crear Campaña (7 días)'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Banner Modal ─────────────────────────────────────────────────────────────

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerFormData) => void;
  title: string;
  initialData?: BannerFormData;
}

export function BannerModal({ isOpen, onClose, onSubmit, title, initialData }: BannerModalProps) {
  const [formData, setFormData] = useState<BannerFormData>(
    initialData || {
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      placement: 'HOME_MAIN',
      startDate: '',
      endDate: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Banner</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Destino</label>
              <input
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <select
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
              >
                <option value="HOME_MAIN">Home - Principal</option>
                <option value="HOME_SPOTLIGHT">Home - Spotlight</option>
                <option value="HOME_BANNER">Home - Banner</option>
                <option value="SEARCH_RESULTS">Resultados de Búsqueda</option>
                <option value="PROPERTY_DETAIL">Detalle de Propiedad</option>
                <option value="PROJECT_DETAIL">Detalle de Proyecto</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 text-gray-700"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-lg hover:-translate-y-0.5"
              >
                {initialData ? 'Guardar Cambios' : 'Crear Banner'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, itemName, isLoading }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">
            ¿Estás seguro de eliminar <strong>{itemName}</strong>? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Eliminar
            </button>
            <button
              onClick={onClose}
              className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesSelected(files);
      const urls = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...urls].slice(0, 5));
    }
  };

  const handleClick = () => inputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesSelected(files);
      const urls = files.map(f => URL.createObjectURL(f));
      setPreviews(prev => [...prev, ...urls].slice(0, 5));
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="flex flex-col items-center gap-2">
          <div className={`p-3 rounded-xl ${isDragging ? 'bg-emerald-100' : 'bg-gray-100'}`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-emerald-600' : 'text-gray-400'}`} />
          </div>
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? 'Suelta las imágenes aquí' : 'Subir imágenes del inmueble o variantes de Logo'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG • Arrastra y suelta o haz clic para seleccionar</p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Preview ${i + 1}`}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <button
                onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
