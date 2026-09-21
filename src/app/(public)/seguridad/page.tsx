'use client';

import { useState } from 'react';
import { useCreateSupportTicket } from '@/presentation/hooks/admin/useSupportTickets';
import { useAuthStore } from '@/presentation/store/authStore';
import { TicketCategory, TicketSeverity } from '@/core/domain/entities/Admin';
import {
  X, Send, AlertCircle, CheckCircle2, Shield, Loader2,
  ShieldAlert, MessageSquareWarning, AlertTriangle, Eye,
  FileText, Lock, ChevronDown, ChevronUp, ExternalLink, Mail, Phone, User, Flag,
  HelpCircle, Key, Smartphone, Search, Users, Siren, Clock, ShieldCheck,
  Headphones, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const SECURITY_CATEGORIES: { value: TicketCategory; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'PASSWORD_CHANGE', label: 'Cuenta vulnerada', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Alguien accedió a mi cuenta sin autorización' },
  { value: 'ACCOUNT_ISSUE', label: 'Actividad sospechosa', icon: <Eye className="w-5 h-5" />, desc: 'Veo movimientos extraños en mi cuenta o publicaciones' },
  { value: 'PROPERTY_ISSUE', label: 'Anuncio fraudulento', icon: <Flag className="w-5 h-5" />, desc: 'Una publicación parece falsa o engañosa' },
  { value: 'OTHER', label: 'Mensajes peligrosos', icon: <MessageSquareWarning className="w-5 h-5" />, desc: 'Recibí mensajes inapropiados, acoso o intento de estafa' },
  { value: 'SYSTEM_ERROR', label: 'Emergencia', icon: <AlertTriangle className="w-5 h-5" />, desc: 'Situación urgente que requiere atención inmediata' },
  { value: 'WRONG_EMAIL', label: 'Consejos de seguridad', icon: <Lock className="w-5 h-5" />, desc: 'Dudas sobre cómo proteger mis datos o visitas' },
];

const SEVERITIES: { value: TicketSeverity; label: string; color: string }[] = [
  { value: 'LOW', label: 'Baja - Consulta', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' },
  { value: 'MEDIUM', label: 'Media - Preocupación', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' },
  { value: 'HIGH', label: 'Alta - Urgente', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30' },
  { value: 'CRITICAL', label: 'Crítica - Emergencia', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
];

const FAQS = [
  {
    q: '¿Qué hago si alguien vulneró mi cuenta?',
    a: 'Cambia tu contraseña inmediatamente desde la opción "Olvidé mi contraseña" en la pantalla de inicio de sesión. Luego repórtalo a través del formulario de seguridad para que nuestro equipo pueda revisar la actividad sospechosa y proteger tu cuenta.',
  },
  {
    q: '¿Cómo detectar un anuncio fraudulento?',
    a: 'Desconfía de precios muy por debajo del mercado, solicitudes de adelantos o depósitos sin visitar la propiedad, y anunciantes que presionan para cerrar rápido. Verifica siempre que el agente o propietario esté registrado en Tiyuy.',
  },
  {
    q: '¿Cómo reportar un mensaje inseguro o acoso?',
    a: 'No respondas al mensaje. Toma capturas de pantalla como evidencia y repórtalo inmediatamente usando el formulario de seguridad. Nuestro equipo revisará el caso y tomará las medidas necesarias, incluyendo bloquear al usuario si corresponde.',
  },
  {
    q: 'Consejos para visitas seguras',
    a: 'Lleva a alguien de confianza, comparte tu ubicación en tiempo real, verifica la identidad del anunciante, no entregues dinero antes de ver la propiedad, y confirma que la dirección existe antes de ir.',
  },
  {
    q: '¿Cómo proteger mi información personal?',
    a: 'No compartas datos sensibles como DNI, cuentas bancarias o contraseñas fuera de los canales oficiales de Tiyuy. Usa contraseñas seguras y activa la autenticación de dos factores si está disponible.',
  },
  {
    q: '¿Qué hacer en una emergencia durante una visita?',
    a: 'Si te sientes inseguro durante una visita, retírate del lugar inmediatamente. Contacta a las autoridades locales (105) y luego repórtalo en Tiyuy para que tomemos acciones contra el anunciante.',
  },
];

const TRUST_STATS = [
  { icon: <Clock className="w-5 h-5" />, value: '< 24h', label: 'Tiempo de respuesta promedio' },
  { icon: <ShieldCheck className="w-5 h-5" />, value: '100%', label: 'Reportes tratados de forma confidencial' },
  { icon: <Headphones className="w-5 h-5" />, value: '24/7', label: 'Equipo de seguridad disponible' },
];

const FLOW_STEPS = [
  { key: 'category', label: 'Categoría', number: 1 },
  { key: 'form', label: 'Detalles', number: 2 },
  { key: 'success', label: 'Confirmación', number: 3 },
];

const FlowStepper = ({ current }: { current: string }) => {
  const currentIndex = FLOW_STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {FLOW_STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
              i < currentIndex ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white' :
              i === currentIndex ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/10' :
              'border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--bg-card)]'
            }`}>
              {i < currentIndex ? <CheckCircle2 className="w-4 h-4" /> : s.number}
            </div>
            <span className={`text-sm font-bold hidden sm:inline ${i === currentIndex ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
              {s.label}
            </span>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <div className={`w-8 sm:w-16 h-0.5 rounded-full transition-all ${i < currentIndex ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color)]'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default function SeguridadPage() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const [step, setStep] = useState<'info' | 'category' | 'form' | 'success'>('info');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setStep('form');
    scrollToTop();
  };

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
      setError('Debes aceptar los términos para enviar el reporte');
      return;
    }
    setError('');
    try {
      const request: any = {
        subject: `[SEGURIDAD] ${subject.trim()}`,
        description: description.trim(),
        category: selectedCategory!,
        severity: selectedSeverity,
      };
      if (!isAuthenticated) {
        request.guestName = guestName.trim() || undefined;
        request.guestEmail = guestEmail.trim() || undefined;
        request.guestPhone = guestPhone.trim() || undefined;
      }
      await createMutation.mutateAsync(request);
      setStep('success');
      scrollToTop();
    } catch {
      setError('Error al enviar el reporte. Intenta de nuevo.');
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('category');
      setError('');
    } else if (step === 'category') {
      setStep('info');
    }
    scrollToTop();
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
    <div className="min-h-screen bg-[var(--bg-secondary)] antialiased text-[var(--text-primary)] selection:bg-[var(--brand-primary)]/10">
      <div className="relative bg-[var(--bg-primary)] border-b border-[var(--border-light)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-gradient-to-l from-[var(--brand-primary)]/[0.04] to-transparent blur-3xl rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
        </div>

        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 pt-4 sm:pt-6 pb-20 sm:pb-24 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            
            <div className="flex-1 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg">
                <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Centro de Seguridad</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[var(--text-primary)]">
                Seguridad y confianza,<br />sin excepciones.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal max-w-xl">
                Un equipo dedicado revisa cada reporte de forma confidencial. Protegemos tu cuenta,
                tus visitas y tus datos en cada transacción inmobiliaria.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setStep('category')}
                  className="px-6 py-3 bg-[var(--brand-primary)] hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Reportar incidente
                </button>
                <Link
                  href="#faq"
                  className="px-6 py-3 border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold rounded-xl transition-all flex items-center gap-2 bg-[var(--bg-card)]"
                >
                  <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                  Ver preguntas frecuentes
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-[var(--border-light)]">
                {TRUST_STATS.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] flex items-center justify-center text-[var(--brand-primary)] flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-base font-black text-[var(--text-primary)] leading-none">{stat.value}</p>
                      <p className="text-[11px] text-[var(--text-muted)] font-bold mt-0.5 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-none relative pt-4 lg:pt-0">
              <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[var(--border-light)]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/assets/images/hero/hero-1.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-card)]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[var(--border-light)] shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">Plataforma verificada</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 left-4 right-4 sm:left-8 sm:right-auto sm:w-64 bg-[var(--bg-card)] rounded-xl border border-[var(--border-light)] shadow-[0_12px_30px_rgba(0,0,0,0.04)] p-4 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
                </div>
                <div>
                  <p className="text-lg font-black text-[var(--text-primary)] leading-none">+12,400</p>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">Reportes resueltos este año</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-16 py-12">
        {step === 'info' && (
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                    </div>
                    <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Tu seguridad</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">Tu seguridad es lo más importante</h2>
                  <div className="space-y-4">
                    <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                      En Tiyuy trabajamos para que tu experiencia sea segura y confiable. Si detectas
                      actividad sospechosa, crees que tu cuenta fue vulnerada, o encuentras contenido
                      que no parece legítimo, este es el lugar indicado para reportarlo.
                    </p>
                    <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                      Nuestro equipo de seguridad revisará cada reporte de forma confidencial y tomará
                      las acciones necesarias para proteger tu cuenta y la de los demás usuarios.
                    </p>
                    <p className="text-[var(--text-secondary)] leading-relaxed font-medium">
                      Si la situación es una emergencia, contacta inmediatamente a las autoridades
                      locales (105) y luego repórtalo en esta sección.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                    <button
                      onClick={() => setStep('category')}
                      className="w-full px-6 py-3.5 bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Reportar incidente de seguridad
                    </button>
                    <p className="text-xs text-[var(--text-muted)] mt-3 text-center font-medium">
                      Todos los reportes son confidenciales y serán revisados por nuestro equipo.
                    </p>
                  </div>
                </div>
              </div>

              <div id="faq" className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden hover:shadow-[0_8px_40px_rgba(74,154,62,0.06)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-[var(--brand-primary)]" />
                    </div>
                    <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Preguntas</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Preguntas de Seguridad</h2>
                  <div className="space-y-3">
                    {FAQS.map((faq, index) => (
                      <div key={index} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        expandedFaq === index
                          ? 'border-[var(--brand-primary)]/40 shadow-[0_2px_12px_rgba(74,154,62,0.08)]'
                          : 'border-[var(--border-light)] hover:border-[var(--brand-primary)]/30'
                      } bg-[var(--bg-card)]`}>
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          <span className={`font-bold text-sm pr-4 transition-colors ${
                            expandedFaq === index ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'
                          }`}>{faq.q}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            expandedFaq === index
                              ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}>
                            {expandedFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-4 border-t border-[var(--border-light)] pt-3 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-card)]">
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{faq.a}</p>
                            <button
                              onClick={() => setStep('category')}
                              className="mt-3 text-sm font-bold text-[var(--brand-primary)] hover:opacity-80 flex items-center gap-1 transition-colors"
                            >
                              Reportar incidente
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

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--border-light)] to-transparent" />
            </div>

            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary)]/5 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-[var(--brand-primary)]" />
                  </div>
                  <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Consejos</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-6">Consejos para mantenerte seguro</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: <Key className="w-5 h-5" />, title: 'Contraseñas seguras', desc: 'Usa combinaciones de letras, números y símbolos. No repitas contraseñas entre plataformas.' },
                    { icon: <Smartphone className="w-5 h-5" />, title: 'Verificación en dos pasos', desc: 'Activa la autenticación de dos factores para una capa extra de protección.' },
                    { icon: <Search className="w-5 h-5" />, title: 'Verifica anuncios', desc: 'Desconfía de precios irrealmente bajos y verifica la identidad del anunciante.' },
                    { icon: <Users className="w-5 h-5" />, title: 'Visitas acompañadas', desc: 'Lleva a alguien de confianza a las visitas y comparte tu ubicación en tiempo real.' },
                    { icon: <Siren className="w-5 h-5" />, title: 'Emergencias', desc: 'Si algo sale mal durante una visita, retírate y contacta a las autoridades (105).' },
                    { icon: <FileText className="w-5 h-5" />, title: 'No compartas datos', desc: 'No entregues información sensible fuera de los canales oficiales de Tiyuy.' },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-5 hover:border-[var(--brand-primary)]/30 hover:-translate-y-0.5 transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)] mb-4 border border-[var(--border-light)]">
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-[var(--text-primary)] text-base mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card)] rounded-3xl p-8 sm:p-12 text-center border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[var(--brand-primary)]/8 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--brand-primary)]/15 to-[var(--brand-primary)]/5 flex items-center justify-center mx-auto mb-6 border border-[var(--brand-primary)]/20">
                  <Shield className="w-10 h-10 text-[var(--brand-primary)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">¿Detectaste algo sospechoso?</h2>
                <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto mb-8 font-medium leading-relaxed">
                  No lo ignores. Reportarlo nos ayuda a mantener la plataforma segura para todos.
                </p>
                <button
                  onClick={() => setStep('category')}
                  className="px-8 py-4 bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Reportar ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'category' && (
          <div className="max-w-3xl mx-auto">
            <FlowStepper current="category" />
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)]">¿Qué tipo de incidente?</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Selecciona el que más se acerque a tu situación</p>
                  </div>
                  <button onClick={handleBack} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
                    <X className="w-5 h-5 text-[var(--text-muted)]" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {SECURITY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleSelectCategory(cat.value)}
                      className="group flex items-start gap-4 p-5 rounded-2xl border border-[var(--border-light)] hover:border-[var(--brand-primary)]/50 hover:bg-gradient-to-br hover:from-[var(--brand-primary)]/5 hover:to-transparent transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] group-hover:bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-all border border-[var(--border-light)] flex-shrink-0">
                        {cat.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{cat.label}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5 font-medium">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="max-w-3xl mx-auto">
            <FlowStepper current="form" />
            <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-light)] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[var(--brand-primary)]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 border-b border-[var(--border-light)] pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--text-primary)]">Describe el incidente</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
                      {SECURITY_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                    </p>
                  </div>
                  <button onClick={handleBack} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors">
                    <X className="w-5 h-5 text-[var(--text-muted)]" />
                  </button>
                </div>

                <div className="space-y-6">
                  {!isAuthenticated && (
                    <>
                      <p className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Información de contacto</p>
                      <div className="bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-5">
                        <p className="text-sm text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                          No has iniciado sesión. Proporciona tus datos de contacto para que podamos darte seguimiento.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Nombre <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                              placeholder="Tu nombre" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Teléfono <span className="text-[var(--text-muted)] font-medium">(opcional)</span></label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                              placeholder="+51 999 999 999" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Correo electrónico <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                          <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                        </div>
                      </div>
                      <hr className="border-[var(--border-light)]" />
                    </>
                  )}

                  <p className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Detalles del incidente</p>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">¿Qué tan urgente es?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SEVERITIES.map(sev => (
                        <button key={sev.value} onClick={() => setSelectedSeverity(sev.value)}
                          className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${selectedSeverity === sev.value ? `${sev.color} ring-2 ring-offset-2 ring-offset-[var(--bg-card)]` : 'border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--brand-primary)]/30'}`}>
                          {sev.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Asunto <span className="text-red-500">*</span></label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                      placeholder="Ej: Alguien publicó usando mi nombre sin autorización"
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Descripción <span className="text-red-500">*</span></label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      placeholder="Describe el incidente en detalle. Incluye fechas, capturas de pantalla y cualquier evidencia que tengas."
                      rows={5} className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium transition-all resize-none" />
                  </div>

                  <p className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">Confirmación</p>

                  <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-light)]">
                    <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                      Al enviar este reporte, nuestro equipo de seguridad revisará la información proporcionada
                      y podrá tomar medidas como bloquear usuarios, desactivar publicaciones o escalar el caso
                      a las autoridades si es necesario. Recibirás actualizaciones sobre el estado de tu reporte.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-2">
                    <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-[var(--border-light)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-primary)]" />
                    <span className="text-sm text-[var(--text-secondary)] font-medium group-hover:text-[var(--text-primary)] transition-colors leading-relaxed">
                      Confirmo que la información proporcionada es verídica y autorizo a Tiyuy a revisar mi caso
                      y tomar las acciones necesarias.
                    </span>
                  </label>

                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-bold border border-red-200 dark:border-red-900/30">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-[var(--border-light)] gap-4">
                    <button onClick={handleBack} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      ← Cambiar tipo
                    </button>
                    <button onClick={handleSubmit}
                      disabled={!subject.trim() || !description.trim() || !acceptedTerms || createMutation.isPending}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                      {createMutation.isPending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                      ) : (
                        <><Send className="w-5 h-5" /> Enviar Reporte</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-3xl mx-auto py-8">
            <FlowStepper current="success" />
            <div className="bg-[var(--bg-card)] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[var(--border-light)] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6 border border-green-200 dark:border-green-900/30">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">¡Reporte enviado!</h2>
                <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-4 font-medium leading-relaxed">
                  Hemos recibido tu reporte de seguridad. Nuestro equipo lo revisará de forma confidencial
                  y tomará las acciones necesarias.
                </p>
                <p className="text-sm text-[var(--text-muted)] font-bold mb-10">
                  Recibirás actualizaciones en tu correo y dentro de la plataforma.
                </p>
                <button onClick={resetForm}
                  className="px-8 py-3.5 bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-xl font-bold transition-all shadow-sm">
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}