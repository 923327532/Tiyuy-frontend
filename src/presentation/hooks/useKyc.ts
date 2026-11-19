import { useKycStore } from '../store/kycStore';
import { KycRepository } from '@/infrastructure/repositories';

const kycRepository = new KycRepository();

export const useKyc = () => {
  const {
    dniValidation,
    rucValidation,
    isValidating,
    error,
    setDniValidation,
    setRucValidation,
    setValidating,
    setError,
    clearKyc,
  } = useKycStore();

  const validateDni = async (dni: string) => {
    try {
      setValidating(true);
      setError(null);

      const validation = await kycRepository.validateDni(dni);
      setDniValidation(validation);

      return validation;
    } catch (err: any) {
      setError(err.message || 'Error al validar DNI');
      throw err;
    } finally {
      setValidating(false);
    }
  };

  const validateRuc = async (ruc: string) => {
    try {
      setValidating(true);
      setError(null);

      const validation = await kycRepository.validateRuc(ruc);
      setRucValidation(validation);

      return validation;
    } catch (err: any) {
      setError(err.message || 'Error al validar RUC');
      throw err;
    } finally {
      setValidating(false);
    }
  };

  const completeKyc = async (userId: string, dni: string) => {
    if (!dniValidation) {
      throw new Error('Primero valida el DNI');
    }

    try {
      setValidating(true);
      const kyc = await kycRepository.completeKyc(userId, dni, dniValidation);
      return kyc;
    } catch (err: any) {
      setError(err.message || 'Error al completar KYC');
      throw err;
    } finally {
      setValidating(false);
    }
  };

  const upgradeToDeveloper = async (userId: string, ruc: string) => {
    try {
      setValidating(true);
      const result = await kycRepository.upgradeToDeveloper(userId, ruc);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar a desarrollador');
      throw err;
    } finally {
      setValidating(false);
    }
  };

  const uploadInternationalDocuments = async (documentImage: File, selfieImage: File) => {
    try {
      setValidating(true);
      setError(null);
      const result = await kycRepository.uploadInternationalDocuments(documentImage, selfieImage);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al subir los documentos');
      throw err;
    } finally {
      setValidating(false);
    }
  };

  return {
    dniValidation,
    rucValidation,
    isValidating,
    error,
    validateDni,
    validateRuc,
    completeKyc,
    upgradeToDeveloper,
    uploadInternationalDocuments,
    clearKyc,
  };
};
