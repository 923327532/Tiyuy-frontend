/**
 * State and handlers hook for Developer Subscription Discount Form Modal
 */

import { useState, useEffect } from 'react';
import {
  CreateDeveloperSubscriptionDiscountRequest,
  UpdateDeveloperSubscriptionDiscountRequest,
} from '@/core/domain/entities/DeveloperSubscriptionDiscount';
import {
  FormData,
  FormErrors,
  DeveloperOption,
  DeveloperSubscriptionDiscountFormModalProps,
  DEFAULT_FORM_DATA,
} from './formConfig';
import { validateForm } from './formValidation';

export function useDiscountForm({
  isOpen,
  onClose: _onClose,
  editingDiscount,
  onSubmit,
}: DeveloperSubscriptionDiscountFormModalProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [developerSearch, setDeveloperSearch] = useState('');
  const [showDeveloperDropdown, setShowDeveloperDropdown] = useState(false);
  const [developers, setDevelopers] = useState<DeveloperOption[]>([]);

  // Load developers on mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('/admin/developers?size=1000', {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setDevelopers(data.content || []);
        }
      } catch (err) {
        console.error('Error fetching developers:', err);
      }
    };
    fetchDevelopers();
  }, []);

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (editingDiscount) {
        setFormData({
          developerId: editingDiscount.developerId.toString(),
          type: editingDiscount.type,
          percentage: editingDiscount.percentage?.toString() || '',
          amountPen: editingDiscount.amountPen?.toString() || '',
          amountUsd: editingDiscount.amountUsd?.toString() || '',
          applicabilityScope: editingDiscount.applicabilityScope,
          applicablePlanCodes: editingDiscount.applicablePlanCodes?.join(', ') || '',
          maxDiscountPen: editingDiscount.maxDiscountPen?.toString() || '',
          maxDiscountUsd: editingDiscount.maxDiscountUsd?.toString() || '',
          usageLimit: editingDiscount.usageLimit?.toString() || '',
          validFrom: editingDiscount.validFrom ? new Date(editingDiscount.validFrom).toISOString().split('T')[0] : '',
          validUntil: editingDiscount.validUntil ? new Date(editingDiscount.validUntil).toISOString().split('T')[0] : '',
          adminReason: editingDiscount.adminReason,
        });
        setDeveloperSearch(`${editingDiscount.developerName} (${editingDiscount.developerRuc || 'sin RUC'})`);
      } else {
        setFormData(DEFAULT_FORM_DATA);
        setDeveloperSearch('');
      }
      setErrors({});
    } else {
      setFormData(DEFAULT_FORM_DATA);
      setDeveloperSearch('');
      setErrors({});
    }
  }, [isOpen, editingDiscount]);

  // Filter developers
  const filteredDevelopers = developers.filter(d =>
    d.name.toLowerCase().includes(developerSearch.toLowerCase()) ||
    (d.ruc && d.ruc.includes(developerSearch))
  ).slice(0, 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const submitData: CreateDeveloperSubscriptionDiscountRequest | UpdateDeveloperSubscriptionDiscountRequest = {
      type: formData.type,
      applicabilityScope: formData.applicabilityScope,
      validFrom: new Date(formData.validFrom).toISOString(),
      adminReason: formData.adminReason,
    };

    if (!editingDiscount) {
      (submitData as CreateDeveloperSubscriptionDiscountRequest).developerId = parseInt(formData.developerId);
    }

    if (formData.type === 'PERCENTAGE') {
      submitData.percentage = parseFloat(formData.percentage);
    } else {
      if (formData.amountPen) submitData.amountPen = parseFloat(formData.amountPen);
      if (formData.amountUsd) submitData.amountUsd = parseFloat(formData.amountUsd);
    }

    if (formData.applicablePlanCodes.trim()) {
      submitData.applicablePlanCodes = formData.applicablePlanCodes.split(',').map(c => c.trim()).filter(Boolean);
    }

    if (formData.maxDiscountPen) submitData.maxDiscountPen = parseFloat(formData.maxDiscountPen);
    if (formData.maxDiscountUsd) submitData.maxDiscountUsd = parseFloat(formData.maxDiscountUsd);
    if (formData.usageLimit) submitData.usageLimit = parseInt(formData.usageLimit);
    if (formData.validUntil) submitData.validUntil = new Date(formData.validUntil).toISOString();

    onSubmit(submitData);
  };

  const handleDeveloperSelect = (dev: DeveloperOption) => {
    setFormData(prev => ({ ...prev, developerId: dev.id.toString() }));
    setDeveloperSearch(`${dev.name} (${dev.ruc || 'sin RUC'})`);
    setShowDeveloperDropdown(false);
  };

  return {
    formData,
    setFormData,
    errors,
    developerSearch,
    setDeveloperSearch,
    showDeveloperDropdown,
    setShowDeveloperDropdown,
    filteredDevelopers,
    handleSubmit,
    handleDeveloperSelect,
  };
}
