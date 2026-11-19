'use client';
import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/presentation/components/ui';
import { AuthErrorBanner } from '@/presentation/components/auth/shared';
import Link from 'next/link';
import { useForgotPassword } from '@/presentation/hooks/useForgotPassword';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const { sendForgotPassword, isLoading, error, isSuccess } = useForgotPassword();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setValidationError('El email es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setValidationError('Email inválido');
      return;
    }

    setValidationError(null);
    await sendForgotPassword(email);
  };

  const displayError = validationError || error;

  if (isSuccess) {
    return (
      <div className="text-center w-full">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ¡Email Enviado!
        </h2>

        <p className="text-xs text-gray-500 mb-5">
          Hemos enviado un mensaje a <strong className="text-gray-700">{email}</strong> con los pasos para restablecer tu contraseña.
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-left">
            <p className="text-[11px] text-blue-800 leading-relaxed">
              <strong>Tip:</strong> Si no lo visualizas en un par de minutos, revisa tu bandeja de correo no deseado o spam.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          ¿Olvidaste tu contraseña?
        </h2>

        <p className="text-xs text-gray-500 max-w-[280px] mx-auto">
          Ingresa tu correo y te enviaremos de inmediato las instrucciones de recuperación.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Error de validación o de API */}
        {displayError && (
          <div className="mb-2">
            <AuthErrorBanner error={displayError} onClose={() => setValidationError(null)} />
          </div>
        )}

        <Input
          type="email"
          name="email"
          label="Correo electrónico"
          leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
          className="text-sm focus:scale-100 placeholder:text-gray-400 py-2"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          className="cursor-pointer py-2 text-sm font-semibold"
        >
          {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Volver al Login
        </Link>
      </div>
    </div>
  );
};