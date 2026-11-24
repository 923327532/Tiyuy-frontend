'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProjectComments, useDeleteProjectComment } from '@/presentation/hooks/useAdmin';

interface ProjectCommentsSectionProps {
  projectId: number;
  compact?: boolean;
}

export function ProjectCommentsSection({ projectId, compact = false }: ProjectCommentsSectionProps) {
  const { data: comments, isLoading, error } = useProjectComments(projectId);
  const deleteCommentMutation = useDeleteProjectComment();
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 5;

  if (isLoading) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Comentarios de Usuarios</h4>}
        <div className="text-xs text-gray-500">Cargando comentarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Comentarios de Usuarios</h4>}
        <div className="text-xs text-red-500">Error al cargar comentarios</div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className={compact ? '' : 'mt-6'}>
        {!compact && <h4 className="font-medium text-gray-900 mb-3">Comentarios de Usuarios</h4>}
        <p className="text-xs text-slate-500">No hay comentarios para este proyecto</p>
      </div>
    );
  }

  const handleDeleteComment = async (commentId: number) => {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      await deleteCommentMutation.mutateAsync({ projectId, commentId });
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', projectId, 'comments'] });
    }
  };

  return (
    <div className={compact ? '' : 'mt-6'}>
      {!compact && (
        <h4 className="font-medium text-gray-900 mb-3">
          Comentarios de Usuarios ({comments.length})
        </h4>
      )}
      <div className={compact ? 'space-y-2' : 'space-y-3 max-h-64 overflow-y-auto'}>
        {(showAll ? comments : comments.slice(0, MAX_VISIBLE)).map((comment: any) => (
          <div key={comment.id} className={`${compact ? 'p-3' : 'bg-gray-50 p-4'} rounded-lg border border-gray-200 ${comment.isFlagged ? 'border-red-300 bg-red-50' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.userName}</span>
                {comment.isFlagged && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                    [MARCADO]
                  </span>
                )}
                {comment.rating && (
                  <span className="text-yellow-500">
                    {'★'.repeat(comment.rating)}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {comment.isFlagged && comment.flagReason && (
              <div className="text-xs text-red-600 mb-2">
                <strong>Motivo de marca:</strong> {comment.flagReason}
              </div>
            )}
            <div className="text-sm text-gray-700 mb-2">
              {comment.content}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Eliminar comentario
              </button>
            </div>
          </div>
        ))}
      </div>
      {comments.length > MAX_VISIBLE && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800"
        >
          Ver todos los comentarios ({comments.length})
        </button>
      )}
    </div>
  );
}
