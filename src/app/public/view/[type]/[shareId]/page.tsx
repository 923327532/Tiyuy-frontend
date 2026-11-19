'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { publicApiClient } from '@/infrastructure/api/axios-client';
import { useAuthStore } from '@/presentation/store/authStore';
import { Home, Users, MapPin, Eye, MessageSquare, LogIn, Clock, User, ChevronRight, Shield } from 'lucide-react';

export default function PublicViewPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const type = params.type as string;
  const shareId = params.shareId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type || !shareId) return;
    fetchData();
  }, [type, shareId]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await publicApiClient.get(`/public/view/${type}/${shareId}`);
      setData(res.data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Este contenido ya no esta disponible.');
      } else {
        setError('No pudimos cargar este contenido. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {data?.title || 'Contenido no disponible'}
          </h1>
          <p className="text-gray-500 mb-6">{error || data?.message || 'Este contenido ya no esta disponible.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/images/logo.svg" alt="TIYUY" className="h-8 w-auto" />
          </Link>
          {!isAuthenticated && (
            <button onClick={() => router.push('/profile-selector')}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all">
              <LogIn className="w-4 h-4" />
              Iniciar sesion
            </button>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {data.type === 'status' && !data.expired && (
          <StatusView data={data} isAuthenticated={isAuthenticated} router={router} />
        )}
        {data.type === 'group' && !data.expired && (
          <GroupView data={data} isAuthenticated={isAuthenticated} router={router} />
        )}
      </div>

      <footer className="text-center py-6 border-t border-gray-100 mt-8">
        <p className="text-xs text-gray-400">Compartido desde Tiyuy - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

function StatusView({ data, isAuthenticated, router }: any) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  };

  const contentLength = data.content?.length || 0;

  const getTextStyleClass = () => {
    switch (data.textStyle) {
      case 'BOLD': return 'font-bold';
      case 'ITALIC': return 'italic';
      case 'COLORFUL': return 'text-yellow-200';
      case 'CODE': return 'font-mono';
      case 'HIGHLIGHT': return 'bg-white/20 px-2 py-1 rounded-lg';
      default: return 'font-medium';
    }
  };

  const getAutoSizeClass = () => {
    if (contentLength < 30) return 'text-3xl sm:text-4xl';
    if (contentLength < 80) return 'text-2xl sm:text-3xl';
    if (contentLength < 150) return 'text-xl sm:text-2xl';
    return 'text-base sm:text-lg';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600">Publicacion compartida</span>
      </nav>

      {/* Card del estado - estilo Facebook */}
      <div 
        className="rounded-2xl flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-8 sm:p-12 text-center shadow-lg overflow-hidden"
        style={{ backgroundColor: data.customColor || '#14b8a6' }}
      >
        <div className="w-full max-w-lg mx-auto">
          {/* Avatar + nombre */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">{data.authorName}</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(data.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Texto del estado con auto-sizing y estilo */}
          <div className={`text-white leading-relaxed ${getTextStyleClass()} ${getAutoSizeClass()}`}>
            {data.content}
          </div>

          {data.location && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm font-medium">
                <MapPin className="w-3 h-3" />
                {data.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-sm text-white/60 mt-8 pt-6 border-t border-white/20">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{data.viewCount} vistas</span>
          </div>
        </div>
      </div>

      {/* Comentarios */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comentarios ({data.commentCount})
        </h3>

        {data.comments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No hay comentarios aun.</p>
        ) : (
          <div className="space-y-4">
            {data.comments.map((c: any) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.authorName}</p>
                  <p className="text-gray-600 text-sm">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(c.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm text-gray-500 mb-3">Inicia sesion para comentar o interactuar</p>
            <button onClick={() => router.push('/profile-selector')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all">
              <LogIn className="w-4 h-4" />
              Iniciar sesion
            </button>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-4">
            <p className="text-sm text-teal-600 font-medium">Puedes comentar desde tu panel de contactos.</p>
            <button onClick={() => router.push('/dashboard/my-contacts')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
              Ir a Contactos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GroupView({ data, isAuthenticated, router }: any) {
  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600">Grupo compartido</span>
      </nav>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {data.memberCount} miembros · Creado por {data.adminName}
            </p>
          </div>
        </div>

        {data.description && (
          <p className="text-gray-600 mb-6">{data.description}</p>
        )}

        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Miembros ({data.members.length})
        </h3>

        <div className="space-y-2">
          {data.members.map((m: any) => (
            <div key={m.userId} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {m.photo ? <img src={m.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <User className="w-5 h-5 text-gray-400" />}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role === 'ADMIN' ? 'Administrador' : 'Miembro'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Inicia sesion para unirte a este grupo</p>
          <button onClick={() => router.push('/profile-selector')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-all">
            <LogIn className="w-4 h-4" />
            Iniciar sesion
          </button>
        </div>
      )}
    </div>
  );
}