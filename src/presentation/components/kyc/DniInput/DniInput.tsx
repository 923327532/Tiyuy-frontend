'use client';
import React, { useState } from 'react';
import { Input, Button, Spinner } from '@/presentation/components/ui';
import { useKyc } from '@/presentation/hooks';
import { XCircle, Hash  } from 'lucide-react';

interface DniInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidated?: (data: any) => void;
  required?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  externalError?: string;
}

export const DniInput: React.FC<DniInputProps> = ({
  value,
  onChange,
  onValidated,
  required = false,
  disabled = false,
  helperText,
  externalError,
}) => {
  const { validateDni, isValidating, dniValidation } = useKyc();
  const [error, setError] = useState<string>('');
  const displayError = error || externalError || '';
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('Su DNI no puede ser validado. Corrobore los digitos.');

  const handleValidate = async () => {
    if (value.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }
    try {
      setError('');
      const result = await validateDni(value);
      if (result?.success) {
        onValidated?.(result);
      } else {
        setModalMessage('Verifique su DNI, nuestro sistema no ha podido encontrarlo. Corrobore los dígitos ingresados.');
        setShowErrorModal(true);
      }
    } catch (err: any) {
      const errorMsg = err?.message || '';
      if (errorMsg.includes('no disponible') || errorMsg.includes('servicio') || errorMsg === 'Error al validar DNI') {
        setModalMessage('Servicio de validación no disponible temporalmente. Verifique su DNI manualmente o intente más tarde.');
      } else {
        setModalMessage('Verifique su DNI, nuestro sistema no ha podido encontrarlo. Corrobore los dígitos ingresados.');
      }
      setShowErrorModal(true);
      setError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    onChange(val);
    setError('');
  };

  return (
    <div className="space-y-2">
      {/* Label manual */}
      <label className="block text-sm font-medium text-gray-700">
        DNI {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Ingresa tu DNI"
            value={value}
            onChange={handleChange}
            maxLength={8}
            disabled={disabled}
            leftIcon={<Hash className="w-4 h-4 text-gray-400" />}
            className="text-sm focus:scale-100 placeholder:text-gray-400 py-2 w-full"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleValidate}
          disabled={value.length !== 8 || isValidating}
          isLoading={isValidating}
          className="mt-0"
        >
          {isValidating ? 'Validando...' : 'Validar'}
        </Button>
      </div>
      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      {disabled && (
        <p className="text-sm text-gray-500">DNI ya validado y verificado</p>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Validacion de DNI</h3>
            <p className="text-gray-600 mb-6">{modalMessage}</p>
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
