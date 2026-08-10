'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import {
  sendCopilotMessage,
  SUGGESTION_QUESTIONS,
  COPILOT_SCROLL_EVENT,
  type ChatHistoryEntry,
  type CopilotAction,
} from '@/services/agentCopilotService';

interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  data?: Record<string, unknown>[];
  viewAllUrl?: string;
}

interface PropertyResult {
  id: number | string;
  title?: string;
  price?: number;
  currency?: string;
  type?: string;
  transactionType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  slug?: string;
  district?: string;
  region?: string;
  province?: string;
  coverImageUrl?: string;
}

let messageCounter = 0;

function generateId(): string {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

/**
 * Delay execution by ms milliseconds.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formats a price value with thousands separators and currency symbol.
 */
function formatPrice(price?: number, currency?: string): string {
  if (price == null) return '';
  const symbol = currency === 'USD' ? '$' : 'S/';
  return `${symbol} ${price.toLocaleString('es-PE')}`;
}

/**
 * Formats a property type enum into a readable Spanish label.
 */
function formatPropertyType(type?: string): string {
  switch (type) {
    case 'APARTMENT': return 'Departamento';
    case 'HOUSE': return 'Casa';
    case 'LAND': return 'Terreno';
    case 'OFFICE': return 'Oficina';
    case 'COMMERCIAL': return 'Local Comercial';
    case 'ROOM': return 'Habitación';
    default: return 'Propiedad';
  }
}

/**
 * Renders a single property result card inside the chat.
 * Shows a small thumbnail, title, price, location and a "Ver" button
 * that navigates to the specific property detail page.
 */
function PropertyResultCard({
  property,
  onView,
}: {
  property: PropertyResult;
  onView: (property: PropertyResult) => void;
}) {
  const slug = property.slug || String(property.id);
  const location = [property.district, property.province, property.region]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
        {property.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.coverImageUrl}
            alt={property.title || 'Propiedad'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
            <Icon icon="material-symbols:image" className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {property.title || formatPropertyType(property.type)}
        </p>
        <p className="text-sm font-bold text-brand">
          {formatPrice(property.price, property.currency)}
        </p>
        {location && (
          <p className="text-xs text-[var(--text-muted)] truncate">
            <Icon icon="material-symbols:location-on" className="w-3 h-3 inline-block mr-0.5" />
            {location}
          </p>
        )}
      </div>
      <button
        onClick={() => onView(property)}
        className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold transition-colors"
      >
        Ver
      </button>
    </div>
  );
}

/**
 * Tiyuy Agent Widget - AI Copilot floating chat assistant.
 * Provides an intelligent chat interface with function calling capabilities.
 */
export function TiyuyAgentWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Draggable floating button state.
  // The widget stays at its default position (bottom-right) unless the user drags it.
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [chatPosition, setChatPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragMoved = useRef(false);

  const buildHistory = useCallback((msgs: AgentMessage[]): ChatHistoryEntry[] => {
    return msgs
      .filter((m) => !m.isTyping)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Hola, soy el Copiloto de Tiyuy. Puedo ayudarte a buscar propiedades, explorar proyectos, navegar por la plataforma o guiarte en tus gestiones. ¿En que puedo ayudarte hoy?',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  /**
   * Handles executing actions returned by the agent:
   * - NAVIGATE: Redirects the user after a 1200ms delay so they can read the message.
   * - SCROLL_TO_FIELD: Dispatches a custom event so form components can scroll/focus.
   */
  const executeAction = useCallback(
    async (action: CopilotAction) => {
      if (!action) return;

      switch (action.type) {
        case 'NAVIGATE': {
          const { path, message } = action.payload;
          // Give the user 1200ms to read the assistant message before redirecting
          await delay(1200);
          if (path) {
            router.push(path);
          }
          break;
        }

        case 'SCROLL_TO_FIELD': {
          const { field } = action.payload;
          // Dispatch a custom event so form components can react
          window.dispatchEvent(
            new CustomEvent(COPILOT_SCROLL_EVENT, {
              detail: { field, pathname },
            })
          );
          break;
        }

        default:
          break;
      }
    },
    [router, pathname]
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const trimmedMessage = text.trim();
      setShowSuggestions(false);

      const userMessage: AgentMessage = {
        id: generateId(),
        role: 'user',
        content: trimmedMessage,
      };

      const typingMessage: AgentMessage = {
        id: 'typing',
        role: 'assistant',
        content: '...',
        isTyping: true,
      };

      setMessages((prev) => [...prev, userMessage, typingMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const currentMessages = messages.filter((m) => m.id !== 'typing');
        const history = buildHistory([...currentMessages, userMessage]);

        const response = await sendCopilotMessage(trimmedMessage, {
          currentPath: pathname,
          history,
        });

        // Remove typing indicator and add agent response
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== 'typing');
          const agentMessage: AgentMessage = {
            id: generateId(),
            role: 'assistant',
            content: response.text || 'No entiendo tu consulta. ¿Puedes reformularla?',
            data: response.data ?? undefined,
            viewAllUrl:
              response.action?.type === 'SHOW_RESULTS'
                ? response.action.payload.viewAllUrl
                : undefined,
          };
          return [...filtered, agentMessage];
        });

        // Execute any action returned by the agent (navigation, scroll, etc.)
        if (response.action) {
          executeAction(response.action as CopilotAction);
        }
      } catch (error) {
        // Graceful error message - agent is unavailable but still helpful
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== 'typing');
          const errorMessage: AgentMessage = {
            id: generateId(),
            role: 'assistant',
            content:
              'En este momento estoy procesando muchas solicitudes, pero cuentame que seccion buscas y te llevo manualmente. ¿Quieres ir a buscar propiedades, publicar un inmueble o necesitas ayuda con otra cosa?',
          };
          return [...filtered, errorMessage];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, pathname, buildHistory, executeAction]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      handleSendMessage(text);
    },
    [handleSendMessage]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(inputValue);
    },
    [handleSendMessage, inputValue]
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Updates the button position while dragging, keeping it within the viewport.
   * Also computes the chat panel position so it stays anchored to the button.
   */
  const handleDragMove = useCallback((e: PointerEvent) => {
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Consider it a drag only if the pointer moved more than a few pixels
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragMoved.current = true;
    }

    const buttonSize = 64; // w-16 h-16
    const margin = 16;
    const maxX = window.innerWidth - buttonSize - margin;
    const maxY = window.innerHeight - buttonSize - margin;

    const newX = Math.min(Math.max(dragStart.current.posX + dx, margin), maxX);
    const newY = Math.min(Math.max(dragStart.current.posY + dy, margin), maxY);

    setPosition({ x: newX, y: newY });

    // Compute the chat panel position so it stays anchored to the button.
    // Chat is 400px wide and 520px tall; keep it within the viewport.
    const chatWidth = 400;
    const chatHeight = 520;
    const chatX = Math.min(
      Math.max(newX - chatWidth + 64, 8),
      Math.max(window.innerWidth - chatWidth - 8, 8)
    );
    const chatY = Math.min(
      Math.max(newY - chatHeight, 8),
      Math.max(window.innerHeight - chatHeight - 8, 8)
    );
    setChatPosition({ x: chatX, y: chatY });
  }, []);

  /**
   * Ends the drag. If the user actually dragged the button, we keep the new
   * position; otherwise we treat it as a click (toggle the chat).
   */
  const handleDragEnd = useCallback(
    (e: PointerEvent) => {
      if (!dragStart.current) return;
      setIsDragging(false);
      dragStart.current = null;

      // Remove global listeners
      window.removeEventListener('pointermove', handleDragMove);
      window.removeEventListener('pointerup', handleDragEnd);
      window.removeEventListener('pointercancel', handleDragEnd);

      // If it was a real drag, keep the new position and do NOT toggle the chat.
      // Otherwise treat it as a click and toggle the chat.
      if (dragMoved.current) {
        dragMoved.current = false;
      } else {
        toggleOpen();
      }
    },
    [handleDragMove, toggleOpen]
  );

  /**
   * Starts dragging the floating button. Records the initial pointer position
   * and the current button position so we can compute the delta on move.
   * Uses global window listeners so the drag keeps working even if the
   * pointer moves outside the button.
   */
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      // Only start dragging with the primary (left) button
      if (e.button !== 0) return;

      const currentPos = position ?? { x: window.innerWidth - 88, y: window.innerHeight - 88 };
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: currentPos.x,
        posY: currentPos.y,
      };
      dragMoved.current = false;
      setIsDragging(true);

      // Prevent text selection / native drag while dragging
      e.preventDefault();

      // Attach global listeners so the drag is smooth and reliable
      window.addEventListener('pointermove', handleDragMove);
      window.addEventListener('pointerup', handleDragEnd);
      window.addEventListener('pointercancel', handleDragEnd);
    },
    [position, handleDragMove, handleDragEnd]
  );

  /**
   * Navigates to a specific property detail page.
   */
  const handleViewProperty = useCallback(
    (property: PropertyResult) => {
      const slug = property.slug || String(property.id);
      router.push(`/property/${slug}`);
    },
    [router]
  );

  /**
   * Navigates to the full results page ("Ver todo").
   */
  const handleViewAll = useCallback(
    (url?: string) => {
      router.push(url || '/properties');
    },
    [router]
  );

  return (
    <>
      <button
        ref={buttonRef}
        onPointerDown={handleDragStart}
        style={
          position
            ? { left: position.x, top: position.y, touchAction: 'none' }
            : { touchAction: 'none' }
        }
        className={`fixed z-50 w-16 h-16 flex items-center justify-center ${
          isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab transition-all duration-200 hover:scale-105 active:scale-95'
        } ${position ? '' : 'bottom-6 right-6'}`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat del copiloto'}
      >
        {isOpen ? (
          <Icon icon="material-symbols:close" className="w-8 h-8 text-[var(--text-primary)]" />
        ) : (
          <img
            src="/assets/icons/soporte.ico"
            alt="Soporte"
            className="w-16 h-16"
          />
        )}
      </button>

      {isOpen && (
        <div
          style={
            chatPosition
              ? { left: chatPosition.x, top: chatPosition.y }
              : undefined
          }
          className={`fixed z-50 w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            chatPosition ? '' : 'bottom-24 right-6'
          }`}
        >
          <div className="flex items-center gap-3 px-5 py-4 bg-brand text-white">
            <div className="w-11 h-11 flex items-center justify-center">
              <img
                src="/assets/icons/soporte.ico"
                alt="Soporte"
                className="w-11 h-11"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">Copiloto Tiyuy</h3>
              <p className="text-xs text-white/70 truncate">Asistente inteligente</p>
            </div>
            <button
              onClick={toggleOpen}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <Icon icon="material-symbols:close" className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-brand text-white rounded-br-md'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-bl-md border border-[var(--border-color)]'
                  } ${msg.isTyping ? 'animate-pulse' : ''}`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.isTyping ? (
                      <span className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    ) : (
                      msg.content
                    )}
                  </p>

                  {msg.role === 'assistant' && msg.data && msg.data.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.data.slice(0, 3).map((item, idx) => (
                        <PropertyResultCard
                          key={idx}
                          property={item as unknown as PropertyResult}
                          onView={handleViewProperty}
                        />
                      ))}
                      <button
                        onClick={() => handleViewAll(msg.viewAllUrl)}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-brand text-brand hover:bg-brand hover:text-white text-xs font-semibold transition-colors"
                      >
                        Ver todo ({msg.data.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showSuggestions && messages.length <= 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
                  Preguntas sugeridas
                </p>
                {SUGGESTION_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSuggestionClick(q.text)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="line-clamp-2">{q.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-[var(--border-color)] px-4 py-3 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 bg-brand hover:bg-brand-hover disabled:bg-[var(--bg-tertiary)] text-white rounded-xl flex items-center justify-center transition-colors disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Enviar mensaje"
            >
              <Icon icon="material-symbols:send" className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
