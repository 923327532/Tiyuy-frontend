'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useGetChats, useGetChatMessages, useSendMessage, useMarkChatAsRead, useToggleFavoriteChat } from '@/presentation/hooks/useContacts';
import { toast } from '@/presentation/store/toastStore';
import { SearchResultItem, timeAgo } from '../../page';
import { useGooglePlaces } from '@/presentation/hooks/useGooglePlaces';
import { IC } from '../../page';
type ChatFilter = 'all' | 'unread' | 'favorites';

const ROLE_COLOR: Record<string, string> = {
    USER: 'from-blue-500 to-blue-700',
    AGENT: 'from-teal-500 to-teal-700',
    DEVELOPER: 'from-purple-500 to-purple-700',
    ADMIN: 'from-slate-500 to-slate-700',
};

async function apiCall(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await axiosClient.request({
        method: options.method || 'GET',
        url,
        data: options.body,
    });

    return response.data;
}

export function Avatar({
    name, role, size = 'md', src,
}: {
    name: string; role?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; src?: string;
}) {
    const sizes = { xs: 'w-7 h-7 text-[10px]', sm: 'w-9 h-9 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
    const color = ROLE_COLOR[role ?? 'USER'] ?? 'from-slate-500 to-slate-700';
    if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />;
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-semibold flex-shrink-0 select-none`}>
            {(name ?? '?').charAt(0).toUpperCase()}
        </div>
    );
}

export function ChatsPanel({ user, selectedChatId, setSelectedChatId }: { user: any; selectedChatId: number | null; setSelectedChatId: (id: number | null) => void }) {
    const [filter, setFilter] = useState<ChatFilter>('all');
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'all' | 'name' | 'property' | 'district' | 'phone'>('all');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce: esperar 300ms después de que el usuario deje de escribir
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm]);
    const [district, setDistrict] = useState('');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showContactMenu, setShowContactMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Google Places hook
    const { searchPredictions, loading: placesLoading } = useGooglePlaces();

    const { data: chats, isLoading: loadingChats, error: chatsError } = useGetChats(filter);
    const { data: messages, isLoading: loadingMessages, error: messagesError } = useGetChatMessages(selectedChatId!, { enabled: !!selectedChatId });
    const sendMessage = useSendMessage();
    const markAsRead = useMarkChatAsRead();
    const toggleFavorite = useToggleFavoriteChat();

    // Helper para obtener ID del remitente (funciona con backend real)
    const getSenderId = (msg: any) => {
        return msg.senderId ??
            msg.sender?.id ??
            msg.userId ??
            msg.fromUserId ??
            msg.authorId ??
            null;
    };

    // Queries para búsqueda específica (con debounce 300ms)
    const { data: searchResults = [], isLoading: loadingSearch } = useQuery({
        queryKey: ['specific-search', debouncedSearchTerm, searchType],
        queryFn: async () => {
            if (!debouncedSearchTerm) return [];

            const results: any[] = [];

            // Usar el término con debounce para la búsqueda
            const query = debouncedSearchTerm;

            // Construir parámetros según el tipo de búsqueda
            let params = new URLSearchParams();

            switch (searchType) {
                case 'name':
                    params.append('keyword', query);
                    break;
                case 'property':
                    params.append('keyword', query);
                    break;
                case 'district':
                    params.append('district', query);
                    break;
                case 'phone':
                    params.append('keyword', query);
                    break;
                default: // 'all'
                    params.append('keyword', query);
            }

            try {
                // Buscar propiedades
                const propResponse = await apiCall(`/contacts/extended/search/properties?${params.toString()}`);
                results.push(...propResponse.map((prop: any) => ({
                    type: 'property',
                    data: prop
                })));
            } catch (error) {
                console.error('Error searching properties:', error);
            }

            try {
                // Buscar usuarios (paginado - primeros 20)
                const userResponse = await apiCall(`/contacts/extended/search/users?${params.toString()}&size=20`);
                const users = Array.isArray(userResponse) ? userResponse : (userResponse?.content ?? []);
                results.push(...users.map((user: any) => ({
                    type: 'user',
                    data: user
                })));
            } catch (error) {
                console.error('Error searching users:', error);
            }

            return results;
        },
        enabled: !!debouncedSearchTerm
    });

    const selectedChat = chats?.find((c: any) => c.id === selectedChatId);

    // Mutation para agregar contacto
    const addContact = useMutation({
        mutationFn: async (contactId: number) => {
            const formData = new FormData();
            formData.append('contactId', contactId.toString());

            return apiCall('/contacts/extended/contacts', {
                method: 'POST',
                body: formData,
                headers: {} // Dejar que browser establezca Content-Type para FormData
            });
        },
        onSuccess: () => {
            toast.success('Contacto agregado exitosamente');
            // Refrescar lista de contactos si es necesario
        },
        onError: (error: any) => {
            console.error('Error al agregar contacto:', error);
            toast.error(error.message || 'Error al agregar contacto');
        }
    });
    const createChat = useMutation({
        mutationFn: async ({ targetUserId, propertyId, statusId, initialMessage, interactionType }: {
            targetUserId: number;
            propertyId?: number;
            statusId?: number;
            initialMessage: string;
            interactionType: string;
        }) => {
            return apiCall('/contacts/extended/chats', {
                method: 'POST',
                body: JSON.stringify({
                    targetUserId,
                    propertyId,
                    statusId,
                    initialMessage,
                    interactionType
                })
            });
        },
        onSuccess: (response) => {
            // Actualizar la lista de chats
            window.location.reload(); // Simple refresh para actualizar los chats
        },
        onError: (error: any) => {
            console.error('Error creating chat:', error);
        }
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (selectedChatId) markAsRead.mutate(selectedChatId);
    }, [selectedChatId]);

    const handleSend = () => {
        if (!newMessage.trim() || !selectedChatId) return;
        sendMessage.mutate({ chatId: selectedChatId, content: newMessage, type: 'TEXT' });
        setNewMessage('');
    };

    const filters: { key: ChatFilter; label: string }[] = [
        { key: 'all', label: 'Todos' },
        { key: 'unread', label: 'No leídos' },
        { key: 'favorites', label: 'Favoritos' },
    ];

    // Lista chats - Solo renderizar la lista de chats
    return (
        <div className="flex flex-col h-full">
            {/* Search con Filtro Integrado */}
            <div className="px-3 py-3 bg-[var(--bg-card)] border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-full px-3 py-2">
                            <IC.Search />
                            <input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] flex-1 focus:outline-none pr-20"
                            />
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                                    searchType !== 'all' 
                                        ? 'bg-brand text-white border-brand' 
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'
                                }`}
                            >
                                {searchType !== 'all' ? searchType === 'name' ? 'Nombre' : searchType === 'property' ? 'Prop.' : searchType === 'district' ? 'Distrito' : 'Tel.' : 'Filtro'}
                            </button>

                            {showFilterDropdown && (
                                <div className="absolute top-full mt-2 right-0 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] z-10 min-w-[200px]">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] mb-2">
                                            Tipo de búsqueda
                                        </div>
                                        <button
                                            onClick={() => { setSearchType('all'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--bg-tertiary)] ${searchType === 'all' ? 'bg-brand/10 text-brand' : 'text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => { setSearchType('name'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--bg-tertiary)] ${searchType === 'name' ? 'bg-brand/10 text-brand' : 'text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            Nombre
                                        </button>
                                        <button
                                            onClick={() => { setSearchType('property'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--bg-tertiary)] ${searchType === 'property' ? 'bg-brand/10 text-brand' : 'text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            Propiedad
                                        </button>
                                        <button
                                            onClick={() => { setSearchType('district'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--bg-tertiary)] ${searchType === 'district' ? 'bg-brand/10 text-brand' : 'text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            Distrito
                                        </button>
                                        <button
                                            onClick={() => { setSearchType('phone'); setShowFilterDropdown(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--bg-tertiary)] ${searchType === 'phone' ? 'bg-brand/10 text-brand' : 'text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            Teléfono (PE)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menú de 3 puntos estilo WhatsApp */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setShowContactMenu(!showContactMenu)}
                            className="w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
                        >
                            <MoreHorizontal className="w-5 h-5 fill-current" />
                        </button>

                        {showContactMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border-color)] py-1 z-50">
                                <button
                                    onClick={() => {
                                        const userResults = searchResults?.filter((r: any) => r.type === 'user');
                                        if (userResults && userResults.length > 0) {
                                            const firstUser = userResults[0].data;
                                            addContact.mutate(firstUser.id);
                                            setShowContactMenu(false);
                                        } else {
                                            setSearchType('phone');
                                            const searchInput = document.querySelector('input[placeholder="Buscar..."]') as HTMLInputElement;
                                            if (searchInput) {
                                                searchInput.focus();
                                                searchInput.placeholder = "Buscar contacto por teléfono...";
                                            }
                                            setShowContactMenu(false);
                                        }
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-3"
                                >
                                    <Plus className="w-4 h-4 fill-current text-[var(--text-muted)]" />
                                    Agregar Contacto
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters de chats existentes */}
            <div className="flex gap-2 px-3 py-2 bg-[var(--bg-card)] border-b border-[var(--border-color)] overflow-x-auto scrollbar-hide">
                {filters.map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f.key
                            ? 'bg-brand text-white shadow-sm'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                            }`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto bg-[var(--bg-card)]">
                {loadingSearch ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                    </div>
                ) : searchTerm ? (
                    // Mostrar resultados de búsqueda
                    <>
                        {searchResults.length === 0 ? (
                            <div className="text-center py-16 px-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <IC.Search />
                                </div>
                                <p className="text-gray-600 text-sm font-medium">No se encontraron resultados</p>
                                <p className="text-gray-400 text-xs mt-1">Intenta con otros términos o ajusta los filtros</p>
                            </div>
                        ) : (
                            searchResults.map((result: any, index: number) => (
                                <SearchResultItem
                                    key={`${result.type}-${result.data.id}-${index}`}
                                    result={result}
                                    onCreateChat={createChat.mutate}
                                />
                            ))
                        )}
                    </>
                ) : loadingChats ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-4 border-brand border-t-transparent animate-spin" />
                    </div>
                ) : chatsError ? (
                    <div className="text-center py-16 px-6">
                        <p className="text-red-400 text-sm font-medium">Error al cargar los chats</p>
                        <p className="text-gray-400 text-xs mt-1">Verifica tu conexión e intenta de nuevo</p>
                    </div>
                ) : !chats?.length ? (
                    <div className="text-center py-16 px-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <IC.Chat />
                        </div>
                        <p className="text-gray-600 text-sm font-medium">No tienes conversaciones aúnc</p>
                        <p className="text-gray-400 text-xs mt-1">Usa el buscador para encontrar propiedades, usuarios o estados</p>
                    </div>
                ) : (
                    chats.map((chat: any) => (
                        <div key={chat.id} onClick={() => setSelectedChatId(chat.id)}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] cursor-pointer border-b border-[var(--border-color)] transition-colors ${selectedChatId === chat.id ? 'bg-[var(--bg-secondary)]' : ''}`}>
                            <div className="relative">
                                <Avatar name={chat.participantName ?? chat.groupName ?? 'U'} role="USER" size="md" src={chat.participantAvatar} />
                                {chat.type === 'GROUP' && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                                        <Icon icon="mdi:account-group" className="w-2.5 h-2.5 fill-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                                        {chat.type === 'GROUP' ? chat.groupName : chat.participantName}
                                    </span>
                                    <span className={`text-[11px] flex-shrink-0 ml-2 ${chat.unreadCount > 0 ? 'text-[#25d366] font-medium' : 'text-[var(--text-muted)]'}`}>
                                        {chat.lastMessageAt ? timeAgo(new Date(chat.lastMessageAt)) : ''}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-[var(--text-secondary)] truncate">{chat.lastMessagePreview ?? 'Sin mensajes'}</p>
                                    {chat.unreadCount > 0 && (
                                        <span className="w-5 h-5 bg-[#25d366] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ml-2">
                                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                        </span>
                                    )}
                                    {chat.isFavorite && !chat.unreadCount && (
                                        <span className="text-yellow-400 text-xs ml-2">⭐</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
