'use client';

import { useEffect, useRef, useState } from 'react';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { env } from '@/config/env';

// Singleton global para WebSocket - una sola conexión por usuario
let globalWebSocket: WebSocket | null = null;
let globalConnectionCount = 0;
let globalUserId: number | null = null;

// Exportar globalUserId para que otros componentes puedan acceder
export function getCurrentUserId(): number | null {
  return globalUserId;
}

interface WebSocketMessage {
  type: 'new_message' | 'typing' | 'connection_established' | 'subscribed_to_chat' | 'unsubscribed_from_chat' | 'error';
  // Backend envía datos directos, no anidados en 'message'
  id?: number;
  userId?: number;
  chatId?: number;
  senderId?: number;
  senderName?: string;
  content?: string;
  messageType?: string;
  mediaUrl?: string;
  createdAt?: string;
  // Para mensajes de error
  message?: string;
  code?: string;
}

interface UseWebSocketOptions {
  enabled?: boolean;
  onNewMessage?: (message: any) => void;
  onTyping?: (userId: number, chatId: number) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const isConnectingRef = useRef(false);
  const maxReconnectAttempts = 5;
  const instanceId = useRef(Math.random()); // ID único para esta instancia

  const connect = () => {
    // SINGLETON: Solo una conexión global por usuario
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      console.log(`WebSocket global ya existe (Usuario ${globalUserId}), reutilizando...`);
      setIsConnected(true);
      setConnectionError(null);
      options.onConnectionChange?.(true);
      return;
    }

    // Evitar múltiples conexiones simultáneas
    if (isConnectingRef.current) {
      console.log('Conexión ya en progreso, ignorando...');
      return;
    }
    
    if (globalWebSocket) {
      if (globalWebSocket.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket global conectando, esperando...');
        console.log('WebSocket global conectando, esperando...');
        return;
      }
      // Cerrar conexión anterior si está cerrada o en error
      try {
        globalWebSocket.close();
      } catch (e) {
        console.log('Error cerrando WebSocket anterior:', e);
      }
      globalWebSocket = null;
    }
    
    isConnectingRef.current = true;
    
    try {
      // Obtener token usando auth-storage para consistencia
      const token = authStorage.getToken();

      // Si no hay token, no intentar conectar (usuario no autenticado)
      if (!token) {
        console.log('🔌 No hay token de autenticación, omitiendo conexión WebSocket');
        isConnectingRef.current = false;
        return;
      }

      // URL del WebSocket - con validación para evitar URLs corruptas
      let wsUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
      
      // Si no hay URL válida, usar ruta relativa (Vercel actúa como puente)
      if (!wsUrl || wsUrl.includes('"') || wsUrl.includes('>') || !wsUrl.startsWith('ws')) {
        // Usar ruta relativa para WebSocket - Vercel no soporta WebSocket proxy, 
        // así que necesitamos la URL real del backend para WebSocket
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = env.wsHost || (window.location.hostname === 'localhost' ? 'localhost:8080' : window.location.hostname + ':8080');
        wsUrl = `${wsProtocol}://${host}/ws/chat`;
      }

      globalWebSocket = new WebSocket(wsUrl);

      globalWebSocket.onopen = () => {
        isConnectingRef.current = false;
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;

        // Autenticar y enviar token con pequeño delay para evitar CONNECTING state
        if (globalWebSocket && token) {
          setTimeout(() => {
            if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
              globalWebSocket.send(JSON.stringify({
                type: 'auth',
                token: token
              }));
            }
          }, 100); // 100ms delay
        }

        options.onConnectionChange?.(true);
      };

      globalWebSocket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          switch (data.type) {
            case 'connection_established':
              globalUserId = data.userId || null; 
              break;

            case 'new_message':
              options.onNewMessage?.(data); 

            case 'typing':
              options.onTyping?.(data.userId!, data.chatId!);
              break;

            case 'subscribed_to_chat':
              break;

            case 'unsubscribed_from_chat':
              break;

            case 'error':
              if (data.message || data.code) {
                console.error('Error WebSocket:', data.message || data.code);
                
                if (data.message?.includes('Token de autenticación inválido') || 
                    data.code === 'INVALID_TOKEN') {
                  console.warn('Token JWT inválido detectado, limpiando almacenamiento...');
                  authStorage.clear();
                  setConnectionError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
                } else {
                  setConnectionError(data.message || 'Error de conexión');
                }
              }
              break;

            default:
              console.log('❓ Tipo de mensaje no manejado:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      globalWebSocket.onclose = (event) => {
        isConnectingRef.current = false;
        setIsConnected(false);
        options.onConnectionChange?.(false);

        // No reconectar si fue cerrado limpiamente por nosotros
        if (event.wasClean) {
          return;
        }

        // Intentar reconectar automáticamente
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setConnectionError('No se pudo conectar al servidor de chat');
        }
      };

      globalWebSocket.onerror = (error) => {
        // Error silenciado - la reconexión se maneja en onclose
        isConnectingRef.current = false;
        // No establecer error aquí, dejar que onclose maneje la reconexión
      };

    } catch (error) {
      isConnectingRef.current = false;
      setConnectionError('Error al crear conexión WebSocket');
    }
  };

  const disconnect = () => {
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (globalWebSocket) {
      // Solo cerrar si está OPEN, no si está CONNECTING (causa error)
      if (globalWebSocket.readyState === WebSocket.OPEN) {
        globalWebSocket.close(1000, 'Disconnected by client'); // Código limpio
      }
      globalWebSocket = null;
    }
    
    isConnectingRef.current = false;
    setIsConnected(false);
    options.onConnectionChange?.(false);
  };

  const subscribeToChat = (chatId: number) => {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      globalWebSocket.send(JSON.stringify({
        type: 'subscribe_chat',
        chatId: chatId
      }));
    }
  };

  const unsubscribeFromChat = (chatId: number) => {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      globalWebSocket.send(JSON.stringify({
        type: 'unsubscribe_chat',
        chatId: chatId
      }));
    }
  };

  const sendTyping = (chatId: number) => {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      globalWebSocket.send(JSON.stringify({
        type: 'typing',
        chatId: chatId
      }));
    }
  };

  // Conectar automáticamente al montar el componente SOLO si está habilitado
  const shouldConnect = options.enabled !== false;
  
  useEffect(() => {
    // Si está deshabilitado, no conectar
    if (!shouldConnect) {
      return;
    }
    
    globalConnectionCount++;
    
    if (globalConnectionCount === 1) {
      connect();
    }

    return () => {
      globalConnectionCount--;
      console.log(`🔌 useWebSocket cleanup, quedan ${globalConnectionCount} instancias`);
      
      if (globalConnectionCount === 0) {
        disconnect();
        globalWebSocket = null;
        globalUserId = null;
      }
    };
  }, []); 

  return {
    isConnected,
    connectionError,
    subscribeToChat,
    unsubscribeFromChat,
    sendTyping,
    disconnect,
    reconnect: connect
  };
}
