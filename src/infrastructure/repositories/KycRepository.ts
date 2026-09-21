import { publicApiClient, axiosClient } from '../api/axios-client';
import { KYC_ENDPOINTS } from '../api/endpoints';
import { IKycRepository } from '@/core/domain/repositories';
import {
  DniValidationResponse,
  RucValidationResponse,
  KycVerification,
} from '@/core/domain/entities';

export class KycRepository implements IKycRepository {
  async validateDni(dni: string): Promise<DniValidationResponse> {
    try {
      const response = await publicApiClient.post<DniValidationResponse>(
        KYC_ENDPOINTS.VALIDATE_DNI,
        { dni }
      );
      return response.data;
    } catch (error: any) {
      // Extraer mensaje amigable del backend
      const data = error.response?.data;
      const msg = data?.message || 'Error al validar DNI';
      throw new Error(msg);
    }
  }

  async validateRuc(ruc: string): Promise<RucValidationResponse> {
    try {
      const response = await publicApiClient.post<RucValidationResponse>(
        KYC_ENDPOINTS.VALIDATE_RUC,
        { ruc }
      );
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const msg = data?.message || 'Error al validar RUC';
      throw new Error(msg);
    }
  }

  async completeKyc(
    userId: string,
    dni: string,
    validation: DniValidationResponse
  ): Promise<KycVerification> {
    try {
      const response = await publicApiClient.post<KycVerification>(
        KYC_ENDPOINTS.COMPLETE_KYC,
        { dni }
      );
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const msg = data?.message || 'Error al completar KYC';
      throw new Error(msg);
    }
  }

  async upgradeToDeveloper(userId: string, ruc: string): Promise<any> {
    try {
      const response = await publicApiClient.post(KYC_ENDPOINTS.UPGRADE_DEVELOPER, { ruc });
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const msg = data?.message || 'Error al actualizar a desarrollador';
      throw new Error(msg);
    }
  }

  /**
   * Sube la foto del documento internacional y la selfie a S3.
   * El registro queda en estado PENDING hasta que un administrador lo apruebe.
   * NO se simula ninguna verificación real.
   */
  async uploadInternationalDocuments(documentImage: File, selfieImage: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('documentImage', documentImage);
      formData.append('selfieImage', selfieImage);
      const response = await axiosClient.post(
        '/identity/kyc-international/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      const msg = data?.message || 'Error al subir los documentos';
      throw new Error(msg);
    }
  }
}
