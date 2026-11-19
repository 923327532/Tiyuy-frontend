'use client';

import { CheckCircle, XCircle, Building, Users, Search } from 'lucide-react';

interface TargetSelectionProps {
  newNotification: {
    sendToAll: boolean;
    roles: string[];
    userIds: number[];
    agencyIds: string[];
  };
  setNewNotification: React.Dispatch<React.SetStateAction<any>>;
  userSearch: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    users: any[];
    isLoading: boolean;
    hasSearched: boolean;
  };
  agentSearch: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    users: any[];
    isLoading: boolean;
    hasSearched: boolean;
  };
  toggleUserSelection: (userId: number) => void;
  toggleRoleSelection: (role: string) => void;
  toggleAgencySelection: (agencyRuc: string) => void;
}

export function TargetSelection({
  newNotification,
  setNewNotification,
  userSearch,
  agentSearch,
  toggleUserSelection,
  toggleRoleSelection,
  toggleAgencySelection,
}: TargetSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>

      {/* Send to All Option */}
      <div className="mb-4 p-3 border rounded-lg bg-gray-50">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={newNotification.sendToAll}
            onChange={(e) => setNewNotification((prev: any) => ({
              ...prev,
              sendToAll: e.target.checked,
              roles: e.target.checked ? [] : prev.roles,
              userIds: e.target.checked ? [] : prev.userIds
            }))}
            className="mr-3 h-4 w-4 shrink-0"
          />
          <span className="font-medium text-gray-900 text-sm">Enviar a todos los usuarios</span>
        </label>
      </div>

      {/* By Roles */}
      {!newNotification.sendToAll && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Por Rol:</p>
          <div className="flex flex-wrap gap-2">
            {['USER', 'AGENT', 'DEVELOPER', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => toggleRoleSelection(role)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  newNotification.roles.includes(role)
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/30'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* By Specific Users */}
      {!newNotification.sendToAll && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Usuarios específicos:</p>
          <div className="mb-2">
            <input
              type="text"
              value={userSearch.searchQuery}
              onChange={(e) => userSearch.setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, email o DNI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all"
            />
          </div>
          {userSearch.isLoading && (
            <p className="text-sm text-gray-500 mb-2">Buscando usuarios...</p>
          )}
          {!userSearch.hasSearched && (
            <p className="text-xs text-gray-500 mb-2">
              Escribe al menos 2 caracteres para buscar usuarios.
            </p>
          )}
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
            {userSearch.users.map((user: any) => (
              <label key={user.id} className="flex items-start p-2 hover:bg-gray-50 cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={newNotification.userIds.includes(user.id)}
                  onChange={() => toggleUserSelection(user.id)}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-xs sm:text-sm text-gray-700 break-words min-w-0">
                  {user.firstName} {user.lastName} ({user.email}) - {user.role}
                </span>
              </label>
            ))}
            {userSearch.hasSearched && userSearch.users.length === 0 && !userSearch.isLoading && (
              <p className="text-sm text-gray-500 p-2">No se encontraron usuarios</p>
            )}
          </div>
        </div>
      )}

      {/* By Agency */}
      {!newNotification.sendToAll && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Por Inmobiliaria (RUC):</p>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              id="agencyRuc"
              placeholder="Ingresa RUC de inmobiliaria"
              className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  if (input.value.trim()) {
                    toggleAgencySelection(input.value.trim());
                    input.value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById('agencyRuc') as HTMLInputElement;
                if (input?.value.trim()) {
                  toggleAgencySelection(input.value.trim());
                  input.value = '';
                }
              }}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg shadow-teal-500/30 text-sm"
            >
              Agregar
            </button>
          </div>
          {newNotification.agencyIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newNotification.agencyIds.map((ruc) => (
                <span
                  key={ruc}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-teal-100 text-teal-800"
                >
                  RUC: {ruc}
                  <button
                    onClick={() => toggleAgencySelection(ruc)}
                    className="ml-2 text-teal-600 hover:text-teal-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* By Agent */}
      {!newNotification.sendToAll && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Agentes específicos:</p>
          <div className="mb-2">
            <input
              type="text"
              value={agentSearch.searchQuery}
              onChange={(e) => agentSearch.setSearchQuery(e.target.value)}
              placeholder="Buscar agente por nombre, email o DNI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all"
            />
          </div>
          {agentSearch.isLoading && (
            <p className="text-sm text-gray-500 mb-2">Buscando agentes...</p>
          )}
          {!agentSearch.hasSearched && (
            <p className="text-xs text-gray-500 mb-2">
              Escribe al menos 2 caracteres para buscar agentes.
            </p>
          )}
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
            {agentSearch.users
              .filter((agent: any) => agent.role === 'AGENT')
              .map((agent: any) => (
                <label key={agent.id} className="flex items-start p-2 hover:bg-gray-50 cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    checked={newNotification.userIds.includes(agent.id)}
                    onChange={() => toggleUserSelection(agent.id)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 break-words min-w-0">
                    {agent.firstName} {agent.lastName} ({agent.email})
                  </span>
                </label>
              ))}
            {agentSearch.hasSearched && agentSearch.users.filter((agent: any) => agent.role === 'AGENT').length === 0 && !agentSearch.isLoading && (
              <p className="text-sm text-gray-500 p-2">No se encontraron agentes</p>
            )}
            <p className="text-xs text-gray-400 mt-2">Los agentes seleccionados se agregarán como usuarios específicos</p>
          </div>
        </div>
      )}
    </div>
  );
}