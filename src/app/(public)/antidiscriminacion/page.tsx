'use client';

import { useState } from 'react';
import { useCreateSupportTicket } from '@/presentation/hooks/admin/useSupportTickets';
import { useAuthStore } from '@/presentation/store/authStore';
import { TicketCategory, TicketSeverity } from '@/core/domain/entities/Admin';
import {
  X, Send, AlertCircle, CheckCircle2, Shield, Loader2, HelpCircle,
  Scale, Users, MessageCircle, Eye, Ban, Flag, ChevronDown, ChevronUp,
  ExternalLink, Mail, Phone, User, Heart, FileText, ShieldAlert, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const DISCRIMINATION_CATEGORIES: { value: TicketCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'PROPERTY_ISSUE', label: 'Publicación discriminatoria', icon: <Ban className="w-5 h-5" />, desc: 'Un anuncio contiene lenguaje o condiciones excluyentes' },
  { value: 'OTHER', label: 'Trato discriminatorio', icon: <Users className="w-5 h-5" />, desc: 'Me rechazaron o trataron diferente por quién soy' },
  { value: 'SYSTEM_ERROR', label: 'Mensaje ofensivo', icon: <MessageCircle className="w-5 h-5" />, desc: 'Recibí comentarios inapropiados, humillantes o discriminatorios' },
  { value: 'ACCOUNT_ISSUE', label: 'Símbolos o imágenes de odio', icon: <Eye className="w-5 h-5" />, desc: 'Una publicación incluye contenido ofensivo o excluyente' },
  { value: 'WRONG_EMAIL', label: 'Otra conducta discriminatoria', icon: <Flag className="w-5 h-5" />, desc: 'Otra situación que considero discriminatoria en la plataforma' },
];

const SEVERITIES: { value: TicketSeverity; label: string; color: string }[] = [
  { value: 'HIGH', label: 'Grave - Urgente', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
  { value: 'MEDIUM', label: 'Media - Requiere atención', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' },
  { value: 'LOW', label: 'Informativo - Consulta', color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' },
];

const FAQS = [
  {
    q: '¿Qué características están protegidas?',
    a: 'En Tiyuy está prohibido discriminar por raza, color, religión, nacionalidad, origen étnico, discapacidad, sexo, género, identidad de género, expresión de género, orientación sexual, edad, estado civil, situación migratoria, condición socioeconómica, apariencia física o cualquier otra característica protegida por la ley.',
  },
  {
    q: '¿Puedo establecer reglas en mi propiedad?',
    a: 'Sí, siempre que se apliquen por igual a todas las personas interesadas y no sean una excusa para discriminar. Por ejemplo: "No se permiten mascotas" o "No fumar dentro del inmueble" son reglas válidas porque aplican a todos por igual. "No acepto familias con niños" no lo es.',
  },
  {
    q: '¿Qué hace Tiyuy cuando recibe una denuncia?',
    a: 'Nuestro equipo revisa el caso, evalúa la evidencia y puede tomar medidas que van desde solicitar la modificación del contenido hasta la suspensión definitiva de la cuenta. Dependiendo de la gravedad, también podemos reportar el caso a las autoridades competentes.',
  },
  {
    q: '¿Puedo denunciar de forma anónima?',
    a: 'Sí, aceptamos denuncias anónimas. Sin embargo, proporcionar tus datos de contacto nos permite darte seguimiento y notificarte sobre las acciones tomadas.',
  },
  {
    q: '¿Qué no se considera discriminación?',
    a: 'No se considera discriminación establecer requisitos objetivos y aplicables a todos, como capacidad de pago, referencias verificables, políticas de mascotas o no fumar, siempre que no se usen como pretexto para excluir a grupos protegidos.',
  },
];

const PROHIBITED_CONDUCTS = [
  {
    title: 'Trato diferenciado',
    desc: 'Rechazar, condicionar o dar un trato distinto a una persona basándose en una característica protegida.',
    example: '"No alquilo a extranjeros", "Solo para familias tradicionales", "No aceptamos personas con discapacidad".',
  },
  {
    title: 'Lenguaje discriminatorio',
    desc: 'Usar términos ofensivos, estereotipos o expresiones que denigren a una persona o grupo en descripciones, mensajes o durante visitas.',
    example: '"Zona segura, sin problemas", "Solo personas serias y de buena familia", comentarios sobre origen o apariencia.',
  },
  {
    title: 'Condiciones excluyentes',
    desc: 'Establecer requisitos que en la práctica excluyan a ciertos grupos sin una razón objetiva.',
    example: '"Se requiere DNI peruano", "No aceptamos parejas del mismo sexo", "Solo peruanos".',
  },
  {
    title: 'Símbolos o imágenes ofensivas',
    desc: 'Publicar imágenes, símbolos o mensajes que promuevan odio, exclusión o discriminación.',
    example: 'Símbolos religiosos excluyentes, imágenes que denigren a grupos, mensajes con contenido de odio.',
  },
  {
    title: 'Reglas neutras con efecto discriminatorio',
    desc: 'Aplicar reglas que parecen neutrales pero que en la práctica afectan desproporcionadamente a ciertos grupos.',
    example: 'Exigir referencias laborales que solo ciertos grupos pueden obtener, o requisitos de ingreso que excluyen indirectamente.',
  },
];

const ScaleIllustration = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" className="fill-[var(--brand-primary)]/5" />
    <circle cx="100" cy="100" r="70" className="fill-[var(--brand-primary)]/10" />
    <rect x="60" y="40" width="80" height="12" rx="6" className="fill-[var(--brand-primary)]/30" />
    <line x1="100" y1="52" x2="100" y2="80" className="stroke-[var(--brand-primary)]" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 80L100 90L145 80" className="stroke-[var(--brand-primary)]" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 80L40 120" className="stroke-[var(--brand-primary)]/50" strokeWidth="3" strokeLinecap="round" />
    <path d="M145 80L160 120" className="stroke-[var(--brand-primary)]/50" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="130" r="15" className="fill-[var(--brand-primary)]/20 stroke-[var(--brand-primary)]" strokeWidth="2" />
    <circle cx="160" cy="130" r="15" className="fill-[var(--brand-primary)]/20 stroke-[var(--brand-primary)]" strokeWidth="2" />
    <path d="M35 130L40 125L45 130" className="stroke-[var(--brand-primary)]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M155 130L160 125L165 130" className="stroke-[var(--brand-primary)]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AntidiscriminacionPage() {
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
  const [reportedUser, setReportedUser] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [preferredChannel, setPreferredChannel] = useState('EMAIL');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedConduct, setExpandedConduct] = useState<number | null>(null);

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
      setError('Debes aceptar los términos para enviar la denuncia');
      return;
    }
    setError('');
    try {
      const request: any = {
        subject: `[DISCRIMINACION] ${subject.trim()}`,
        description: `Denunciado: ${reportedUser || 'No especificado'}\nFecha: ${incidentDate || 'No especificada'}\nCanal preferido: ${preferredChannel}\n\n${description.trim()}`,
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
      setError('Error al enviar la denuncia. Intenta de nuevo.');
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      {/* Hero Section */}
      <div className="relative border-b border-[var(--border-light)] overflow-hidden bg-slate-950">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: "url('/assets/images/hero/hero-2.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40 dark:from-[var(--bg-primary)] dark:via-[var(--bg-primary)]/90 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-950" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[var(--brand-primary)]/10 blur-[140px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 pt-6 sm:pt-10 pb-20 sm:pb-28 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
            
            <div className="flex-1 max-w-3xl space-y-6 backdrop-blur-[2px] py-4 rounded-3xl">
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md rounded-xl shadow-2xl">
                <Scale className="w-4 h-4 text-white dark:text-[var(--brand-primary)]" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  Antidiscriminación
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
                Nuestra política <br />
                <span className="text-[var(--brand-primary)] relative inline-block drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                  antidiscriminación
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 dark:text-[var(--text-secondary)] leading-relaxed font-normal max-w-xl drop-shadow-sm">
                Compromiso con la igualdad, el respeto y la inclusión. Construimos una plataforma 
                donde todas las personas son valoradas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setStep('form')}
                  className="px-8 py-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold rounded-xl transition-all duration-200 shadow-xl shadow-[var(--brand-primary)]/20 flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                  <Flag className="w-4 h-4" />
                  Denunciar ahora
                </button>
                
                <Link
                  href="#faq"
                  className="px-8 py-4 border border-white/20 dark:border-[var(--border-color)] bg-white/10 dark:bg-[var(--bg-card)] hover:bg-white/20 text-white dark:text-[var(--text-primary)] font-bold rounded-xl transition-all duration-200 backdrop-blur-md flex items-center justify-center gap-2.5"
                >
                  <HelpCircle className="w-4 h-4 text-slate-300 dark:text-[var(--text-secondary)]" />
                  Ver preguntas frecuentes
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-1 justify-end items-center pointer-events-none">
              <div className="w-80 h-80 bg-white/5 dark:bg-[var(--bg-card)]/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <ScaleIllustration className="w-full h-full text-white/90 dark:text-[var(--brand-primary)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {step === 'info' && (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12 space-y-10">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Introducción */}
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
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">Una comunidad basada en el respeto</h2>
                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                    En Tiyuy creemos que todas las personas merecen ser tratadas con dignidad, respeto e igualdad.
                    Construimos una plataforma donde la diversidad es valorada y donde nadie debe ser excluido,
                    rechazado o tratado de manera diferente por quien es.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                    Esta política aplica a todas las interacciones dentro de Tiyuy: publicaciones, mensajes,
                    visitas, negociaciones, comentarios y cualquier otra forma de comunicación entre usuarios
                    de la plataforma. El incumplimiento de esta política puede resultar en la suspensión
                    temporal o definitiva de la cuenta, además de las acciones legales que correspondan.
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

            {/* Conductas prohibidas */}
            <div className="group bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-red-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, var(--brand-primary) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                    <Ban className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Prohibido</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Conductas prohibidas</h2>
                <div className="space-y-4">
                  {PROHIBITED_CONDUCTS.map((item, idx) => (
                    <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                      expandedConduct === idx
                        ? 'border-red-300/50 dark:border-red-800/40 shadow-[0_2px_12px_rgba(239,68,68,0.06)]'
                        : 'border-[var(--border-light)] hover:border-red-300/30'
                    } bg-[var(--bg-card)]`}>
                      <button
                        onClick={() => setExpandedConduct(expandedConduct === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                            expandedConduct === idx
                              ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/40'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
                          }`}>
                            <Ban className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <span className={`font-bold text-base transition-colors ${
                              expandedConduct === idx ? 'text-red-600 dark:text-red-400' : 'text-[var(--text-primary)]'
                            }`}>{item.title}</span>
                            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          expandedConduct === idx
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}>
                          {expandedConduct === idx ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      {expandedConduct === idx && (
                        <div className="px-5 pb-5 border-t border-[var(--border-light)] pt-4 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)]">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 ml-14 border border-red-100 dark:border-red-900/30">
                            <p className="text-xs text-red-800 dark:text-red-300 font-bold mb-1 uppercase tracking-wider">Ejemplo:</p>
                            <p className="text-sm text-red-700 dark:text-red-400 italic font-medium">"{item.example}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Criterios válidos */}
                <div className="mt-8 p-6 bg-gradient-to-br from-[var(--brand-primary)]/8 to-[var(--brand-primary)]/3 rounded-2xl border border-[var(--brand-primary)]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--brand-primary)]/10 to-transparent blur-2xl rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-[var(--brand-primary)]" />
                      <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Sí está permitido</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-2 text-lg">Criterios que sí pueden aplicarse</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                      No se considera discriminación establecer requisitos objetivos que se apliquen por igual
                      a todas las personas, como: verificar capacidad de pago, solicitar referencias, establecer
                      reglas de convivencia (no mascotas, no fumar), exigir depósito de garantía, o verificar
                      identidad. Lo importante es que estos criterios no sean utilizados como pretexto para
                      excluir a grupos protegidos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            {/* Cómo actuamos */}
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
                    <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Acciones</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Cómo actuamos frente a la discriminación</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: <Eye className="w-5 h-5" />, title: 'Revisión', desc: 'Analizamos cada denuncia y evaluamos la evidencia presentada.' },
                    { icon: <Ban className="w-5 h-5" />, title: 'Remoción', desc: 'Eliminamos contenido que viole esta política.' },
                    { icon: <FileText className="w-5 h-5" />, title: 'Límites', desc: 'Restringimos publicaciones o funcionalidades según el caso.' },
                    { icon: <Users className="w-5 h-5" />, title: 'Suspensión', desc: 'Suspendemos cuentas de forma temporal o definitiva.' },
                    { icon: <ShieldAlert className="w-5 h-5" />, title: 'Bloqueo', desc: 'Bloqueamos usuarios reincidentes o casos graves.' },
                    { icon: <Scale className="w-5 h-5" />, title: 'Acción legal', desc: 'Derivamos a las autoridades cuando corresponde.' },
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
                  <Scale className="w-10 h-10 text-[var(--brand-primary)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">¿Presenciaste o sufriste discriminación?</h2>
                <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto mb-8 font-medium leading-relaxed">
                  Tu denuncia es importante. Ayúdanos a mantener una comunidad segura e inclusiva para todos.
                </p>
                <button onClick={() => setStep('form')}
                  className="px-8 py-4 bg-[var(--brand-primary)] text-[var(--bg-primary)] font-bold rounded-xl hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Denunciar ahora
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
                <h2 className="text-2xl font-black text-[var(--text-primary)]">Denunciar discriminación</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Tu denuncia será revisada por nuestro equipo</p>
              </div>
              <button onClick={() => setStep('info')} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
                <X className="w-6 h-6 text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
              </button>
            </div>

            <div className="space-y-6">
              {!isAuthenticated && (
                <>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
                    <p className="text-sm text-amber-800 dark:text-amber-400 font-medium leading-relaxed">Si nos dejas tus datos podremos darte seguimiento personalizado sobre tu denuncia.</p>
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
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Tipo de denuncia</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DISCRIMINATION_CATEGORIES.map(cat => (
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
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Persona denunciada <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                  <input type="text" value={reportedUser} onChange={e => setReportedUser(e.target.value)}
                    placeholder="Nombre de usuario o anunciante" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Fecha del incidente <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                  <input type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all [color-scheme:light] dark:[color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Asunto <span className="text-red-500">*</span></label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Ej: Publicación con lenguaje discriminatorio" className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Descripción <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe lo sucedido con el mayor detalle posible: ¿qué pasó?, ¿cuándo?, ¿dónde?, ¿quién estuvo involucrado?, ¿hay testigos o evidencia?"
                  rows={5} className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Gravedad</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {SEVERITIES.map(sev => (
                    <button key={sev.value} onClick={() => setSelectedSeverity(sev.value)}
                      className={`flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedSeverity === sev.value ? sev.color + ' ring-2 ring-offset-2 ring-offset-[var(--bg-card)]' : 'border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-light)]/80'
                      }`}>{sev.label}</button>
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
                  Al enviar esta denuncia, autorizas a Tiyuy a revisar la información proporcionada y tomar
                  las medidas correspondientes. Tu identidad será tratada de forma confidencial en la medida
                  de lo posible.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[var(--border-light)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-primary)]" />
                <span className="text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                  Confirmo que la información proporcionada es verídica y autorizo a Tiyuy a investigar esta denuncia.
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
                  {createMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</> : <><Send className="w-5 h-5" /> Enviar Denuncia</>}
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
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">Denuncia recibida</h2>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-4 font-medium leading-relaxed">
                Hemos recibido tu denuncia. Nuestro equipo la revisará y tomará las medidas correspondientes.
                Te contactaremos si necesitamos más información.
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
