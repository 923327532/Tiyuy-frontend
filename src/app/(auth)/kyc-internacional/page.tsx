'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import { useKyc } from '@/presentation/hooks';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, ShieldCheck, UploadCloud, ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function useCurrentUserReview() {
  const { user: authUser, setUser } = useAuthStore();
  return useQuery({
    queryKey: ['current-user-review'],
    queryFn: async () => {
      const response = await axiosClient.get('/auth/me');
      const userData = response.data;
      if (userData) setUser(userData);
      return userData;
    },
    initialData: authUser,
    enabled: !!authUser,
  });
}

function UploadImageBox({
  label,
  hint,
  file,
  previewUrl,
  onFile,
  accent = 'brand',
}: {
  label: string;
  hint: string;
  file: File | null;
  previewUrl: string;
  onFile: (f: File | null) => void;
  accent?: 'brand' | 'blue';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState('');

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setLocalError('La imagen excede el tamaño máximo de 10MB');
      onFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      setLocalError('Formato no permitido. Solo JPG, PNG y WEBP');
      onFile(null);
      return;
    }
    setLocalError('');
    onFile(f);
  };

  const ringColor = accent === 'blue' ? 'ring-blue-500 border-blue-300' : 'ring-[var(--brand-primary)] border-gray-300';

  return (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${ringColor} bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden cursor-pointer focus:outline-none focus:ring-4 ${
          accent === 'blue' ? 'focus:ring-blue-500/20' : 'focus:ring-[var(--brand-primary)]/20'
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <UploadCloud className="w-8 h-8" />
            <span className="text-xs font-medium px-4 text-center">{hint}</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {file && (
        <button
          type="button"
          onClick={() => { onFile(null); inputRef.current && (inputRef.current.value = ''); }}
          className="mt-2 text-xs text-red-500 hover:underline"
        >
          Quitar imagen
        </button>
      )}
      {localError && <p className="mt-2 text-xs text-red-600">⚠ {localError}</p>}
    </div>
  );
}

function KycInternacionalContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: freshUser } = useCurrentUserReview();
  const { uploadInternationalDocuments, isValidating } = useKyc();

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const status = freshUser?.verificationStatus || user?.verificationStatus || 'PENDING';

  useEffect(() => {
    if (documentFile) {
      const url = URL.createObjectURL(documentFile);
      setDocumentPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setDocumentPreview('');
  }, [documentFile]);

  useEffect(() => {
    if (selfieFile) {
      const url = URL.createObjectURL(selfieFile);
      setSelfiePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setSelfiePreview('');
  }, [selfieFile]);

  // El usuario peruano no debería estar aquí
  useEffect(() => {
    if (freshUser && freshUser.documentType && freshUser.documentType !== 'INTERNATIONAL') {
      router.replace('/');
    }
  }, [freshUser, router]);

  const handleSubmit = async () => {
    setError('');
    if (!documentFile || !selfieFile) {
      setError('Debes subir la foto del documento y una selfie.');
      return;
    }
    try {
      await uploadInternationalDocuments(documentFile, selfieFile);
      setSubmitted(true);
      // Refrescar el estado del usuario
      const response = await axiosClient.get('/auth/me');
      if (response.data) {
        const { setUser } = useAuthStore.getState();
        setUser(response.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al subir los documentos. Inténtalo de nuevo.');
    }
  };


  // Aprobado: acceso completo
  if (status === 'VERIFIED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Identidad verificada</h1>
          <p className="text-sm text-gray-600 mb-6">
            Tu documento fue aprobado. Ya puedes acceder a todas las áreas privadas de TIYUY.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Ir a mi cuenta
          </Link>
        </div>
      </div>
    );
  }

  // Rechazado
  if (status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Documento rechazado</h1>
          <p className="text-sm text-gray-600 mb-2">
            No pudimos validar tu documento. Verifica que la foto sea legible y vuelve a intentarlo.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Volver a subir mis documentos
          </button>
          <Link href="/" className="block mt-3 text-sm text-gray-500 hover:underline">
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  // En revisión (PENDING) después de subir
  if (submitted || freshUser?.documentImageUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Documento en revisión</h1>
          <p className="text-sm text-gray-600 mb-6">
            Subimos tu documento y selfie. Un administrador lo está revisando. Te avisaremos cuando sea aprobado.
            Mientras tanto puedes seguir explorando TIYUY.
          </p>
          <Link
            href="/"
            className="block w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Formulario de subida
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full p-6 sm:p-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[var(--brand-primary-light)] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7 text-[var(--brand-primary)]" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Verificación de identidad</h1>
          <p className="text-sm text-gray-500">
            Sube una foto de tu documento y una selfie para que podamos verificar tu identidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <UploadImageBox
            label="Foto del documento"
            hint="Sube una foto clara de tu documento"
            file={documentFile}
            previewUrl={documentPreview}
            onFile={setDocumentFile}
          />
          <UploadImageBox
            label="Selfie"
            hint="Sube una selfie de tu rostro"
            file={selfieFile}
            previewUrl={selfiePreview}
            onFile={setSelfieFile}
            accent="blue"
          />
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 mb-5">
          <p className="text-xs text-blue-700">
            Tus documentos se guardan de forma segura y solo los revisa el equipo de TIYUY.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
            ⚠ {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isValidating}
          className="w-full bg-[var(--brand-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Subiendo...' : 'Enviar mis documentos'}
        </button>
      </div>
    </div>
  );
}

export default function KycInternacionalPage() {
  return (
    <ProtectedRoute>
      <KycInternacionalContent />
    </ProtectedRoute>
  );
}

