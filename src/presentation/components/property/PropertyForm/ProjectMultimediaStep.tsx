'use client';

import React, { useState, useRef } from 'react';
import { X, FileText } from 'lucide-react';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { toast } from '@/presentation/store/toastStore';

interface ProjectMultimediaStepProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  propertyId?: number;
  // 🔍 FIX: Agregar archivos de unidades para subir en paso 5
  unitBlueprintFiles?: {[key: number]: File};
  groupBlueprintFiles?: {[key: number]: File};
  // 🔍 FIX: Agregar tipo para manejar propiedades vs proyectos
  entityType?: 'property' | 'project';
}

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error('No se pudo leer el video'));
    video.src = URL.createObjectURL(file);
  });
};

const validateFile = async (file: File, type: 'images' | 'blueprints' | 'renders'): Promise<string | null> => {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  // Límites de tamaño
  const maxSize = isVideo ? 100 * 1024 * 1024   // 100MB para video
                : isImage ? 10 * 1024 * 1024    // 10MB para imágenes
                :           20 * 1024 * 1024;   // 20MB para PDFs/planos

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    return `"${file.name}" pesa ${fileMB}MB. Máximo permitido: ${maxMB}MB`;
  }

  // Validar duración de video (máx 60 segundos)
  if (isVideo) {
    try {
      const duration = await getVideoDuration(file);
      if (duration > 60) {
        return `El video "${file.name}" dura ${Math.round(duration)}s. Máximo: 60 segundos`;
      }
    } catch (error) {
      return `El video "${file.name}" no es válido o está corrupto`;
    }
  }

  // Validar formatos permitidos
  const allowedTypes = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    blueprints: ['application/pdf', 'image/vnd.dwg', 'application/dxf'],
    renders: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/avi']
  };

  if (!allowedTypes[type].includes(file.type)) {
    return `El archivo "${file.name}" tiene un formato no permitido para ${type}`;
  }

  return null; // sin error
};

export function ProjectMultimediaStep({ formData, onChange, propertyId, unitBlueprintFiles, groupBlueprintFiles, entityType = 'property' }: ProjectMultimediaStepProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blueprintInputRef = useRef<HTMLInputElement>(null);
  const renderInputRef = useRef<HTMLInputElement>(null);

  // Función para subir planos de unidades (del paso 3)
  const uploadUnitBlueprints = async () => {
    if (!propertyId) return;

    const token = authStorage.getToken() || localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
    if (!token) return;

    console.log('Subiendo planos de unidades desde paso 3...');
    
    // Guardar las URLs subidas para actualizar las unidades
    const uploadedBlueprints: {[key: number]: string} = {};
    
    // Subir planos de unidades individuales
    if (unitBlueprintFiles) {
      for (const [unitId, file] of Object.entries(unitBlueprintFiles)) {
        if (file) {
          const formDataUpload = new FormData();
          formDataUpload.append('files', file);
          formDataUpload.append('type', 'blueprints');

          try {
            const endpoint = entityType === 'project' ? 'projects' : 'properties';
            const response = await fetch(`/api/${endpoint}/${propertyId}/upload`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formDataUpload,
            });

            if (response.ok) {
              const result = await response.json();
              const uploadedUrl = Array.isArray(result) ? result[0] : result.url;
              console.log(`Plano de unidad ${unitId} subido:`, uploadedUrl);
              
              // Guardar la URL para actualizar la unidad
              uploadedBlueprints[parseInt(unitId)] = uploadedUrl;
            }
          } catch (error) {
            console.error(`Error subiendo plano de unidad ${unitId}:`, error);
          }
        }
      }
    }

    // Subir planos de grupos
    if (groupBlueprintFiles) {
      for (const [groupId, file] of Object.entries(groupBlueprintFiles)) {
        if (file) {
          const formDataUpload = new FormData();
          formDataUpload.append('files', file);
          formDataUpload.append('type', 'blueprints');

          try {
            const endpoint = entityType === 'project' ? 'projects' : 'properties';
            const response = await fetch(`/api/${endpoint}/${propertyId}/upload`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formDataUpload,
            });

            if (response.ok) {
              const result = await response.json();
              const uploadedUrl = Array.isArray(result) ? result[0] : result.url;
              console.log(`Plano de grupo ${groupId} subido:`, uploadedUrl);
              
              // Guardar la URL para actualizar el grupo
              uploadedBlueprints[parseInt(groupId)] = uploadedUrl;
            }
          } catch (error) {
            console.error(`Error subiendo plano de grupo ${groupId}:`, error);
          }
        }
      }
    }

    // Devolver las URLs subidas para que se usen en el guardado final
    return uploadedBlueprints;
  };

  const handleFileUpload = async (files: FileList, type: 'images' | 'blueprints' | 'renders') => {
    if (!propertyId) {
      toast.error('Primero debes guardar el proyecto para subir archivos');
      return;
    }

    if (propertyId <= 0) {
      toast.error('ID de proyecto inválido. Por favor, recarga la página e intenta nuevamente.');
      return;
    }

    
    
    for (const file of Array.from(files)) {
      const error = await validateFile(file, type);
      if (error) {
        toast.error(error);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = authStorage.getToken();
      if (!token) throw new Error('No se encontró el token de autenticación');

      // Crear FormData para la subida
      const formDataUpload = new FormData();
      
      // Agregar archivos
      Array.from(files).forEach(file => {
        formDataUpload.append('files', file);
      });

      // Agregar metadatos
      const backendType = type === 'images' ? 'PHOTO' : type === 'blueprints' ? 'BLUEPRINT' : 'RENDER';
      formDataUpload.append('mediaType', backendType);

      console.log(`Subiendo ${files.length} archivos al proyecto ${propertyId}`);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 5, 95));
      }, 500);

      // Usar ruta relativa - Vercel actúa como puente
      const endpoint = entityType === 'project' ? 'projects' : 'properties';
      const uploadUrl = `/api/${endpoint}/${propertyId}/upload`;

      console.log(`Enviando POST a: ${uploadUrl}`);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type manualmente para FormData, el navegador lo hace automáticamente
        },
        body: formDataUpload,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error del servidor:', response.status, errorBody);

        if (errorBody.includes('Method \'POST\' is not supported')) {
          throw new Error('El servidor no reconoce esta ruta para subida.');
        }

        if (response.status === 500) {
          throw new Error('Error del servidor al procesar los archivos.');
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const newUrls = Array.isArray(result) ? result.map((m: any) => m.url) : [];
      
      const currentUrls = formData[type] || [];
      onChange(type, [...currentUrls, ...newUrls]);
      toast.success('Archivos subidos correctamente');

    } catch (error: any) {
      console.error(' Error en la subida:', error);
      toast.error(error.message || 'Error al subir los archivos');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (type: 'images' | 'blueprints' | 'renders', index: number) => {
    const currentFiles = formData[type] || [];
    onChange(type, currentFiles.filter((_: any, i: number) => i !== index));
  };

  return (
    <div data-multimedia-step className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multimedia del Proyecto</h3>
        <p className="text-sm text-gray-600 mb-6">
          Sube imágenes, planos y renders para mostrar tu proyecto
        </p>
      </div>

      {!propertyId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-yellow-600"></div>
            <div>
              <p className="text-yellow-800 font-medium">Importante</p>
              <p className="text-yellow-700 text-sm">
                Debes completar los pasos anteriores para poder subir archivos multimedia
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Imágenes del Proyecto */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Imágenes del Proyecto</h4>
        <p className="text-sm text-gray-600 mb-3">
          Fotos del edificio, amenities, vistas, etc. (Máximo 10 imágenes)
        </p>
        
        {/* Grid de imágenes existentes */}
        {formData.images && formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.images.map((image: any, index: number) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`Imagen ${index + 1} cargada: ${image}`)}
                    onError={() => console.error(`Error cargando imagen ${index + 1}: ${image}`)}
                  />
                </div>
                <button
                  onClick={() => removeFile('images', index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'images')}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={!propertyId || uploading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo...' : '+ Subir Imágenes'}
        </button>
      </div>

      {/* Planos */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Planos del Proyecto</h4>
        <p className="text-sm text-gray-600 mb-3">
          Planos arquitectónicos, plantas, distribuciones (PDF, DWG)
        </p>
        
        {/* Lista de planos existentes */}
        {formData.blueprints && formData.blueprints.length > 0 && (
          <div className="space-y-2 mb-4">
            {formData.blueprints.map((blueprint: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{blueprint.name}</p>
                    <p className="text-sm text-gray-500">{blueprint.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('blueprints', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={blueprintInputRef}
          type="file"
          multiple
          accept="application/pdf,image/vnd.dwg,application/dxf"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'blueprints')}
          className="hidden"
        />
        
        <button
          onClick={() => blueprintInputRef.current?.click()}
          disabled={!propertyId || uploading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo...' : '+ Subir Planos'}
        </button>
      </div>

      {/* Renders 3D */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Renders 3D</h4>
        <p className="text-sm text-gray-600 mb-3">
          Imágenes 3D, tours virtuales, visualizaciones
        </p>
        
        {/* Grid de renders existentes */}
        {formData.renders && formData.renders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.renders.map((render: any, index: number) => {
              const isVideo = render.includes('.mp4') || render.includes('.avi') || render.includes('.mov');
              
              return (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {isVideo ? (
                      <video
                        src={render}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                      >
                        Tu navegador no soporta el tag de video.
                      </video>
                    ) : (
                      <img
                        src={render}
                        alt={`Render ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      {isVideo ? ' VIDEO' : '3D'}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('renders', index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input
          ref={renderInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/avi"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'renders')}
          className="hidden"
        />
        
        <button
          onClick={() => renderInputRef.current?.click()}
          disabled={!propertyId || uploading}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo...' : '+ Subir Renders 3D'}
        </button>
      </div>

      {/* Progreso de subida */}
      {uploading && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Subiendo archivos...</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Resumen multimedia */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-3">Resumen Multimedia</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="text-purple-700 block text-sm">Imágenes</span>
            <p className="font-semibold text-purple-900 text-lg">{formData.images?.length || 0}</p>
          </div>
          <div>
            <span className="text-purple-700 block text-sm">Planos</span>
            <p className="font-semibold text-purple-900 text-lg">{formData.blueprints?.length || 0}</p>
          </div>
          <div>
            <span className="text-purple-700 block text-sm">Renders</span>
            <p className="font-semibold text-purple-900 text-lg">{formData.renders?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="text-blue-600 mt-0.5"></div>
          <div>
            <p className="text-blue-800 font-medium mb-1">Recomendaciones</p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Usa imágenes de alta resolución (mínimo 1200x800px)</li>
              <li>• Incluye fotos del edificio, amenities y vistas</li>
              <li>• Los planos deben estar en PDF y ser legibles</li>
              <li>• Los renders 3D ayudan a visualizar el proyecto final</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
