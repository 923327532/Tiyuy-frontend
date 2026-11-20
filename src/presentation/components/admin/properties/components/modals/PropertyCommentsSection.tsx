'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { useDeletePropertyComment, usePropertyComments } from '@/presentation/hooks/useAdmin';
import {
  Chip,
  EmptyNote,
  ItemRow,
  ListBody,
  Panel,
} from '@/presentation/components/admin/users/components/detail/ui/detailParts';
import { formatDate } from '../../utils/properties.utils';

interface PropertyCommentsSectionProps {
  propertyId: number;
}

const MAX_VISIBLE = 5;

export function PropertyCommentsSection({ propertyId }: PropertyCommentsSectionProps) {
  const { data: comments, isLoading, error } = usePropertyComments(propertyId);
  const deleteMutation = useDeletePropertyComment();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? comments ?? [] : (comments ?? []).slice(0, MAX_VISIBLE);

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;
    try {
      await deleteMutation.mutateAsync({ propertyId, commentId });
    } catch {
      window.alert('No se pudo eliminar el comentario.');
    }
  };

  return (
    <Panel title={`Comentarios de usuarios (${comments?.length ?? 0})`}>
      {isLoading && <EmptyNote>Cargando comentarios...</EmptyNote>}
      {error && <EmptyNote>No se pudieron cargar los comentarios.</EmptyNote>}
      {!isLoading && !error && comments?.length === 0 && (
        <EmptyNote>No hay comentarios para esta propiedad.</EmptyNote>
      )}

      {!isLoading && !error && visible.length > 0 && (
        <ListBody>
          {visible.map((comment) => (
            <ItemRow
              key={comment.id}
              title={comment.userName || 'Usuario'}
              meta={`${comment.rating ? '★'.repeat(comment.rating) : ''} ${formatDate(comment.createdAt)}`}
              sub={
                <>
                  <p className="text-sm text-slate-600">{comment.content}</p>
                  {comment.isFlagged && (
                    <p className="mt-1 text-xs font-medium text-rose-700">
                      Marcado: {comment.flagReason || 'Sin motivo'}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleDelete(comment.id)}
                    disabled={deleteMutation.isPending}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rose-700 hover:underline disabled:opacity-60"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                    Eliminar comentario
                  </button>
                </>
              }
              right={
                comment.isFlagged ? <Chip tone="danger">Marcado</Chip> : null
              }
            />
          ))}
        </ListBody>
      )}

      {Boolean(comments && comments.length > MAX_VISIBLE) && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
        >
          {showAll ? 'Ver menos' : `Ver los ${comments!.length - MAX_VISIBLE} restantes`}
        </button>
      )}
    </Panel>
  );
}
