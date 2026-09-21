'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/presentation/hooks';
import { useGoogleAuth, GoogleUserData } from '@/presentation/hooks/useGoogleAuth';
import { Button, Input, InfoDialog } from '@/presentation/components/ui';
import { AuthErrorBanner } from '@/presentation/components/auth/shared';
import { User } from '@/core/domain/entities';
import { authStorage } from '@/infrastructure/storage';
import { useAuthStore } from '@/presentation/store/authStore';

const MIN_PASSWORD_LENGTH = 8;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const { signInWithGoogleComplete, loading: googleLoading, error: googleError } = useGoogleAuth();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [infoDialog, setInfoDialog] = useState<{
    isOpen: boolean;
    message: string;
    showRegisterButton?: boolean;
    googleData?: GoogleUserData;
  }>({ isOpen: false, message: '' });

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `La contraseña debe tener mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    

    const newErrors = validateForm();
    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const result = await login(formData.email, formData.password);
    

    if (!result || !result.success) {
      // login failed; the hook already set the error in the store so AuthErrorBanner will show it
      return;
    }

    // On success, navigate from the component so logs remain visible if needed.
    const target = result.targetRoute || '/';
    // small delay allows the console to show logs before navigation clears it during debug
    setTimeout(() => router.replace(target), 80);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogleComplete();
      

      if (result.verificationError) {
        return;
      }

      if (result.exists && result.authResponse) {
        const userData: User = {
          id: result.authResponse.userId,
          email: result.authResponse.email,
          phone: '',
          firstName: result.authResponse.firstName,
          lastName: result.authResponse.lastName,
          dni: '',
          role: result.authResponse.role,
          emailVerified: false,
          phoneVerified: false,
          publishedPropertiesCount: 0,
          createdAt: new Date(),
        };

        const adminData = result.authResponse.adminRoleType
          ? {
              adminRoleType: result.authResponse.adminRoleType,
              permissions: result.authResponse.permissions,
              departments: result.authResponse.departments,
              isActive: result.authResponse.isActive,
            }
          : undefined;

        authStorage.setToken(result.authResponse.token);
        authStorage.setUser(userData);
        setAuth(result.authResponse.token, userData, adminData);

        const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
        const isAdminUser = result.authResponse.adminRoleType !== undefined || adminRoles.includes(result.authResponse.role);
        const targetRoute = isAdminUser ? '/admin' : '/';

        // delay navigation slightly so console logs and UI updates are visible
        setTimeout(() => router.replace(targetRoute), 80);
        // fallback full reload after a bit more time
        setTimeout(() => window.location.assign(targetRoute), 300);
      } else if (result.loginError && result.userData) {
        setInfoDialog({
          isOpen: true,
          message: result.loginError,
          showRegisterButton: false,
          googleData: undefined,
        });
      } else if (!result.exists && result.userData) {
        setInfoDialog({
          isOpen: true,
          message: `El correo ${result.userData.email} no está registrado. ¿Deseas registrarte ahora?`,
          showRegisterButton: true,
          googleData: result.userData,
        });
      }
    } catch (err: any) {
      // silent catch: error is handled via hook state
    }
  };

  const handleRegisterFromDialog = () => {
    if (infoDialog.googleData) {
      sessionStorage.setItem('googleRegistrationData', JSON.stringify(infoDialog.googleData));
    }
    setInfoDialog({ isOpen: false, message: '' });
    router.push('/profile-selector');
  };

  return (
    <>
      <InfoDialog
        isOpen={infoDialog.isOpen}
        onClose={() => setInfoDialog({ isOpen: false, message: '' })}
        title="Registro Requerido"
        message={infoDialog.message}
        variant="info"
        showRegisterButton={infoDialog.showRegisterButton}
        onRegister={handleRegisterFromDialog}
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--brand-primary)] mb-3">
            Bienvenido
          </h1>
          <p className="text-[var(--text-secondary)]">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthErrorBanner error={error} onClose={clearError} autoDismissSeconds={5} />
          <AuthErrorBanner error={googleError} />

          <Input
            type="email"
            name="email"
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
            className="text-base focus:scale-100 placeholder:text-gray-400"
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
            className="text-base focus:scale-100 placeholder:text-gray-400"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer"
              />
              <span className="text-[var(--text-secondary)]">Recordarme</span>
            </label>
            <Link href="/recover-password" className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium cursor-pointer">
              ¿Olvidé mi contraseña?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading} className="cursor-pointer">
            Iniciar Sesión
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-tertiary)]">O continúa con</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            isLoading={googleLoading}
            className="cursor-pointer"
          >
            <Icon icon="logos:google-icon" className="w-5 h-5 shrink-0" />
            {googleLoading ? 'Conectando...' : 'Google'}
          </Button>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            ¿No tienes cuenta?{' '}
            <Link
              href="/profile-selector"
              className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold cursor-pointer"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};