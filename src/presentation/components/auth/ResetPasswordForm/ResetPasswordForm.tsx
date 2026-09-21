'use client';
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/presentation/components/ui';
import { AuthErrorBanner, PasswordStrengthIndicator } from '@/presentation/components/auth/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { publicApiClient } from '@/infrastructure/api/axios-client';

export const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token de recuperación no válido o expirado');
      setTokenValid(false);
    } else {
      // Aquí podríamos validar el token con el backend
      setTokenValid(true);
    }
  }, [token]);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token de recuperación no válido');
      return;
    }

    if (!password) {
      setError('La contraseña es requerida');
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Usar el route handler de Next.js (/api/auth/reset-password) para evitar
      // el problema de doble /api en la URL del backend
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      setIsSuccess(true);
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Error en reset password:', err);
      const message = err.message || 'Error de conexión. Inténtalo nuevamente';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Enlace Inválido
        </h2>
        
        <p className="text-gray-600 mb-8">
          El enlace de recuperación de contraseña es inválido o ha expirado.
        </p>

        <div className="space-y-4">
          <Link href="/recover-password">
            <Button variant="primary" size="lg" fullWidth>
              Solicitar Nuevo Enlace
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg" fullWidth>
              Volver al Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Contraseña Restablecida!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Tu contraseña ha sido actualizada exitosamente.
          Serás redirigido al login en unos segundos...
        </p>

        <Link href="/login">
          <Button variant="primary" size="lg" fullWidth>
            Ir al Login Ahora
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Restablecer Contraseña
        </h2>
        
        <p className="text-gray-600">
          Ingresa tu nueva contraseña para continuar.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Error de validación o de API */}
        <AuthErrorBanner error={error} onClose={() => setError(null)} />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            label="Nueva Contraseña"
            leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
          <PasswordStrengthIndicator password={password} />
        </div>

        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            label="Confirmar Contraseña"
            leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl py-3 font-semibold"
        >
          {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link 
          href="/login"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
};
