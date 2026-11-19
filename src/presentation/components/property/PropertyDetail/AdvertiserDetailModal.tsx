'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/presentation/components/ui/Modal';
import { AdvertiserPublicProfile } from '@/core/domain/entities/Property';
import { Mail, Phone, CalendarDays, Building2, Loader2, MapPin } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Departamento',
  HOUSE: 'Casa',
  LAND: 'Terreno',
  OFFICE: 'Oficina',
  COMMERCIAL: 'Local Comercial',
  ROOM: 'Habitación',
};

const TRANSACTION_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
};

function formatPrice(price: number, currency?: string): string {
  const formatted = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(price);
  return currency === 'USD' ? `$${formatted}` : `S/ ${formatted}`;
}

function formatMemberSince(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface AdvertiserDetailModalProps {
  ownerId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AdvertiserDetailModal({ ownerId, isOpen, onClose }: AdvertiserDetailModalProps) {
  const [data, setData] = useState<AdvertiserPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !ownerId) return;
    let cancelled = false;
    setIsLoading(true);
    setError('');
    setData(null);
    fetch(`/api/properties/owner/${ownerId}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el anunciante');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message || 'Error al cargar el anunciante');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, ownerId]);

  const initials = data?.name
    ? data.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')
    : '?';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {isLoading && (
          <div className="py-14 flex flex-col items-center justify-center text-[var(--text-secondary)]">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Cargando anunciante...</p>
          </div>
        )}

        {error && (
          <div className="py-14 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {/* Cabecera del anunciante */}
            <div className="flex items-center gap-4 pb-5 border-b border-[var(--border-light)]">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt={data.name}
                  className="w-16 h-16 rounded-full object-cover bg-[var(--bg-tertiary)] flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-inner">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">{data.name}</h3>
                <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5 mt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Miembro de Tiyuy desde {formatMemberSince(data.memberSince) || '…'}
                </p>
              </div>
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 hover:border-[var(--brand-primary)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] truncate">{data.email}</span>
                </a>
              )}
              {data.phone && (
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 hover:border-[var(--brand-primary)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0" />
                  <span className="text-sm text-[var(--text-primary)]">{data.phone}</span>
                </a>
              )}
            </div>

            {/* Propiedades del anunciante */}
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-[var(--brand-primary)]" />
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Propiedades activas ({data.totalPublished})
              </h4>
            </div>

            {data.properties.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] bg-[var(--bg-secondary)] rounded-xl px-4 py-6 text-center">
                Este anunciante no tiene propiedades publicadas actualmente.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.properties.map((p) => (
                  <Link
                    key={p.id}
                    href={`/property/${p.slug || p.id}`}
                    onClick={onClose}
                    className="group flex gap-3 bg-white border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-[var(--brand-primary)] hover:shadow-sm transition-all"
                  >
                    <div className="w-24 h-24 shrink-0 bg-[var(--bg-tertiary)]">
                      {p.coverPhotoUrl ? (
                        <img src={p.coverPhotoUrl} alt={p.title || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)] text-xs">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-2.5 pr-3">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{p.title || 'Propiedad'}</p>
                      <p className="text-[13px] font-bold text-[var(--brand-primary)] mt-0.5">
                        {formatPrice(p.price, p.currency)}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {p.district || 'Perú'} · {TYPE_LABELS[p.type] || p.type} · {TRANSACTION_LABELS[p.transactionType] || p.transactionType}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
