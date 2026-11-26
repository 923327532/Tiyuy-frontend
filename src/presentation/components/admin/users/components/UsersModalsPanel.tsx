'use client';

import dynamic from 'next/dynamic';
import type { UserListItem, UserPropertiesResponse, UserProjectsResponse } from '@/core/domain/entities/Admin';

const UserDetailModal = dynamic(() => import('./detail/UserDetailModal'), { ssr: false });
const RoleChangeModal = dynamic(() => import('./role-change').then((m) => m.RoleChangeModal), { ssr: false });
const ToggleStatusModal = dynamic(() => import('./toggle-status').then((m) => m.ToggleStatusModal), { ssr: false });
const DeleteUserModal = dynamic(() => import('./delete-user').then((m) => m.DeleteUserModal), { ssr: false });
const UserPropertiesModal = dynamic(() => import('./properties').then((m) => m.UserPropertiesModal), { ssr: false });
const UserProjectsModal = dynamic(() => import('./UserProjectsModal').then((m) => m.UserProjectsModal), { ssr: false });

interface UsersModalsPanelProps {
  selectedUser: UserListItem | null;
  displayUser: UserListItem | null;
  isViewModalOpen: boolean;
  isLoadingDetail: boolean;
  isRoleModalOpen: boolean;
  isToggleModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isPropertiesModalOpen: boolean;
  isProjectsModalOpen: boolean;
  userPropertiesData: UserPropertiesResponse | null;
  isLoadingProperties: boolean;
  userProjectsData: UserProjectsResponse | null;
  isLoadingProjects: boolean;
  isEmailVerifying: boolean;
  isPhoneVerifying: boolean;
  togglePending: boolean;
  deletePending: boolean;
  onCloseDetail: () => void;
  onCloseRole: () => void;
  onCloseToggle: () => void;
  onCloseDelete: () => void;
  onCloseProperties: () => void;
  onCloseProjects: () => void;
  onVerifyEmail: (userId: number) => void;
  onVerifyPhone: (userId: number) => void;
  onViewProperties: (user: UserListItem) => void;
  onViewProjects: (user: UserListItem) => void;
  onConfirmRole: (newRole: string, reason: string) => Promise<void>;
  onConfirmToggle: (reason: string) => Promise<void>;
  onConfirmDelete: (reason: string) => Promise<void>;
}

export function UsersModalsPanel({
  selectedUser,
  displayUser,
  isViewModalOpen,
  isLoadingDetail,
  isRoleModalOpen,
  isToggleModalOpen,
  isDeleteModalOpen,
  isPropertiesModalOpen,
  isProjectsModalOpen,
  userPropertiesData,
  isLoadingProperties,
  userProjectsData,
  isLoadingProjects,
  isEmailVerifying,
  isPhoneVerifying,
  togglePending,
  deletePending,
  onCloseDetail,
  onCloseRole,
  onCloseToggle,
  onCloseDelete,
  onCloseProperties,
  onCloseProjects,
  onVerifyEmail,
  onVerifyPhone,
  onViewProperties,
  onViewProjects,
  onConfirmRole,
  onConfirmToggle,
  onConfirmDelete,
}: UsersModalsPanelProps) {
  return (
    <>
      {isViewModalOpen && displayUser && (
        <UserDetailModal
          user={displayUser}
          isLoading={isLoadingDetail}
          isOpen={isViewModalOpen}
          onClose={onCloseDetail}
          onVerifyEmail={onVerifyEmail}
          onVerifyPhone={onVerifyPhone}
          onViewProperties={onViewProperties}
          onViewProjects={onViewProjects}
          isEmailVerifying={isEmailVerifying}
          isPhoneVerifying={isPhoneVerifying}
        />
      )}

      {selectedUser && isRoleModalOpen && (
        <RoleChangeModal
          user={selectedUser}
          isOpen={isRoleModalOpen}
          onClose={onCloseRole}
          onConfirm={onConfirmRole}
        />
      )}

      {isToggleModalOpen && (
        <ToggleStatusModal
          user={selectedUser}
          isOpen={isToggleModalOpen}
          onClose={onCloseToggle}
          onConfirm={onConfirmToggle}
          isPending={togglePending}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteUserModal
          user={selectedUser}
          isOpen={isDeleteModalOpen}
          onClose={onCloseDelete}
          onConfirm={onConfirmDelete}
          isPending={deletePending}
        />
      )}

      {isPropertiesModalOpen && (
        <UserPropertiesModal
          data={userPropertiesData}
          isLoading={isLoadingProperties}
          isOpen={isPropertiesModalOpen}
          onClose={onCloseProperties}
        />
      )}

      {isProjectsModalOpen && (
        <UserProjectsModal
          data={userProjectsData}
          isLoading={isLoadingProjects}
          isOpen={isProjectsModalOpen}
          onClose={onCloseProjects}
        />
      )}
    </>
  );
}