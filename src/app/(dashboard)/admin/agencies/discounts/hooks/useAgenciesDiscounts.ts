/**
 * Page logic hook for the Agencies Discounts page
 */

import { useState, useCallback, useEffect } from 'react';
import { axiosClient } from '@/infrastructure/api/axios-client';
import {
  DeveloperDiscountCode,
  PaginatedResponse,
  FilterState,
  NewDiscountForm,
  EMPTY_NEW_DISCOUNT,
} from '../types';
import { exportDiscountsExcel } from '../utils';

export function useAgenciesDiscounts() {
  const [data, setData] = useState<PaginatedResponse<DeveloperDiscountCode> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: '',
    developerFilter: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [developers, setDevelopers] = useState<{ id: number; name: string }[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState<NewDiscountForm>(EMPTY_NEW_DISCOUNT);
  const [isCreatePending, setIsCreatePending] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.statusFilter) params.append('status', filters.statusFilter);
      if (filters.developerFilter) params.append('developerId', filters.developerFilter);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom + 'T00:00:00');
      if (filters.dateTo) params.append('dateTo', filters.dateTo + 'T23:59:59');
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      params.append('sort', sortBy);

      const response = await axiosClient.get(`/admin/developers/discount-codes`, { params });

      if (!response.data) {
        setError('Respuesta vacía del servidor');
        setData(null);
      } else {
        setData(response.data);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Endpoint de descuentos no disponible. Contacte al administrador del backend.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('No autorizado. Verifique su sesión.');
      } else {
        setError(err.response?.data?.message || 'Error al cargar descuentos');
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize, sortBy]);

  // Fetch developers for filter dropdown
  const fetchDevelopers = useCallback(async () => {
    try {
      const response = await axiosClient.get('/admin/developers', { params: { size: 1000 } });
      if (response.data?.content) {
        setDevelopers(response.data.content);
      }
    } catch (err) {
      console.error('Error fetching developers:', err);
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      statusFilter: '',
      developerFilter: '',
      dateFrom: '',
      dateTo: '',
    });
    setCurrentPage(0);
  };

  const hasFilters = Boolean(filters.searchQuery || filters.statusFilter || filters.developerFilter || filters.dateFrom || filters.dateTo);

  // Create discount
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscount.developerId || !newDiscount.code || !newDiscount.discountPercentage) {
      alert('Completa los campos obligatorios');
      return;
    }

    setIsCreatePending(true);
    try {
      await axiosClient.post(`/admin/developers/${newDiscount.developerId}/discount-codes`, {
        code: newDiscount.code.toUpperCase(),
        discountPercentage: parseInt(newDiscount.discountPercentage),
        maxUses: newDiscount.maxUses ? parseInt(newDiscount.maxUses) : null,
        validFrom: newDiscount.validFrom ? new Date(newDiscount.validFrom).toISOString() : null,
        validUntil: newDiscount.validUntil ? new Date(newDiscount.validUntil).toISOString() : null,
        applicableToAgents: newDiscount.applicableToAgents,
      });

      setIsCreateModalOpen(false);
      setNewDiscount(EMPTY_NEW_DISCOUNT);
      fetchData();
      alert('Descuento creado exitosamente');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear descuento');
    } finally {
      setIsCreatePending(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (discountCode: DeveloperDiscountCode, newStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED') => {
    try {
      await axiosClient.patch(`/admin/discount-codes/${discountCode.id}/status`, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  // Delete discount
  const handleDeleteDiscount = async (discountCode: DeveloperDiscountCode) => {
    if (!confirm(`¿Eliminar el código "${discountCode.code}"?`)) return;
    try {
      await axiosClient.delete(`/admin/discount-codes/${discountCode.id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  // Export Excel
  const handleExport = () => {
    if (!data?.content?.length) {
      alert('No hay datos para exportar');
      return;
    }
    exportDiscountsExcel(data.content, filters);
  };

  // Load data on mount
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      await fetchData();
      if (mounted) {
        await fetchDevelopers();
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [fetchData, fetchDevelopers]);

  return {
    data, isLoading, error,
    filters, sortBy, setSortBy,
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    showFilters, setShowFilters,
    developers,
    isCreateModalOpen, setIsCreateModalOpen,
    newDiscount, setNewDiscount,
    isCreatePending,
    hasFilters,
    handleFilterChange,
    handleClearFilters,
    handleCreateDiscount,
    handleToggleStatus,
    handleDeleteDiscount,
    handleExport,
    fetchData,
  };
}
