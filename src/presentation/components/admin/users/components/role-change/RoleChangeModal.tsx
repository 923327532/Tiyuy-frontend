'use client';

import { useEffect, useState } from 'react';
import { Code, Shield, User, UserCog, Users } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal';
import type { RoleChangeModalProps } from '@/presentation/components/admin/users/types/users.types';
import { ROLE_LABELS } from '@/presentation/components/admin/users/userRoleConfig';

import './styles/RoleChangeModal.css';

type RoleValue = 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN';

const ROLE_OPTIONS: { value: RoleValue; label: string }[] = [
  { value: 'USER', label: 'Usuario' },
  { value: 'AGENT', label: 'Agente' },
  { value: 'DEVELOPER', label: 'Promotor' },
  { value: 'ADMIN', label: 'Administrador' },
];

const ROLE_ICONS: Record<RoleValue, React.ComponentType<{ className?: string }>> = {
  USER: User,
  AGENT: Users,
  DEVELOPER: Code,
  ADMIN: Shield,
};

const ROLE_DESCRIPTIONS: Record<RoleValue, string> = {
  USER: 'Acceso básico de usuario',
  AGENT: 'Puede gestionar propiedades',
  DEVELOPER: 'Puede gestionar propiedades y proyectos',
  ADMIN: 'Acceso total al sistema',
};

function asRoleValue(role: string | undefined): RoleValue {
  if (role === 'AGENT' || role === 'DEVELOPER' || role === 'ADMIN' || role === 'USER') return role;
  return 'USER';
}

export function RoleChangeModal({ user, isOpen, onClose, onConfirm }: RoleChangeModalProps) {
  const [newRole, setNewRole] = useState<RoleValue>('USER');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setNewRole(asRoleValue(user.role));
      setReason('');
    }
  }, [isOpen, user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onConfirm(newRole, reason);
  };

  const SelectedIcon = ROLE_ICONS[newRole];
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="role-change-modal__surface">
        <header className="role-change-modal__header">
          <div className="role-change-modal__header-icon">
            <UserCog className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="role-change-modal__header-content">
            <h3 className="role-change-modal__title">Cambiar rol de usuario</h3>
            <p className="role-change-modal__subtitle">{fullName}</p>
          </div>
        </header>

        <div className="role-change-modal__body">
          <div className="role-change-modal__current-role">
            <span className="role-change-modal__current-label">Rol actual</span>
            <span className="role-change-modal__current-value">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </div>

          <div className="role-change-modal__field">
            <label htmlFor="new-role" className="role-change-modal__label">
              Nuevo rol
            </label>

            <div className={`role-change-modal__role-preview role-change-modal__role-preview--${newRole.toLowerCase()}`}>
              <div className="role-change-modal__role-preview-icon">
                <SelectedIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="role-change-modal__role-preview-info">
                <span className="role-change-modal__role-preview-label">
                  {ROLE_OPTIONS.find((o) => o.value === newRole)?.label}
                </span>
                <span className="role-change-modal__role-preview-desc">{ROLE_DESCRIPTIONS[newRole]}</span>
              </div>
            </div>

            <select
              id="new-role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as RoleValue)}
              className="role-change-modal__select"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="role-change-modal__field">
            <label htmlFor="role-change-reason" className="role-change-modal__label">
              Motivo
              <span className="role-change-modal__required">*</span>
            </label>
            <textarea
              id="role-change-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="role-change-modal__textarea"
              placeholder="Indica el motivo del cambio de rol..."
            />
          </div>
        </div>

        <footer className="role-change-modal__actions">
          <button type="button" onClick={onClose} className="role-change-modal__btn role-change-modal__btn--cancel">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!reason.trim()}
            className="role-change-modal__btn role-change-modal__btn--confirm"
          >
            Cambiar rol
          </button>
        </footer>
      </form>
    </Modal>
  );
}
