'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceRepository } from '@/infrastructure/repositories/FinanceRepository';
import { toast } from '@/presentation/store/toastStore';
import { authStorage } from '@/infrastructure/storage/auth-storage';

const financeRepo = new FinanceRepository();

export function useWalletBalance() {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: () => financeRepo.getWalletBalance(),
    refetchInterval: 60000,
  });
}

export function useWalletTransactions(page = 0, size = 20) {
  return useQuery({
    queryKey: ['wallet', 'transactions', page, size],
    queryFn: () => financeRepo.getWalletTransactions(page, size),
  });
}

export function useActiveSubscription() {
  return useQuery({
    queryKey: ['subscription', 'active'],
    queryFn: () => financeRepo.getActiveSubscription(),
    staleTime: 0, // Siempre considerar los datos como obsoletos
    refetchOnMount: true, // Siempre refrescar al montar
    refetchOnWindowFocus: true, // Refrescar cuando la ventana gana foco
    refetchInterval: 15000, // Refrescar cada 15s mientras la página esté visible
  });
}

export function useAvailablePlans() {
  return useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: () => financeRepo.getAvailablePlans(),
    retry: 1, // Solo reintentar una vez
    retryDelay: 1000,
    throwOnError: false, // No lanzar errores para no bloquear la UI
  });
}

export function useSubscribeToPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, paymentMethod, discountCode }: { planId: string; paymentMethod: 'CARD' | 'MERCADOPAGO'; discountCode?: string }) =>
      financeRepo.subscribeToPlan(planId, paymentMethod, discountCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', 'active'] });
      // No mostrar mensaje de activacion porque la suscripcion aun no esta activa
      // Se activara cuando MercadoPago notifique el pago
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const data = error.response?.data;
      
      let message = 'No se pudo procesar la solicitud';
      let type: 'warning' | 'info' | 'error' = 'warning';
      
      if (status === 409) {
        message = data?.message || 'Ya tienes una suscripción activa';
        type = 'info';
      } else if (status === 400) {
        message = data?.message || 'Verifica los datos ingresados';
        type = 'warning';
      } else if (status === 402) {
        message = data?.message || 'Completa el pago para activar tu suscripción';
        type = 'info';
      } else if (status === 500) {
        message = 'Error del servidor. Intenta nuevamente.';
        type = 'error';
      } else if (error.message) {
        message = error.message;
      }
      
      toast[type](message);
    },
  });
}

export function usePlanPrice(planId: string | number) {
  const user = authStorage.getUser();
  
  return useQuery({
    queryKey: ['plan', 'price', planId, user?.id],
    queryFn: () => financeRepo.getPlanPriceForUser(Number(planId)),
    enabled: !!planId && !!user?.id,
    staleTime: 30000, // 30s cache
  });
}

export function useAvailableDeveloperDiscountCodes() {
  return useQuery({
    queryKey: ['developer', 'discount-codes'],
    queryFn: async () => {
      const userData = authStorage.getUser();
      if (!userData || (userData.role !== 'AGENT' && userData.role !== 'DEVELOPER')) {
        return [];
      }
      try {
        const result = await financeRepo.getAvailableDeveloperDiscountCodes();
        return result;
      } catch (error) {
        throw error;
      }
    },
    retry: 1,
    throwOnError: false,
  });
}
