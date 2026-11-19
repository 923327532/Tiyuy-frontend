import { apiClient } from '../api/axios-client';
import { ENDPOINTS } from '../api/endpoints';
import { IPaymentRepository } from '@/core/domain/repositories/IPaymentRepository';
import { Payment, PaymentRequest } from '@/core/domain/entities/Wallet';
import { 
  PaymentResponseDTO, 
  PaymentPageDTO, 
  TotalPaidDTO 
} from '@/core/application/dtos/PaymentDTO';

export class PaymentRepository implements IPaymentRepository {
  private mapToPayment(dto: PaymentResponseDTO): Payment {
    return {
      id: dto.id,
      userId: dto.userId,
      amount: dto.amount,
      currency: dto.currency,
      status: dto.status as Payment['status'],
      paymentMethod: dto.paymentMethod as Payment['paymentMethod'],
      description: dto.description,
      transactionId: dto.transactionId,
      errorMessage: dto.errorMessage || undefined,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
      createdAt: new Date(dto.createdAt),
      phone: dto.phone,
      lastFour: dto.lastFour,
    };
  }

  async processPayment(request: PaymentRequest): Promise<Payment> {
    const response = await apiClient.post<PaymentResponseDTO>(
      ENDPOINTS.PAYMENTS.MERCADOPAGO,
      {
        token: request.token,
        amount: request.amount,
        description: request.description,
        sessionId: request.sessionId, // Para device fingerprint antifraude
      }
    );

    return this.mapToPayment(response.data);
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const response = await apiClient.get<PaymentResponseDTO>(
      ENDPOINTS.PAYMENTS.BY_ID(paymentId)
    );
    return this.mapToPayment(response.data);
  }

  async getMyPayments(page = 0, size = 20): Promise<{
    content: Payment[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }> {
    const response = await apiClient.get<PaymentPageDTO>(
      ENDPOINTS.PAYMENTS.MY_PAYMENTS,
      {
        params: { page, size, sort: 'createdAt,desc' },
      }
    );

    return {
      content: response.data.content.map(this.mapToPayment),
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      page: response.data.number,
      size: response.data.size,
    };
  }

  async getTotalPaid(): Promise<{ totalPaid: number; currency: string }> {
    const response = await apiClient.get<TotalPaidDTO>(
      ENDPOINTS.PAYMENTS.TOTAL_PAID
    );
    return response.data;
  }
}
