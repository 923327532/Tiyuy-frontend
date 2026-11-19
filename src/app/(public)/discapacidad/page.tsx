'use client';

import { useState } from 'react';
import { useCreateSupportTicket } from '@/presentation/hooks/admin/useSupportTickets';
import { useAuthStore } from '@/presentation/store/authStore';
import { TicketCategory, TicketSeverity } from '@/core/domain/entities/Admin';
import { PublicPageHero } from '@/presentation/components/layout/PublicPageHero';
import {
  X, Send, AlertCircle, CheckCircle2, Shield, Loader2, HelpCircle,
  Scale, Users, Eye, ChevronDown, ChevronUp, Heart, Accessibility,
  DoorOpen, ChevronLeft, ChevronRight, Car, Volume2, Braces, Monitor,
  ArrowRight, FileText, Flag
} from 'lucide-react';
import Link from 'next/link';


const SUPPORT_TYPES: { value: TicketCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'PROPERTY_ISSUE', label: 'Información de accesibilidad', icon: <DoorOpen className="w-5 h-5" />, desc: 'Solicitar detalles sobre accesos, baños o rutas de una propiedad' },
  { value: 'OTHER', label: 'Ajuste razonable en visita', icon: <Users className="w-5 h-5" />, desc: 'Necesito apoyo adicional para realizar una visita presencial' },
  { value: 'SYSTEM_ERROR', label: 'Apoyo en plataforma', icon: <Monitor className="w-5 h-5" />, desc: 'Dificultad para usar la web o app por mi condición' },
  { value: 'WRONG_EMAIL', label: 'Reportar falta de accesibilidad', icon: <Eye className="w-5 h-5" />, desc: 'Un anuncio no informa correctamente sus condiciones de acceso' },
  { value: 'ACCOUNT_ISSUE', label: 'Otra solicitud', icon: <HelpCircle className="w-5 h-5" />, desc: 'Otro tipo de apoyo relacionado con accesibilidad' },
];

const ACCESSIBILITY_FEATURES = [
  { icon: <ChevronLeft className="w-5 h-5" />, title: 'Acceso sin escalones', desc: 'Entrada principal a nivel de calle o con rampa' },
  { icon: <DoorOpen className="w-5 h-5" />, title: 'Puertas anchas', desc: 'Puertas de al menos 80 cm de ancho para silla de ruedas' },
  { icon: <Accessibility className="w-5 h-5" />, title: 'Baño accesible', desc: 'Baño con barras de apoyo, ducha a nivel y espacio de giro' },
  { icon: <Car className="w-5 h-5" />, title: 'Estacionamiento accesible', desc: 'Espacio de estacionamiento reservado y cercano al ingreso' },
  { icon: <ChevronRight className="w-5 h-5" />, title: 'Rutas despejadas', desc: 'Pasillos y circulaciones libres de obstáculos' },
  { icon: <Volume2 className="w-5 h-5" />, title: 'Señalización clara', desc: 'Información visible, contrastes adecuados y señales táctiles' },
];

const FAQS = [
  {
    q: '¿Puedo solicitar información de accesibilidad antes de visitar?',
    a: 'Sí. Puedes usar el formulario de esta página para solicitar detalles específicos sobre accesibilidad de cualquier propiedad publicada en Tiyuy. Nos comunicaremos con el anunciante para obtener la información y te la haremos llegar.',
  },
  {
    q: '¿Qué tipo de ajustes razonables puedo solicitar?',
    a: 'Desde apoyo para realizar una visita (acompañamiento, intérprete, material en braille) hasta solicitar que el anunciante proporcione información detallada sobre medidas, accesos y condiciones del inmueble.',
  },
  {
    q: '¿Cuánto tiempo tarda una solicitud?',
    a: 'Nuestro equipo revisa cada solicitud en un plazo máximo de 48 horas hábiles y coordina con el anunciante la respuesta. Casos urgentes pueden priorizarse indicando la gravedad en el formulario.',
  },
  {
    q: '¿Los anunciantes están obligados a responder?',
    a: 'Tiyuy recomienda y espera que todos los anunciantes proporcionen información veraz sobre accesibilidad. Si un anunciante no responde o la información es incorrecta, puedes reportarlo y tomaremos las medidas correspondientes.',
  },
  {
    q: '¿Puedo denunciar si un anuncio miente sobre accesibilidad?',
    a: 'Sí. Usa la opción "Reportar falta de accesibilidad" en el formulario. Investigaremos el caso y, si se confirma la información falsa, tomaremos acciones que pueden incluir la suspensión del anuncio.',
  },
];

export default function DiscapacidadPage() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>('PROPERTY_ISSUE');
  const [selectedSeverity, setSelectedSeverity] = useState<TicketSeverity>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [propertyLink, setPropertyLink] = useState('');
  const [supportDate, setSupportDate] = useState('');
  const [preferredChannel, setPreferredChannel] = useState('EMAIL');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const createMutation = useCreateSupportTicket();

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      setError('Completa todos los campos requeridos');
      return;
    }
    if (!isAuthenticated && !guestEmail.trim()) {
      setError('Debes proporcionar tu correo para que podamos contactarte');
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los términos para enviar la solicitud');
      return;
    }
    setError('');
    try {
      const request: any = {
        subject: `[DISCAPACIDAD] ${subject.trim()}`,
        description: `Propiedad: ${propertyLink || 'No especificada'}\nFecha: ${supportDate || 'No especificada'}\nCanal: ${preferredChannel}\n\n${description.trim()}`,
        category: selectedCategory,
        severity: selectedSeverity,
      };
      if (!isAuthenticated) {
        request.guestName = guestName.trim() || undefined;
        request.guestEmail = guestEmail.trim() || undefined;
        request.guestPhone = guestPhone.trim() || undefined;
      }
      await createMutation.mutateAsync(request);
      setStep('success');
    } catch {
      setError('Error al enviar la solicitud. Intenta de nuevo.');
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <PublicPageHero
        eyebrow="Accesibilidad"
        icon={<Accessibility className="h-4 w-4" />}
        title={<>Apoyo a personas con <span className="text-[var(--brand-primary)]">discapacidad</span></>}
        description="Accesibilidad, inclusión y acompañamiento para todos. Estamos aquí para garantizar que todas las personas encuentren un hogar sin barreras."
        imageSrc="/assets/help-discap.png"
        imageAlt="Mujer en silla de ruedas y niña compartiendo un momento de inclusión"
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-[var(--brand-primary-hover)]"
          >
            <Send className="h-4 w-4" />
            Solicitar apoyo
          </button>
          <Link
            href="#faq"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-6 py-3.5 font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-primary)]/40"
          >
            <HelpCircle className="h-4 w-4" />
            Ver preguntas frecuentes
          </Link>
        </div>
      </PublicPageHero>


      {step === 'info' && (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 space-y-10">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Compromiso */}
            <div className="group bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[var(--brand-primary)]/3 to-transparent blur-2xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Nuestro compromiso</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">Una plataforma para todos</h2>
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                    En Tiyuy creemos que encontrar un hogar es un derecho, no un privilegio. Trabajamos para
                    que nuestra plataforma sea accesible, inclusiva y útil para todas las personas,
                    independientemente de sus capacidades.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                    Nadie puede ser discriminado por su discapacidad en Tiyuy. Todos los anunciantes deben
                    describir de forma honesta y clara las condiciones de accesibilidad de sus propiedades.
                    Si necesitas información adicional o apoyo para realizar una visita, estamos aquí para ayudarte.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* Apoyo disponible */}
            <div className="group bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, var(--brand-primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Apoyo disponible</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">¿Qué tipo de apoyo puedes solicitar?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: <DoorOpen className="w-5 h-5" />, title: 'Info de accesibilidad', desc: 'Detalles sobre accesos, baños, estacionamiento y rutas de una propiedad.' },
                    { icon: <Users className="w-5 h-5" />, title: 'Acompañamiento en visita', desc: 'Solicita apoyo adicional para realizar una visita presencial.' },
                    { icon: <Volume2 className="w-5 h-5" />, title: 'Comunicación accesible', desc: 'Información en braille, letra grande, audio o formato adaptado.' },
                    { icon: <Monitor className="w-5 h-5" />, title: 'Apoyo en plataforma', desc: 'Asistencia para navegar, publicar o contactar en la web o app.' },
                    { icon: <Eye className="w-5 h-5" />, title: 'Reportar incumplimiento', desc: 'Denunciar anuncios que no informan correctamente su accesibilidad.' },
                    { icon: <HelpCircle className="w-5 h-5" />, title: 'Otro ajuste razonable', desc: 'Cualquier otra solicitud que necesites para participar en igualdad de condiciones.' },
                  ].map((item, idx) => (
                    <div key={idx} className="group/card bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-5 hover:border-[var(--brand-primary)]/30 hover:shadow-[0_4px_20px_rgba(74,154,62,0.06)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-2xl rounded-full pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 flex items-center justify-center text-[var(--brand-primary)] mb-4 border border-[var(--border-light)] group-hover/card:bg-gradient-to-br group-hover/card:from-[var(--brand-primary)]/25 group-hover/card:to-[var(--brand-primary)]/10 group-hover/card:border-[var(--brand-primary)]/20 transition-all duration-200">
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">{item.title}</h4>
                        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* Accesibilidad en anuncios */}
            <div className="group bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[var(--brand-primary)]/3 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, var(--brand-primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                    <Accessibility className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Anuncios accesibles</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2">Características que un anuncio debería informar</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-medium">
                  Los anunciantes deben describir con claridad las condiciones de accesibilidad de sus
                  propiedades para que puedas tomar decisiones informadas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACCESSIBILITY_FEATURES.map((feat, idx) => (
                    <div key={idx} className="group/card flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--brand-primary)]/30 hover:shadow-[0_4px_20px_rgba(74,154,62,0.06)] hover:-translate-y-0.5 transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 flex items-center justify-center text-[var(--brand-primary)] flex-shrink-0 border border-[var(--border-light)] group-hover/card:bg-gradient-to-br group-hover/card:from-[var(--brand-primary)]/25 group-hover/card:to-[var(--brand-primary)]/10 group-hover/card:border-[var(--brand-primary)]/20 transition-all duration-200">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm mb-1">{feat.title}</h4>
                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* FAQ */}
            <div className="group bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300" id="faq">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Preguntas</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Preguntas frecuentes</h2>
                <div className="space-y-4">
                  {FAQS.map((faq, index) => (
                    <div key={index} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                      expandedFaq === index
                        ? 'border-[var(--brand-primary)]/40 shadow-[0_2px_12px_rgba(74,154,62,0.08)]'
                        : 'border-[var(--border-light)] hover:border-[var(--brand-primary)]/30'
                    } bg-[var(--bg-card)]`}>
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <span className={`font-bold pr-4 transition-colors ${
                          expandedFaq === index ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'
                        }`}>{faq.q}</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          expandedFaq === index
                            ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}>
                          {expandedFaq === index ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                      {expandedFaq === index && (
                        <div className="px-5 pb-5 border-t border-[var(--border-light)] pt-4 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)]">
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* CTA */}
            <div className="group bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-card)] rounded-3xl p-8 sm:p-12 text-center border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.08)] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/3 via-transparent to-[var(--brand-primary)]/3 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[var(--brand-primary)]/8 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, var(--brand-primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 flex items-center justify-center mx-auto mb-6 border border-[var(--brand-primary)]/20">
                  <Accessibility className="w-10 h-10 text-[var(--brand-primary)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">¿Necesitas apoyo o información?</h2>
                <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto mb-8 font-medium leading-relaxed">
                  Estamos aquí para ayudarte. Cuéntanos qué necesitas y te responderemos a la brevedad.
                </p>
                <button onClick={() => setStep('form')}
                  className="px-8 py-4 bg-[var(--brand-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Solicitar apoyo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {step === 'form' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[var(--border-light)] p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--border-light)] pb-6">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)]">Solicitar apoyo</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Cuéntanos qué necesitas y te ayudaremos</p>
              </div>
              <button onClick={() => setStep('info')} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
                <X className="w-6 h-6 text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <div className="space-y-6">
              {!isAuthenticated && (
                <>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
                    <p className="text-sm text-amber-800 dark:text-amber-400 font-medium leading-relaxed">Si nos dejas tus datos podremos darte seguimiento personalizado.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Nombre <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                      <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                        placeholder="Tu nombre" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Teléfono <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                      <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                        placeholder="+51 999 999 999" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Correo electrónico <span className="text-red-500">*</span></label>
                    <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                  </div>
                  <hr className="border-[var(--border-light)] my-2" />
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Tipo de apoyo</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUPPORT_TYPES.map(cat => (
                    <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
                      className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                        selectedCategory === cat.value ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border-light)] hover:border-[var(--brand-primary)]/30 bg-[var(--bg-secondary)]'
                      }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedCategory === cat.value ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]' : 'bg-[var(--bg-primary)] border border-[var(--border-light)] text-[var(--text-muted)]'}`}>{cat.icon}</div>
                      <div>
                        <p className={`font-bold text-sm mb-1 ${selectedCategory === cat.value ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'}`}>{cat.label}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Propiedad relacionada <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                  <input type="text" value={propertyLink} onChange={e => setPropertyLink(e.target.value)}
                    placeholder="URL o nombre del anuncio" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Fecha de necesidad <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                  <input type="date" value={supportDate} onChange={e => setSupportDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Asunto <span className="text-red-500">*</span></label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Ej: Necesito información sobre accesibilidad de un departamento" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Descripción <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Cuéntanos qué necesitas con el mayor detalle posible. Por ejemplo: tipo de apoyo, fechas estimadas, preguntas específicas sobre la propiedad, etc."
                  rows={5} className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Urgencia</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {[{v:'LOW',l:'Baja',c:'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-light)]'},{v:'MEDIUM',l:'Media',c:'bg-yellow-100 text-yellow-700 border-yellow-200'},{v:'HIGH',l:'Alta',c:'bg-orange-100 text-orange-700 border-orange-200'},{v:'CRITICAL',l:'Urgente',c:'bg-red-100 text-red-700 border-red-200'}].map(sev => (
                    <button key={sev.v} onClick={() => setSelectedSeverity(sev.v as TicketSeverity)}
                      className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedSeverity === sev.v ? `${sev.c} ring-2 ring-offset-2 ring-offset-[var(--bg-card)] ring-${sev.c.includes('red') ? 'red' : sev.c.includes('orange') ? 'orange' : sev.c.includes('yellow') ? 'yellow' : 'gray'}-500` : 'border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-light)]/80'
                      }`}>{sev.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">¿Cómo prefieres que te contactemos? <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                <div className="flex flex-wrap gap-3">
                  {[{v:'EMAIL',l:'Email'},{v:'PHONE',l:'Teléfono'},{v:'WHATSAPP',l:'WhatsApp'}].map(ch => (
                    <button key={ch.v} onClick={() => setPreferredChannel(ch.v)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        preferredChannel === ch.v ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/30' : 'border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/30'
                      }`}>{ch.l}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-light)]">
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  Al enviar esta solicitud, autorizas a Tiyuy a revisar la información proporcionada y
                  coordinar con el anunciante si es necesario. Tu identidad y datos serán tratados de
                  forma confidencial.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[var(--border-light)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-primary)]" />
                <span className="text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                  Acepto que Tiyuy gestione mi solicitud y se comunique conmigo para brindarme apoyo.
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-bold border border-red-200 dark:border-red-900/30">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-[var(--border-light)] gap-4">
                <button onClick={() => setStep('info')} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">← Volver</button>
                <button onClick={handleSubmit}
                  disabled={!subject.trim() || !description.trim() || !acceptedTerms || createMutation.isPending}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--bg-primary)] rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                  {createMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</> : <><Send className="w-5 h-5" /> Enviar Solicitud</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[var(--border-light)] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6 border border-green-200 dark:border-green-900/30">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">Solicitud recibida</h2>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-4 font-medium leading-relaxed">
                Hemos recibido tu solicitud. Nuestro equipo la revisará y te contactará a la brevedad
                para brindarte el apoyo que necesitas.
              </p>
              <p className="text-sm text-[var(--text-muted)] font-bold mb-10">Recibirás actualizaciones en tu correo.</p>
              <button onClick={() => setStep('info')}
                className="px-8 py-3.5 bg-[var(--brand-primary)] hover:opacity-90 text-[var(--bg-primary)] rounded-xl font-bold transition-all shadow-sm">Volver al inicio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
