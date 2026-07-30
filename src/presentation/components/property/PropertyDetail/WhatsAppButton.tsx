'use client';

import { useState } from 'react';
import { Property } from '@/core/domain/entities/Property';
import { useCRMInteraction } from '@/presentation/hooks/useCRMInteraction';
import { Loader, MessageCircle, SquarePen } from 'lucide-react';;

interface WhatsAppButtonProps {
  property: Property;
  className?: string;
}

export function WhatsAppButton({ property, className = '' }: WhatsAppButtonProps) {
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    `¡Hola! Me interesa tu propiedad: ${property.title || `${property.type} en ${property.location.district}`}. ¿Podrían darme más información?`
  );
  
  const { trackWhatsAppClick, isLoading } = useCRMInteraction();

  const handleWhatsAppClick = (message?: string) => {
    const finalMessage = message || customMessage;
    
    // Trackear en CRM y redirigir a WhatsApp
    trackWhatsAppClick.mutate({
      propertyId: property.id,
      ownerId: property.owner.id,
      ownerPhone: (property.owner as any).phone || '',
      message: finalMessage,
      source: 'whatsapp_button',
    });
  };

  return (
    <div className={`${className}`}>
      {/* Botón principal de WhatsApp */}
      <button
        onClick={() => handleWhatsAppClick()}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin h-5 w-5" />
            Procesando...
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </>
        )}
      </button>

      {/* Opción de personalizar mensaje */}
      <div className="mt-3">
        <button
          onClick={() => setShowMessageEditor(!showMessageEditor)}
          className="w-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium py-2 flex items-center justify-center gap-2 transition-colors"
        >
          <SquarePen className="w-4 h-4" />
          {showMessageEditor ? 'Ocultar editor' : 'Personalizar mensaje'}
        </button>

        {showMessageEditor && (
          <div className="mt-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Mensaje personalizado:
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--input-border)] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
              rows={3}
              placeholder="Escribe tu mensaje personalizado..."
            />
            <button
              onClick={() => handleWhatsAppClick(customMessage)}
              disabled={isLoading}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-4 w-4" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Enviar mensaje personalizado
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-3 text-xs text-[var(--text-tertiary)] text-center">
        Respuesta rápida por WhatsApp • Disponible 24/7
      </div>
    </div>
  );
}
