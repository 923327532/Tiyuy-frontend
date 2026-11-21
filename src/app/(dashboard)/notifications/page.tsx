'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedNotifications } from '@/presentation/hooks/useUnifiedNotifications';
import { useAuthStore } from '@/presentation/store/authStore';
import { PushNotificationToggle } from '@/presentation/components/notifications/PushNotificationToggle';
import { 
  Bell, 
  Clock, 
  History, 
  CheckCheck, 
  Settings,
  Shield,
  Calendar,
  Heart,
  Home,
  Check,
  CircleCheckBig,
  AlertTriangle,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CreditCard,
  RefreshCw,
  Eye,
  X,
  ArrowUpDown,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Footer } from '@/presentation/components/layout/Footer/Footer';

type TabType = 'all' | 'unread' | 'alerts' | 'history';
type SortType = 'newest' | 'oldest' | 'unread' | 'important';

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
  } = useUnifiedNotifications();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [_hydrated, set_hydrated] = useState(false);
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    set_hydrated(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const alertsCount = useMemo(() =>
    notifications.filter(n => n.type === 'ADMIN_NOTIFICATION' || n.type === 'SUBSCRIPTION_EXPIRING').length,
  [notifications]);

  const historyCount = useMemo(() =>
    notifications.filter(n => n.read).length,
  [notifications]);

  const handleMarkAsRead = (id: string) => {
    setMarkingIds(prev => new Set(prev).add(id));
    markAsRead(id);
    setTimeout(() => {
      setMarkingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    switch (activeTab) {
      case 'unread':
        result = result.filter(n => !n.read);
        break;
      case 'alerts':
        result = result.filter(n => n.type === 'ADMIN_NOTIFICATION' || n.type === 'SUBSCRIPTION_EXPIRING');
        break;
      case 'history':
        result = result.filter(n => n.read);
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title?.toLowerCase().includes(q) ||
        n.message?.toLowerCase().includes(q) ||
        n.type?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'unread':
        result.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
        break;
      case 'important':
        result.sort((a, b) => {
          const aImportant = a.type === 'ADMIN_NOTIFICATION' || a.type === 'SUBSCRIPTION_EXPIRING' ? 1 : 0;
          const bImportant = b.type === 'ADMIN_NOTIFICATION' || b.type === 'SUBSCRIPTION_EXPIRING' ? 1 : 0;
          return bImportant - aImportant;
        });
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [notifications, activeTab, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredNotifications.length / pageSize);
  const paginatedNotifications = useMemo(() =>
    filteredNotifications.slice(page * pageSize, (page + 1) * pageSize),
  [filteredNotifications, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [activeTab, searchQuery, sortBy]);

  const sortLabels: Record<SortType, string> = {
    newest: 'Más recientes',
    oldest: 'Más antiguas',
    unread: 'No leídas primero',
    important: 'Importantes primero'
  };

  if (!_hydrated || authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#111b2e] transition-colors duration-300">
    
    {/* 1. TOP NAVIGATION BAR */}
    <div className="bg-white/80 dark:bg-[#0f172a]/90 border-b border-zinc-200 dark:border-zinc-800/60 sticky top-0 z-10 backdrop-blur-md">
      <div className="w-full px-8 xl:px-16">
        <div className="flex items-center justify-between py-4">
          
          {/* Lado Izquierdo: Título e Icono */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-muted rounded-xl">
                <Bell className="w-5 h-5 text-foreground/80" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-background">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Centro de Notificaciones</h1>
          </div>
          
          {/* Lado Derecho: Acciones principales fijas */}
          <div className="flex items-center gap-3">
            <PushNotificationToggle />
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                className="flex items-center gap-1.5 px-3 py-2 bg-brand/10 text-brand rounded-xl hover:bg-brand/20 transition-colors text-xs font-semibold disabled:opacity-50"
              >
                {isMarkingAllAsRead ? (
                  <Loader2 className="animate-spin w-3.5 h-3.5" />
                ) : (
                  <CheckCheck className="w-3.5 h-3.5" />
                )}
                {isMarkingAllAsRead ? 'Guardando...' : 'Marcar todo'}
              </button>
            )}
            
            <button 
              onClick={() => router.push('/preferences')}
              className="flex items-center gap-1.5 px-3 py-2 text-foreground/70 hover:text-foreground transition-colors rounded-xl hover:bg-muted text-xs font-semibold border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
            >
              <Settings className="w-3.5 h-3.5" />
              Configuración
            </button>
          </div>

        </div>
      </div>
    </div>

    {/* 2. CUERPO PRINCIPAL DEL DASHBOARD */}
    <div className="w-full px-8 xl:px-16 py-6">
      {/* Stats Cards - full width grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700/50 hover:shadow-md transition-all hover:border-brand/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Bell className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{unreadCount}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Sin leer</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700/50 hover:shadow-md transition-all hover:border-amber-500/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{alertsCount}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Importantes</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1a2332] rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700/50 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-700/50 rounded-lg">
              <History className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{historyCount}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">En historial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700/50 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700/50 bg-zinc-50 dark:bg-[#1e293b] cursor-pointer">
          {[
            { id: 'all' as TabType, label: 'Todas', icon: Bell, count: notifications.length },
            { id: 'unread' as TabType, label: 'No leídas', icon: Eye, count: unreadCount },
            { id: 'alerts' as TabType, label: 'Alertas', icon: AlertTriangle, count: alertsCount },
            { id: 'history' as TabType, label: 'Historial', icon: History, count: historyCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all relative ${
                  isActive 
                    ? 'text-brand bg-white dark:bg-[#1a2332]' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-foreground/40'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    tab.id === 'alerts'
                      ? 'bg-red-500/10 text-red-500'
                      : tab.id === 'unread'
                      ? 'bg-brand/10 text-brand'
                      : 'bg-muted text-foreground/70'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-[#1e293b]/50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar notificación..."
                className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-[#0f172a] border-2 border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-brand/40 focus:border-brand text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-background border border-zinc-200 dark:border-zinc-800/80 rounded-xl text-sm transition-all min-w-[180px]"
              >
                <ArrowUpDown className="w-4 h-4 text-foreground/40" />
                <span className="flex-1 text-left text-foreground/80">{sortLabels[sortBy]}</span>
                <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 mt-1 w-full bg-background border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-lg z-20 py-1">
                    {(Object.entries(sortLabels) as [SortType, string][]).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortBy(value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                          sortBy === value ? 'text-brand font-medium bg-brand/5 dark:bg-brand/10' : 'text-foreground/70'
                        }`}
                      >
                        {sortBy === value && <Check className="w-4 h-4 text-brand" />}
                        <span className={sortBy === value ? '' : 'ml-6'}>{label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
            </div>
          ) : paginatedNotifications.length === 0 ? (
            <EmptyState 
              icon={activeTab === 'alerts' ? <AlertTriangle className="w-16 h-16 text-foreground/30" /> : activeTab === 'history' ? <History className="w-16 h-16 text-foreground/30" /> : <Bell className="w-16 h-16 text-foreground/30" />} 
              title={searchQuery ? 'Sin resultados' : 'No hay notificaciones'}
              description="Las notificaciones aparecerán aquí."
            />
          ) : (
            <div className="space-y-3">
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  isHistory={activeTab === 'history'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-muted/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/70">Mostrar</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-2 py-1.5 bg-background border border-zinc-200 dark:border-zinc-800/80 rounded-lg text-sm text-foreground"
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <span className="text-sm text-foreground/50 ml-2">
                  {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredNotifications.length)} de {filteredNotifications.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/80 text-foreground/60 hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const startPage = Math.max(0, Math.min(page - 2, totalPages - 5));
                    const pageNum = startPage + i;
                    if (pageNum >= totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNum ? 'bg-brand text-white' : 'text-foreground/70 hover:bg-muted'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800/80 text-foreground/60 hover:bg-muted disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    < Footer />
  </div>
  
);
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">{description}</p>
      )}
    </div>
  );
}

interface NotificationCardProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  isHistory?: boolean;
}

function NotificationCard({ notification, onMarkAsRead, isHistory }: NotificationCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ADMIN_NOTIFICATION':
        return <Shield className="w-5 h-5" />;
      case 'SUBSCRIPTION_EXPIRING':
        return <CreditCard className="w-5 h-5" />;
      case 'EVENT_CREATED':
      case 'EVENT_UPDATED':
      case 'EVENT_REMINDER':
      case 'EVENT_JOINED':
        return <Calendar className="w-5 h-5" />;
      case 'FAVORITE':
        return <Heart className="w-5 h-5" />;
      case 'PROPERTY_PUBLISHED':
        return <Home className="w-5 h-5" />;
      case 'CONTACT':
        return <MessageSquare className="w-5 h-5" />;
      case 'MARKETING':
        return <RefreshCw className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'ADMIN_NOTIFICATION':
        return 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/30';
      case 'SUBSCRIPTION_EXPIRING':
        return 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/30';
      case 'EVENT_CREATED':
      case 'EVENT_UPDATED':
      case 'EVENT_REMINDER':
      case 'EVENT_JOINED':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/30';
      case 'FAVORITE':
        return 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-500/30';
      case 'PROPERTY_PUBLISHED':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30';
      case 'CONTACT':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/30';
      case 'MARKETING':
        return 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-cyan-500/30';
      default:
        return 'bg-gradient-to-br from-brand to-brand-dark text-white shadow-brand/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ADMIN_NOTIFICATION': return 'Notificación del sistema';
      case 'SUBSCRIPTION_EXPIRING': return 'Renovación de plan';
      case 'EVENT_CREATED': return 'Evento creado';
      case 'EVENT_UPDATED': return 'Evento actualizado';
      case 'EVENT_REMINDER': return 'Recordatorio de evento';
      case 'EVENT_JOINED': return 'Te uniste a un evento';
      case 'FAVORITE': return 'Favorito';
      case 'PROPERTY_PUBLISHED': return 'Propiedad publicada';
      case 'CONTACT': return 'Mensaje de contacto';
      case 'MARKETING': return 'Marketing';
      default: return 'Notificación';
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'PROPERTY_PUBLISHED': return 'Ver propiedad';
      case 'CONTACT': return 'Responder';
      case 'EVENT_CREATED':
      case 'EVENT_UPDATED':
      case 'EVENT_REMINDER':
      case 'EVENT_JOINED': return 'Ver evento';
      case 'SUBSCRIPTION_EXPIRING': return 'Ver recibo';
      case 'FAVORITE': return 'Ver propiedad';
      default: return 'Ver detalle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays < 7) return `Hace ${diffInDays}d`;
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isImportant = notification.type === 'ADMIN_NOTIFICATION' || notification.type === 'SUBSCRIPTION_EXPIRING';
  const isUnread = !notification.read && !isHistory;

  return (
    <div
      className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 ${
        isUnread
          ? 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-sm hover:shadow-md hover:border-brand/40'
          : 'bg-[var(--bg-secondary)]/50 border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]'
      } ${isImportant && isUnread ? 'ring-1 ring-amber-500/40' : ''}`}
    >
      {/* Icono adaptable en tamaño */}
      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${getIconColors(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`font-semibold text-base ${isUnread ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                {notification.title}
              </h3>
              {isUnread && (
                <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded-full">
                  NUEVO
                </span>
              )}
              {isImportant && (
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  IMPORTANTE
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${isUnread ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
              {notification.message}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(notification.createdAt)}
              </span>
              <span className="text-xs text-[var(--text-muted)]">•</span>
              <span className="text-xs text-[var(--text-muted)]">{getTypeLabel(notification.type)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-start gap-1">
            {isUnread && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="p-2 text-brand hover:bg-brand/10 hover:scale-110 rounded-lg transition-all duration-200"
                title="Marcar como leída"
              >
                <CheckCheck className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
