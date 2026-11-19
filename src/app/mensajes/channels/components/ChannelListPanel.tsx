'use client';

import { useState } from 'react';
import { useChannels } from '@/presentation/hooks/useChannels';
import { InfoDialog } from '@/presentation/components/ui';
import { ArrowLeft, Plus, Search, Users } from 'lucide-react';
import { EntityIcon } from '@/utils/entityIcons';

function CanalesListPanel({ 
  user, 
  onChannelSelect, 
  activeSection,
  onSectionChange,
}: { 
  user: any; 
  onChannelSelect: (channel: any) => void;
  activeSection: 'mis-canales-creados' | 'mis-canales-suscritos' | 'descubrir-canales' | 'crear-canal';
  onSectionChange: (s: 'mis-canales-creados' | 'mis-canales-suscritos' | 'descubrir-canales' | 'crear-canal') => void;
}) {
  const { channels, channelsLoading: isLoading } = useChannels(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoDialog, setInfoDialog] = useState(false);
  
  // Canales que creé (soy admin)
  const misCanalesCreados = channels?.filter((c: any) => c.isAdmin) ?? [];
  
  // Canales suscritos (soy miembro pero no admin)
  const misCanalesSuscritos = channels?.filter((c: any) => c.isSubscribed && !c.isAdmin) ?? [];
  
  // Filtrado por búsqueda
  const filteredCanalesCreados = misCanalesCreados.filter((channel: any) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCanalesSuscritos = misCanalesSuscritos.filter((channel: any) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Verificar si el usuario ya es admin de un canal
  const hasChannel = misCanalesCreados.length > 0;


  return (
    <div className="flex flex-col h-full bg-[var(--bg-primary)]">
      {/* Header estilo Facebook */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Canales</h1>
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input 
            placeholder="Buscar canales" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] flex-1 focus:outline-none" 
          />
        </div>
      </div>

      {/* Nav items */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => onSectionChange('mis-canales-creados')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeSection === 'mis-canales-creados' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Mis canales creados
          {misCanalesCreados.length > 0 && (
            <span className="ml-auto bg-[var(--text-muted)] text-[var(--bg-primary)] text-xs px-2 py-1 rounded-full">
              {misCanalesCreados.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSectionChange('mis-canales-suscritos')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeSection === 'mis-canales-suscritos' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <Users className="w-5 h-5" />
          Mis canales suscritos
          {misCanalesSuscritos.length > 0 && (
            <span className="ml-auto bg-[var(--text-muted)] text-[var(--bg-primary)] text-xs px-2 py-1 rounded-full">
              {misCanalesSuscritos.length}
            </span>
          )}
        </button>

        <button
          onClick={() => onSectionChange('descubrir-canales')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeSection === 'descubrir-canales' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <Search className="w-5 h-5" />
          Descubrir canales
        </button>

        <button
          onClick={() => onSectionChange('crear-canal')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeSection === 'crear-canal' ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <Plus className="w-5 h-5" />
          Crear canal
        </button>
      </div>

      <div className="border-t border-[var(--border-color)]" />

      {/* Mini lista de canales creados filtrados */}
      {filteredCanalesCreados.length > 0 && (
        <div className="px-3 py-3">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Mis Canales Creados {searchQuery && `(${filteredCanalesCreados.length})`}
          </h3>
          <div className="space-y-1">
            {filteredCanalesCreados.slice(0, 3).map((channel: any) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                  <EntityIcon name={channel.name} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{channel.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{channel.subscriberCount} suscriptores</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mini lista de canales suscritos filtrados */}
      {filteredCanalesSuscritos.length > 0 && (
        <div className="px-3 py-3">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Suscrito {searchQuery && `(${filteredCanalesSuscritos.length})`}
          </h3>
          <div className="space-y-1">
            {filteredCanalesSuscritos.slice(0, 3).map((channel: any) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
                  <EntityIcon name={channel.name} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{channel.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{channel.subscriberCount} suscriptores</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay resultados de búsqueda */}
      {searchQuery && filteredCanalesCreados.length === 0 && filteredCanalesSuscritos.length === 0 && (
        <div className="px-3 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">No se encontraron canales con "{searchQuery}"</p>
        </div>
      )}

      <InfoDialog
        isOpen={infoDialog}
        onClose={() => setInfoDialog(false)}
        title="Permisos insuficientes"
        message="Para crear canales necesitas ser Agente Inmobiliario o Empresa. Contacta a nuestro equipo para actualizar tu rol."
        variant="info"
      />

      {/* Botón crear - Verificación inteligente de rol */}
      <div className="px-3 pb-3">
        <button
          onClick={() => {
            const canCreate = !!user && !!user.id;
            if (canCreate) {
              onSectionChange('crear-canal');
            } else {
              setInfoDialog(true);
            }
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors relative ${
            hasChannel 
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed' 
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90'
          }`}
        >
          {hasChannel && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          <span className="text-lg font-bold leading-none">
            {hasChannel ? '' : '+'}
          </span>
          {hasChannel ? 'Límite alcanzado' : 'Crear nuevo canal'}
        </button>
        {hasChannel && (
          <p className="text-xs text-[var(--text-muted)] text-center mt-1">
            Ya tienes 1 canal activo
          </p>
        )}
      </div>
    </div>
  );
}

export default CanalesListPanel;
