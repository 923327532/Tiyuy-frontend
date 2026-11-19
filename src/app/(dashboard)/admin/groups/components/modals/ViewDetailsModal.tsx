'use client';

import { Modal } from '@/presentation/components/ui/Modal';
import { CARD, Row, RowList, SECONDARY_BUTTON } from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import '@/presentation/components/admin/users/components/detail/styles/UserDetailModal.css';

import type { Channel, Group, ViewType } from '../../types';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Group | Channel | null;
  viewType: ViewType;
}

export function ViewDetailsModal({ isOpen, onClose, item, viewType }: ViewDetailsModalProps) {
  if (!item) return null;

  const isChannel = 'city' in item;
  const memberCount = isChannel ? (item as Channel).subscriberCount : (item as Group).memberCount;
  const memberLabel = isChannel ? 'Suscriptores' : 'Miembros';
  const adminName = item.adminName;
  const adminEmail = item.adminEmail;
  const initials = item.name.slice(0, 2).toUpperCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="user-detail-modal__surface">
        <header className="user-detail-modal__header">
          <span className="user-detail-modal__avatar user-detail-modal__avatar--fallback">
            {initials}
          </span>

          <div className="user-detail-modal__identity">
            <h3 className="user-detail-modal__name" title={item.name}>{item.name}</h3>
            <p className="user-detail-modal__email" title={adminEmail}>
              {isChannel ? 'Canal por ciudad' : 'Grupo social'} · {memberCount} {memberLabel.toLowerCase()}
            </p>
            <div className="user-detail-modal__badges">
              <span className={`user-detail-modal__role-badge ${item.isActive ? 'user-detail-modal__role-badge--admin' : 'user-detail-modal__role-badge--user'}`}>
                {item.isActive ? 'Activo' : 'Inactivo'}
              </span>
              <span className="user-detail-modal__role-badge user-detail-modal__role-badge--user">
                {isChannel ? 'Canal' : 'Grupo'}
              </span>
            </div>
          </div>
        </header>

        <div className="user-detail-modal__content">
          <section className={`${CARD} p-4`}>
            <h4 className="mb-3 text-sm font-semibold tracking-tight text-[#0f2e3a]">
              Información
            </h4>
            <RowList>
              <Row label="Estado" value={item.isActive ? 'Activo' : 'Inactivo'} />
              <Row label={memberLabel} value={String(memberCount)} />
              {isChannel && <Row label="Ciudad" value={(item as Channel).city || '—'} />}
              <Row label="Administrador" value={adminName || 'No disponible'} />
              <Row label="Correo" value={adminEmail || 'No disponible'} />
              <Row
                label="Creado"
                value={item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-PE') : '—'}
              />
            </RowList>
          </section>

          <section className={`${CARD} p-4`}>
            <h4 className="mb-2 text-sm font-semibold tracking-tight text-[#0f2e3a]">
              Descripción
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              {item.description || 'Sin descripción'}
            </p>
          </section>
        </div>

        <footer className="user-detail-modal__footer">
          <button type="button" className={SECONDARY_BUTTON} onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </Modal>
  );
}
