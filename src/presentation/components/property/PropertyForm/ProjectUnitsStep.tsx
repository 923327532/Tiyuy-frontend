'use client';

import React, { useState } from 'react';
import { Home, LayoutDashboard, Maximize } from 'lucide-react';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { toast } from 'sonner';
import {
  PROJECT_UNIT_TYPES_LABELS,
  PROJECT_UNIT_STATUS_LABELS,
  CURRENCIES,
} from '@/config/constants';

const LOT_FIELDS_CONFIG = [
  { key: 'lotNumber', label: 'Número de lote *', type: 'text', placeholder: 'Ej: L-01' },
  { key: 'block', label: 'Manzana', type: 'text', placeholder: 'Ej: Mz A' },
  { key: 'area', label: 'Área (m²) *', type: 'number', min: 0, step: 0.01 },
  { key: 'frontWidth', label: 'Frente (ml)', type: 'number', min: 0, step: 0.01 },
  { key: 'price', label: 'Precio *', type: 'number', min: 0, isPrice: true },
  { key: 'status', label: 'Estado *', type: 'select', options: 'PROJECT_UNIT_STATUS_LABELS' },
  { key: 'view', label: 'Ubicación', type: 'text', placeholder: 'Ej: Frente a parque principal' },
];

const LOT_GROUP_FIELDS_CONFIG = [
  { key: 'groupName', label: 'Nombre del grupo *', type: 'text', placeholder: 'Ej: Lotes Mz A - Frente' },
  { key: 'block', label: 'Manzana', type: 'text', placeholder: 'Ej: Mz A' },
  { key: 'area', label: 'Área (m²) *', type: 'number', min: 0, step: 0.01 },
  { key: 'frontWidth', label: 'Frente (ml)', type: 'number', min: 0, step: 0.01 },
  { key: 'price', label: 'Precio *', type: 'number', min: 0, isPrice: true },
  { key: 'status', label: 'Estado *', type: 'select', options: 'PROJECT_UNIT_STATUS_LABELS' },
  { key: 'view', label: 'Ubicación', type: 'text', placeholder: 'Ej: Frente a parque principal' },
  { key: 'quantity', label: 'Cantidad de lotes *', type: 'number', min: 1 },
];

const DEPARTMENT_FIELDS_CONFIG = [
  { key: 'unitNumber', label: 'Número de unidad *', type: 'text', placeholder: 'Ej: 101-A' },
  { key: 'type', label: 'Tipo *', type: 'select', options: 'PROJECT_UNIT_TYPES_LABELS' },
  { key: 'floor', label: 'Piso *', type: 'number', min: 1 },
  { key: 'area', label: 'Área (m²) *', type: 'number', min: 0, step: 0.01 },
  { key: 'bedrooms', label: 'Dormitorios', type: 'number', min: 0, dependsOnType: ['APARTMENT', 'PENTHOUSE', 'DUPLEX'] },
  { key: 'bathrooms', label: 'Baños *', type: 'number', min: 0 },
  { key: 'parkingSpots', label: 'Estacionamientos', type: 'number', min: 0 },
  { key: 'price', label: 'Precio *', type: 'number', min: 0, isPrice: true },
  { key: 'view', label: 'Vista', type: 'text', placeholder: 'Ej: Calle principal' },
  { key: 'status', label: 'Estado *', type: 'select', options: 'PROJECT_UNIT_STATUS_LABELS' },
];

interface ProjectUnitsStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  propertyId?: number;
  projectType?: string;
}

function Field({ label, children, className = '' }: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
      {children}
    </div>
  );
}

export function ProjectUnitsStep({ formData, onChange, propertyId, projectType }: ProjectUnitsStepProps) {
  const selectedCurrency = formData.currency || 'PEN';
  const isLotization = projectType === 'LOTIZATION';
  const currencySymbol = CURRENCIES[selectedCurrency as keyof typeof CURRENCIES]?.symbol || 'S/';

  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [uploadingBP, setUploadingBP] = useState(false);

  const emptyUnit = isLotization ? {
    lotNumber: '',
    block: '',
    area: 120,
    frontWidth: 8,
    price: selectedCurrency === 'USD' ? 20000 : 50000,
    status: 'AVAILABLE',
    view: '',
    blueprintImage: '',
    _previewUrl: '',
  } : {
    unitNumber: '',
    type: 'APARTMENT',
    floor: 1,
    area: 60,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpots: 1,
    price: selectedCurrency === 'USD' ? 50000 : 150000,
    status: 'AVAILABLE',
    view: '',
    blueprintImage: '',
    _previewUrl: '',
  };

  const emptyGroup = isLotization ? {
    groupName: '',
    unitType: 'LOT',
    floorStart: 1,
    floorEnd: 1,
    area: 120,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpots: 0,
    price: selectedCurrency === 'USD' ? 20000 : 50000,
    status: 'AVAILABLE',
    view: '',
    quantity: 1,
    blueprintImage: '',
    inheritBlueprint: true,
    _previewUrl: '',
  } : {
    groupName: '',
    unitType: 'APARTMENT',
    floorStart: 1,
    floorEnd: 1,
    area: 60,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpots: 1,
    price: selectedCurrency === 'USD' ? 50000 : 150000,
    status: 'AVAILABLE',
    view: '',
    quantity: 1,
    blueprintImage: '',
    inheritBlueprint: true,
    _previewUrl: '',
  };

  const [currentUnit, setCurrentUnit] = useState({ ...emptyUnit });
  const [currentGroup, setCurrentGroup] = useState({ ...emptyGroup });

  const handleModeChange = (newMode: 'individual' | 'group') => {
    setMode(newMode);
    if (showUnitForm || showGroupForm) {
      setShowUnitForm(newMode === 'individual');
      setShowGroupForm(newMode === 'group');
    }
  };

  const handleRemoveUnit = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la Unidad ${name}?`)) {
      removeUnit(id);
    }
  };

  const handleRemoveGroup = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el grupo "${name}"?`)) {
      removeGroup(id);
    }
  };

  // Subir plano a S3 inmediatamente
  const uploadBlueprintFile = async (file: File, type: 'unit' | 'group'): Promise<string | null> => {
    if (!propertyId || propertyId <= 0) return null;
    
    const token = authStorage.getToken() || localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
    if (!token) return null;

    try {
      setUploadingBP(true);
      const formDataUpload = new FormData();
      formDataUpload.append('files', file);
      formDataUpload.append('type', 'blueprints');

      const response = await fetch(`/api/projects/${propertyId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });

      if (response.ok) {
        const result = await response.json();
        const url = Array.isArray(result) ? result[0]?.url || result[0] : result?.url;
        if (url) {
          toast.success(`Plano de ${type} subido correctamente`);
          return url;
        }
      } else {
        console.error(`Error subiendo plano: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error subiendo plano:`, error);
    } finally {
      setUploadingBP(false);
    }
    return null;
  };

  const handleUnitBlueprint = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    
    // Subir a S3 si hay propertyId
    let finalUrl = previewUrl;
    if (propertyId && propertyId > 0) {
      const uploadedUrl = await uploadBlueprintFile(file, 'unit');
      if (uploadedUrl) finalUrl = uploadedUrl;
    } else {
      // Guardar temporalmente si no hay propertyId (creación nueva)
      const tempId = `unit_temp_${Date.now()}`;
      onChange('unitBlueprintFiles', {
        ...(formData.unitBlueprintFiles || {}),
        [tempId]: { file, previewUrl },
      });
      setCurrentUnit(prev => ({ ...prev, blueprintImage: tempId, _previewUrl: previewUrl }));
      return;
    }
    
    setCurrentUnit(prev => ({ ...prev, blueprintImage: finalUrl, _previewUrl: previewUrl }));
  };

  const handleGroupBlueprint = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    
    // Subir a S3 si hay propertyId
    let finalUrl = previewUrl;
    if (propertyId && propertyId > 0) {
      const uploadedUrl = await uploadBlueprintFile(file, 'group');
      if (uploadedUrl) finalUrl = uploadedUrl;
    } else {
      // Guardar temporalmente si no hay propertyId
      const tempId = `group_temp_${Date.now()}`;
      onChange('groupBlueprintFiles', {
        ...(formData.groupBlueprintFiles || {}),
        [tempId]: { file, previewUrl },
      });
      setCurrentGroup(prev => ({ ...prev, blueprintImage: tempId, _previewUrl: previewUrl }));
      return;
    }
    
    setCurrentGroup(prev => ({ ...prev, blueprintImage: finalUrl, _previewUrl: previewUrl }));
  };

  const getPreviewUrl = (blueprintImage: string, type: 'unit' | 'group'): string => {
    if (!blueprintImage) return '';
    if (blueprintImage.startsWith('http')) return blueprintImage;
    if (blueprintImage.startsWith('blob:')) return blueprintImage;
    const files = type === 'unit' ? formData.unitBlueprintFiles : formData.groupBlueprintFiles;
    return files?.[blueprintImage]?.previewUrl || '';
  };

  const totalFromGroups = () =>
    (formData.unitGroups || []).reduce((s: number, g: any) => s + (g.quantity || 0), 0);

  const currentFieldsConfig = isLotization ? LOT_FIELDS_CONFIG : DEPARTMENT_FIELDS_CONFIG;
  const currentGroupFieldsConfig = isLotization ? LOT_GROUP_FIELDS_CONFIG : null;

  const addUnit = () => {
    const unitId = isLotization ? (currentUnit as any).lotNumber : (currentUnit as any).unitNumber;
    if (!unitId?.trim()) return;
    const units = formData.units || [];
    const newId = Date.now();
    const tempId = currentUnit.blueprintImage;

    if (tempId && !tempId.startsWith('http') && !tempId.startsWith('blob:')) {
      const existing = formData.unitBlueprintFiles?.[tempId];
      if (existing) {
        const updated = { ...(formData.unitBlueprintFiles || {}) };
        delete updated[tempId];
        updated[newId] = existing;
        onChange('unitBlueprintFiles', updated);
      }
    }

    const newUnit = isLotization ? {
      id: newId,
      unitNumber: (currentUnit as any).lotNumber || '',
      type: 'LOT',
      floor: 1,
      area: currentUnit.area,
      bedrooms: 0,
      bathrooms: 0,
      parkingSpots: 0,
      price: currentUnit.price,
      status: currentUnit.status,
      view: currentUnit.view,
      lotNumber: (currentUnit as any).lotNumber || '',
      block: (currentUnit as any).block || '',
      frontWidth: (currentUnit as any).frontWidth || 0,
      blueprintImage: (currentUnit as any).blueprintImage || '',
    } : {
      id: newId,
      unitNumber: currentUnit.unitNumber,
      type: currentUnit.type,
      floor: currentUnit.floor,
      area: currentUnit.area,
      bedrooms: currentUnit.bedrooms,
      bathrooms: currentUnit.bathrooms,
      parkingSpots: currentUnit.parkingSpots,
      price: currentUnit.price,
      status: currentUnit.status,
      view: currentUnit.view,
      blueprintImage: currentUnit.blueprintImage || '',
    };

    const newUnits = [...units, newUnit];
    onChange('units', newUnits);
    onChange('totalUnits', newUnits.length + totalFromGroups());
    onChange('availableUnits', newUnits.length + totalFromGroups());

    const allAreas = [
      ...newUnits.map((u: any) => u.area),
      ...(formData.unitGroups || []).map((g: any) => g.area),
    ];
    if (allAreas.length > 0) {
      onChange('areaFrom', Math.min(...allAreas));
      onChange('areaTo', Math.max(...allAreas));
    }

    setCurrentUnit({ ...emptyUnit });
    setShowUnitForm(false);
  };

  const addGroup = () => {
    if (!currentGroup.groupName.trim()) return;
    const unitGroups = formData.unitGroups || [];
    const newId = Date.now();
    const tempId = currentGroup.blueprintImage;

    if (tempId && !tempId.startsWith('http') && !tempId.startsWith('blob:')) {
      const existing = formData.groupBlueprintFiles?.[tempId];
      if (existing) {
        const updated = { ...(formData.groupBlueprintFiles || {}) };
        delete updated[tempId];
        updated[newId] = existing;
        onChange('groupBlueprintFiles', updated);
      }
    }

    const newGroup = {
      id: newId,
      groupName: currentGroup.groupName,
      unitType: currentGroup.unitType,
      floorStart: currentGroup.floorStart,
      floorEnd: currentGroup.floorEnd,
      area: currentGroup.area,
      bedrooms: currentGroup.bedrooms,
      bathrooms: currentGroup.bathrooms,
      parkingSpots: currentGroup.parkingSpots,
      price: currentGroup.price,
      status: currentGroup.status,
      view: currentGroup.view,
      quantity: currentGroup.quantity,
      blueprintImage: currentGroup.blueprintImage || '',
      inheritBlueprint: currentGroup.inheritBlueprint,
    };

    const newGroups = [...unitGroups, newGroup];
    onChange('unitGroups', newGroups);
    onChange('totalUnits', (formData.units?.length || 0) + newGroups.reduce((s: number, g: any) => s + g.quantity, 0));
    onChange('availableUnits', (formData.units?.length || 0) + newGroups.reduce((s: number, g: any) => s + g.quantity, 0));

    const allAreas = [
      ...(formData.units || []).map((u: any) => u.area),
      ...newGroups.map((g: any) => g.area),
    ];
    if (allAreas.length > 0) {
      onChange('areaFrom', Math.min(...allAreas));
      onChange('areaTo', Math.max(...allAreas));
    }

    setCurrentGroup({ ...emptyGroup });
    setShowGroupForm(false);
  };

  const removeUnit = (id: number) => {
    const newUnits = (formData.units || []).filter((u: any) => u.id !== id);
    onChange('units', newUnits);
    onChange('totalUnits', newUnits.length + totalFromGroups());
  };

  const removeGroup = (id: number) => {
    const newGroups = (formData.unitGroups || []).filter((g: any) => g.id !== id);
    onChange('unitGroups', newGroups);
    onChange('totalUnits', (formData.units?.length || 0) + newGroups.reduce((s: number, g: any) => s + g.quantity, 0));
  };

  const hasUnits = (formData.units?.length || 0) + (formData.unitGroups?.length || 0) > 0;

  const BlueprintUploader = ({
    previewUrl,
    onFile,
    onClear,
  }: {
    previewUrl: string;
    onFile: (f: File) => void;
    onClear: () => void;
  }) => (
    <div className="space-y-2">
      {previewUrl && (
        <div className="relative w-full h-36 bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--border-color)]">
          <img src={previewUrl} alt="Plano" className="w-full h-full object-contain p-1" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
            ✕
          </button>
        </div>
      )}
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition text-sm">
        <LayoutDashboard className="w-4 h-4" />
        {uploadingBP ? 'Subiendo...' : (previewUrl ? 'Cambiar plano' : 'Subir plano')}
        <input type="file" accept="image/*" className="hidden" disabled={uploadingBP}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      </label>
    </div>
  );

  const inputClasses = "w-full px-3 py-2 border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none transition";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{isLotization ? 'Tipos de Lotes' : 'Tipos de Unidades'}</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {isLotization ? (
            <>Define los lotes disponibles de tu proyecto. Usa <strong>grupos</strong> para lotes idénticos.</>
          ) : (
            <>Define los departamentos de tu proyecto. Usa <strong>grupos</strong> para unidades idénticas.</>
          )}
        </p>
      </div>

      <div className="flex gap-3 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
        <button type="button" onClick={() => handleModeChange('individual')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${mode === 'individual' ? 'bg-[var(--bg-card)] shadow text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
          Individual
        </button>
        <button type="button" onClick={() => handleModeChange('group')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${mode === 'group' ? 'bg-[var(--bg-card)] shadow text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}>
          Por Grupo
        </button>
      </div>

      {formData.unitGroups?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Grupos configurados</h4>
          {formData.unitGroups.map((group: any) => {
            const preview = getPreviewUrl(group.blueprintImage, 'group');
            const available = group.status === 'AVAILABLE' ? group.quantity : 0;
            return (
              <div key={group.id} className="flex gap-4 border border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/[0.03] rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex-shrink-0 w-28 h-28 bg-[var(--bg-card)] rounded-lg border border-[var(--brand-primary)]/10 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Plano" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Maximize className="w-8 h-8 text-[var(--text-muted)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{group.groupName}</p>
                      <p className="text-xs text-[var(--brand-primary)] font-medium mt-0.5">
                        {PROJECT_UNIT_TYPES_LABELS[group.unitType as keyof typeof PROJECT_UNIT_TYPES_LABELS] || group.unitType}
                      </p>
                    </div>
                    <button type="button" onClick={() => handleRemoveGroup(group.id, group.groupName)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs flex-shrink-0 transition-colors">
                      Eliminar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[var(--text-secondary)]">
                    {isLotization ? (
                      <>
                        {group.block && <span>Mz {group.block}</span>}
                        <span>{group.area} m²</span>
                        {group.frontWidth && <span>{group.frontWidth} ml frente</span>}
                        <span>{group.quantity} lotes</span>
                      </>
                    ) : (
                      <>
                        <span>{group.bedrooms} dorm</span>
                        <span>{group.bathrooms} baños</span>
                        <span>{group.area} m²</span>
                        <span>{group.parkingSpots} est.</span>
                        <span>Pisos {group.floorStart}–{group.floorEnd}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-base font-bold text-[var(--text-primary)]">{currencySymbol} {group.price.toLocaleString()}</span>
                    <span className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold px-2 py-0.5 rounded-full">{available} disponibles</span>
                    <span className="text-xs text-[var(--text-muted)]">({group.quantity} en total)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formData.units?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Unidades individuales</h4>
          {formData.units.map((unit: any) => {
            const preview = getPreviewUrl(unit.blueprintImage, 'unit');
            return (
              <div key={unit.id} className="flex gap-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex-shrink-0 w-20 h-20 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Plano" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Home className="w-7 h-7 text-[var(--text-muted)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Unidad {unit.unitNumber}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {PROJECT_UNIT_TYPES_LABELS[unit.type as keyof typeof PROJECT_UNIT_TYPES_LABELS]} · Piso {unit.floor}
                      </p>
                    </div>
                    <button type="button" onClick={() => handleRemoveUnit(unit.id, unit.unitNumber)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors">
                      Eliminar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[var(--text-secondary)]">
                    {unit.bedrooms && <span>{unit.bedrooms} dorm</span>}
                    <span>{unit.bathrooms} baños</span>
                    <span>{unit.area} m²</span>
                  </div>
                  <p className="text-base font-bold text-[var(--text-primary)] mt-2">
                    {currencySymbol} {unit.price.toLocaleString()}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                      unit.status === 'AVAILABLE' ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' :
                      unit.status === 'RESERVED' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'}`}>
                      {PROJECT_UNIT_STATUS_LABELS[unit.status as keyof typeof PROJECT_UNIT_STATUS_LABELS] || unit.status}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button type="button"
        onClick={() => mode === 'individual' ? setShowUnitForm(true) : setShowGroupForm(true)}
        className="w-full py-3 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition text-sm font-medium">
        + {mode === 'individual' ? 'Agregar unidad individual' : 'Agregar grupo de unidades'}
      </button>

      {showUnitForm && (
        <div className="border border-[var(--brand-primary)]/20 rounded-xl p-5 bg-[var(--brand-primary)]/[0.04] space-y-4">
          <h4 className="font-semibold text-[var(--text-primary)]">{isLotization ? 'Nuevo lote individual' : 'Nueva unidad individual'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentFieldsConfig.map((field: any) => {
              if (field.dependsOnType && !field.dependsOnType.includes(currentUnit.type)) return null;
              const labelText = field.isPrice ? `Precio (${currencySymbol}) *` : field.label;
              return (
                <Field key={field.key} label={labelText}>
                  {field.type === 'select' ? (
                    <select
                      value={currentUnit[field.key as keyof typeof currentUnit] || ''}
                      onChange={e => setCurrentUnit(p => ({ ...p, [field.key]: e.target.value }))}
                      className={inputClasses}>
                      {Object.entries(field.options === 'PROJECT_UNIT_TYPES_LABELS' ? PROJECT_UNIT_TYPES_LABELS : PROJECT_UNIT_STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v as string}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      min={field.min}
                      step={field.step}
                      value={currentUnit[field.key as keyof typeof currentUnit] ?? ''}
                      onChange={e => {
                        const val = field.type === 'number'
                          ? (field.step ? parseFloat(e.target.value) : parseInt(e.target.value, 10))
                          : e.target.value;
                        setCurrentUnit(p => ({ ...p, [field.key]: isNaN(val as number) && field.type === 'number' ? '' : val }));
                      }}
                      className={inputClasses}
                    />
                  )}
                </Field>
              );
            })}
            <Field label="Imagen de plano" className="md:col-span-2">
              {uploadingBP && <p className="text-xs text-[var(--brand-primary)] mb-2">Subiendo plano a S3...</p>}
              <BlueprintUploader
                previewUrl={currentUnit._previewUrl}
                onFile={handleUnitBlueprint}
                onClear={() => setCurrentUnit(p => ({ ...p, blueprintImage: '', _previewUrl: '' }))}
              />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={addUnit}
              className="px-5 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:opacity-90">
              Agregar unidad
            </button>
            <button type="button" onClick={() => setShowUnitForm(false)}
              className="px-5 py-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-lg text-sm font-medium transition-colors hover:bg-[var(--brand-primary)]/[0.06]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showGroupForm && (
        <div className="border border-[var(--brand-primary)]/20 rounded-xl p-5 bg-[var(--brand-primary)]/[0.04] space-y-4">
          <h4 className="font-semibold text-[var(--text-primary)]">
            {isLotization ? 'Nuevo grupo de lotes' : 'Nuevo grupo de unidades'}
          </h4>
          <p className="text-xs text-[var(--text-secondary)]">
            {isLotization 
              ? 'Un grupo representa N lotes idénticos (misma manzana, área, frente y precio).'
              : 'Un grupo representa N unidades idénticas.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLotization ? (
              <>
                {LOT_GROUP_FIELDS_CONFIG.map((field: any) => {
                  const labelText = field.isPrice ? `Precio (${currencySymbol}) *` : field.label;
                  return (
                    <Field key={field.key} label={labelText}>
                      {field.type === 'select' ? (
                        <select
                          value={String(currentGroup[field.key as keyof typeof currentGroup] || '')}
                          onChange={e => setCurrentGroup(p => ({ ...p, [field.key]: e.target.value }))}
                          className={inputClasses}>
                          {Object.entries(PROJECT_UNIT_STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v as string}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          min={field.min}
                          step={field.step}
                          value={String(currentGroup[field.key as keyof typeof currentGroup] ?? '')}
                          onChange={e => {
                            const val = field.type === 'number'
                              ? (field.step ? parseFloat(e.target.value) : parseInt(e.target.value, 10))
                              : e.target.value;
                            setCurrentGroup(p => ({ ...p, [field.key]: isNaN(val as number) && field.type === 'number' ? '' : val }));
                          }}
                          className={inputClasses}
                        />
                      )}
                    </Field>
                  );
                })}
                <Field label="Estado *">
                  <select value={currentGroup.status}
                    onChange={e => setCurrentGroup(p => ({ ...p, status: e.target.value }))}
                    className={inputClasses}>
                    {Object.entries(PROJECT_UNIT_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Field label="Nombre del grupo *">
                  <input type="text" value={currentGroup.groupName}
                    onChange={e => setCurrentGroup(p => ({ ...p, groupName: e.target.value }))}
                    className={inputClasses} placeholder="Ej: Departamentos 2 dorm - Torre A" />
                </Field>
                <Field label="Tipo de unidad *">
                  <select value={currentGroup.unitType}
                    onChange={e => setCurrentGroup(p => ({ ...p, unitType: e.target.value }))}
                    className={inputClasses}>
                    {Object.entries(PROJECT_UNIT_TYPES_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Piso inicio">
                  <input type="number" value={currentGroup.floorStart} min={1}
                    onChange={e => setCurrentGroup(p => ({ ...p, floorStart: +e.target.value || 1 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Piso fin">
                  <input type="number" value={currentGroup.floorEnd} min={currentGroup.floorStart}
                    onChange={e => setCurrentGroup(p => ({ ...p, floorEnd: +e.target.value || 1 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Área (m²) *">
                  <input type="number" value={currentGroup.area} min={0} step={0.01}
                    onChange={e => setCurrentGroup(p => ({ ...p, area: +e.target.value || 60 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Dormitorios">
                  <input type="number" value={currentGroup.bedrooms} min={0}
                    onChange={e => setCurrentGroup(p => ({ ...p, bedrooms: +e.target.value || 0 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Baños *">
                  <input type="number" value={currentGroup.bathrooms} min={0}
                    onChange={e => setCurrentGroup(p => ({ ...p, bathrooms: +e.target.value || 0 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Estacionamientos">
                  <input type="number" value={currentGroup.parkingSpots} min={0}
                    onChange={e => setCurrentGroup(p => ({ ...p, parkingSpots: +e.target.value || 0 }))}
                    className={inputClasses} />
                </Field>
                <Field label={`Precio (${currencySymbol}) *`}>
                  <input type="number" value={currentGroup.price} min={0}
                    onChange={e => setCurrentGroup(p => ({ ...p, price: +e.target.value || 0 }))}
                    className={inputClasses} />
                </Field>
                <Field label="Cantidad de unidades *">
                  <input type="number" value={currentGroup.quantity} min={1}
                    onChange={e => setCurrentGroup(p => ({ ...p, quantity: +e.target.value || 1 }))}
                    className={inputClasses} placeholder="Ej: 5" />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Se crearán {currentGroup.quantity} unidades con las mismas características</p>
                </Field>
                <Field label="Estado *">
                  <select value={currentGroup.status}
                    onChange={e => setCurrentGroup(p => ({ ...p, status: e.target.value }))}
                    className={inputClasses}>
                    {Object.entries(PROJECT_UNIT_STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Vista">
                  <input type="text" value={currentGroup.view}
                    onChange={e => setCurrentGroup(p => ({ ...p, view: e.target.value }))}
                    className={inputClasses} placeholder="Ej: Vista al parque" />
                </Field>
              </>
            )}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border border-[var(--border-color)]">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Heredar imagen del grupo</p>
                  <p className="text-xs text-[var(--text-muted)]">Todas las unidades usarán el plano del grupo</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentGroup(p => ({ ...p, inheritBlueprint: !p.inheritBlueprint }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    currentGroup.inheritBlueprint ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color)]'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    currentGroup.inheritBlueprint ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
            <Field label="Plano del tipo de unidad" className="md:col-span-2">
              {uploadingBP && <p className="text-xs text-[var(--brand-primary)] mb-2">Subiendo plano a S3...</p>}
              <BlueprintUploader
                previewUrl={currentGroup._previewUrl}
                onFile={handleGroupBlueprint}
                onClear={() => setCurrentGroup(p => ({ ...p, blueprintImage: '', _previewUrl: '' }))}
              />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={addGroup}
              className="px-5 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:opacity-90">
              {isLotization ? 'Agregar grupo de lotes' : 'Agregar grupo'}
            </button>
            <button type="button" onClick={() => setShowGroupForm(false)}
              className="px-5 py-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-lg text-sm font-medium transition-colors hover:bg-[var(--brand-primary)]/[0.06]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {hasUnits && (
        <div className="bg-[var(--brand-primary)]/[0.04] border border-[var(--brand-primary)]/20 rounded-xl p-4">
          <h4 className="font-semibold text-[var(--text-primary)] mb-3">Resumen</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[var(--brand-primary)]/70 text-xs font-medium">Unidades individuales</p>
              <p className="font-bold text-[var(--text-primary)] text-lg">{formData.units?.length || 0}</p>
            </div>
            <div>
              <p className="text-[var(--brand-primary)]/70 text-xs font-medium">Grupos</p>
              <p className="font-bold text-[var(--text-primary)] text-lg">{formData.unitGroups?.length || 0}</p>
            </div>
            <div>
              <p className="text-[var(--brand-primary)]/70 text-xs font-medium">Total unidades</p>
              <p className="font-bold text-[var(--text-primary)] text-lg">{(formData.units?.length || 0) + totalFromGroups()}</p>
            </div>
            <div>
              <p className="text-[var(--brand-primary)]/70 text-xs font-medium">Precio desde</p>
              <p className="font-bold text-[var(--brand-primary)] text-lg">
                {currencySymbol} {Math.min(
                  ...(formData.units?.map((u: any) => u.price) || [Infinity]),
                  ...(formData.unitGroups?.map((g: any) => g.price) || [Infinity])
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}