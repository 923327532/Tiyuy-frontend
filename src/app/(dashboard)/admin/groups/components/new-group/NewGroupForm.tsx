'use client';

import { useState } from 'react';
import { Globe, User, Users } from 'lucide-react';

import { LocationField } from './location';
import type { Coordinates } from './location';
import { INITIAL_NEW_GROUP_DATA, useCreateGroup } from './useCreateGroup';
import './styles/NewGroupPage.css';

interface NewGroupFormProps {
  onClose: () => void;
}

export function NewGroupForm({ onClose }: NewGroupFormProps) {
  const [formData, setFormData] = useState({ ...INITIAL_NEW_GROUP_DATA });
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const { submit, isPending } = useCreateGroup({ onSuccess: onClose });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit({
        ...formData,
        latitude: coordinates?.lat ?? null,
        longitude: coordinates?.lng ?? null,
      });
      setFormData({ ...INITIAL_NEW_GROUP_DATA });
      setCoordinates(null);
    } catch {
      // Los errores ya se notifican en useCreateGroup.
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="ngp-form">
      <section className="ngp-form__section">
        <h2 className="ngp-form__section-title">
          <Users className="ngp-form__section-icon" aria-hidden="true" />
          Información Básica
        </h2>

        <div className="ngp-form__group">
          <label htmlFor="name" className="ngp-form__label">
            Nombre del Grupo <span className="ngp-form__required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="ngp-form__input"
            placeholder="Ej: Amantes de la Naturaleza"
          />
        </div>

        <div className="ngp-form__group">
          <label htmlFor="description" className="ngp-form__label">
            Descripción <span className="ngp-form__required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="ngp-form__textarea"
            placeholder="Describe el propósito y actividades del grupo..."
          />
        </div>
      </section>

      <section className="ngp-form__section">
        <h2 className="ngp-form__section-title">
          <User className="ngp-form__section-icon" aria-hidden="true" />
          Información del Administrador
        </h2>

        <div className="ngp-form__grid">
          <div className="ngp-form__group">
            <label htmlFor="adminName" className="ngp-form__label">
              Nombre del Administrador <span className="ngp-form__required">*</span>
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
              className="ngp-form__input"
              placeholder="Nombre completo"
            />
          </div>

          <div className="ngp-form__group">
            <label htmlFor="adminEmail" className="ngp-form__label">
              Email del Administrador <span className="ngp-form__required">*</span>
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              required
              className="ngp-form__input"
              placeholder="admin@ejemplo.com"
            />
          </div>
        </div>
      </section>

      <section className="ngp-form__section">
        <LocationField
          district={formData.city}
          address={formData.address}
          coordinates={coordinates}
          onDistrictChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
          onAddressChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
          onCoordinatesChange={setCoordinates}
        />
      </section>

      <section className="ngp-form__section">
        <h2 className="ngp-form__section-title">
          <Globe className="ngp-form__section-icon" aria-hidden="true" />
          Estado del Grupo
        </h2>

        <div className="ngp-form__checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="ngp-form__checkbox"
          />
          <label htmlFor="isActive" className="ngp-form__checkbox-label">
            Grupo activo
          </label>
        </div>
        <p className="ngp-form__helper">
          Los grupos activos son visibles y pueden ser utilizados por los usuarios.
        </p>
      </section>

      <div className="ngp-form__actions">
        <button type="button" onClick={onClose} className="ngp-form__btn ngp-form__btn--cancel">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="ngp-form__btn ngp-form__btn--submit"
        >
          {isPending ? (
            <>
              <span className="ngp-form__spinner" aria-hidden="true" />
              Creando...
            </>
          ) : (
            <>
              <Users className="w-4 h-4" aria-hidden="true" />
              Crear Grupo
            </>
          )}
        </button>
      </div>
    </form>
  );
}
