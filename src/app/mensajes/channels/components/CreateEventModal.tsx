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

// ─── CUSTOM SELECT ───
function CustomSelect({ label, value, options, onChange, required }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || 'Seleccionar';

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors">
        <span>{selectedLabel}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${value === opt.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const autocompleteRef = useRef<any>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

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
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Error al crear el evento. Verifica los datos ingresados.';
      toast.error(msg);
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Initialize Google Maps
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google || mapInstanceRef.current) return;

    setMapLoading(true);
    
    // Default location (Lima, Peru)
    const defaultLocation = { lat: -12.0464, lng: -77.0428 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
    });

    mapInstanceRef.current = map;

    // Create draggable marker
    const marker = new window.google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current = marker;

    // Add click listener to map
    map.addListener('click', (e: any) => {
      marker.setPosition(e.latLng);
      updateLocationFromCoords(e.latLng.lat(), e.latLng.lng());
    });

    // Add drag end listener to marker
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      updateLocationFromCoords(position.lat(), position.lng());
    });

    // Initialize autocomplete
    if (locationInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'pe' },
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          map.setCenter(location);
          marker.setPosition(location);
          updateLocationFromPlace(place);
        }
      });
    }

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

    // Reverse geocode to get address
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      try {
        const result = await geocoder.geocode({ location: { lat, lng } });
        if (result.results && result.results[0]) {
          const place = result.results[0];
          updateLocationFromPlace(place);
        }
      } catch (error) {
        console.error('Error geocoding:', error);
      }
    }
  };

  // Update location data from place result
  const updateLocationFromPlace = (place: any) => {
    const addressComponents = place.address_components || [];
    
    let city = '';
    let country = '';
    
    addressComponents.forEach((component: any) => {
      const types = component.types;
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        city = component.long_name;
      }
      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    setFormData(prev => ({
      ...prev,
      address: place.formatted_address || prev.address,
      city: city || prev.city,
      country: country || prev.country,
    }));
  };

  // Load Google Maps script when modal opens - with proper cleanup
  useEffect(() => {
    if (!isOpen) {
      // Cleanup map when modal closes
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
      setMapLoaded(false);
      return;
    }

    if (isOpen && !mapLoaded && !mapLoading) {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        // Avoid duplicate script injection
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = initMap;
          document.head.appendChild(script);
        } else {
          existingScript.addEventListener('load', initMap);
        }
      }
    }
  }, [isOpen, initMap, mapLoaded, mapLoading]);

  // Cleanup preview URLs and map on unmount
  useEffect(() => {
    return () => {
      // Full cleanup on unmount
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []); // empty deps - only on unmount

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
  <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Evento" size="md">
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto space-y-6 px-1">
      {/* Información Básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Información Básica
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Título del evento"
            maxLength={200}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
            placeholder="Describe tu evento..."
            maxLength={2000}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            label="Tipo de Evento"
            value={formData.eventType}
            options={EVENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
            onChange={(v) => handleInputChange('eventType', v)}
            required
          />
          <CustomSelect
            label="Visibilidad"
            value={formData.visibility}
            options={VISIBILITY_TYPES.map(t => ({ value: t.value, label: t.label }))}
            onChange={(v) => handleInputChange('visibility', v)}
            required
          />
        </div>
      </div>

      {/* Imágenes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Imágenes del Evento
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Máximo {MAX_IMAGES} imágenes. La primera será la portada.
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-brand text-white text-xs rounded">
                  Portada
                </span>
              )}
            </div>
          ))}
          
          {selectedImages.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-brand/10 transition-colors bg-gray-50 dark:bg-gray-800/50"
            >
              <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Agregar imagen</span>
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

      {/* Fechas y Horas - una debajo de otra en mobile */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Fechas</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha y Hora de Inicio <span className="text-red-500">*</span>
          </label>
          <input type="datetime-local" value={formData.startDateTime}
            onChange={(e) => handleInputChange('startDateTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white ${errors.startDateTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
          {errors.startDateTime && <p className="text-red-500 text-xs mt-1">{errors.startDateTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha y Hora de Fin</label>
          <input type="datetime-local" value={formData.endDateTime}
            onChange={(e) => handleInputChange('endDateTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white ${errors.endDateTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
          {errors.endDateTime && <p className="text-red-500 text-xs mt-1">{errors.endDateTime}</p>}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ubicación</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar ubicación
          </label>
          <input
            ref={locationInputRef}
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Escribe una dirección para buscar"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Google Map */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Haz clic en el mapa o arrastra el marcador para ajustar la ubicación exacta
          </p>
          <div
            key={isOpen ? 'map-open' : 'map-closed'}
            ref={mapRef}
            className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
            style={{ display: mapLoaded ? 'block' : 'none' }}
          ></div>
          {!mapLoaded && (
            <div className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Cargando mapa...</span>
              </div>
            </div>
          )}
        </div>

        {/* Dirección exacta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dirección exacta
            <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(se rellena al marcar en el mapa)</span>
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Calle, número, distrito, referencia..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Ciudad"
              maxLength={100}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">País</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="País"
              maxLength={100}
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>
      </div>

      {/* Configuración Adicional */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configuración Adicional</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Máximo de Asistentes
          </label>
          <input
            type="number"
            value={formData.maxAttendees}
            onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
              errors.maxAttendees ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Sin límite"
            min="1"
            max="10000"
          />
          {errors.maxAttendees && <p className="text-red-500 text-xs mt-1">{errors.maxAttendees}</p>}
        </div>
      </div>
      </div>

      {/* Botones */}  
      <div className="flex-none flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button type="button" onClick={onClose}
          className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          disabled={createEventMutation.isPending || uploadEventImagesMutation.isPending}>
          Cancelar
        </button>
        <button type="submit"
          className="flex-1 px-2 py-2 text-sm bg-blue-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={createEventMutation.isPending || uploadEventImagesMutation.isPending}>
          {createEventMutation.isPending || uploadEventImagesMutation.isPending ? (
            <div className="flex items-center justify-center gap-1"><div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin" /> {uploadEventImagesMutation.isPending ? 'Subiendo...' : 'Creando...'}</div>
          ) : 'Crear Evento'}
        </button>
      </div>
    </form>
  </Modal>
);
}
