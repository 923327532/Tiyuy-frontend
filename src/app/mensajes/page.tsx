'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Avatar } from './chats/components/ChatsPanel';
import { Icon } from '@iconify/react';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { ArrowLeft, ChevronLeft, Globe, Lock, LogOut, MessageCircle, MessageSquare, Mic, MoreHorizontal, Paperclip, Play, Plus, PlusSquare, Search, Send, Share2, User, Users, X } from 'lucide-react';
import { MisContactosPageContent } from './groups/components/MisContactosPageContent';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await axiosClient.request({ method: options.method || 'GET', url, data: options.body });
  return response.data;
}

type MainTab = 'chats' | 'estados' | 'canales' | 'grupos';
type ChatFilter = 'all' | 'unread' | 'favorites';
type NavItem = { key: MainTab; Icon: (props: { a?: boolean }) => React.ReactElement; label: string; badge?: number };

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' });
}

export function formatLastSeen(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minuto${Math.floor(diff / 60) > 1 ? 's' : ''}`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hora${Math.floor(diff / 3600) > 1 ? 's' : ''}`;
  if (diff < 604800) { const days = Math.floor(diff / 86400); return days === 1 ? 'ayer' : `hace ${days} días`; }
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export function formatDateSeparator(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'Hoy';
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 7) return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][d.getDay()];
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export function timeLeft(expiresAt: Date | string): string {
  const d = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const diff = d.getTime() - Date.now();
  if (diff <= 0) return 'Expirado';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function expiresPercent(createdAt: Date | string, expiresAt: Date | string): number {
  const c = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const e = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const total = e.getTime() - c.getTime();
  const elapsed = Date.now() - c.getTime();
  return Math.min(100, Math.round((elapsed / total) * 100));
}

export const IC = {
  Chat: () => <MessageSquare className="" />,
  Status: (p: { a?: boolean }) => <Play className={`w-[22px] h-[22px] transition-all ${p.a ? 'fill-[var(--text-primary)]' : 'fill-[var(--text-muted)]'}`} />,
  Channel: (p: { a?: boolean }) => <User className={`w-[22px] h-[22px] transition-all ${p.a ? 'fill-[var(--text-primary)]' : 'fill-[var(--text-muted)]'}`} />,
  Groups: (p: { a?: boolean }) => <Users className={`w-[22px] h-[22px] transition-all ${p.a ? 'fill-[var(--text-primary)]' : 'fill-[var(--text-muted)]'}`} />,
  Search: () => <Search className="w-4 h-4 fill-[var(--text-muted)]" />,
  Send: () => <Send className="w-5 h-5 fill-[var(--bg-primary)]" />,
  Check: () => <Icon icon="mdi:check-all" className="w-4 h-4 inline ml-1 text-[#53bdeb]" />,
  Plus: () => <PlusSquare className="w-5 h-5 fill-[var(--bg-primary)]" />,
  Share: () => <Share2 className="w-4 h-4 fill-current" />,
  Lock: () => <Lock className="w-3.5 h-3.5 fill-red-400" />,
  Emoji: () => <Globe className="w-5 h-5 fill-[var(--text-muted)]" />,
  Attach: () => <Paperclip className="w-5 h-5 fill-[var(--text-muted)]" />,
  Mic: () => <Mic className="w-5 h-5 fill-[var(--text-muted)]" />,
  ArrowBack: () => <ArrowLeft className="w-5 h-5 fill-[var(--text-secondary)]" />,
};

function ChatBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto relative"
      style={{
        backgroundColor: '#efeae2',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(0, 168, 62, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 168, 62, 0.02) 0%, transparent 50%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(0, 168, 62, 0.02) 40px,
            rgba(0, 168, 62, 0.02) 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(0, 168, 62, 0.02) 40px,
            rgba(0, 168, 62, 0.02) 41px
          )
        `
      }}
    >
      <div className="px-4 py-3 space-y-1">{children}</div>
    </div>
  );
}

export function ShareModal({ title, link, onClose }: { title: string; link: string; onClose: () => void }) {
  const encoded = encodeURIComponent(`${title} - únete en Tiyuy: ${link}`);
  const [copied, setCopied] = useState(false);

  const shareTo = (platform: string) => {
    try {
      fetch(`/api/contacts/extended/status/share-record?shareMethod=${platform}&shareDestination=${platform}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    } catch {}
  };

  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm mx-auto my-2">
      <div className="bg-[var(--brand-primary)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-base">Compartir</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg leading-none">×</button>
        </div>
        <p className="text-white/70 text-xs mt-1 truncate">{title}</p>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-xl p-3 border border-[var(--border-light)]">
          <span className="text-xs text-[var(--text-secondary)] truncate flex-1 font-mono">{link}</span>
          <button onClick={copy} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex-shrink-0 ${copied ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--brand-primary)] text-white hover:opacity-90'}`}>
            {copied ? '✔ Copiado' : 'Copiar'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <a href={`https://wa.me/?text=${encoded}`} target="_blank" rel="noopener noreferrer" onClick={() => shareTo('whatsapp')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"><MessageCircle className="w-6 h-6 text-green-500" /></div>
            <span className="text-xs text-[var(--text-primary)] font-medium">WhatsApp</span>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer" onClick={() => shareTo('facebook')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"><Icon icon="mdi:facebook" className="w-6 h-6 text-blue-600" /></div>
            <span className="text-xs text-[var(--text-primary)] font-medium">Facebook</span>
          </a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encoded}`} target="_blank" rel="noopener noreferrer" onClick={() => shareTo('telegram')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"><Icon icon="ic:baseline-telegram" className="w-6 h-6 text-sky-500" /></div>
            <span className="text-xs text-[var(--text-primary)] font-medium">Telegram</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function SearchResultItem({ result, onCreateChat }: { result: any; onCreateChat: (params: any) => void }) {
  const handleAction = (action: string) => {
    switch (result.type) {
      case 'property':
        const property = result.data;
        if (action === 'like') onCreateChat({ targetUserId: property.owner.id, propertyId: property.id, initialMessage: ` Me interesa tu propiedad: ${property.title}`, interactionType: 'like' });
        else if (action === 'info') onCreateChat({ targetUserId: property.owner.id, propertyId: property.id, initialMessage: ` Me gustaría más información sobre: ${property.title}`, interactionType: 'info_request' });
        else if (action === 'contact') onCreateChat({ targetUserId: property.owner.id, propertyId: property.id, initialMessage: ` Hola, estoy interesado en tu propiedad: ${property.title}`, interactionType: 'contact' });
        break;
      case 'user':
        const user = result.data;
        onCreateChat({ targetUserId: user.id, initialMessage: `Hola ${user.name}, me gustaría conversar contigo.`, interactionType: 'direct' });
        break;
    }
  };

  if (result.type === 'property') {
    const property = result.data;
    return (
      <div className="px-4 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center text-lg"></div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{property.title}</h4>
            <p className="text-xs text-[var(--text-secondary)]">{property.city} {property.price} {property.currency}</p>
            <p className="text-xs text-[var(--text-muted)]">Dueño: {property.owner.name} {property.owner.phone}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleAction('like')} className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs hover:bg-red-200">Like</button>
              <button onClick={() => handleAction('info')} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-600 hover:text-white">Info</button>
              <button onClick={() => handleAction('contact')} className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs hover:bg-green-200">Contactar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result.type === 'user') {
    const user = result.data;
    return (
      <div className="px-4 py-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} role={user.role} size="md" src={user.avatar} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</h4>
            <p className="text-xs text-[var(--text-secondary)]">{user.role} {user.phone}</p>
            {user.properties && user.properties.length > 0 && <p className="text-xs text-[var(--text-muted)]">{user.properties.length} propiedades</p>}
          </div>
          <button onClick={() => handleAction('chat')} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-600 hover:text-white">Chatear</button>
        </div>
      </div>
    );
  }
  return null;
}

export default function MisContactosPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" /></div>}>
      <MisContactosPageContent />
    </Suspense>
  );
}