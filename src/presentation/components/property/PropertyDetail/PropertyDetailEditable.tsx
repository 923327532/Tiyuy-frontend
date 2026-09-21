'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, FileText } from 'lucide-react';
import { Property } from '@/core/domain/entities/Property';
import { PropertyGallery } from '../PropertyGallery/PropertyGallery';
import { PropertyLocation } from './PropertyLocation';
import { PropertyQuickInfo } from './PropertyQuickInfo';
import { useUpdateProperty } from '@/presentation/hooks/useProperties';
import { useAuthStore } from '@/presentation/store/authStore';
import { toast } from 'sonner';

interface PropertyDetailEditableProps {
  property: Property;
  onSave?: () => void;
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Departamento',
  HOUSE: 'Casa',
  LAND: 'Terreno',
  OFFICE: 'Oficina',
  COMMERCIAL: 'Local Comercial',
  ROOM: 'Habitación',
};

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
};

export function PropertyDetailEditable({ property, onSave }: PropertyDetailEditableProps) {
  const updateMutation = useUpdateProperty();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    title: property.title || '',
    description: property.description || '',
    price: property.price || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    totalArea: property.totalArea || 0,
    builtArea: property.builtArea || 0,
    parkingSpots: property.parkingSpots || 0,
    maintenanceFee: property.maintenanceFee || 0,
  });

  const [isEditing, setIsEditing] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'USD' ? 'US$' : 'S/';
    return `${symbol} ${price.toLocaleString('es-PE')}`;
  };

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[property.type] || property.type;
  const transactionLabel = TRANSACTION_TYPE_LABELS[property.transactionType] || property.transactionType;

  const locationLine = [
    property.location?.fullAddress,
    property.location?.district,
    property.location?.province,
  ].filter(Boolean).join(', ');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        userId: user?.id || 0,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        totalArea: formData.totalArea,
        builtArea: formData.builtArea,
        parkingSpots: formData.parkingSpots,
        maintenanceFee: formData.maintenanceFee
      };
      
      await updateMutation.mutateAsync({
        id: property.id,
        data: updateData
      });
      
      toast.success('Propiedad actualizada exitosamente');
      setIsEditing(false);
      
      onSave?.();
    } catch (error) {
      toast.error('Error al actualizar la propiedad');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors">
      <div className="w-full px-4 sm:px-6 py-6">
        {/* Header con botones de acción */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Editar Propiedad
          </h1>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancelar edición
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-[var(--brand-primary)] text-white font-semibold text-sm rounded-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-colors"
                >
                  {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/my-properties"
                  className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Cancelar / Volver
                </Link>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[var(--brand-primary)] text-white font-semibold text-sm rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
                >
                  Modo Edición
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* COLUMNA PRINCIPAL */}
          <div className="space-y-4">
            {/* 1. GALERÍA (solo visual, no editable) */}
            <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] shadow-sm -mt-2 border border-[var(--border-color)]">
              <PropertyGallery media={property.media} coverPhotoUrl={property.coverPhotoUrl} />
            </div>

            {/* 1.5 STATS RÁPIDOS (m², baños, dorm.) debajo de la galería */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-4">
              <PropertyQuickInfo property={property} />
            </div>

            {/* 2. TIPO · PRECIO · TÍTULO · DIRECCIÓN */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <span className="font-semibold text-[var(--brand-primary)] uppercase tracking-wide text-xs">
                {propertyTypeLabel}
              </span>

              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className="text-2xl sm:text-3xl font-bold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-base font-normal text-[var(--text-secondary)]">
                      {property.currency === 'USD' ? 'US$' : 'S/'}
                      {property.transactionType === 'RENT' && (
                        <span className="ml-1">/ mes</span>
                      )}
                    </span>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                      {transactionLabel}&nbsp;{formatPrice(formData.price, property.currency)}
                      {property.transactionType === 'RENT' && (
                        <span className="text-base font-normal text-[var(--text-secondary)] ml-1">/ mes</span>
                      )}
                    </h2>
                    {property.pricePerSqm && (
                      <span className="text-sm text-[var(--text-secondary)]">
                        · {formatPrice(property.pricePerSqm, property.currency)} / m²
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Título editable */}
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-3 text-lg font-semibold bg-[var(--bg-primary)] text-[var(--text-primary)] leading-snug w-full border border-[var(--border-color)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="Título de la propiedad"
                />
              ) : (
                <h1 className="mt-3 text-lg font-semibold text-[var(--text-primary)] leading-snug">
                  {formData.title}
                </h1>
              )}

              {locationLine && (
                <p className="mt-2 text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                  {locationLine}
                </p>
              )}
            </div>

            {/* 3. CARACTERÍSTICAS (Formato vertical: Etiqueta arriba, Valor/Atributo abajo) */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Características</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Área Total', field: 'totalArea', value: formData.totalArea ? `${formData.totalArea.toLocaleString('es-PE')} m²` : '0 m²' },
                  { label: 'Área Construida', field: 'builtArea', value: formData.builtArea ? `${formData.builtArea.toLocaleString('es-PE')} m²` : '0 m²' },
                  { label: 'Dormitorios', field: 'bedrooms', value: formData.bedrooms ? `${formData.bedrooms} dorm.` : '0 dorm.' },
                  { label: 'Baños', field: 'bathrooms', value: formData.bathrooms ? `${formData.bathrooms} baños` : '0 baños' },
                  { label: 'Estacionamientos', field: 'parkingSpots', value: formData.parkingSpots },
                  { label: 'Mantenimiento', field: 'maintenanceFee', value: formData.maintenanceFee ? `S/ ${formData.maintenanceFee}` : 'No' },
                ].map(({ label, field, value }) => (
                  <div key={field} className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)] flex flex-col items-start justify-center">
                    <span className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                      {label}
                    </span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData[field as keyof typeof formData] || 0}
                        onChange={(e) => handleInputChange(field, Number(e.target.value))}
                        className="w-full text-base font-semibold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded px-2 py-1 text-left focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                        min="0"
                      />
                    ) : (
                      <span className="text-base font-semibold text-[var(--text-primary)]">
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DESCRIPCIÓN editable */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                Descripción de la propiedad
              </h2>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] leading-relaxed text-sm border border-[var(--border-color)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  placeholder="Describe la propiedad..."
                />
              ) : (
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap">
                  {formData.description || 'No hay descripción disponible'}
                </p>
              )}
            </div>

            {/* 5. MAPA */}
            <PropertyLocation location={property.location} propertyId={property.id} />
          </div>
        </div>
      </div>
    </div>
  );
}