'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Image, Upload, Loader2 } from 'lucide-react';
import { Modal } from '@/presentation/components/ui/Modal/Modal';
import { toast } from '@/presentation/store/toastStore';
import { useCreateChannelEvent, useUploadChannelEventImages } from '@/presentation/hooks/useContacts';
import { useQueryClient } from '@tanstack/react-query';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: number;
  onSuccess?: () => void;
}

// Enums que coinciden con el backend
const EVENT_TYPES = [
  { value: 'FERIA_INMOBILIARIA', label: 'Ferias inmobiliarias' },
  { value: 'OPEN_HOUSE', label: 'Open House' },
  { value: 'WEBINAR', label: 'Webinars' },
  { value: 'REMATE', label: 'Remates' },
  { value: 'OTRO', label: 'Otros' },
] as const;

const VISIBILITY_TYPES = [
  { value: 'PUBLIC', label: 'Publico' },
  { value: 'PRIVATE', label: 'Privado' },
] as const;

const MAX_IMAGES = 5;
// Usar axiosClient centralizado - no se necesita API_BASE_URL

export default function CreateEventModal({ isOpen, onClose, channelId, onSuccess }: CreateEventModalProps) {
  const queryClient = useQueryClient();
  const createEventMutation = useCreateChannelEvent();
  const uploadEventImagesMutation = useUploadChannelEventImages();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'FERIA_INMOBILIARIA' as const,
    visibility: 'PUBLIC' as const,
    startDateTime: '',
    endDateTime: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    city: '',
    country: 'Peru',
    maxAttendees: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El titulo es requerido';
    } else if (formData.title.length > 200) {
      newErrors.title = 'El titulo no puede exceder 200 caracteres';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'La descripcion no puede exceder 2000 caracteres';
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = 'La fecha de inicio es requerida';
    } else {
      const startDate = new Date(formData.startDateTime);
      if (startDate <= new Date()) {
        newErrors.startDateTime = 'La fecha de inicio debe ser en el futuro';
      }
    }

    // Validar que fecha fin no sea anterior a fecha inicio
    if (formData.endDateTime && formData.startDateTime) {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);
      if (endDate <= startDate) {
        newErrors.endDateTime = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'La direccion no puede exceder 500 caracteres';
    }

    if (formData.city && formData.city.length > 100) {
      newErrors.city = 'La ciudad no puede exceder 100 caracteres';
    }

    if (formData.country && formData.country.length > 100) {
      newErrors.country = 'El pais no puede exceder 100 caracteres';
    }

    if (formData.maxAttendees && (parseInt(formData.maxAttendees) < 1 || parseInt(formData.maxAttendees) > 10000)) {
      newErrors.maxAttendees = 'El numero de asistentes debe estar entre 1 y 10000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Build event data - explicitly omit endDateTime when empty to let @PrePersist set default
      const eventData: any = {
        title: formData.title,
        description: formData.description,
        coverImageUrl: '',
        eventType: formData.eventType,
        visibility: formData.visibility,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: formData.city,
        country: formData.country,
        channelId,
      };

      // Only add endDateTime if user provided a value
      // This allows Java @PrePersist to set default (start + 2h) when null
      if (formData.endDateTime && formData.endDateTime.trim() !== '') {
        eventData.endDateTime = new Date(formData.endDateTime).toISOString();
      }
      // If not set, eventData.endDateTime will be undefined (not sent to backend)

      // Create the event
      const createdEvent = await createEventMutation.mutateAsync(eventData);
      
      // Upload images if any selected
      if (selectedImages.length > 0 && createdEvent?.id) {
        await uploadEventImagesMutation.mutateAsync({
          channelId,
          eventId: createdEvent.id,
          files: selectedImages
        });
      }

      // Wait for queries to refetch with new data (including images)
      await queryClient.refetchQueries({ 
        queryKey: ['channelEvents', channelId],
        exact: false 
      });
      await queryClient.refetchQueries({ 
        queryKey: ['channelUpcomingEvents', channelId] 
      });

      onClose();
      onSuccess?.();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: 'FERIA_INMOBILIARIA',
        visibility: 'PUBLIC',
        startDateTime: '',
        endDateTime: '',
        address: '',
        latitude: null,
        longitude: null,
        city: '',
        country: 'Peru',
        maxAttendees: '',
      });
      setSelectedImages([]);
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImagePreviewUrls([]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Initialize Google Maps
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    setMapLoading(true);
    
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');
    
    const defaultLocation: [number, number] = [-12.0464, -77.0428];
    
    const map = L.map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;

    const marker = L.marker(defaultLocation, { draggable: true }).addTo(map);
    markerRef.current = marker;

    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      updateLocationFromCoords(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      updateLocationFromCoords(position.lat, position.lng);
    });

    setMapLoaded(true);
    setMapLoading(false);
  }, []);

  // Update location from coordinates using reverse geocoding
  const updateLocationFromCoords = async (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`, {
        headers: { 'User-Agent': 'Tiyuy-Frontend' },
      });
      const data = await response.json();
      if (data) {
        const city = data.address?.city || data.address?.town || data.address?.county || '';
        const country = data.address?.country || '';
        setFormData(prev => ({
          ...prev,
          address: data.display_name || prev.address,
          city: city || prev.city,
          country: country || prev.country,
        }));
      }
    } catch (error) {
      console.error('Error geocoding:', error);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pe&limit=5&accept-language=es`, {
        headers: { 'User-Agent': 'Tiyuy-Frontend' },
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleLocationSearchSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    if (mapInstanceRef.current && markerRef.current) {
      const L = require('leaflet');
      const latlng = L.latLng(lat, lng);
      mapInstanceRef.current.setView(latlng, 16);
      markerRef.current.setLatLng(latlng);
    }
    
    updateLocationFromCoords(lat, lng);
    setSearchResults([]);
    if (locationInputRef.current) {
      locationInputRef.current.value = result.display_name;
    }
  };

  // Load Leaflet map when modal opens
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markerRef.current = null;
      setMapLoaded(false);
      return;
    }

    if (isOpen && !mapLoaded && !mapLoading) {
      initMap();
    }
  }, [isOpen, initMap, mapLoaded, mapLoading]);

  // Cleanup preview URLs and map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = selectedImages.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(`Solo puedes subir máximo ${MAX_IMAGES} imágenes por evento`);
      return;
    }

    // Validate file types and sizes
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} excede el límite de 5MB`);
        return false;
      }
      return true;
    });

    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Evento" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Título del evento"
              maxLength={200}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe tu evento..."
              maxLength={2000}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibilidad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VISIBILITY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Imagenes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Imagenes del Evento</h3>
          <p className="text-sm text-gray-500">Maximo {MAX_IMAGES} imagenes. La primera sera la portada.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                    Portada
                  </span>
                )}
              </div>
            ))}
            
            {selectedImages.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Agregar imagen</span>
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Fechas y Horas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Fechas y Horas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => handleInputChange('startDateTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDateTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDateTime && <p className="text-red-500 text-xs mt-1">{errors.startDateTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora de Fin
              </label>
              <input
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => handleInputChange('endDateTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDateTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDateTime && <p className="text-red-500 text-xs mt-1">{errors.endDateTime}</p>}
            </div>
          </div>
        </div>

        {/* Ubicacion */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Ubicacion</h3>
          
          {/* Buscar direccion - Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar ubicacion
            </label>
            <input
              ref={locationInputRef}
              type="text"
              value={formData.address}
              onChange={(e) => {
                handleInputChange('address', e.target.value);
                searchLocation(e.target.value);
              }}
              placeholder="Escribe una direccion para buscar"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            {searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900 truncate"
                    onClick={() => handleLocationSearchSelect(result)}
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Google Map */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Haz clic en el mapa o arrastra el marcador para ajustar la ubicacion exacta
            </p>
            <div
              key={isOpen ? 'map-open' : 'map-closed'}
              ref={mapRef}
              className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
              style={{ display: mapLoaded ? 'block' : 'none' }}
            >
            </div>
            {!mapLoaded && (
              <div className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-500">Cargando mapa...</span>
                </div>
              </div>
            )}
          </div>

          {/* Direccion exacta - Resultado del mapa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Direccion exacta
              <span className="text-gray-400 font-normal ml-1">(se rellena al marcar en el mapa)</span>
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Calle, numero, distrito, referencia..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ciudad"
                maxLength={100}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pais</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Pais"
                maxLength={100}
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
          </div>
        </div>

        {/* Configuracion Adicional */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuracion Adicional</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximo de Asistentes
            </label>
            <input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Sin limite"
              min="1"
              max="10000"
            />
            {errors.maxAttendees && <p className="text-red-500 text-xs mt-1">{errors.maxAttendees}</p>}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={createEventMutation.isPending || uploadEventImagesMutation.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createEventMutation.isPending || uploadEventImagesMutation.isPending}
          >
            {createEventMutation.isPending || uploadEventImagesMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                {uploadEventImagesMutation.isPending ? 'Subiendo imagenes...' : 'Creando...'}
              </div>
            ) : (
              'Crear Evento'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
