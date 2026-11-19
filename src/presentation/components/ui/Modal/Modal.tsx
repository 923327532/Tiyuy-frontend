'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className={`
        relative rounded-t-2xl md:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col overflow-hidden
        w-full mx-0 md:mx-4 max-h-[calc(100vh-80px)] md:max-h-[85vh] ${sizes[size]}
        animate-in slide-in-from-bottom md:zoom-in-95 duration-300
      `} style={{ marginTop: '16px' }}>
        {/* Header - fixed */}
        {title && (
          <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-[#054d44] bg-green-600 md:rounded-t-2xl rounded-t-2xl">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content - scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};