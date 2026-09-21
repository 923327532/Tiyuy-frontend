/**
 * Admin Bulk Operations Component
 * Provides bulk operations for admin management
 * Based on real backend permissions and endpoints
 */

'use client';

import { useState } from 'react';
import { usePermissions } from '@/presentation/hooks/usePermissions';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { UserListItem } from '@/core/domain/entities/Admin';

interface AdminBulkOperationsProps {
  selectedItems: UserListItem[];
  onClearSelection: () => void;
  onOperationComplete: () => void;
  itemType: 'users' | 'agents' | 'developers';
}

export function AdminBulkOperations({ 
  selectedItems, 
  onClearSelection, 
  onOperationComplete,
  itemType 
}: AdminBulkOperationsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationType, setOperationType] = useState<'status' | 'role' | 'delete'>('status');
  const [operationData, setOperationData] = useState({
    enabled: true,
    reason: '',
    newRole: 'USER'
  });

  const { hasPermission } = usePermissions();

  // Check permissions based on item type and operation
  const canChangeStatus = itemType === 'users' 
    ? hasPermission('USERS_UPDATE') 
    : hasPermission('USERS_UPDATE');

  const canChangeRole = itemType === 'users' 
    ? hasPermission('USERS_CHANGE_ROLE') 
    : false; // Only users can change roles

  const canDelete = itemType === 'users' 
    ? hasPermission('USERS_DELETE') 
    : false; // Only users can be deleted

  const hasAnyPermission = canChangeStatus || canChangeRole || canDelete;

  if (!hasAnyPermission || selectedItems.length === 0) {
    return null;
  }

  const handleBulkOperation = (type: 'status' | 'role' | 'delete') => {
    setOperationType(type);
    setIsModalOpen(true);
  };

  const executeBulkOperation = async () => {
    // TODO: Implement actual bulk operation calls to backend
    console.log(`Executing bulk ${operationType} on ${itemType}:`, {
      items: selectedItems.map(item => item.id),
      data: operationData
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsModalOpen(false);
    setOperationData({ enabled: true, reason: '', newRole: 'USER' });
    onClearSelection();
    onOperationComplete();
  };

  const getOperationLabel = () => {
    switch (operationType) {
      case 'status':
        return operationData.enabled ? 'Activate' : 'Deactivate';
      case 'role':
        return 'Change Role';
      case 'delete':
        return 'Delete';
      default:
        return 'Operation';
    }
  };

  const getItemTypeLabel = () => {
    switch (itemType) {
      case 'users':
        return 'users';
      case 'agents':
        return 'agents';
      case 'developers':
        return 'developers';
      default:
        return 'items';
    }
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedItems.length} {getItemTypeLabel()} selected
            </span>
            <Button
              variant="outline"
              onClick={onClearSelection}
              className="text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Clear Selection
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canChangeStatus && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setOperationData({ ...operationData, enabled: true });
                    handleBulkOperation('status');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setOperationData({ ...operationData, enabled: false });
                    handleBulkOperation('status');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Deactivate
                </Button>
              </div>
            )}

            {canChangeRole && (
              <Button
                size="sm"
                onClick={() => handleBulkOperation('role')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Change Role
              </Button>
            )}

            {canDelete && (
              <Button
                size="sm"
                onClick={() => handleBulkOperation('delete')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Operation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">
            {getOperationLabel()} {selectedItems.length} {getItemTypeLabel()}
          </h3>

          {operationType === 'status' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                You are about to {operationData.enabled ? 'activate' : 'deactivate'} {selectedItems.length} {getItemTypeLabel()}.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional)
                </label>
                <textarea
                  value={operationData.reason}
                  onChange={(e) => setOperationData({ ...operationData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for this action..."
                />
              </div>
            </div>
          )}

          {operationType === 'role' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                You are about to change the role of {selectedItems.length} {getItemTypeLabel()}.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <select
                  value={operationData.newRole}
                  onChange={(e) => setOperationData({ ...operationData, newRole: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="AGENT">Agent</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={operationData.reason}
                  onChange={(e) => setOperationData({ ...operationData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for role change..."
                  required
                />
              </div>
            </div>
          )}

          {operationType === 'delete' && (
            <div className="space-y-4">
              <div className="text-sm text-red-600">
                <strong>Warning:</strong> You are about to delete {selectedItems.length} {getItemTypeLabel()}.
                This action cannot be undone.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for deletion
                </label>
                <textarea
                  value={operationData.reason}
                  onChange={(e) => setOperationData({ ...operationData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  placeholder="Enter reason for deletion..."
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => executeBulkOperation()}
              className={
                operationType === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : operationType === 'status' && !operationData.enabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            >
              {getOperationLabel()} {selectedItems.length} {getItemTypeLabel()}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
