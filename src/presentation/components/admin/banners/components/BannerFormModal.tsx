'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Clock,
  ImagePlus,
  Layers,
  Link2,
  MapPin,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';

import type { Banner } from '@/core/domain/entities/Admin';
import type { BannerUploadPayload } from '@/presentation/hooks/admin/useAdminMarketingAssets';
import { Modal } from '@/presentation/components/ui/Modal';
import { toast } from '@/presentation/store/toastStore';
import {
  DISPLAY_MODE_OPTIONS,
  PLACEMENT_OPTIONS,
  type BannerDisplayModeValue,
} from '../config/banners.config';
import './styles/banner-form-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BannerUploadPayload) => void | Promise<void>;
  banner?: Banner | null;
  isSubmitting?: boolean;
}

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#0f2e3a] outline-none transition placeholder:text-slate-400 focus:border-[#0f766e] focus:ring-3 focus:ring-[#0f766e]/15 disabled:cursor-not-allowed disabled:opacity-60';
const LABEL_CLASS = 'mb-1.5 block text-xs font-semibold text-[#0f2e3a]';
const DURATION_PRESETS = [7, 15, 30, 60, 90];

export function BannerFormModal({ isOpen, onClose, onSubmit, banner, isSubmitting = false }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [placement, setPlacement] = useState('SLIDER');
  const [displayMode, setDisplayMode] = useState<BannerDisplayModeValue>('INTEGRATED');
  const [durationDays, setDurationDays] = useState(30);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);

  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placementBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(banner?.title ?? '');
    setDescription(banner?.description ?? '');
    setLinkUrl(banner?.linkUrl ?? '');
    setPlacement(banner?.placement ?? 'SLIDER');
    setDisplayMode(banner?.displayMode ?? 'INTEGRATED');
    setDurationDays(banner?.durationDays ?? 30);
    setDisplayOrder(banner?.displayOrder ?? 0);
    setImageFile(null);
    setImagePreview(banner?.imageUrl ?? '');
    setIsPlacementOpen(false);
  }, [isOpen, banner]);

  useEffect(() => {
    if (isOpen) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreview('');
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlacementOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (placementBoxRef.current && !placementBoxRef.current.contains(e.target as Node)) {
        setIsPlacementOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isPlacementOpen]);

  const applySelectedFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen (PNG, JPG o WebP)');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImageFile(file);
    setImagePreview(url);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applySelectedFile(event.target.files?.[0]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    applySelectedFile(event.dataTransfer.files?.[0]);
  };

  const selectedPlacementObj =
    PLACEMENT_OPTIONS.find((opt) => opt.value === placement) ?? PLACEMENT_OPTIONS[0];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('El título del banner es obligatorio');
      return;
    }
    if (!banner && !imageFile) {
      toast.error('Selecciona una imagen para el banner');
      return;
    }

    try {
      await onSubmit({
        image: imageFile,
        title: title.trim(),
        description: description.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        placement,
        displayMode,
        durationDays: Number.isFinite(durationDays) && durationDays > 0 ? durationDays : undefined,
        displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
      });
    } catch {
      // Los hooks muestran el mensaje de error.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col bg-slate-50/70">
        <header className="banner-form-modal__header flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="banner-form-modal__header-icon" aria-hidden="true">
              <ImagePlus className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-[#0f2e3a]">
                  {banner ? 'Editar pieza publicitaria' : 'Nuevo banner promocional'}
                </h3>
                <span className="hidden rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-teal-600/20 sm:inline-flex">
                  {banner ? 'Edición' : 'Campaña'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Configura la creatividad visual, ubicación en portada y vigencia del anuncio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-500 shadow-2xs transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {/* Sección 1: Creatividad visual */}
            <section className="banner-form-modal__section">
              <div className="banner-form-modal__section-title">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                1. Creatividad y contenido
              </div>

              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0f2e3a]">
                    Imagen del banner {!banner && <span className="text-red-500">*</span>}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Recomendado: 1920 × 600 px (PNG, JPG o WebP)
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`banner-form-modal__dropzone ${
                    isDragging ? 'banner-form-modal__dropzone--active' : ''
                  } ${imagePreview ? 'banner-form-modal__dropzone--has-image' : ''}`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Vista previa del banner" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent px-3.5 py-2.5 text-white">
                        <span className="truncate text-xs font-medium">
                          {imageFile ? imageFile.name : 'Imagen actual cargada'}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#0f2e3a] shadow-sm">
                          <UploadCloud className="h-3.5 w-3.5 text-teal-700" />
                          Cambiar imagen
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center px-4 py-5 text-center">
                      <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-600/20">
                        <UploadCloud className="h-5 w-5" />
                      </span>
                      <p className="text-xs font-semibold text-[#0f2e3a]">
                        Haz clic para subir o arrastra tu imagen aquí
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Formato panorámico de alta resolución · Máx. 5 MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="banner-title" className={LABEL_CLASS}>
                    Título interno <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="banner-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ej. Campaña Proyectos Lima Norte"
                    maxLength={200}
                    required
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="banner-link" className={LABEL_CLASS}>
                    <span className="inline-flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 text-slate-400" /> URL de destino
                    </span>
                  </label>
                  <input
                    id="banner-link"
                    type="url"
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://tiyuy.com/proyectos/..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="mt-3.5">
                <label htmlFor="banner-description" className={LABEL_CLASS}>
                  Subtítulo o nota descriptiva
                </label>
                <textarea
                  id="banner-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={2}
                  maxLength={500}
                  className={`${INPUT_CLASS} resize-none`}
                  placeholder="Mensaje breve visible en la pieza o referencia para el equipo..."
                />
              </div>
            </section>

            {/* Sección 2: Ubicación y formato */}
            <section className="banner-form-modal__section">
              <div className="banner-form-modal__section-title">
                <Layers className="h-3.5 w-3.5 text-teal-600" />
                2. Ubicación y despliegue
              </div>

              <div ref={placementBoxRef} className="relative mb-4">
                <span className={LABEL_CLASS}>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-700" /> Ubicación en plataforma
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsPlacementOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm text-[#0f2e3a] transition hover:border-slate-300 focus:border-[#0f766e] focus:ring-3 focus:ring-[#0f766e]/15"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    {selectedPlacementObj?.label ?? placement}
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
                      {placement}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isPlacementOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isPlacementOpen && (
                  <div className="banner-form-modal__placement-menu" role="listbox">
                    {PLACEMENT_OPTIONS.map((option) => {
                      const isSelected = option.value === placement;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setPlacement(option.value);
                            setIsPlacementOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                            isSelected
                              ? 'bg-teal-50 font-semibold text-teal-900'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{option.label}</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {option.value}
                            </span>
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-teal-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <span className={LABEL_CLASS}>Modo de visualización</span>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {DISPLAY_MODE_OPTIONS.map((option) => {
                    const selected = displayMode === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`banner-form-modal__mode ${
                          selected ? 'banner-form-modal__mode--selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="displayMode"
                          value={option.value}
                          checked={selected}
                          onChange={() => setDisplayMode(option.value)}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-[#0f2e3a]">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Sección 3: Vigencia y prioridad */}
            <section className="banner-form-modal__section">
              <div className="banner-form-modal__section-title">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                3. Vigencia y prioridad
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="banner-duration" className={LABEL_CLASS}>
                    Duración de publicación (días)
                  </label>
                  <input
                    id="banner-duration"
                    type="number"
                    min={1}
                    max={365}
                    value={durationDays}
                    onChange={(event) => setDurationDays(Number(event.target.value))}
                    className={INPUT_CLASS}
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {DURATION_PRESETS.map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDurationDays(days)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                          durationDays === days
                            ? 'bg-[#0f2e3a] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {days} días
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="banner-order" className={LABEL_CLASS}>
                    Prioridad en carrusel
                  </label>
                  <input
                    id="banner-order"
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(event) => setDisplayOrder(Number(event.target.value))}
                    className={INPUT_CLASS}
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    Menor número aparece primero (0 = máxima prioridad).
                  </p>
                </div>
              </div>
            </section>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="hidden text-xs text-slate-400 sm:inline">
              Los cambios se reflejan inmediatamente al guardar.
            </span>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#0f2e3a] to-[#164e63] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Guardando...' : banner ? 'Guardar cambios' : 'Publicar banner'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </Modal>
  );
}