'use client';

import React, { useState } from 'react';

interface ProjectTimelineStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export function ProjectTimelineStep({ formData, onChange }: ProjectTimelineStepProps) {
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState({
    phase: '',
    date: '',
    description: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateMainDates = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    if (field === 'startDate') {
      if (formData.estimatedDelivery && value > formData.estimatedDelivery) {
        newErrors.startDate = 'La fecha de inicio no puede ser posterior a la de entrega';
      } else {
        delete newErrors.startDate;
        delete newErrors.estimatedDelivery;
      }
    }

    if (field === 'estimatedDelivery') {
      const start = formData.startDate || formData.constructionStart;
      if (!value) {
        newErrors.estimatedDelivery = 'La fecha de entrega estimada es obligatoria';
      } else if (start && value < start) {
        newErrors.estimatedDelivery = 'La fecha de entrega no puede ser anterior a la de inicio';
      } else {
        delete newErrors.estimatedDelivery;
        delete newErrors.startDate;
      }
    }

    setErrors(newErrors);
  };

  const addMilestone = () => {
    const milestoneErrors: { [key: string]: string } = {};

    if (!currentMilestone.phase.trim()) {
      milestoneErrors.phase = 'El nombre de la fase o hito es obligatorio';
    }
    if (!currentMilestone.date) {
      milestoneErrors.date = 'La fecha del hito es obligatoria';
    }

    if (Object.keys(milestoneErrors).length > 0) {
      setErrors(p => ({ ...p, ...milestoneErrors }));
      return;
    }

    const timeline = formData.timeline || [];
    onChange('timeline', [...timeline, { ...currentMilestone, phase: currentMilestone.phase.trim(), id: Date.now() }]);
    setCurrentMilestone({ phase: '', date: '', description: '' });
    setShowMilestoneForm(false);
    
    setErrors(p => {
      const { phase, date, ...rest } = p;
      return rest;
    });
  };

  const removeMilestone = (milestoneId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este hito?')) {
      const timeline = formData.timeline || [];
      onChange('timeline', timeline.filter((m: any) => m.id !== milestoneId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Timeline del Proyecto</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Define las fechas importantes y hitos de construcción
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Inicio de Construcción
          </label>
          <input
            type="date"
            max={formData.estimatedDelivery || undefined}
            value={formData.startDate || formData.constructionStart || ''}
            onChange={(e) => {
              onChange('startDate', e.target.value);
              validateMainDates('startDate', e.target.value);
            }}
            className={`w-full px-3 py-2 border rounded-lg outline-none transition focus:ring-2 bg-[var(--bg-card)] text-[var(--text-primary)] ${
              errors.startDate 
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                : 'border-[var(--input-border)] focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]'
            }`}
          />
          {errors.startDate && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Entrega Estimada *
          </label>
          <input
            type="date"
            min={formData.startDate || formData.constructionStart || undefined}
            value={formData.estimatedDelivery || ''}
            onChange={(e) => {
              onChange('estimatedDelivery', e.target.value);
              validateMainDates('estimatedDelivery', e.target.value);
            }}
            className={`w-full px-3 py-2 border rounded-lg outline-none transition focus:ring-2 bg-[var(--bg-card)] text-[var(--text-primary)] ${
              errors.estimatedDelivery 
                ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                : 'border-[var(--input-border)] focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]'
            }`}
            required
          />
          {errors.estimatedDelivery && (
            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {errors.estimatedDelivery}
            </p>
          )}
        </div>
      </div>

      <div className="bg-[var(--brand-primary-light)] border border-[var(--brand-primary)]/20 rounded-lg p-4">
        <h4 className="font-medium text-[var(--text-primary)] mb-2">Información importante</h4>
        <ul className="text-sm text-[var(--text-secondary)] space-y-1">
          <li>• La fecha de entrega estimada es obligatoria</li>
          <li>• Puedes agregar hitos importantes del proyecto</li>
          <li>• Estas fechas serán visibles para los compradores</li>
        </ul>
      </div>

      {formData.timeline && formData.timeline.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-[var(--text-primary)]">Hitos del Proyecto</h4>
          <div className="space-y-3">
            {[...formData.timeline]
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((milestone: any) => (
                <div key={milestone.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--bg-card)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full"></div>
                        <span className="font-medium text-[var(--text-primary)]">{milestone.phase}</span>
                        <span className="text-sm text-[var(--text-muted)]">
                          {new Date(milestone.date + 'T00:00:00').toLocaleDateString('es-PE')}
                        </span>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-[var(--text-secondary)]">{milestone.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700 ml-4 text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!showMilestoneForm && (
        <button
          type="button"
          onClick={() => setShowMilestoneForm(true)}
          className="w-full py-3 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition text-sm font-medium"
        >
          + Agregar Hito
        </button>
      )}

      {showMilestoneForm && (
        <div className="border border-[var(--brand-primary)]/20 rounded-xl p-5 bg-[var(--brand-primary)]/[0.04] space-y-4">
          <h4 className="font-semibold text-[var(--text-primary)]">Nuevo Hito</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Fase o Hito *
              </label>
              <input
                type="text"
                maxLength={100}
                value={currentMilestone.phase}
                onChange={(e) => {
                  setCurrentMilestone({ ...currentMilestone, phase: e.target.value });
                  if (e.target.value.trim() && errors.phase) {
                    setErrors(p => { const { phase, ...r } = p; return r; });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition focus:ring-2 bg-[var(--bg-card)] text-[var(--text-primary)] ${
                  errors.phase 
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                    : 'border-[var(--input-border)] focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]'
                }`}
                placeholder="Ej: Inicio de cimentación"
                required
              />
              {errors.phase && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.phase}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={currentMilestone.date}
                onChange={(e) => {
                  setCurrentMilestone({ ...currentMilestone, date: e.target.value });
                  if (e.target.value && errors.date) {
                    setErrors(p => { const { date, ...r } = p; return r; });
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg outline-none transition focus:ring-2 bg-[var(--bg-card)] text-[var(--text-primary)] ${
                  errors.date 
                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                    : 'border-[var(--input-border)] focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]'
                }`}
                required
              />
              {errors.date && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Descripción
              </label>
              <input
                type="text"
                maxLength={250}
                value={currentMilestone.description}
                onChange={(e) => setCurrentMilestone({ ...currentMilestone, description: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg outline-none transition focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] text-[var(--text-primary)] bg-[var(--bg-card)]"
                placeholder="Detalles importantes (opcional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setCurrentMilestone({ phase: '', date: '', description: '' });
                setErrors(p => { const { phase, date, ...r } = p; return r; });
                setShowMilestoneForm(false);
              }}
              className="px-4 py-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-lg hover:bg-[var(--brand-primary)]/[0.06] text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={addMilestone}
              className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] text-sm font-medium transition-colors shadow-sm"
            >
              Agregar Hito
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-[var(--text-primary)] mb-3">Certificaciones y Sellos de Calidad</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Sello de Calidad', 'Certificación LEED', 'ISO 9001', 
            'Certificado de Seguridad', 'Sustentable', 'Edificio Inteligente',
            'Certificado Sismorresistente', 'Material Premium', 'Garantía Estructural'
          ].map((cert) => (
            <label key={cert} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.certifications?.includes(cert) || false}
                onChange={(e) => {
                  const current = formData.certifications || [];
                  if (e.target.checked) {
                    onChange('certifications', [...current, cert]);
                  } else {
                    onChange('certifications', current.filter((c: string) => c !== cert));
                  }
                }}
                className="rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] w-4 h-4 cursor-pointer transition"
              />
              <span className="text-sm text-[var(--text-secondary)] select-none group-hover:text-[var(--text-primary)] transition-colors">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.timeline && formData.timeline.length > 0 && (
        <div className="bg-[var(--brand-primary)]/[0.04] border border-[var(--brand-primary)]/20 rounded-xl p-4">
          <h4 className="font-medium text-[var(--text-primary)] mb-2">Resumen del Timeline</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Total Hitos:</span>
              <span className="font-semibold text-[var(--text-primary)]">{formData.timeline.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Primer Hito:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {new Date(Math.min(...formData.timeline.map((m: any) => new Date(m.date).getTime())) + 86400000).toLocaleDateString('es-PE')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Último Hito:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {new Date(Math.max(...formData.timeline.map((m: any) => new Date(m.date).getTime())) + 86400000).toLocaleDateString('es-PE')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
