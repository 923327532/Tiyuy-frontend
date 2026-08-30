'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react'
import { useAuthStore } from '@/presentation/store/authStore';
import { useGetChats, useSendMessage, useMarkChatAsRead, useToggleFavoriteChat, useGetChatMessages, useGetActiveStatusPosts, useGetGroups, useEditMessage, useDeleteMessage } from '@/presentation/hooks/useContacts';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/presentation/hooks/useWebSocket';
import { IC, formatLastSeen, formatDateSeparator, apiCall } from '../../page';
import { toast } from '@/presentation/store/toastStore';
import EmojiPicker from 'emoji-picker-react';
import { MessageSquare, Lock, Globe, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Sidebar } from '../../components/Sidebar';
import { ChatsPanel, Avatar } from '../../chats/components/ChatsPanel';
import EstadosPanel from '../../states/page';
import CanalesListPanel from '../../channels/components/ChannelListPanel';
import { GruposListPanel } from './GruposListPanel';
import { GrupoDetailPanel } from './GrupoDetailPanel';
import CreateGroupView from './CreateGroupView';
import DiscoverGroupsView from './DiscoverGroupsView';
import { GruposMisGruposView } from './GruposMisGruposView';
import CreateStatusView from '../../states/components/CreateStatusView';
import StatusDetailPanel from '../../states/components/StatusDetailPanel';
import { ChannelPostsPanel } from '../../channels/components/ChannelPostsPanel';
import MisCanalesCreadosView from '../../channels/components/MyCreatedChannelsView';
import MisCanalesSuscritosView from '../../channels/components/MySubscribedChannelsView';
import DiscoverChannelsView from '../../channels/components/DiscoverChannelsView';
import CreateChannelView from '../../channels/components/CreateChannelView';

type MainTab = 'chats' | 'estados' | 'canales' | 'grupos';
type NavItem = { key: MainTab; Icon: (props: { a?: boolean }) => React.ReactElement; label: string; badge?: number };

export function MisContactosPageContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<MainTab>('chats');
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
    const [selectedStatusGroup, setSelectedStatusGroup] = useState<any[] | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [selectedChannel, setSelectedChannel] = useState<any>(null);
    const [channelsSection, setChannelsSection] = useState<'mis-canales-creados' | 'mis-canales-suscritos' | 'descubrir-canales' | 'crear-canal'>('mis-canales-creados');
    const [gruposSection, setGruposSection] = useState<'menu' | 'mis-grupos' | 'descubrir' | 'crear'>('menu');
    const [statusSection, setStatusSection] = useState<'lista' | 'crear'>('lista');
    const [newMessage, setNewMessage] = useState('');
    const [pinnedMessage, setPinnedMessage] = useState<any>(null);
    const [contextMenu, setContextMenu] = useState<{ msg: any; x: number; y: number } | null>(null);
    const [replyToMessage, setReplyToMessage] = useState<any>(null);
    const [showReactionPicker, setShowReactionPicker] = useState<{ msg: any; x: number; y: number } | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [editingMessage, setEditingMessage] = useState<any>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [localReactions, setLocalReactions] = useState<{ [key: string]: { [emoji: string]: { count: number, users: string[] } } }>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user, token, isAuthenticated } = useAuthStore();
    const [initialChatProcessed, setInitialChatProcessed] = useState(false);
    const { data: chats } = useGetChats('all');
    const { data: messages, isLoading: loadingMessages, error: messagesError } = useGetChatMessages(selectedChatId!, { enabled: !!selectedChatId });
    const sendMessage = useSendMessage();
    const editMessage = useEditMessage();
    const deleteMessageMutation = useDeleteMessage();
    const markAsRead = useMarkChatAsRead();
    const toggleFavorite = useToggleFavoriteChat();
    const queryClient = useQueryClient();

    // Resizable left panel
    const [leftPanelWidth, setLeftPanelWidth] = useState(380);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef(0);
    const dragStartWidth = useRef(0);
    const LEFT_MIN = 280;
    const LEFT_MAX = 800;
    const LEFT_STORAGE = 'tiyuy-left-panel-width';
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;
        try { const saved = localStorage.getItem(LEFT_STORAGE); if (saved) { const w = parseInt(saved, 10); if (w >= LEFT_MIN && w <= LEFT_MAX) setLeftPanelWidth(w); } } catch {}
    }, [isMobile]);
    useEffect(() => {
        if (isMobile || isDraggingLeft) return;
        try { localStorage.setItem(LEFT_STORAGE, String(leftPanelWidth)); } catch {}
    }, [leftPanelWidth, isMobile, isDraggingLeft]);

    const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDraggingLeft(true);
        dragStartX.current = e.clientX;
        dragStartWidth.current = leftPanelRef.current?.offsetWidth || leftPanelWidth;
    }, [leftPanelWidth]);
    const handleLeftMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingLeft) return;
        const delta = e.clientX - dragStartX.current;
        setLeftPanelWidth(Math.min(LEFT_MAX, Math.max(LEFT_MIN, dragStartWidth.current + delta)));
    }, [isDraggingLeft]);
    const handleLeftMouseUp = useCallback(() => {
        if (isDraggingLeft) { setIsDraggingLeft(false); try { localStorage.setItem(LEFT_STORAGE, String(leftPanelRef.current?.offsetWidth || leftPanelWidth)); } catch {} }
    }, [isDraggingLeft, leftPanelWidth]);
    useEffect(() => {
        if (isDraggingLeft) {
            document.addEventListener('mousemove', handleLeftMouseMove);
            document.addEventListener('mouseup', handleLeftMouseUp);
            document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleLeftMouseMove);
            document.removeEventListener('mouseup', handleLeftMouseUp);
            document.body.style.cursor = ''; document.body.style.userSelect = '';
        };
    }, [isDraggingLeft, handleLeftMouseMove, handleLeftMouseUp]);

    useEffect(() => {
        if (!isAuthenticated || !token) {}
    }, [isAuthenticated, token]);
    useEffect(() => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }, [messages]);
    useEffect(() => {
        const handleClick = () => { setContextMenu(null); setShowReactionPicker(null); };
        if (contextMenu || showReactionPicker) { document.addEventListener('click', handleClick); return () => document.removeEventListener('click', handleClick); }
    }, [contextMenu, showReactionPicker]);

    const handleReaction = (msg: any, emoji: string) => {
        const messageId = String(msg.id);
        const userId = String(user?.id || 'anonymous');
        setLocalReactions(prev => {
            const messageReactions = { ...prev[messageId] };
            const reaction = messageReactions[emoji] || { count: 0, users: [] };
            if (reaction.users.includes(userId)) { reaction.count--; reaction.users = reaction.users.filter(id => id !== userId); if (reaction.count === 0) delete messageReactions[emoji]; }
            else { reaction.count++; reaction.users.push(userId); messageReactions[emoji] = reaction; }
            return { ...prev, [messageId]: messageReactions };
        });
        setShowReactionPicker(null);
    };

    const { isConnected: wsConnected } = useWebSocket({
        enabled: isAuthenticated,
        onNewMessage: (message: any) => { queryClient.invalidateQueries({ queryKey: ['chat-messages', message.chatId] }); queryClient.invalidateQueries({ queryKey: ['chats'] }); },
        onConnectionChange: (connected: any) => {}
    });

    useEffect(() => {
        if (!chats || initialChatProcessed) return;
        const organizerData = localStorage.getItem('chat_with_organizer');
        if (organizerData) {
            const { userId: orgId, name, timestamp } = JSON.parse(organizerData);
            if (Date.now() - timestamp < 30000) {
                setActiveTab('chats');
                const existingChat = chats.find((c: any) => c.participantId === orgId || c.targetUserId === orgId);
                if (existingChat) setSelectedChatId(existingChat.id);
                else apiCall('/contacts/extended/chats', { method: 'POST', body: JSON.stringify({ targetUserId: orgId, initialMessage: `Hola ${name || ''}, me interesa contactarte.`, interactionType: 'event_contact' }) }).then((r: any) => { if (r?.id) setSelectedChatId(r.id); }).catch(() => toast.error('No se pudo iniciar la conversación'));
            }
            localStorage.removeItem('chat_with_organizer');
        }
        setInitialChatProcessed(true);
    }, [chats, initialChatProcessed]);

    const handleSendMessage = async () => {
        if (!selectedChatId) return;

        // Modo edición: actualizar el mensaje existente (solo texto)
        if (editingMessage) {
            if (!newMessage.trim()) return;
            editMessage.mutate({ chatId: selectedChatId, messageId: editingMessage.id, content: newMessage.trim() });
            setNewMessage('');
            setEditingMessage(null);
            if (replyToMessage) setReplyToMessage(null);
            return;
        }

        // Si hay imagen seleccionada, subirla primero
        if (selectedImageFile) {
            setIsUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append('file', selectedImageFile);
                if (newMessage.trim()) formData.append('content', newMessage.trim());
                const token = localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token') || '';
                const res = await fetch(`/api/contacts/extended/chats/${selectedChatId}/messages/upload-image`, {
                    method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
                });
                if (!res.ok) throw new Error('Error');
                await res.json();
                queryClient.invalidateQueries({ queryKey: ['chat-messages', selectedChatId] });
                queryClient.invalidateQueries({ queryKey: ['chats'] });
                toast.success('📷 Imagen enviada');
            } catch {
                toast.error('Error al subir imagen');
            } finally {
                setIsUploadingImage(false);
                setSelectedImageFile(null);
                setSelectedImagePreview(null);
                setNewMessage('');
                if (replyToMessage) setReplyToMessage(null);
            }
            return;
        }
        
        if (!newMessage.trim()) return;
        const messagePayload: any = { chatId: selectedChatId, content: newMessage, type: 'TEXT' };
        if (replyToMessage) messagePayload.replyToMessageId = String(replyToMessage.id);
        sendMessage.mutate(messagePayload);
        setNewMessage('');
        if (replyToMessage) setReplyToMessage(null);
    };

    const { data: chatsData } = useGetChats('unread');
    const { data: groups, isLoading: groupsLoading } = useGetGroups(0, 50);
    const { data: statusData } = useGetActiveStatusPosts();
    const allPosts = statusData?.pages?.flatMap((p: any) => p.content) ?? [];
    const unreadCount = chatsData?.reduce((acc: number, c: any) => acc + (c.unreadCount ?? 0), 0) ?? 0;

    const NAV: NavItem[] = [
        { key: 'chats' as MainTab, Icon: IC.Chat, label: 'Chats', badge: unreadCount },
        { key: 'estados' as MainTab, Icon: IC.Status, label: 'Estados' },
        { key: 'grupos' as MainTab, Icon: IC.Groups, label: 'Grupos' },
        { key: 'canales' as MainTab, Icon: IC.Channel, label: 'Comunidades' },
    ];

    const hasStatusSubSection = activeTab === 'estados' && (selectedStatusId !== null || (isMobile && statusSection !== 'lista'));
    const hasGroupSubSection = activeTab === 'grupos' && (selectedGroup !== null || (isMobile && gruposSection !== 'menu'));
    const hasChannelSubSection = activeTab === 'canales' && (selectedChannel !== null || channelsSection !== 'mis-canales-creados');
    const hasSelection = selectedChatId || selectedStatusId || selectedGroup || selectedChannel || hasStatusSubSection || hasGroupSubSection || hasChannelSubSection;

    // ===== RENDER CHAT VIEW =====
    const renderChatView = () => {
        if (activeTab === 'chats' && selectedChatId && chats?.find((c: any) => c.id === selectedChatId)) {
            const chat = chats.find((c: any) => c.id === selectedChatId);
            return (
                <div className="flex flex-col h-full" onClick={() => setContextMenu(null)}>
                    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)] border-b border-[var(--border-color)] flex-shrink-0">
                        <button onClick={() => { setSelectedChatId(null); setReplyToMessage(null); }} className="text-white/70 hover:text-white transition-colors"><IC.ArrowBack /></button>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{chat?.participantName}</p>
                            <p className="text-white/70 text-xs">{(chat?.participantLastSeen || chat?.lastMessageAt) ? `visto ${formatLastSeen(chat?.participantLastSeen || chat?.lastMessageAt)}` : 'en línea'}</p>
                        </div>
                        <button onClick={() => toggleFavorite.mutate(selectedChatId)} className={`text-sm transition-colors ${chat?.isFavorite ? 'text-yellow-400' : 'text-white/40 hover:text-white/70'}`}>⭐</button>
                    </div>
                    {pinnedMessage && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex-shrink-0">
                            <div className="w-1 h-8 rounded-full bg-[var(--brand-primary)] flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-[var(--brand-primary)]">{pinnedMessage.isOwn ? 'Tú' : pinnedMessage.senderName?.split(' ')[0]}</p>
                                <p className="text-xs text-[var(--text-secondary)] truncate">{pinnedMessage.content}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setPinnedMessage(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none flex-shrink-0 ml-2">×</button>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" data-chat-area
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
                        {messagesError ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-red-600 p-4">
                                <p className="font-semibold">Error al cargar mensajes</p>
                                <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Reintentar</button>
                            </div>
                        ) : loadingMessages ? (
                            <div className="flex justify-center py-8"><div className="w-6 h-6 rounded-full border-2 border-[#075e54] border-t-transparent animate-spin" /></div>
                        ) : !messages?.length ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-[var(--text-muted)]"><p className="text-sm">Sin mensajes aún</p></div>
                        ) : (
                            messages.slice().sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((msg: any, index: number, arr: any[]) => {
                                const isMe = msg.isOwn === true;
                                const prevMsg = arr[index - 1] ?? null;
                                const showDate = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();
                                const isPinned = pinnedMessage?.id === msg.id;
                                return (
                                    <div key={msg.id ?? `msg-${index}`}>
                                        {showDate && (<div className="flex justify-center my-3"><span className="text-[11px] px-3 py-1 rounded-lg shadow-sm" style={{ background: '#d9f0f9', color: '#54656f' }}>{formatDateSeparator(new Date(msg.createdAt))}</span></div>)}
                                        <div className={`flex mb-0.5 ${isMe ? 'justify-end' : 'justify-start'}`} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ msg, x: e.clientX, y: e.clientY }); }}>
                                            <div className={`relative max-w-[70%] px-3 py-2 shadow-sm text-sm leading-relaxed cursor-pointer ${isMe ? 'rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl' : 'rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'} ${isPinned ? 'ring-2 ring-[#075e54]' : ''}`}
                                                style={{ background: isMe ? '#dcf8c6' : '#ffffff', color: '#111b21', wordBreak: 'break-word', minWidth: '80px', paddingBottom: '20px' }}>
                                                {(msg.replyToContent || msg.replyToSenderName) && (<div className="mb-1 p-2 bg-[var(--bg-tertiary)] rounded-md border-l-2 border-blue-500"><p className="text-xs text-[var(--text-secondary)] font-medium">Respondiendo a {msg.replyToIsOwn ? 'ti mismo' : msg.replyToSenderName?.split(' ')[0] || 'alguien'}</p><p className="text-xs text-[var(--text-primary)] truncate">{msg.replyToContent}</p></div>)}
                                                {msg.mediaUrl && msg.type === 'IMAGE' && (
                                                    <img src={msg.mediaUrl} alt="" className="max-w-full rounded-lg mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                                                        style={{ maxHeight: '200px' }}
                                                        onClick={(e) => { e.stopPropagation(); setViewingImage(msg.mediaUrl); }}
                                                        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ msg, x: e.clientX, y: e.clientY }); }} />
                                                )}
                                                {isPinned && <span className="text-[10px] text-[#075e54] font-semibold block mb-0.5">Fijado</span>}
                                                <span className="break-words">{msg.content}</span>
                                                <div className="absolute bottom-1 right-2 flex items-center gap-0.5 pointer-events-none">
                                                    {msg.edited && <span className="text-[10px] italic" style={{ color: '#667781' }}>editado</span>}
                                                    <span className="text-[10px]" style={{ color: '#667781' }}>{new Date(msg.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                    {isMe && <Icon icon="mdi:check-all" className="w-4 h-3 text-[#53bdeb]" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {contextMenu && (
                        <div className="fixed z-[9999] bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-light)] py-1 min-w-[180px] overflow-hidden" style={{ top: contextMenu.y, left: Math.min(contextMenu.x, window.innerWidth - 200) }} onClick={(e) => e.stopPropagation()}>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3 transition-colors" onClick={() => { setReplyToMessage(contextMenu.msg); setContextMenu(null); }}><span>️</span> Responder</button>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3 transition-colors" onClick={() => { navigator.clipboard.writeText(contextMenu.msg.content ?? ''); setContextMenu(null); }}><span></span> Copiar</button>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3 transition-colors" onClick={() => { setContextMenu(null); setTimeout(() => setShowReactionPicker({ msg: contextMenu.msg, x: contextMenu.x, y: contextMenu.y - 60 }), 100); }}><span></span> Reaccionar</button>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3 transition-colors" onClick={() => { setPinnedMessage(contextMenu.msg); setContextMenu(null); }}><span></span> {pinnedMessage?.id === contextMenu.msg.id ? 'Ya está fijado' : 'Fijar mensaje'}</button>
                            {contextMenu.msg.isOwn && contextMenu.msg.type === 'TEXT' && (
                                <button className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3 transition-colors" onClick={() => {
                                    setEditingMessage(contextMenu.msg);
                                    setNewMessage(contextMenu.msg.content ?? '');
                                    setReplyToMessage(null);
                                    setSelectedImageFile(null);
                                    setSelectedImagePreview(null);
                                    setContextMenu(null);
                                }}><Pencil className="w-4 h-4" /> Editar</button>
                            )}
                            {contextMenu.msg.isOwn && (
                                <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors" onClick={() => {
                                    const msg = contextMenu.msg;
                                    setContextMenu(null);
                                    if (pinnedMessage?.id === msg.id) setPinnedMessage(null);
                                    if (replyToMessage?.id === msg.id) setReplyToMessage(null);
                                    if (window.confirm('¿Eliminar este mensaje?')) {
                                        deleteMessageMutation.mutate({ chatId: selectedChatId!, messageId: msg.id });
                                    }
                                }}><Trash2 className="w-4 h-4" /> Eliminar</button>
                            )}
                        </div>
                    )}
                    {/* Input con emojis y subida de imágenes */}
                    <div className="px-3 py-2 bg-[var(--bg-tertiary)] flex-shrink-0 relative">
                        {replyToMessage && (
                            <div className="mb-2 p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                                <div className="flex-1 min-w-0"><p className="text-xs text-[var(--text-secondary)] font-medium">Respondiendo a {replyToMessage.isOwn ? 'ti mismo' : replyToMessage.senderName?.split(' ')[0] || 'alguien'}</p><p className="text-sm text-[var(--text-primary)] truncate">{replyToMessage.content}</p></div>
                                <button onClick={() => setReplyToMessage(null)} className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xl leading-none">×</button>
                            </div>
                        )}
                        {editingMessage && (
                            <div className="mb-2 p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-[var(--brand-primary)]">✏️ Editando mensaje</p>
                                    <p className="text-sm text-[var(--text-secondary)] truncate">{editingMessage.content}</p>
                                </div>
                                <button onClick={() => { setEditingMessage(null); setNewMessage(''); }} className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xl leading-none">×</button>
                            </div>
                        )}
                        {/* Preview de imagen seleccionada (como WhatsApp) */}
                        {selectedImagePreview && (
                            <div className="mb-2 p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={selectedImagePreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                                    <div>
                                        <p className="text-xs font-medium text-[var(--text-secondary)]">{selectedImageFile?.name}</p>
                                        <p className="text-[10px] text-[var(--text-muted)]">Se eliminará en 48h</p>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedImageFile(null); setSelectedImagePreview(null); }} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xl leading-none">×</button>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors flex-shrink-0" title="Emojis">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                            </button>
                            {!editingMessage && (
                                <label className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors cursor-pointer flex-shrink-0" title="Adjuntar imagen">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedImageFile(file);
                                            setSelectedImagePreview(URL.createObjectURL(file));
                                        }
                                        e.target.value = '';
                                    }} />
                                </label>
                            )}
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={editingMessage ? "Edita tu mensaje..." : replyToMessage ? "Escribe una respuesta..." : "Escribe un mensaje..."}
                                className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] rounded-full text-sm focus:outline-none shadow-sm border-0" />
                            <button onClick={handleSendMessage} disabled={(editingMessage ? !newMessage.trim() : (!newMessage.trim() && !selectedImageFile)) || sendMessage.isPending || isUploadingImage || editMessage.isPending}
                                className="w-9 h-9 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center hover:opacity-90 transition-colors disabled:opacity-50 shadow-sm flex-shrink-0">
                                {editingMessage ? <Icon icon="mdi:check" className="w-5 h-5" /> : isUploadingImage ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <IC.Send />}</button>
                        </div>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-1 z-50 shadow-xl rounded-xl overflow-hidden border border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                                <EmojiPicker onEmojiClick={(emojiData: any) => { setNewMessage(prev => prev + (emojiData.emoji || '')); }}
                                    searchDisabled={false} skinTonesDisabled={true} previewConfig={{ showPreview: false }} width={320} height={350} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        if (activeTab === 'estados' && statusSection === 'crear') return (
            <div className="flex-1 flex flex-col overflow-hidden">
                {isMobile && (<div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)]"><button onClick={() => setStatusSection('lista')} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button><span className="text-white font-semibold text-sm">Crear Estado</span></div>)}
                <div className="flex-1 overflow-y-auto"><CreateStatusView user={user} onBack={() => setStatusSection('lista')} /></div>
            </div>
        );
        if (activeTab === 'estados' && selectedStatusId) {
            const statusForPanel = selectedStatusGroup?.length
                ? selectedStatusGroup[0]
                : (allPosts.find((post: any) => post.id === selectedStatusId) || { id: selectedStatusId, user: { name: 'Usuario' }, content: '', createdAt: new Date().toISOString(), tags: [], likes: 0, comments: [] });
            return <StatusDetailPanel
                key={selectedStatusId}
                status={statusForPanel}
                user={user}
                statuses={selectedStatusGroup?.length ? selectedStatusGroup : undefined}
                onClose={() => { setSelectedStatusId(null); setSelectedStatusGroup(null); }}
            />;
        }
        if (activeTab === 'grupos') {
            if (selectedGroup) return <GrupoDetailPanel group={selectedGroup} user={user} onBack={() => setSelectedGroup(null)} />;
            if (gruposSection === 'crear') return (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {isMobile && (<div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)]"><button onClick={() => setGruposSection('menu')} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button><span className="text-white font-semibold text-sm">Crear Grupo</span></div>)}
                    <div className="flex-1 overflow-y-auto"><CreateGroupView user={user} onBack={() => setGruposSection('menu')} /></div>
                </div>
            );
            if (gruposSection === 'descubrir') return (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {isMobile && (<div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)]"><button onClick={() => setGruposSection('menu')} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button><span className="text-white font-semibold text-sm">Descubrir Grupos</span></div>)}
                    <div className="flex-1 overflow-y-auto"><DiscoverGroupsView user={user} onGroupSelect={(group: any) => setSelectedGroup(group)} /></div>
                </div>
            );
            return (
                <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
                    {isMobile && (<div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)]"><button onClick={() => { setGruposSection('menu'); setSelectedGroup(null); }} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button><span className="text-white font-semibold text-sm">Mis Grupos</span></div>)}
                    <div className="flex-1 overflow-y-auto"><GruposMisGruposView user={user} onGroupSelect={(group: any) => setSelectedGroup(group)} /></div>
                </div>
            );
        }
        return (
            <div className="flex-1 flex items-center justify-center" data-msg-bg="true" style={{ backgroundColor: '#e5ddd5', backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
                <div className="text-center px-6 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--brand-primary)] flex items-center justify-center mb-6 shadow-2xl"><span className="text-white font-bold text-3xl">{activeTab === 'chats' ? 'T' : 'E'}</span></div>
                    <h2 className="text-[var(--text-primary)] text-2xl font-light mb-2">{activeTab === 'chats' ? 'Tiyuy Mensajes' : 'Estados'}</h2>
                    <p className="text-[var(--text-secondary)] text-sm text-center max-w-xs leading-relaxed mb-6">{activeTab === 'chats' ? 'Selecciona un chat para comenzar a conversar con clientes' : 'Comparte tu estado con otros profesionales'}</p>
                </div>
            </div>
        );
    };

    // ===== RENDER CHANNELS VIEW =====
    const renderChannelsView = () => {
        if (selectedChannel) {
            return (
                <div className={`flex-1 flex flex-col bg-[var(--bg-primary)] overflow-hidden ${isMobile ? 'w-full' : ''}`}>
                    <div className="flex-none flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)] border-b border-[var(--border-color)]">
                        <button onClick={() => setSelectedChannel(null)} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button>
                        <div className="flex-1 min-w-0"><p className="text-white font-semibold text-sm">{selectedChannel.name}</p><p className="text-white/60 text-xs">{selectedChannel.subscriberCount?.toLocaleString('es-PE') || 0} suscriptores</p></div>
                    </div>
                    <div className="flex-1 flex flex-row overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <ChannelPostsPanel channelId={selectedChannel.id} channelName={selectedChannel.name} currentUserId={user?.id || 0} currentUser={user} isChannelAdmin={selectedChannel.adminId === user?.id || selectedChannel.isAdmin} onCreatePost={() => {}} onCreateEvent={() => {}} />
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">

                {isMobile && channelsSection !== 'mis-canales-creados' && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)] flex-shrink-0">
                        <button onClick={() => setChannelsSection('mis-canales-creados')} className="text-white/70 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 fill-current" /></button>
                        <span className="text-white font-semibold text-sm">{channelsSection === 'descubrir-canales' ? 'Descubrir Canales' : channelsSection === 'crear-canal' ? 'Crear Canal' : channelsSection === 'mis-canales-suscritos' ? 'Mis Canales Suscritos' : 'Canales'}</span>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    {channelsSection === 'mis-canales-creados' && <MisCanalesCreadosView user={user} onChannelSelect={setSelectedChannel} />}
                    {channelsSection === 'mis-canales-suscritos' && <MisCanalesSuscritosView user={user} onChannelSelect={setSelectedChannel} />}
                    {channelsSection === 'descubrir-canales' && <DiscoverChannelsView user={user} onChannelSelect={setSelectedChannel} />}
                    {channelsSection === 'crear-canal' && <CreateChannelView user={user} onBack={() => setChannelsSection('mis-canales-creados')} />}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex ${isMobile ? 'h-[calc(100vh-64px)] pb-14' : 'h-[calc(100vh-64px)]'} bg-[var(--bg-secondary)] overflow-hidden`}>
            {!isAuthenticated && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                        <div className="w-14 h-14 bg-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare className="w-7 h-7 fill-white" /></div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Inicia sesión para chatear</h2>
                        <a href="/login" className="block w-full py-3 bg-[var(--brand-primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity mb-3">Iniciar sesión</a>
                        <a href="/" className="block text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)]">Volver</a>
                    </div>
                </div>
            )}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} user={user} isMobile={isMobile} />
            <div className="flex-1 flex overflow-hidden">
                <div ref={leftPanelRef} className={`flex-initial flex flex-col bg-[var(--bg-card)] border-r border-[var(--border-color)] overflow-hidden ${isMobile && hasSelection ? 'hidden' : 'flex'} ${isMobile ? 'w-full' : ''}`}

                    style={{ width: isMobile ? '100%' : leftPanelWidth, transition: isDraggingLeft ? 'none' : 'width 200ms ease' }}>
                    <div className="bg-[var(--brand-primary)] px-4 py-3 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div><h1 className="text-white font-bold text-base leading-tight">{activeTab === 'chats' && 'Mis Contactos'}{activeTab === 'estados' && 'Estados'}{activeTab === 'canales' && 'Canales'}{activeTab === 'grupos' && 'Grupos'}</h1><p className="text-white/80 text-xs">Mensajería inmobiliaria</p></div>
                            {activeTab === 'estados' && <button onClick={() => setStatusSection('crear')} className="bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-full transition-colors font-medium">+ Estado</button>}
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden bg-[var(--bg-card)]">
                        {activeTab === 'chats' && <ChatsPanel user={user} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />}
                        {activeTab === 'estados' && <EstadosPanel user={user} onNewStatus={() => setStatusSection('crear')} onStatusSelect={(id) => { setSelectedStatusId(id); setSelectedStatusGroup(null); }} onStatusGroupSelect={(statuses) => { setSelectedStatusGroup(statuses); setSelectedStatusId(statuses[0]?.id ?? null); }} selectedStatusId={selectedStatusId} />}
                        {activeTab === 'canales' && <CanalesListPanel user={user} onChannelSelect={setSelectedChannel} activeSection={channelsSection} onSectionChange={setChannelsSection} />}
                        {activeTab === 'grupos' && <GruposListPanel user={user} onGroupSelect={(group) => { setSelectedGroup(group); }} activeSection={gruposSection === 'menu' ? 'mis-grupos' : gruposSection} onSectionChange={(s) => { setGruposSection(s); setSelectedGroup(null); }} />}
                        {activeTab === 'grupos' && gruposSection === 'menu' && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center px-6">
                                    <p className="text-[var(--text-muted)] text-sm">Selecciona una opción del menú</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isMobile && (
                        <div onMouseDown={handleLeftMouseDown} className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-green-400/30 active:bg-green-400/50 transition-colors z-10 group">
                            <div className="absolute inset-y-0 right-0 w-0.5 bg-transparent group-hover:bg-green-400/50 transition-colors" />
                        </div>
                    )}
                </div>
                <div className={`flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)] ${isMobile ? (hasSelection ? 'w-full flex' : 'hidden') : ''}`}>
                    {activeTab === 'canales' ? renderChannelsView() : renderChatView()}
                </div>
            </div>
            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--border-color)] flex items-center justify-around px-2 py-1 safe-area-bottom">
                    {NAV.map(({ key, Icon, label, badge }) => (
                        <button key={key} onClick={() => { setActiveTab(key); setSelectedChatId(null); setSelectedStatusId(null); setSelectedGroup(null); setSelectedChannel(null); }}
                            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all ${activeTab === key ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>
                            <div className="relative"><Icon a={activeTab === key} />{badge ? <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white text-[8px] font-bold px-0.5">{badge > 99 ? '99+' : badge}</span> : null}</div>
                            <span className={`text-[9px] mt-0.5 font-medium ${activeTab === key ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>{label}</span>
                        </button>
                    ))}
                </div>
            )}
            {/* Modal ver imagen */}
            {viewingImage && (
                <div className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex items-center justify-center" onClick={() => setViewingImage(null)}>
                    {/* Botón cerrar arriba derecha */}
                    <button onClick={() => setViewingImage(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    {/* Botón descargar abajo derecha */}
                    <button onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            const res = await fetch(viewingImage);
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'wasyn-image.jpg';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        } catch {}
                    }} className="absolute bottom-6 right-6 z-10 bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-lg" title="Descargar">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <img src={viewingImage} alt="" className="max-w-[92vw] max-h-[90vh] object-contain select-none shadow-2xl rounded-lg" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}