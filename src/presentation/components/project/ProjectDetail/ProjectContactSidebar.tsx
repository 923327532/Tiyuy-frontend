'use client';

import { useState, useEffect, useRef } from 'react';
import { ProjectFull, ProjectUnit } from '@/core/domain/entities/Project';
import { useCRMInteraction } from '@/presentation/hooks/useCRMInteraction';
import { useAuthStore } from '@/presentation/store/authStore';
import { Input } from '@/presentation/components/ui';
import { ShareButton } from '../../shared/ShareButton/ShareButton';
import { AlertCircle, Calendar, MessageCircle, Heart, LogIn, UserPlus, AlertTriangle, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { toast } from '@/presentation/store/toastStore';
import { useRouter } from 'next/navigation';
import { DeveloperDetailModal } from './DeveloperDetailModal';

interface ProjectContactSidebarProps {
  project: ProjectFull;
  units: ProjectUnit[];
  currency: string;
}

export function ProjectContactSidebar({ project, units, currency }: ProjectContactSidebarProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { trackContactForm, trackWhatsAppClick, isLoading } = useCRMInteraction();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  // Cargar estado de favorito
  useEffect(() => {
    if (!isAuthenticated) return;
    const checkFavorite = async () => {
      try {
        const res = await axiosClient.get(`/favorites/check/${project.id}`);
        setIsFavorite(res.data?.isFavorite ?? false);
      } catch {
        // Silently fail
      }
    };
    checkFavorite();
  }, [project.id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setFavLoading(true);
    try {
      const res = await axiosClient.post(`/favorites/projects/${project.id}`);
      const newState = res.data?.isFavorite ?? !isFavorite;
      setIsFavorite(newState);
      toast.success(newState ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch {
      toast.error('No se pudo actualizar el favorito');
    } finally {
      setFavLoading(false);
    }
  };

  type ContactMethod = 'EMAIL' | 'PHONE' | 'WHATSAPP';

  const contactMethods: { value: ContactMethod; label: string; icon: string }[] = [
    { value: 'EMAIL', label: 'Email', icon: 'material-symbols:mail-outline' },
    { value: 'PHONE', label: 'Teléfono', icon: 'material-symbols:phone-in-talk-outline' },
    { value: 'WHATSAPP', label: 'WhatsApp', icon: 'ic:baseline-whatsapp' },
  ];

  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
  const methodDropdownRef = useRef<HTMLDivElement>(null);
  const unitDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    contactName: user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : '',
    contactEmail: user?.email || '',
    contactPhone: '',
    message: 'Hola! Me interesa este proyecto. Esta disponible?',
    preferredContactMethod: 'EMAIL' as ContactMethod,
    selectedUnitId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target as Node)) {
        setMethodDropdownOpen(false);
      }
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target as Node)) {
        setUnitDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactName.trim()) newErrors.contactName = 'El nombre es obligatorio';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'El teléfono es obligatorio';
    } else {
      const digitsOnly = formData.contactPhone.replace(/\D/g, '');
      if (digitsOnly.length !== 9) {
        newErrors.contactPhone = 'El teléfono debe tener exactamente 9 dígitos';
      }
    }
    if (!formData.message.trim()) newErrors.message = 'El mensaje es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Para el telefono: solo permitir numeros y maximo 9 digitos
    if (name === 'contactPhone') {
      const digitsOnly = value.replace(/\D/g, '');
      const limited = digitsOnly.slice(0, 9);
      setFormData({ ...formData, contactPhone: limited });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await trackContactForm.mutateAsync({
        projectId: project.id,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        message: `${formData.message}${formData.selectedUnitId ? ` | Unidad de interes: ${formData.selectedUnitId}` : ''}`,
        preferredContactMethod: formData.preferredContactMethod,
      });

      toast.success('Enviado exitosamente');

      setFormData({
        contactName: isAuthenticated && user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : '',
        contactEmail: isAuthenticated && user?.email ? user.email : '',
        contactPhone: '',
        message: 'Hola! Me interesa este proyecto. Esta disponible?',
        preferredContactMethod: 'EMAIL' as const,
        selectedUnitId: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error enviando formulario:', error);
      toast.error('Error al enviar el mensaje. Intentalo de nuevo.');
    }
  };

  const handleWhatsApp = () => {
    const phone = project.developer?.phone?.replace(/\D/g, '') || '';
    if (!phone) return;

    const msg = encodeURIComponent(
      `Hola, estoy interesado en el proyecto *${project.name}* en ${project.district}.\n` +
      `¿Podría darme más información?`
    );

    trackWhatsAppClick.mutate({
      propertyId: project.id,
      ownerId: project.developer?.id || 0,
      ownerPhone: phone,
      message: msg,
      source: 'whatsapp_button',
    });
  };

  const publishedDate = (project as any).createdAt
    ? new Date((project as any).createdAt).toLocaleDateString('es-PE', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <div className="sticky top-4 space-y-4">
      {/* ── FORMULARIO DE CONTACTO ── */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            Contáctate con {project.developer?.companyName || 'el desarrollador'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            por el proyecto en {project.district}, {project.province}
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <form onSubmit={handleSubmit} className="px-4 py-3 space-y-2.5" noValidate>
          <Input
            id="contactName"
            name="contactName"
            type="text"
            label="Nombre completo"
            value={formData.contactName}
            onChange={handleChange}
            error={errors.contactName}
            placeholder="Juan Pérez"
          />

          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            label="Email"
            value={formData.contactEmail}
            onChange={handleChange}
            error={errors.contactEmail}
            placeholder="juan@example.com"
          />

          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            label="Teléfono"
            value={formData.contactPhone}
            onChange={handleChange}
            error={errors.contactPhone}
            placeholder="+51 999 999 999"
          />

          {/* Método preferido - Dropdown personalizado */}
          <div ref={methodDropdownRef}>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Prefieres que te contacten por
            </label>
            <button
              type="button"
              onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm hover:border-gray-400 transition-all duration-200 text-gray-700 text-sm"
            >
              <span className="flex items-center gap-2">
                {(() => {
                  const selected = contactMethods.find(m => m.value === formData.preferredContactMethod);
                  return selected ? (
                    <>
                      <Icon icon={selected.icon} className="w-4 h-4 text-brand" />
                      <span>{selected.label}</span>
                    </>
                  ) : null;
                })()}
              </span>
              <Icon
                icon="material-symbols:keyboard-arrow-down"
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${methodDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {methodDropdownOpen && (
              <div className="relative z-50">
                <div
                  className="absolute top-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  style={{ animation: 'fadeIn 0.15s ease-out' }}
                >
                  {contactMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, preferredContactMethod: method.value });
                        setMethodDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                        formData.preferredContactMethod === method.value
                          ? 'bg-brand/5 text-brand font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        icon={method.icon}
                        className={`w-4 h-4 ${formData.preferredContactMethod === method.value ? 'text-brand' : 'text-gray-400'}`}
                      />
                      <span>{method.label}</span>
                      {formData.preferredContactMethod === method.value && (
                        <Icon icon="material-symbols:check" className="w-4 h-4 text-brand ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unidad de interés - Dropdown personalizado */}
          {units.length > 0 && (
            <div ref={unitDropdownRef}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Unidad de interés (opcional)
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm hover:border-gray-400 transition-all duration-200 text-sm"
                >
                  <span className={`${formData.selectedUnitId ? 'text-gray-700' : 'text-gray-400'}`}>
                    {formData.selectedUnitId || 'Selecciona una unidad'}
                  </span>
                  <Icon
                    icon="material-symbols:keyboard-arrow-down"
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${unitDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {unitDropdownOpen && (
                  <div className="relative z-50">
                    <div
                      className="absolute top-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                      style={{ animation: 'fadeIn 0.15s ease-out' }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, selectedUnitId: '' });
                          setUnitDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                          !formData.selectedUnitId
                            ? 'bg-brand/5 text-brand font-semibold'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span>Selecciona una unidad</span>
                        {!formData.selectedUnitId && (
                          <Icon icon="material-symbols:check" className="w-4 h-4 text-brand ml-auto" />
                        )}
                      </button>
                      {units.filter(u => u.status === 'AVAILABLE').map((unit) => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, selectedUnitId: unit.unitNumber });
                            setUnitDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                            formData.selectedUnitId === unit.unitNumber
                              ? 'bg-brand/5 text-brand font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{unit.unitNumber} - {unit.bedrooms} dorm - {currency} {unit.price?.toLocaleString('en-US')}</span>
                          {formData.selectedUnitId === unit.unitNumber && (
                            <Icon icon="material-symbols:check" className="w-4 h-4 text-brand ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mensaje */}
          <div>
            <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1.5">
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 ${
                errors.message
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50'
              }`}
              placeholder="Hola, me interesa este proyecto..."
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>

        {/* WhatsApp Button */}
        {project.developer?.phone && (
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir por WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* ── DESARROLLADOR — clic para ver perfil completo ── */}
      {project.developer?.companyName && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowDeveloperModal(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowDeveloperModal(true);
            }
          }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:border-[var(--brand-primary)] hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {project.developer.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{project.developer.companyName}</p>
              <p className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
                Desarrollador · Ver perfil <ChevronRight className="w-3 h-3" />
              </p>
            </div>
            {project.developer.phone && (
              <a
                href={`tel:${project.developer.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap transition-colors"
              >
                Ver teléfono
              </a>
            )}
          </div>
          {project.developer.ruc && (
            <p className="mt-2 text-xs text-gray-400">RUC: {project.developer.ruc}</p>
          )}
        </div>
      )}

      {/* ── ESTADÍSTICAS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Estadísticas</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { v: project.viewsCount ?? 0, l: 'Visitas' },
            { v: (project as any).favoritesCount ?? 0, l: 'Favoritos' },
            { v: project.contactsCount ?? 0, l: 'Contactos' },
          ].map(({ v, l }) => (
            <div key={l} className="bg-gray-50 rounded-xl p-3">
              <div className="text-xl font-bold text-gray-900">{v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {publishedDate && (
          <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            Publicado el {publishedDate}
          </p>
        )}
      </div>

      {/* Modal de inicio de sesión para favoritos */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-6 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Guardar en Favoritos</h3>
              <p className="text-rose-100 text-sm mt-1">Inicia sesión para guardar este proyecto</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Debes iniciar sesión o crear una cuenta para agregar proyectos a tus favoritos.
                  </p>
                </div>
              </div>
              <button onClick={() => router.push('/login')} className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Iniciar Sesión
              </button>
              <button onClick={() => router.push('/register')} className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /> Crear una Cuenta
              </button>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
              <button onClick={() => setShowLoginModal(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Ahora no, gracias
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de detalle del desarrollador */}
      <DeveloperDetailModal
        developerId={project.developer?.id || 0}
        isOpen={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
      />
    </div>
  );
}
