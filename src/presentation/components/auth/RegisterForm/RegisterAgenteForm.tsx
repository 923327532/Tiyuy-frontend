'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, User, Phone, Lock, Hash, Briefcase } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/presentation/hooks';
import { useGoogleAuth, GoogleUserData } from '@/presentation/hooks/useGoogleAuth';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';

const authRepository = new AuthRepository();
import { useUserValidation } from '@/presentation/hooks/useUserValidation';
import { Button, Input } from '@/presentation/components/ui';
import { DniInput } from '@/presentation/components/kyc';
import { AuthErrorBanner, PasswordStrengthIndicator } from '@/presentation/components/auth/shared';
import { AgentRepository } from '@/infrastructure/repositories/AgentRepository';
import { StepProgress } from './StepProgress';

const agentRepo = new AgentRepository();
const MIN_PASSWORD_LENGTH = 8;
const STEP_LABELS = ['Cuenta', 'Identidad', 'Profesional'];
const TOTAL_STEPS = 3;

export const RegisterAgenteForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();
  const { validateEmail, isValidating: validatingEmail } = useUserValidation();

  const [currentStep, setCurrentStep] = useState(1);
  const [googleData, setGoogleData] = useState<GoogleUserData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    licenseNumber: '',
    agency: '',
  });
  const [isDniValidated, setIsDniValidated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('googleRegistrationData');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setFormData((prev) => ({
        ...prev,
        email: parsed.email ?? prev.email,
        firstName: parsed.firstName ?? prev.firstName,
        lastName: parsed.lastName ?? prev.lastName,
      }));
      sessionStorage.removeItem('googleRegistrationData');
    } catch {
      sessionStorage.removeItem('googleRegistrationData');
    }
  }, []);

  useEffect(() => {
    const isValidFormat = formData.email && /\S+@\S+\.\S+/.test(formData.email);
    if (!isValidFormat) { setEmailExists(false); return; }
    const timer = setTimeout(async () => {
      try {
        const exists = await validateEmail(formData.email);
        setEmailExists(exists);
        setErrors((prev) => {
          const updated = { ...prev };
          if (exists) updated.email = 'Este email ya está registrado';
          else delete updated.email;
          return updated;
        });
      } catch { /* silencioso */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email, validateEmail]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!googleData) {
        if (!formData.email) newErrors.email = 'El correo electrónico es obligatorio';
        else if (emailExists) newErrors.email = 'Este email ya está registrado';
        if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
        else if (formData.password.length < MIN_PASSWORD_LENGTH) newErrors.password = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
        if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    if (step === 2) {
      if (!formData.dni || formData.dni.length !== 8) newErrors.dni = 'El DNI debe tener 8 dígitos';
      if (!isDniValidated) newErrors.dni = 'Debes validar tu DNI primero';
      if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio';
      if (!formData.lastName) newErrors.lastName = 'Los apellidos son obligatorios';
      const phoneRegex = /^9\d{8}$/;
      if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio';
      else if (!phoneRegex.test(formData.phone.trim())) newErrors.phone = 'Teléfono inválido: 9 dígitos empezando con 9';
    }

    if (step === 3) {
      if (!acceptedPrivacy) newErrors.privacy = 'Debes aceptar el tratamiento de tus datos personales';
      if (!acceptedTerms) newErrors.terms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    try {
      const email = googleData ? googleData.email : formData.email;
      const password = googleData ? crypto.randomUUID() : formData.password;
      const firstName = googleData ? (formData.firstName || googleData.firstName) : formData.firstName;
      const lastName = googleData ? (formData.lastName || googleData.lastName) : formData.lastName;

      await register({
        email,
        password,
        phone: formData.phone,
        firstName,
        lastName,
        dni: formData.dni,
        role: 'AGENT',
      });

      if (formData.licenseNumber || formData.agency) {
        try {
          await agentRepo.updateProfile({
            licenseNumber: formData.licenseNumber,
            agency: formData.agency || undefined,
          });
        } catch { /* no bloqueante */ }
      }
    } catch { /* expuesto via error */ }
  };

  const handleDniValidated = (dniData: { fullName?: string }) => {
    setIsDniValidated(true);
    if (dniData?.fullName) {
      const [firstName = '', ...rest] = dniData.fullName.split(' ');
      setFormData((prev) => ({ ...prev, firstName, lastName: rest.join(' ') }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 9) }));
    } else if (name === 'licenseNumber') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name !== 'email' && errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      sessionStorage.removeItem('googleRegistrationData');
      const googleUserData = await signInWithGoogle();
      if (googleUserData) {
        setGoogleData(googleUserData);
        setFormData({
          email: googleUserData.email,
          password: '',
          confirmPassword: '',
          firstName: googleUserData.firstName,
          lastName: googleUserData.lastName,
          dni: '',
          phone: '',
          licenseNumber: '',
          agency: '',
        });
        setCurrentStep(2);
      }
    } catch { /* expuesto via googleError */ }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-2">
      <div className="mb-3">
        <AuthErrorBanner error={error} onClose={clearError} autoDismissSeconds={8} />
        <AuthErrorBanner error={googleError} />
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-0.5">Cuenta de Agente</h2>
        <p className="text-gray-500 text-xs">Paso {currentStep} de {TOTAL_STEPS}</p>
      </div>

      <div className="scale-95 origin-center mb-2">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── PASO 1: CUENTA ── */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">Crea tu acceso</h3>
              <p className="text-xs text-gray-500">Tu email y contraseña para ingresar</p>
            </div>

            <Input
              type="email"
              name="email"
              label="Correo electrónico"
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="ejemplo@correo.com"
              className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              rightIcon={validatingEmail ? <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" /> : undefined}
            />

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Contraseña"
                leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
                rightIcon={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <div className="scale-95 origin-left mt-1">
                <PasswordStrengthIndicator password={formData.password} />
              </div>
            </div>

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Confirmar contraseña"
              leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repite la contraseña"
              className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Button type="button" variant="primary" size="md" fullWidth onClick={handleNext} className="cursor-pointer py-2 text-sm">
              Siguiente →
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">o regístrate con</span></div>
            </div>

            <Button type="button" variant="outline" size="md" fullWidth onClick={handleGoogleSignIn} isLoading={googleLoading} className="cursor-pointer py-2 text-sm">
              <Icon icon="logos:google-icon" className="w-4 h-4 mr-2 shrink-0" />
              {googleLoading ? 'Conectando...' : 'Google'}
            </Button>

            <div className="text-center pt-1">
              <p className="text-gray-500 text-xs">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">Inicia sesión</a>
              </p>
            </div>
          </div>
        )}

        {/* ── PASO 2: IDENTIDAD ── */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">Verifica tu identidad</h3>
              <p className="text-xs text-gray-500">Tu DNI para validar tus datos personales</p>
              {googleData && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                  <Icon icon="logos:google-icon" className="w-3 h-3 shrink-0" />
                  Conectado con Google · {googleData.email}
                </div>
              )}
            </div>

            <DniInput
              value={formData.dni}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, dni: val }));
                if (errors.dni) setErrors((prev) => { const n = { ...prev }; delete n.dni; return n; });
              }}
              onValidated={handleDniValidated}
              leftIcon={<Hash className="w-4 h-4 text-gray-400" />}
              placeholder="Ingresa tu DNI"
              required
              disabled={isDniValidated}
              externalError={errors.dni}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="firstName"
                label="Nombres"
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Tus nombres"
                readOnly={!isDniValidated}
                className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              />
              <Input
                name="lastName"
                label="Apellidos"
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Tus apellidos"
                readOnly={!isDniValidated}
                className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              />
            </div>

            <Input
              type="tel"
              name="phone"
              label="Teléfono"
              leftIcon={<Phone className="w-4 h-4 text-gray-400" />}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="987654321"
              maxLength={9}
              className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
            />

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" size="md" fullWidth onClick={handleBack} className="cursor-pointer py-2 text-sm">
                ← Anterior
              </Button>
              <Button type="button" variant="primary" size="md" fullWidth onClick={handleNext} className="cursor-pointer py-2 text-sm">
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* ── PASO 3: PROFESIONAL ── */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">Datos profesionales</h3>
              <p className="text-xs text-gray-500">Opcional — puedes completarlos más tarde</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                name="licenseNumber"
                label="N.° de Licencia (opcional)"
                leftIcon={<Briefcase className="w-4 h-4 text-gray-400" />}
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Tu licencia"
                className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              />
              <Input
                name="agency"
                label="Inmobiliaria (opcional)"
                leftIcon={<Briefcase className="w-4 h-4 text-gray-400" />}
                value={formData.agency}
                onChange={handleChange}
                placeholder="Nombre"
                className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100 text-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Resumen de tu cuenta</p>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="font-medium text-gray-700 truncate max-w-[170px]">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nombre</span>
                <span className="font-medium text-gray-700">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">DNI</span>
                <span className="font-medium text-gray-700">{formData.dni}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Teléfono</span>
                <span className="font-medium text-gray-700">{formData.phone}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => {
                    setAcceptedPrivacy(e.target.checked);
                    if (e.target.checked && errors.privacy) {
                      setErrors((prev) => { const n = { ...prev }; delete n.privacy; return n; });
                    }
                  }}
                  className="mt-0.5 w-[18px] h-[18px] shrink-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">
                  Acepto el tratamiento de mis datos personales conforme a la{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Política de Privacidad</a>{' '}
                  de TIYUY
                </span>
              </label>
              {errors.privacy && (
                <p className="text-xs text-red-600 ml-7" role="alert">{errors.privacy}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked && errors.terms) {
                      setErrors((prev) => { const n = { ...prev }; delete n.terms; return n; });
                    }
                  }}
                  className="mt-0.5 w-[18px] h-[18px] shrink-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">
                  Acepto los{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Términos y Condiciones</a>{' '}
                  de TIYUY
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-600 ml-7" role="alert">{errors.terms}</p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" size="md" fullWidth onClick={handleBack} className="cursor-pointer py-2 text-sm">
                ← Anterior
              </Button>
              <Button type="submit" variant="primary" size="md" fullWidth isLoading={isLoading} className="cursor-pointer py-2 text-sm">
                Crear Cuenta
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};