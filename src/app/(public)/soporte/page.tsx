/**
 * Soporte Page
 * Página completa de soporte/incidencias para usuarios.
 * Reemplaza el modal anterior. Incluye:
 * - Categorías con iconos por perfil
 * - Texto informativo
 * - FAQ con preguntas frecuentes
 * - Formulario con checkbox de aceptación
 * - Campos de contacto para usuarios sin cuenta
 */

'use client';

import { useState } from 'react';
import { useCreateSupportTicket } from '@/presentation/hooks/admin/useSupportTickets';
import { useAuthStore } from '@/presentation/store/authStore';
import { TicketCategory, TicketSeverity } from '@/core/domain/entities/Admin';
import {
  X, Send, AlertCircle, CheckCircle2, HelpCircle, Loader2,
  UserCheck, Home, Building2, Search, DollarSign, Scale, MessageCircle,
  ChevronDown, ChevronUp, ExternalLink, Mail, Phone, User
} from 'lucide-react';
import Link from 'next/link';

// ==================== Constants ====================

const PROFILE_CATEGORIES: { value: TicketCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'ACCOUNT_ISSUE', label: 'Soy profesional', icon: <UserCheck className="w-5 h-5" />, desc: 'Agente inmobiliario, corredor o asesor' },
  { value: 'PROPERTY_ISSUE', label: 'Soy dueño directo', icon: <Home className="w-5 h-5" />, desc: 'Propietario que publica sus inmuebles' },
  { value: 'OTHER', label: 'Soy constructora', icon: <Building2 className="w-5 h-5" />, desc: 'Empresa constructora o desarrolladora' },
  { value: 'WRONG_EMAIL', label: 'Busco propiedades', icon: <Search className="w-5 h-5" />, desc: 'Comprador o inquilino buscando inmuebles' },
  { value: 'PAYMENT_ISSUE', label: 'Cobranzas y Finanzas', icon: <DollarSign className="w-5 h-5" />, desc: 'Facturación, pagos o suscripciones' },
  { value: 'PASSWORD_CHANGE', label: 'Legales', icon: <Scale className="w-5 h-5" />, desc: 'Aspectos legales, términos o reclamaciones' },
  { value: 'SYSTEM_ERROR', label: 'Comunícate con nosotros', icon: <MessageCircle className="w-5 h-5" />, desc: 'Consulta general, sugerencia o soporte técnico' },
];

const SEVERITIES: { value: TicketSeverity; label: string; color: string }[] = [
  { value: 'LOW', label: 'Baja - Consulta simple', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'MEDIUM', label: 'Media - Necesito ayuda', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'HIGH', label: 'Alta - Problema urgente', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'CRITICAL', label: 'Crítica - Sistema caído', color: 'bg-red-100 text-red-700 border-red-200' },
];

const FAQS = [
  {
    q: 'PREGUNTA 1: ¿Cómo publico una propiedad?',
    a: 'Para publicar una propiedad, ingresa a tu panel principal y selecciona "Publicar Propiedad". Completa la información solicitada, agrega fotografías de calidad, ubicación, precio y características del inmueble. Una vez revisados los datos, guarda y publica el anuncio.',
  },
  {
    q: 'PREGUNTA 2: ¿Cómo edito una publicación existente?',
    a: 'Dirígete a la sección "Mis Propiedades", selecciona la propiedad que deseas modificar y presiona "Editar". Realiza los cambios necesarios y guarda la información actualizada. Los cambios podrían reflejarse en la plataforma después de unos minutos.',
  },
  {
    q: 'PREGUNTA 3: ¿Por qué mi propiedad no aparece en los resultados?',
    a: 'Esto puede deberse a que la publicación se encuentra pendiente de validación, está incompleta o no cumple algún requisito de visualización. Verifica que todos los datos estén completos y que la propiedad se encuentre activa.',
  },
  {
    q: 'PREGUNTA 4: ¿Cómo recuperar el acceso a mi cuenta?',
    a: 'Utiliza la opción "Olvidé mi contraseña" en la pantalla de inicio de sesión. Recibirás instrucciones en tu correo electrónico para restablecer el acceso de forma segura.',
  },
  {
    q: 'PREGUNTA 5: ¿Cómo actualizar mi plan o suscripción?',
    a: 'Accede a la sección "Planes y Suscripciones" desde tu perfil. Allí podrás revisar los beneficios disponibles, actualizar tu plan o gestionar la renovación de tu suscripción.',
  },
  {
    q: 'PREGUNTA 6: ¿Cómo reportar una publicación incorrecta?',
    a: 'Si encuentras información engañosa, contenido inapropiado o datos incorrectos, utiliza la opción "Reportar" disponible en la publicación. Nuestro equipo revisará el caso y tomará las acciones correspondientes.',
  },
  {
    q: 'PREGUNTA 7: ¿Cómo contactar a un anunciante?',
    a: 'Puedes utilizar los medios de contacto habilitados en la publicación, como formulario de contacto, teléfono o mensajería interna, según la información proporcionada por el anunciante.',
  },
  {
    q: 'PREGUNTA 8: ¿Cómo solicitar soporte técnico?',
    a: 'Si experimentas errores, problemas de acceso o fallos en alguna funcionalidad, envía un ticket de soporte describiendo detalladamente la incidencia. Incluye capturas de pantalla y los pasos realizados para ayudarnos a identificar el problema.',
  },
];

// ==================== Component ====================

export default function SoportePage() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const [step, setStep] = useState<'info' | 'category' | 'form' | 'success'>('info');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<TicketSeverity>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const createMutation = useCreateSupportTicket();

  const handleSelectCategory = (category: TicketCategory) => {
    setSelectedCategory(category);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      setError('Completa todos los campos requeridos');
      return;
    }
    if (!isAuthenticated && !guestEmail.trim()) {
      setError('Debes proporcionar tu correo electrónico para que podamos responderte');
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los términos para enviar la incidencia');
      return;
    }
    setError('');
    try {
      const request: any = {
        subject: subject.trim(),
        description: description.trim(),
        category: selectedCategory!,
        severity: selectedSeverity,
      };
      // Si no está autenticado, enviar datos de contacto
      if (!isAuthenticated) {
        request.guestName = guestName.trim() || undefined;
        request.guestEmail = guestEmail.trim() || undefined;
        request.guestPhone = guestPhone.trim() || undefined;
      }
      await createMutation.mutateAsync(request);
      setStep('success');
    } catch (err) {
      setError('Error al enviar la incidencia. Intenta de nuevo.');
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('category');
      setError('');
    } else if (step === 'category') {
      setStep('info');
    }
  };

  const resetForm = () => {
    setStep('info');
    setSelectedCategory(null);
    setSelectedSeverity('MEDIUM');
    setSubject('');
    setDescription('');
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setAcceptedTerms(false);
    setError('');
    setExpandedFaq(null);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
      {/* Hero Header - Color verde de la app */}
      <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)] text-white">
        <div className="max-w-8xl mx-auto px-4 py-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Centro de Soporte</h1>
              <p className="text-white/80 mt-1">Estamos aquí para ayudarte</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step: Info / Welcome - Layout de 2 columnas con igual altura */}
        {step === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Informative Text + CTA */}
            <div className="flex flex-col">
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6 sm:p-8 flex flex-col flex-1">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                  ¿Cómo podemos ayudarte?
                </h2>
                <div className="prose prose-sm text-[var(--text-secondary)] max-w-none flex-1">
                  <p>
                    Nuestro equipo de soporte está disponible para ayudarte con cualquier incidencia,
                    consulta o inconveniente relacionado con la plataforma. Antes de enviar una solicitud,
                    revisa las preguntas frecuentes, ya que muchas consultas comunes pueden resolverse
                    de forma inmediata.
                  </p>
                  <p className="mt-3">
                    Al enviar un ticket de soporte, aceptas que nuestro equipo podrá revisar la información
                    relacionada con tu cuenta y la incidencia reportada con el fin de brindarte una solución
                    adecuada. Para agilizar la atención, proporciona una descripción clara y detallada del
                    problema, incluyendo capturas de pantalla si es posible.
                  </p>
                  <p className="mt-3">
                    Las solicitudes son evaluadas según su prioridad y complejidad. El tiempo de respuesta
                    habitual es de hasta 24 horas hábiles, aunque algunos casos que requieran validaciones
                    adicionales o intervención técnica especializada pueden tomar más tiempo.
                  </p>
                  <p className="mt-3">
                    Nuestro objetivo es ofrecer una solución eficiente y mantenerte informado sobre el
                    estado de tu solicitud durante todo el proceso. Agradecemos tu paciencia y colaboración
                    mientras trabajamos para resolver tu caso.
                  </p>
                </div>

                {/* CTA Button - debajo del texto de la izquierda */}
                <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                  <button
                    onClick={() => setStep('category')}
                    className="w-full px-6 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-xl font-medium transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-primary)]/25"
                  >
                    <Send className="w-4 h-4" />
                    Reportar Incidencia
                  </button>
                  <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
                    Si no encontraste respuesta en las preguntas frecuentes, repórtanos tu caso.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: FAQ */}
            <div className="flex flex-col">
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6 sm:p-8 flex flex-col flex-1">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                  Preguntas Frecuentes
                </h2>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {FAQS.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-[var(--border-color)] rounded-xl overflow-hidden transition-all hover:border-[var(--border-light)]"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <span className="font-medium text-[var(--text-primary)] text-sm pr-4">{faq.q}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 border-t border-[var(--border-light)] pt-3">
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                          <button
                            onClick={() => setStep('category')}
                            className="mt-3 text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium flex items-center gap-1 transition-colors"
                          >
                            ¿No resolviste tu duda? Reportar incidencia
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Category Selection */}
        {step === 'category' && (
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">¿Cuál es tu perfil?</h2>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">Selecciona la opción que mejor describa tu situación</p>
              </div>
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="grid gap-3">
              {PROFILE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleSelectCategory(cat.value)}
                  className="flex items-center gap-4 p-5 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] group-hover:bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--text-primary)]">{cat.label}</p>
                    <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{cat.desc}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-[var(--border-color)] group-hover:border-[var(--brand-primary)] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full group-hover:bg-[var(--brand-primary)] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === 'form' && (
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Describe tu incidencia</h2>
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  {PROFILE_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                </p>
              </div>
              <button
                onClick={handleBack}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Guest contact fields - only show if not authenticated */}
              {!isAuthenticated && (
                <>
                  <div className="bg-[var(--brand-primary-light)] border border-[var(--brand-primary)]/20 rounded-xl p-4">
                    <p className="text-sm text-[var(--brand-primary)]">
                      No has iniciado sesión. Proporciona tus datos de contacto para que podamos responderte.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                        Nombre <span className="text-[var(--text-muted)]">(opcional)</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                        Teléfono <span className="text-[var(--text-muted)]">(opcional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+51 999 999 999"
                          className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <hr className="border-[var(--border-color)]" />
                </>
              )}

              {/* Severity selector */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">¿Qué tan urgente es?</label>
                <div className="grid grid-cols-2 gap-2">
                  {SEVERITIES.map((sev) => (
                    <button
                      key={sev.value}
                      onClick={() => setSelectedSeverity(sev.value)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        selectedSeverity === sev.value
                          ? `${sev.color} ring-2 ring-offset-1`
                          : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-light)]'
                      }`}
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: No puedo publicar una propiedad"
                  className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el problema en detalle. Cuanto más información nos des, más rápido podremos ayudarte. Incluye capturas de pantalla si es posible."
                  rows={5}
                  className="w-full px-4 py-2.5 border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent resize-none transition-all bg-[var(--bg-primary)] text-[var(--text-primary)]"
                />
              </div>

              {/* Legal Notice */}
              <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  Al enviar una incidencia, nuestro equipo analizará la información proporcionada y
                  podrá revisar datos relacionados con tu cuenta para resolver el problema. El tiempo
                  de respuesta habitual es de hasta 24 horas hábiles, aunque algunos casos complejos
                  pueden requerir más tiempo. Recibirás actualizaciones sobre el estado de tu solicitud
                  dentro de la plataforma o por correo electrónico.
                </p>
              </div>

              {/* Acceptance Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  Acepto que mi incidencia sea revisada por el equipo de soporte y que se acceda a
                  la información necesaria de mi cuenta para resolver el problema.
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ← Cambiar categoría
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!subject.trim() || !description.trim() || !acceptedTerms || createMutation.isPending}
                  className="px-6 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] disabled:bg-[var(--bg-tertiary)] disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Incidencia
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[var(--brand-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">¡Incidencia Reportada!</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-2">
              Hemos recibido tu reporte. Nuestro equipo de soporte lo revisará y te notificaremos
              cuando haya una solución.
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-8">
              Recibirás la respuesta en tu correo y dentro de la plataforma.
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-xl font-medium transition-all"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
