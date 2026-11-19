'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Play, Users, Radio, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar } from '../chats/components/ChatsPanel';

type MainTab = 'chats' | 'estados' | 'canales' | 'grupos';

interface NavItem {
  key: MainTab;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const MIN_WIDTH = 72;
const MAX_WIDTH = 280;
const DEFAULT_WIDTH = 220;
const COLLAPSED_WIDTH = 72;
const STORAGE_KEY = 'tiyuy-sidebar-width';

export function Sidebar({
  activeTab,
  onTabChange,
  unreadCount,
  user,
  isMobile,
}: {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  unreadCount: number;
  user: any;
  isMobile: boolean;
}) {
  // Por defecto: contraído (solo iconos). El usuario puede expandir si quiere.
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(COLLAPSED_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  // Restaurar ancho guardado
  useEffect(() => {
    if (isMobile) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const w = parseInt(saved, 10);
        if (w >= MIN_WIDTH && w <= MAX_WIDTH) {
          setSidebarWidth(w);
          setIsCollapsed(w <= COLLAPSED_WIDTH + 10);
        }
      }
    } catch {}
  }, [isMobile]);

  // Guardar ancho
  useEffect(() => {
    if (isMobile || isDragging) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(sidebarWidth));
    } catch {}
  }, [sidebarWidth, isMobile, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = sidebarRef.current?.offsetWidth || sidebarWidth;
  }, [sidebarWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + delta));
    setSidebarWidth(newWidth);
    setIsCollapsed(newWidth <= COLLAPSED_WIDTH + 10);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      try {
        localStorage.setItem(STORAGE_KEY, String(sidebarRef.current?.offsetWidth || sidebarWidth));
      } catch {}
    }
  }, [isDragging, sidebarWidth]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleCollapse = () => {
    if (isCollapsed) {
      const restored = DEFAULT_WIDTH;
      setSidebarWidth(restored);
      setIsCollapsed(false);
      try { localStorage.setItem(STORAGE_KEY, String(restored)); } catch {}
    } else {
      setSidebarWidth(COLLAPSED_WIDTH);
      setIsCollapsed(true);
      try { localStorage.setItem(STORAGE_KEY, String(COLLAPSED_WIDTH)); } catch {}
    }
  };

  const NAV_ITEMS: NavItem[] = [
    { key: 'chats', icon: <MessageSquare className="w-5 h-5" />, label: 'Chats', badge: unreadCount },
    { key: 'estados', icon: <Play className="w-5 h-5" />, label: 'Estados' },
    { key: 'grupos', icon: <Users className="w-5 h-5" />, label: 'Grupos' },
    { key: 'canales', icon: <Radio className="w-5 h-5" />, label: 'Comunidades' },
  ];

  if (isMobile) return null;

  return (
    <div
      ref={sidebarRef}
      className="relative flex flex-col bg-[var(--bg-card)] border-r border-[var(--border-color)] overflow-hidden flex-shrink-0"
      style={{
        width: sidebarWidth,
        transition: isDragging ? 'none' : 'width 250ms ease',
      }}
    >
      {/* Espaciado superior sin logo */}
      <div className="h-4" />

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-hidden">
        {NAV_ITEMS.map(({ key, icon, label, badge }) => {
          const isActive = activeTab === key;
          return (
            <div key={key} className="relative group">
              <button
                onClick={() => onTabChange(key)}
                title={isCollapsed ? label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                {/* Indicador lateral */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-r-full" />
                )}
                
                <div className={`flex-shrink-0 ${isActive ? 'text-[var(--brand-primary)]' : ''}`}>
                  {icon}
                </div>
                
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap truncate">{label}</span>
                )}
                
                {badge !== undefined && badge > 0 && (
                  <span className={`flex-shrink-0 min-w-[18px] h-[18px] bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1
                    ${isCollapsed ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'}`}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>

              {/* Tooltip en modo contraído */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
                  {label}
                  {badge !== undefined && badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded-full">{badge > 99 ? '99+' : badge}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Avatar usuario al fondo */}
      <div className={`p-3 border-t border-[var(--border-color)] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="group relative">
          <Avatar name={user?.firstName ?? 'U'} role={user?.role} size={isCollapsed ? 'sm' : 'sm'} src={user?.avatar ?? undefined} />
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg pointer-events-none">
              {user?.firstName || 'Usuario'}
            </div>
          )}
        </div>
      </div>

      {/* Botón toggle colapsar/expandir */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 z-10 hover:bg-[var(--bg-tertiary)]"
        style={{ transition: 'box-shadow 200ms' }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        )}
      </button>

      {/* Barra de redimensionamiento (arrastrable) */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-green-400/30 active:bg-green-400/50 transition-colors z-10 group"
      >
        <div className="absolute inset-y-0 right-0 w-0.5 bg-transparent group-hover:bg-green-400/50 transition-colors" />
      </div>
    </div>
  );
}