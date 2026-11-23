'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface NewGroupFormData {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
}

export const INITIAL_NEW_GROUP_DATA: NewGroupFormData = {
  name: '',
  description: '',
  adminName: '',
  adminEmail: '',
  city: '',
  address: '',
  latitude: null,
  longitude: null,
  isActive: true,
};

async function createGroupRequest(groupData: NewGroupFormData) {
  const authData = JSON.parse(localStorage.getItem('tiyuy-auth-token') || '{}');
  const token = authData.state?.token || authData.token || '';

  const response = await fetch('/api/admin/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(groupData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

interface UseCreateGroupOptions {
  onSuccess: () => void;
}

export function useCreateGroup({ onSuccess }: UseCreateGroupOptions) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: createGroupRequest,
    onSuccess: () => {
      ['admin-groups', 'admin-suspended-groups', 'admin-group-violations', 'admin-channel-violations'].forEach(
        (queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }),
      );
      alert(' Grupo creado exitosamente');
      onSuccess();
    },
    onError: (error: Error) => {
      console.error('Error al crear grupo:', error);
      alert(' Error al crear grupo: ' + error.message);
    },
  });

  const submit = async (data: NewGroupFormData) => {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isPending: isSubmitting || mutation.isPending };
}
