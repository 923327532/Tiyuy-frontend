'use client';

import { AlertTriangle, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PROJECT_PHASES, PROJECT_PHASES_LABELS, PROJECT_TYPES, PROJECT_TYPES_LABELS, CURRENCIES } from '@/config/constants';

interface ProjectInfoStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors?: Record<string, string>;
}

function SocialIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  switch (type) {
    case 'facebook':
      return <svg className={cls} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'instagram':
      return <svg className={cls} viewBox="0 0 24 24" fill="url(#ig-gradient)"><defs><linearGradient id="ig-gradient" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#F58529"/><stop offset="50%" stopColor="#DD2A7B"/><stop offset="100%" stopColor="#8134AF"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
    case 'tiktok':
      return <svg className={cls} viewBox="0 0 24 24" fill="#000"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
    case 'youtube':
      return <svg className={cls} viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'linkedin':
      return <svg className={cls} viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    case 'twitter':
      return <svg className={cls} viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'whatsapp':
      return <svg className={cls} viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
    case 'web':
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
    default:
      return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
  }
}

const SOCIAL_NETWORKS = [
  { key: 'socialInstagram', label: 'Instagram', type: 'instagram', hoverClass: 'hover:bg-pink-50 hover:border-pink-300', borderClass: 'border-pink-500', borderColor: '#DD2A7B', placeholder: 'https://instagram.com/...' },
  { key: 'socialTiktok', label: 'TikTok', type: 'tiktok', hoverClass: 'hover:bg-gray-100 hover:border-gray-400', borderClass: 'border-gray-600', borderColor: '#000', placeholder: 'https://tiktok.com/@...' },
  { key: 'socialFacebook', label: 'Facebook', type: 'facebook', hoverClass: 'hover:bg-blue-50 hover:border-blue-300', borderClass: 'border-blue-500', borderColor: '#1877F2', placeholder: 'https://facebook.com/...' },
  { key: 'socialWeb', label: 'Web', type: 'web', hoverClass: 'hover:bg-[var(--brand-primary-light)] hover:border-[var(--brand-primary)]', borderClass: 'border-[var(--brand-primary)]', borderColor: '#14b8a6', placeholder: 'https://tupagina.com' },
];

export function ProjectInfoStep({ formData, onChange, validationErrors }: ProjectInfoStepProps) {
  const selectedCurrency = formData.currency || 'PEN';
  const currencySymbol = CURRENCIES[selectedCurrency as keyof typeof CURRENCIES]?.symbol || 'S/';
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  
  const AMENITY_OPTIONS = [
    'Piscina', 'Gimnasio', 'Sauna', 'Jacuzzi', 'Sala de Juegos', 
    'Coworking', 'Pet Friendly', 'Seguridad 24/7', 'Recepción',
    'Área Infantil', 'BBQ', 'Terraza Panorámica'
  ];

  function CustomSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: Record<string, string>; label?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const entries = Object.entries(options);
    const selected = entries.find(([k]) => k === value);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)] text-sm text-[var(--text-secondary)] cursor-pointer transition-all hover:border-gray-400 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] outline-none"
        >
          <span className={selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>{selected ? selected[1] : label || 'Seleccionar'}</span>
          <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden">
            {entries.map(([key, lbl]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChange(key); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] ${value === key ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold' : 'text-[var(--text-secondary)]'}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tipo de Propiedad *</label>
          <CustomSelect
            value={formData.projectType || 'RESIDENTIAL'}
            onChange={(v) => onChange('projectType', v)}
            options={PROJECT_TYPES_LABELS}
            label="Seleccionar tipo"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Fase Actual *</label>
          <CustomSelect
            value={formData.phase || 'PRE_SALE'}
            onChange={(v) => onChange('phase', v)}
            options={PROJECT_PHASES_LABELS}
            label="Seleccionar fase"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Moneda</label>
          <CustomSelect
            value={formData.currency || 'PEN'}
            onChange={(v) => onChange('currency', v)}
            options={Object.fromEntries(Object.entries(CURRENCIES).map(([k, v]) => [k, `${v.symbol} (${k})`]))}
            label="Seleccionar moneda"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Precio Desde ({currencySymbol})</label>
          <input type="number" value={formData.priceFrom ?? ''} onChange={(e) => { const raw = e.target.value; onChange('priceFrom', raw === '' ? '' : parseFloat(raw)); }} placeholder="Ej: 150000" min="0" step="0.01" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none" />
          {validationErrors?.priceFrom && <div className="mt-2 flex items-start gap-2 bg-red-50/50 border-l-4 border-red-500 p-2.5 rounded-r-lg text-sm text-red-700"><span className="mt-0.5">⚠️</span><span className="font-medium">{validationErrors.priceFrom}</span></div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Precio Hasta ({currencySymbol})</label>
          <input type="number" value={formData.priceTo ?? ''} onChange={(e) => { const raw = e.target.value; onChange('priceTo', raw === '' ? '' : parseFloat(raw)); }} placeholder="Ej: 300000" min="0" step="0.01" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] outline-none" />
          {validationErrors?.priceTo && <div className="mt-2 flex items-start gap-2 bg-red-50/50 border-l-4 border-red-500 p-2.5 rounded-r-lg text-sm text-red-700"><span className="mt-0.5">⚠️</span><span className="font-medium">{validationErrors.priceTo}</span></div>}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5"><AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} /></div>
          <div className="flex-1">
            <h4 className="font-medium text-amber-950 dark:text-amber-100 text-sm">Plan Desarrollador</h4>
            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mt-0.5">
              <p>• <strong>Primer proyecto GRATIS</strong> (30 días de prueba)</p>
              <p>• <strong>Proyectos adicionales</strong> requieren suscripción <span className="font-semibold text-[var(--brand-primary)]">ENTERPRISE</span></p>
              <Link href="/plans" className="inline-block text-amber-950 dark:text-amber-100 underline hover:text-amber-700 dark:hover:text-amber-300 font-semibold mt-1">Ver planes y precios</Link>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Nombre del Proyecto *</label>
        <input type="text" value={formData.name || formData.projectName || ''} onChange={(e) => onChange('name', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] outline-none text-[var(--text-primary)] bg-[var(--bg-card)] ${validationErrors?.name ? 'border-red-300 bg-red-50/10' : 'border-[var(--input-border)]'}`} placeholder="Ej: Residencial Las Flores" required />
        {validationErrors?.name && <div className="mt-2 flex items-start gap-2 bg-red-50/50 border-l-4 border-red-500 p-2.5 rounded-r-lg text-sm text-red-700"><span className="mt-0.5">⚠️</span><span className="font-medium">{validationErrors.name}</span></div>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">Descripción del Proyecto *</label>
          <span className={`text-xs font-medium ${(formData.description?.length || 0) < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>{formData.description?.length || 0} caracteres (Mín. 50)</span>
        </div>
        <textarea value={formData.description || ''} onChange={(e) => onChange('description', e.target.value)} rows={4} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] outline-none text-[var(--text-primary)] bg-[var(--bg-card)] ${validationErrors?.description ? 'border-red-300 bg-red-50/10' : 'border-[var(--input-border)]'}`} placeholder="Describe tu proyecto, características principales, amenities, ubicación privilegiada..." required />
        <p className="text-xs text-[var(--text-muted)] mt-1">Una buena descripción mejora significativamente el posicionamiento SEO en los motores de búsqueda.</p>
        {validationErrors?.description && <div className="mt-2 flex items-start gap-2 bg-red-50/50 border-l-4 border-red-500 p-2.5 rounded-r-lg text-sm text-red-700"><span className="mt-0.5">⚠️</span><span className="font-medium">{validationErrors.description}</span></div>}
      </div>

      {formData.projectType === 'LOTIZATION' && (
        <div className="space-y-4 border-l-4 border-[var(--brand-primary)] pl-4 bg-[var(--brand-primary-light)] rounded-r-xl p-4">
          <h4 className="font-bold text-[var(--text-primary)] text-sm">Datos de Lotizacion</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">RUC (privado)</label>
              <input type="text" value={formData.ruc || ''} onChange={e => onChange('ruc', e.target.value)} placeholder="20600000001" maxLength={11} className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Razon social</label>
              <input type="text" value={formData.socialReason || ''} onChange={e => onChange('socialReason', e.target.value)} placeholder="Nombre de la empresa" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Inicial desde (S/)</label>
              <input type="number" value={formData.initialFee || ''} onChange={e => onChange('initialFee', e.target.value ? Number(e.target.value) : '')} placeholder="Ej: 5000" min="0" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Cuota mensual (S/)</label>
              <input type="number" value={formData.monthlyPayment || ''} onChange={e => onChange('monthlyPayment', e.target.value ? Number(e.target.value) : '')} placeholder="Ej: 800" min="0" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Informacion de financiamiento</label>
            <input type="text" value={formData.financingInfo || ''} onChange={e => onChange('financingInfo', e.target.value)} placeholder="Ej: Financiamiento directo sin intereses a 24 meses" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total de manzanas</label>
              <input type="number" value={formData.totalBlocks || ''} onChange={e => onChange('totalBlocks', e.target.value ? Number(e.target.value) : '')} placeholder="Ej: 8" min="0" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total de lotes</label>
              <input type="number" value={formData.totalLots || ''} onChange={e => onChange('totalLots', e.target.value ? Number(e.target.value) : '')} placeholder="Ej: 120" min="0" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Redes sociales</label>
            <p className="text-xs text-[var(--text-muted)] mb-3">Haz clic en el icono y pega el enlace de tu red social</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SOCIAL_NETWORKS.map(social => {
                const value = formData[social.key] || '';
                const isEditing = editingSocial === social.key;
                return (
                  <div key={social.key} className="relative">
                    {isEditing ? (
                      <div className="flex flex-col gap-1.5 p-2 border-2 rounded-xl bg-[var(--bg-card)] shadow-sm" style={{ borderColor: social.borderColor }}>
                        <div className="flex items-center gap-2">
                          <SocialIcon type={social.type} />
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">{social.label}</span>
                        </div>
                        <input type="url" value={value} onChange={e => onChange(social.key, e.target.value)} placeholder={social.placeholder} className="w-full px-2 py-1.5 text-xs border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] outline-none bg-[var(--bg-card)] text-[var(--text-primary)]" autoFocus />
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setEditingSocial(null)} className="flex-1 text-xs py-1 bg-[var(--brand-primary)] text-white rounded-lg hover:opacity-90 transition font-medium">{value ? 'Guardar' : 'Cerrar'}</button>
                          {value && <button type="button" onClick={() => { onChange(social.key, ''); setEditingSocial(null); }} className="px-2 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">✕</button>}
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setEditingSocial(social.key)} className={`w-full flex flex-col items-center gap-1 p-3 rounded-xl border-2 bg-[var(--bg-card)] transition-all ${social.hoverClass} ${value ? social.borderClass + ' bg-opacity-50' : 'border-[var(--border-color)]'}`}>
                        <SocialIcon type={social.type} />
                        <span className="text-xs font-medium text-[var(--text-secondary)]">{social.label}</span>
                        {value && <span className="text-[10px] text-[var(--brand-primary)] truncate max-w-full mt-0.5">✓ Enlace agregado</span>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border-color)]">
            <h5 className="font-semibold text-[var(--text-primary)] text-sm mb-3">Habilitacion urbana y documentos</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasUrbanization || false} onChange={e => onChange('hasUrbanization', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Habilitacion urbana</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasPropertyTitle || false} onChange={e => onChange('hasPropertyTitle', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Titulo de propiedad</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasWater || false} onChange={e => onChange('hasWater', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Agua</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasElectricity || false} onChange={e => onChange('hasElectricity', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Electricidad</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasSewerage || false} onChange={e => onChange('hasSewerage', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Desague</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasPavedRoads || false} onChange={e => onChange('hasPavedRoads', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Pistas</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasStreetLighting || false} onChange={e => onChange('hasStreetLighting', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Alumbrado publico</span></label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={formData.hasGasNetwork || false} onChange={e => onChange('hasGasNetwork', e.target.checked)} className="rounded text-[var(--brand-primary)]" /><span>Gas natural</span></label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[var(--border-color)]">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Nombre de urbanizacion <span className="text-[var(--text-muted)] font-normal">(opcional)</span></label>
                <input type="text" value={formData.urbanizationName || ''} onChange={e => onChange('urbanizationName', e.target.value)} placeholder="Ej: Los Olivos de Monterrico" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-[var(--text-primary)]" />
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Esto genera mayor credibilidad a tu proyecto</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Numero de partida registral <span className="text-[var(--text-muted)] font-normal">(opcional)</span></label>
                <input type="text" value={formData.registryNumber || ''} onChange={e => onChange('registryNumber', e.target.value)} placeholder="Ej: P03234567" className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg text-sm bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--brand-primary)] outline-none text-[var(--text-primary)]" />
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Esto genera mayor credibilidad a tu proyecto</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className={`p-4 rounded-xl border transition-colors ${validationErrors?.amenities ? 'border-red-200 bg-red-50/5' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-3">Amenidades Principales</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITY_OPTIONS.map((amenity) => {
              const isChecked = formData.amenities?.includes(amenity) || false;
              return (
                <label key={amenity} className={`flex items-center space-x-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all duration-150 ${isChecked ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--text-primary)] font-medium' : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                  <input type="checkbox" checked={isChecked} onChange={(e) => { const current = formData.amenities || []; if (e.target.checked) { onChange('amenities', [...current, amenity]); } else { onChange('amenities', current.filter((a: string) => a !== amenity)); } }} style={{ color: 'var(--brand-primary)' }} className="rounded h-4 w-4 border-[var(--border-color)] focus:ring-[var(--brand-primary)] dynamic-checkbox" />
                  <span className="text-sm">{amenity}</span>
                </label>
              );
            })}
          </div>
        </div>
        {validationErrors?.amenities && <div className="mt-2 flex items-start gap-2 bg-red-50/50 border-l-4 border-red-500 p-2.5 rounded-r-lg text-sm text-red-700"><span className="mt-0.5">⚠️</span><span className="font-medium">{validationErrors.amenities}</span></div>}
      </div>
      
      <style jsx>{`.dynamic-checkbox:checked { background-color: var(--brand-primary) !important; border-color: var(--brand-primary) !important; }`}</style>
    </div>
  );
}