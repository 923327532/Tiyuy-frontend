'use client';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Eye, EyeOff, Mail, User, Phone, Lock, Hash, Building2, Star, MapPin, XCircle } from 'lucide-react';
import { useAuth } from '@/presentation/hooks';
import { useGoogleAuth, GoogleUserData } from '@/presentation/hooks/useGoogleAuth';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';

const authRepository = new AuthRepository();
import { useUserValidation } from '@/presentation/hooks/useUserValidation';
import { Button, Input } from '@/presentation/components/ui';
import { DniInput, RucInput } from '@/presentation/components/kyc';
import { AuthErrorBanner, PasswordStrengthIndicator } from '@/presentation/components/auth/shared';
import { StepProgress } from './StepProgress';

const MIN_PASSWORD_LENGTH = 8;
const STEP_LABELS = ['Cuenta', 'Identidad', 'Empresa'];
const TOTAL_STEPS = 3;

export const RegisterDeveloperForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const { signInWithGoogle, loading: googleLoading, error: googleError } = useGoogleAuth();
  const { validateEmail, isValidating: validatingEmail } = useUserValidation();

  const [currentStep, setCurrentStep] = useState(1);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  // Mostrar modal cuando hay error de registro (en vez de solo el banner)
  useEffect(() => {
    if (error) {
      setErrorModalMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);
  const [googleData, setGoogleData] = useState<GoogleUserData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dni: '',
    ruc: '',
    companyName: '',
    phone: '',
    city: '',
    address: '',
  });
  const [isDniValidated, setIsDniValidated] = useState(false);
  const [isRucValidated, setIsRucValidated] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      if (!formData.ruc) newErrors.ruc = 'El RUC de la empresa es obligatorio';
      else if (formData.ruc.length !== 11) newErrors.ruc = 'El RUC debe tener 11 dígitos';
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

  const handleDniValidated = (dniData: { firstName?: string; lastName?: string }) => {
    setIsDniValidated(true);
    if (dniData) {
      setFormData((prev) => ({
        ...prev,
        firstName: dniData.firstName ?? prev.firstName,
        lastName: dniData.lastName ?? prev.lastName,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    const email = googleData ? googleData.email : formData.email;
    const password = googleData ? crypto.randomUUID() : formData.password;
    const firstName = googleData ? (formData.firstName || googleData.firstName) : formData.firstName;
    const lastName = googleData ? (formData.lastName || googleData.lastName) : formData.lastName;

    try {
      // Intentar registrar. Si falla, el error se muestra en el banner (manejado internamente por useAuth).
      // No se cierra el formulario ni se redirige. El usuario puede corregir datos y reintentar.
      await register({
        email,
        password,
        phone: formData.phone,
        firstName,
        lastName,
        dni: formData.dni,
        ruc: formData.ruc,
        fullName: formData.companyName,
        city: formData.city,
        address: formData.address,
        role: 'DEVELOPER',
      });
    } catch (_err: any) {
      // Error inesperado - ya debería estar capturado en useAuth, pero por seguridad
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 9) }));
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
          ruc: '',
          companyName: '',
          phone: '',
          city: '',
          address: '',
        });
        setCurrentStep(2);
      }
    } catch { /* expuesto via googleError */ }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <AuthErrorBanner error={error} onClose={clearError} autoDismissSeconds={8} />
        <AuthErrorBanner error={googleError} />
      </div>

      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Star className="w-4 h-4" />
          30 días gratis — Trial Enterprise
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Cuenta de Desarrollador</h2>
        <p className="text-gray-500 text-sm">Paso {currentStep} de {TOTAL_STEPS}</p>
      </div>

      <div className="mt-4">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── PASO 1: CUENTA ── */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Crea tu acceso</h3>
              <p className="text-sm text-gray-500">Tu email y contraseña para ingresar</p>
            </div>

            <Input
              type="email"
              name="email"
              label="Correo electrónico"
              leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tu@empresa.com"
              rightIcon={validatingEmail ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" /> : undefined}
            />

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Contraseña"
                leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Confirmar contraseña"
              leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repite tu contraseña"
              rightIcon={
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <Button type="button" variant="primary" size="lg" fullWidth onClick={handleNext}>
              Siguiente →
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">o regístrate con</span></div>
            </div>

            <Button type="button" variant="outline" size="lg" fullWidth onClick={handleGoogleSignIn} isLoading={googleLoading}>
              <Icon icon="flat-color-icons:google" className="w-5 h-5 mr-2" />
              {googleLoading ? 'Conectando...' : 'Google'}
            </Button>

            <div className="text-center pt-2">
              <p className="text-gray-600 text-sm">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Inicia sesión</a>
              </p>
            </div>
          </div>
        )}

        {/* ── PASO 2: IDENTIDAD ── */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Tus datos personales</h3>
              <p className="text-sm text-gray-500">Valida tu identidad con tu DNI</p>
              {googleData && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Icon icon="flat-color-icons:google" className="w-4 h-4" />
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
              leftIcon={<Hash className="w-5 h-5 text-gray-400" />}
              placeholder="Ingresa tu DNI"
              required
              disabled={isDniValidated}
              externalError={errors.dni}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="Nombres"
                leftIcon={<User className="w-5 h-5 text-gray-400" />}
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Tus nombres"
                readOnly={!isDniValidated}
              />
              <Input
                name="lastName"
                label="Apellidos"
                leftIcon={<User className="w-5 h-5 text-gray-400" />}
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Tus apellidos"
                readOnly={!isDniValidated}
              />
            </div>

            <Input
              type="tel"
              name="phone"
              label="Teléfono"
              leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="9xxxxxxxx"
              maxLength={9}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="city"
                label="Ciudad"
                leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Ingresa tu ciudad"
              />
              <Input
                name="address"
                label="Dirección de la empresa"
                leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Ingresa la dirección"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" size="lg" fullWidth onClick={handleBack}>
                ← Anterior
              </Button>
              <Button type="button" variant="primary" size="lg" fullWidth onClick={handleNext}>
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* ── PASO 3: EMPRESA ── */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Datos de tu empresa</h3>
              <p className="text-sm text-gray-500">Valida tu RUC para publicar proyectos</p>
            </div>

            <RucInput
              value={formData.ruc}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, ruc: val }));
                if (errors.ruc) setErrors((prev) => { const n = { ...prev }; delete n.ruc; return n; });
              }}
              onValidated={(data) => {
                setIsRucValidated(true);
                if (data.companyName) {
                  setFormData((prev) => ({ ...prev, companyName: data.companyName }));
                }
              }}
              required
              externalError={errors.ruc}
            />

            <Input
              name="companyName"
              label="Nombre de la empresa"
              leftIcon={<Building2 className="w-5 h-5 text-gray-400" />}
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
              placeholder="Nombre de tu empresa"
            />

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              {[
                { value: '1', label: 'Proyecto' },
                { value: '∞', label: 'Unidades' },
                { value: '30', label: 'Días gratis' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-blue-50 rounded-xl p-2 sm:p-3 border border-blue-100">
                  <div className="text-blue-600 font-bold text-base sm:text-lg">{value}</div>
                  <div className="text-[11px] sm:text-xs text-gray-600">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
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
                <div className="text-sm text-gray-600">
                  Acepto el tratamiento de mis datos personales conforme a la{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Política de Privacidad</a>{' '}
                  de TIYUY
                </div>
              </label>
              {errors.privacy && (
                <p className="text-sm text-red-600 ml-7" role="alert">{errors.privacy}</p>
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
                <div className="text-sm text-gray-600">
                  Acepto los{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Términos y Condiciones</a>{' '}
                  de TIYUY
                </div>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-600 ml-7" role="alert">{errors.terms}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" size="lg" fullWidth onClick={handleBack}>
                ← Anterior
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                Crear Cuenta
              </Button>
            </div>
          </div>
        )}
      </form>
      {/* Modal de error de registro */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Error al registrar</h3>
            <p className="text-gray-600 mb-6">{errorModalMessage}</p>
            <p className="text-sm text-gray-500 mb-4">Puedes corregir los datos y volver a intentarlo.</p>
            <button
              type="button"
              onClick={() => {
                setShowErrorModal(false);
                clearError();
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Entendido, corregir datos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
