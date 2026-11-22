/**
 * Dashboard and analytics hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository, ADMIN_QUERY_KEY } from './useAdminShared';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'stats'],
    queryFn: () => adminRepository.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePropertyAnalytics = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'properties'],
    queryFn: () => adminRepository.getPropertyAnalytics(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'userStats'],
    queryFn: async () => {
      try {
        return await adminRepository.getUserStats();
      } catch (error) {
        console.error(' Error fetching user stats:', error);
        return {
          totalUsers: 0,
          activeUsers: 0,
          newUsersToday: 0,
          newUsersThisWeek: 0,
          newUsersThisMonth: 0,
          usersByRole: {},
          usersByStatus: {}
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserRegistrationHistory = (period: string = '1M') => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'registrationHistory', period],
    queryFn: async () => {
      try {
        return await adminRepository.getUserRegistrationHistory(period);
      } catch (error) {
        console.error(' Error fetching registration history:', error);
        return {
          period: period,
          startDate: '',
          endDate: '',
          totalRegistrations: 0,
          dataPoints: []
        };
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinanceStats = () => {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'dashboard', 'financeStats'],
    queryFn: () => adminRepository.getFinanceStats(),
    staleTime: 0, // No caché - siempre datos frescos
    refetchOnWindowFocus: true, // Refrescar al enfocar ventana
    refetchOnReconnect: true, // Refrescar al reconectar
  });
};

