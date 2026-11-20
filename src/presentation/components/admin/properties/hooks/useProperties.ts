'use client';

import { useState } from 'react';

import type { PropertyModerationItem } from '@/core/domain/entities/Admin';
import { usePropertiesData } from './usePropertiesData';
import { usePropertiesActions } from './usePropertiesActions';

export function useProperties() {
  const data = usePropertiesData();
  const actions = usePropertiesActions(data.refetch);
  const [selectedProperties, setSelectedProperties] = useState<PropertyModerationItem[]>([]);

  return {
    ...data,
    ...actions,
    selectedProperties,
    setSelectedProperties,
  };
}
