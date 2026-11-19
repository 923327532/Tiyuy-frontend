'use client';

import { useState, useRef, useCallback } from 'react';
import { useUploadPhotos } from '@/presentation/hooks/useProperties';
import Image from 'next/image';
import { toast } from '@/presentation/store/toastStore';
import { AlertCircle, Camera, CloudUpload, Loader, X } from 'lucide-react';

interface PhotosStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  propertyId?: number;
}

export function PhotosStep({ propertyId }: PhotosStepProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadPhotos();

  // Validar archivo
  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos JPG y PNG');
      return false;
    }
    
    if (file.size > maxSize) {
      toast.error('El archivo no debe superar los 5MB');
      return false;
    }
    
    return true;
  };

  // Manejar selección de archivos
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (selectedFiles.length + validFiles.length > 10) {
      toast.error('Máximo 10 fotos por propiedad');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    
    // Crear previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  // Funcionalidad de cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileSelect([file] as unknown as FileList);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!propertyId) {
      toast.error('Primero debes crear la propiedad');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Selecciona al menos una foto');
      return;
    }

    await uploadMutation.mutateAsync({
      propertyId,
      files: selectedFiles,
    });

    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  return (
    <div className="space-y-8">
      {/* ── ÁREA DE SUBIDA ── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
          Fotos de tu propiedad
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Las propiedades con fotos reciben hasta 5x más visitas
        </p>

        {/* Área de drag & drop */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging 
              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)]' 
              : 'border-[var(--input-border)] hover:border-[var(--text-muted)]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Icono de cámara */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <Camera className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Subir fotos de tu propiedad
          </h3>
          <p className="text-[var(--text-secondary)] mb-8">
            Arrastra y suelta imágenes aquí, o haz clic para seleccionar
          </p>

          {/* Input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all bg-[var(--brand-primary)] hover:opacity-90"
            >
              <CloudUpload className="w-5 h-5" />
              Seleccionar archivos
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] font-semibold rounded-lg hover:border-[var(--text-muted)] transition-all"
            >
              <Camera className="w-5 h-5" />
              Tomar foto
            </button>
          </div>

          <p className="text-sm text-[var(--text-muted)] mt-6">
            Máximo 10 fotos • JPG, PNG • Máx 5MB cada una
          </p>
        </div>
      </section>

      {/* ── PREVIEWS ── */}
      {previewUrls.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Fotos seleccionadas ({previewUrls.length}/10)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg-secondary)]">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded bg-[var(--brand-primary)]">
                    Portada
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending || !propertyId}
            className="w-full mt-6 py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--brand-primary)] hover:opacity-90"
          >
            {uploadMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Subiendo fotos...
              </div>
            ) : (
              'Subir fotos'
            )}
          </button>
        </section>
      )}

      {/* ── CONSEJOS ── */}
      <section>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Consejos para mejores fotos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '☀️', title: 'Buena iluminación', desc: 'Toma fotos con luz natural' },
            { icon: '🧹', title: 'Espacios ordenados', desc: 'Limpia y organiza antes' },
            { icon: '📐', title: 'Ángulos amplios', desc: 'Muestra los espacios completos' },
            { icon: '🏠', title: 'Todas las áreas', desc: 'Incluye todas las habitaciones' }
          ].map((tip, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">{tip.icon}</span>
              </div>
              <h4 className="font-semibold text-[var(--text-primary)] text-sm">{tip.title}</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODAL DE CÁMARA ── */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-card)] rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Tomar foto</h3>
              <button
                onClick={stopCamera}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex justify-center gap-4">
              <button
                onClick={stopCamera}
                className="px-6 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-secondary)]"
              >
                Cancelar
              </button>
              <button
                onClick={capturePhoto}
                className="px-6 py-2 text-white rounded-lg bg-[var(--brand-primary)] hover:opacity-90"
              >
                <Camera className="w-5 h-5 inline mr-2" />
                Capturar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ALERTA SI NO HAY PROPERTY ID ── */}
      {!propertyId && (
        <div className="rounded-lg p-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold">Primero completa los pasos anteriores</p>
            <p className="opacity-80">Para poder subir fotos, primero debes guardar la información básica, ubicación y características de la propiedad.</p>
          </div>
        </div>
      )}
    </div>
  );
}
