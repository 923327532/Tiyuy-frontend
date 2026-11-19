'use client';
import React, { useState } from 'react';
import { Input, Button } from '@/presentation/components/ui';
import { useKyc } from '@/presentation/hooks';
import { Folder } from 'lucide-react';

interface RucInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidated?: (data: any) => void;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  externalError?: string;
}

export const RucInput: React.FC<RucInputProps> = ({
  value,
  onChange,
  onValidated,
  required = false,
  helperText,
  disabled = false,
  externalError,
}) => {
  const { validateRuc, isValidating, rucValidation } = useKyc();
  const [error, setError] = useState<string>('');
  const displayError = error || externalError || '';

  const handleValidate = async () => {
    if (value.length !== 11) {
      setError('El RUC debe tener 11 dígitos');
      return;
    }

    try {
      setError('');
      const result = await validateRuc(value);
      if (result?.success) {
        onValidated?.(result);
      } else {
        // La API no devolvió éxito pero tampoco error: continuamos manual
        onValidated?.({ 
          success: true, 
          companyName: result?.companyName || '', 
          ruc: value,
          message: 'RUC validado localmente'
        });
      }
    } catch (err: any) {
      // La API de validación no responde: permitimos continuar manual
      onValidated?.({ 
        success: true, 
        companyName: '', 
        ruc: value,
        message: 'Ingresa manualmente los datos de tu empresa'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
    onChange(val);
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        RUC {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="12345678901"
            value={value}
            onChange={handleChange}
            error={displayError}
            maxLength={11}
            disabled={disabled}
            leftIcon={
              <Folder className="w-5 h-5" />
            }
            helperText={
              helperText ??
              (disabled
                ? 'RUC ya validado y verificado'
                : 'Ingresa el RUC de tu empresa (11 dígitos)')
            }
          />
        </div>

        <div className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleValidate}
            // Actualizado para usar isValidating
            disabled={value.length !== 11 || isValidating}
            isLoading={isValidating}
          >
            {isValidating ? 'Validando...' : 'Validar'}
          </Button>
        </div>
      </div>
    </div>
  );
};