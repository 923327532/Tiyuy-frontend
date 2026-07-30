'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
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

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat del copiloto'}
      >
        {isOpen ? (
          <Icon icon="material-symbols:close" className="w-8 h-8 text-[var(--text-primary)]" />
        ) : (
          <Image
            src="/assets/icons/soporte.ico"
            alt="Soporte"
            width={64}
            height={64}
            className="w-16 h-16"
          />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3 px-5 py-4 bg-brand text-white">
            <div className="w-9 h-9 flex items-center justify-center">
              <Image
                src="/assets/icons/soporte.ico"
                alt="Soporte"
                width={36}
                height={36}
                className="w-9 h-9 brightness-0 invert"
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