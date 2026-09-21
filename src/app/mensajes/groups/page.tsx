'use client';

import { useState, useEffect } from 'react';
import { useGroups } from '@/presentation/hooks/useGroups';
import { GrupoPostsPanel } from './components/GroupPostsPanel';
import { Plus, Search, Filter, Users } from 'lucide-react';
import { Group } from '@/core/domain/entities/Group';
import { toast } from '@/presentation/store/toastStore';

export default function GruposPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const { groups, groupsLoading, groupsError } = useGroups();

  useEffect(() => {
    const getUser = () => {
      try {
        const { useAuthStore } = require('@/presentation/store/authStore');
        const { user } = useAuthStore.getState();
        if (user?.id) {
          setCurrentUserId(user.id);
          setCurrentUser(user);
          return;
        }
      } catch (error) {
        console.warn('No se pudo obtener el usuario desde el store:', error);
      }

      try {
        const userData = localStorage.getItem('tiyuy-user') ||
                        localStorage.getItem('user') ||
                        localStorage.getItem('auth-user');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.id) {
            setCurrentUserId(parsedUser.id);
            setCurrentUser(parsedUser);
            return;
          }
        }
      } catch (error) {
        console.warn('No se pudo obtener el usuario desde localStorage:', error);
      }

      console.warn('Usando ID de usuario por defecto - esto debería ser configurado correctamente');
      setCurrentUserId(1);
    };

    getUser();
  }, []);

  const filteredGroups = groups.filter(grupo =>
    grupo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = () => {
    if (selectedGrupo) {
      console.log('Crear post en grupo:', selectedGrupo.id);
    } else {
      toast.error('Por favor selecciona un grupo primero');
    }
  };

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (groupsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error al cargar los grupos</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)]">
      <div className="w-96 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col">
        <div className="p-4 border-b border-[var(--border-color)]">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Mis Grupos</h1>
          <div className="flex items-center space-x-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-primary)] text-[var(--text-primary)]"
              />
            </div>
            <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{groups.length}</div>
              <div className="text-xs text-[var(--text-secondary)]">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {groups.filter(g => g.isUserMember).length}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Unidos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {groups.reduce((sum, g) => sum + g.postCount, 0)}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Posts</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {groupsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                {searchTerm ? 'No se encontraron grupos' : 'No tienes grupos'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredGroups.map((grupo) => (
                <div
                  key={grupo.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedGrupo?.id === grupo.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-[var(--border-color)] hover:border-gray-300 bg-[var(--bg-card)]'
                  }`}
                  onClick={() => setSelectedGrupo(grupo as Group)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                      {grupo.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--text-primary)] truncate">{grupo.name}</div>
                      <div className="text-sm text-[var(--text-secondary)] truncate">{grupo.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-[var(--text-muted)]">{grupo.memberCount} miembros</span>
                        {grupo.postCount > 0 && (
                          <span className="text-xs text-green-600">{grupo.postCount} posts</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {grupo.isUserMember ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedGrupo ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedGrupo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedGrupo.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedGrupo.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGrupo(null)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
              </button>
            </div>
          </div>

          {currentUserId && (
            <GrupoPostsPanel
              groupId={selectedGrupo.id}
              groupName={selectedGrupo.name}
              currentUserId={currentUserId}
              currentUser={currentUser}
              onCreatePost={handleCreatePost}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[var(--bg-secondary)]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Selecciona un grupo</h3>
            <p className="text-[var(--text-secondary)]">
              Elige un grupo de la lista para ver sus publicaciones y participar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
