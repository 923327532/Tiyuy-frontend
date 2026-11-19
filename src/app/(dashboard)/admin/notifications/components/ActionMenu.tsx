'use client';

import { MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ActionMenuProps {
  itemId: number | string;
  itemType: 'notification' | 'alert';
  onViewDetail: (type: 'notification' | 'alert', data: any) => void;
  onDelete: (type: 'notification' | 'alert', id: number | string) => void;
}

export function ActionMenu({ itemId, itemType, onViewDetail, onDelete }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleViewDetail = () => {
    onViewDetail(itemType, { id: itemId });
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (confirm(`¿Eliminar esta ${itemType === 'alert' ? 'alerta' : 'notificación'} del historial?`)) {
      onDelete(itemType, itemId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 sm:w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-20 py-1">
            <button
              onClick={handleViewDetail}
              className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> Ver detalle
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
}