'use client';

import { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/presentation/store/toastStore';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Globe, Lock, User, Camera, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';

// Formatos de imagen permitidos
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Hooks para API - Mismos que usa el perfil de usuario
function useCurrentUser() {
  const { user: authUser, setUser } = useAuthStore();
  
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await axiosClient.get('/auth/me');
      const userData = response.data;
      if (userData) {
        setUser(userData);
      }
      return userData;
    },
    initialData: authUser,
    enabled: !!authUser,
  });
}

function useUserPreferences() {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const response = await axiosClient.get('/auth/preferences');
      return response.data;
    },
  });
}

function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosClient.patch('/auth/preferences', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

function useUploadProfilePhoto() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosClient.post('/auth/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (user && data?.avatar) {
        setUser({ ...user, photoUrl: data.avatar });
      }
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      console.error('Error uploading photo:', error);
    },
  });
}

function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await axiosClient.post('/auth/change-password', data);
      return response.data;
    },
  });
}

function useUpdateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const response = await axiosClient.patch('/auth/me', { email: newEmail });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: (error: any) => {
      console.error('Email update error:', error);
    },
  });
}

export default function AdminProfilePage() {
  const { user: authUser } = useAuthStore();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdatePreferences();
  const uploadPhoto = useUploadProfilePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = currentUser || authUser;

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [crmBackground, setCrmBackground] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [timezone, setTimezone] = useState('America/Lima');
  const [country, setCountry] = useState('Peru');
  const [city, setCity] = useState('Lima');

  useEffect(() => {
    if (preferences) {
      setTheme(preferences.theme || 'light');
      setCrmBackground(preferences.crmBackground || '#ffffff');
      setFontSize(preferences.fontSize || 'normal');
      setTimezone(preferences.timezone || 'America/Lima');
      setCountry(preferences.country || 'Peru');
      setCity(preferences.city || 'Lima');
    }
  }, [preferences]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({ new: false, confirm: false });
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [showFormatError, setShowFormatError] = useState(false);
  const [formatErrorFile, setFormatErrorFile] = useState<{ name: string; type: string } | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo antes de enviar
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);

    console.log('Validando archivo:', { name: file.name, type: file.type, extension: fileExtension, isValidType, isValidExtension });

    if (!isValidType || !isValidExtension) {
      console.log('Archivo rechazado - formato no permitido');
      setFormatErrorFile({ name: file.name, type: file.type || 'desconocido' });
      setShowFormatError(true);
      // Resetear el input
      e.target.value = '';
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      toast.error('El archivo excede el tamaño máximo de 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    uploadPhoto.mutate(file, {
      onSuccess: () => {
        setPreviewPhoto(null);
      },
      onError: () => {
        setPreviewPhoto(null);
      }
    });
  };

  const themeClasses = theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';
  const mainContentStyle = { backgroundColor: crmBackground };
  
  const changePassword = useChangePassword();
  const updateEmail = useUpdateEmail();

  const handleUpdateEmail = () => {
    if (!email || email === user?.email) {
      toast.error('Ingresa un email diferente al actual');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Ingresa un email valido');
      return;
    }
    updateEmail.mutate(email, {
      onSuccess: () => {
        setIsEditingEmail(false);
      }
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contrasenas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    changePassword.mutate({ currentPassword, newPassword }, {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  };

  const handleSavePreferences = () => {
    updatePreferences.mutate({
      theme, crmBackground, fontSize, timezone, country, city,
    });
  };

  const timezones = [
    { value: 'America/Lima', label: 'Lima (GMT-5)' },
    { value: 'America/Bogota', label: 'Bogota (GMT-5)' },
    { value: 'America/Mexico_City', label: 'Mexico City (GMT-6)' },
    { value: 'America/Santiago', label: 'Santiago (GMT-4/-3)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1/+2)' },
    { value: 'America/New_York', label: 'New York (GMT-5/-4)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)' },
  ];

  const crmColors = [
    { name: 'Blanco', value: '#ffffff', class: 'bg-white' },
    { name: 'Gris Claro', value: '#f8fafc', class: 'bg-slate-50' },
    { name: 'Verde Menta', value: '#ecfdf5', class: 'bg-emerald-50' },
    { name: 'Azul Cielo', value: '#eff6ff', class: 'bg-blue-50' },
    { name: 'Calido', value: '#fff7ed', class: 'bg-orange-50' },
    { name: 'Personalizado', value: 'custom', class: 'bg-gradient-to-br from-teal-400 to-emerald-500' },
  ];

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${themeClasses} ${fontSizeClass}`} style={mainContentStyle}>
        <main className="overflow-auto">
          {isLoadingUser && (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </div>
            </div>
          )}
          
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-4 sm:px-8 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mi Perfil</h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Gestiona tu cuenta y preferencias</p>
                </div>
                <button
                  onClick={handleSavePreferences}
                  disabled={updatePreferences.isPending}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm"
                >
                  { updatePreferences.isPending ? 'Guardando...' : 'Guardar Cambios' }
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Profile Photo and Identity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><User className="w-5 h-5" /> Identidad</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Photo */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <div className="relative shrink-0">
                    {previewPhoto ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-lg">
                        <img src={previewPhoto} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <UserAvatar size="xl" />
                    )}
                    {uploadPhoto.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadPhoto.isPending}
                      className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors border border-gray-200 disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload}/>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900">Foto de Perfil</h3>
                    <p className="text-sm text-gray-500 mb-3">JPG, PNG. Maximo 2MB.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadPhoto.isPending}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar Foto'}
                    </button>
                  </div>
                </div>

                {/* Verificacion de Identidad */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Verificacion
                    {user?.isVerified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Verificado</span>
                    )}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                      <label className="block text-xs text-gray-500 mb-1">Numero de Documento</label>
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">DNI</span>
                        <span className="font-semibold text-gray-900 truncate">{user?.dni || 'No disponible'}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Tu DNI esta vinculado a tu cuenta</p>
                    </div>
                    
                    <p className="text-xs text-gray-500">La verificacion de identidad mejora la confianza en tu cuenta.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Localizacion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe className="w-5 h-5" /> Ubicacion</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Zona Horaria */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Zona Horaria</h3>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Se usara para mostrar fechas y horas correctamente.</p>
                </div>

                {/* Pais y Ciudad */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Ubicacion</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Pais</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Ej: Peru"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Ciudad</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej: Lima"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Tu ubicacion ayuda a personalizar la experiencia.</p>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock className="w-5 h-5" /> Seguridad</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Datos de la Cuenta */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Datos de la Cuenta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
                      <input type="text" value={user?.firstName || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"/>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Apellido</label>
                      <input type="text" value={user?.lastName || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"/>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEditingEmail}
                        className={`w-full sm:flex-1 px-4 py-3 rounded-xl border outline-none transition-all ${
                          isEditingEmail 
                            ? 'border-teal-500 ring-2 ring-teal-200 bg-white' 
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                      {isEditingEmail ? (
                        <button
                          onClick={handleUpdateEmail}
                          disabled={updateEmail.isPending}
                          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                          {updateEmail.isPending ? '...' : 'Guardar'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cambiar
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">El email es tu identificador unico en Tiyuy.</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Rol</label>
                    <input type="text" value={user?.role || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 capitalize"/>
                  </div>
                </div>

                {/* Cambio de Contrasena */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Cambiar Contrasena</h3>
                  
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Contrasena Actual</label>
                    <div className="relative">
                      <input
                        type="password"
                        autoComplete="off"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Ingresa tu contrasena actual para verificar tu identidad"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Nueva Contrasena</label>
                    <div className="relative">
                      <input
                        type={visiblePasswords.new ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimo 6 caracteres"
                        className="w-full px-4 pr-12 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                      <button type="button" onClick={() => setVisiblePasswords((state) => ({ ...state, new: !state.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-teal-600" aria-label={visiblePasswords.new ? 'Ocultar contrasena' : 'Mostrar contrasena'}>
                        {visiblePasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Confirmar Contrasena</label>
                    <div className="relative">
                      <input
                        type={visiblePasswords.confirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite la nueva contrasena"
                        className="w-full px-4 pr-12 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                      <button type="button" onClick={() => setVisiblePasswords((state) => ({ ...state, confirm: !state.confirm }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-teal-600" aria-label={visiblePasswords.confirm ? 'Ocultar contrasena' : 'Mostrar contrasena'}>
                        {visiblePasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changePassword.isPending}
                    className="w-full py-3 bg-[var(--brand-primary)] text-white rounded-xl font-medium hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 transition-colors"
                  >
                    {changePassword.isPending ? 'Cargando...' : <><Lock className="w-4 h-4 inline mr-1" /> Cambiar Contrasena</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de error de formato de archivo */}
      {showFormatError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95">
            {/* Header con icono */}
            <div className="bg-red-50 px-6 py-5 flex items-center gap-3 border-b border-red-100">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Formato no permitido</h3>
                <p className="text-sm text-gray-500">Solo imágenes JPG, PNG y WEBP</p>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="px-6 py-5 space-y-3">
              {formatErrorFile && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Archivo</span>
                    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Rechazado
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{formatErrorFile!.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tipo detectado: <span className="font-mono text-gray-500">{formatErrorFile!.type}</span>
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Formatos aceptados</p>
                <div className="flex flex-wrap gap-2">
                  {['JPG', 'JPEG', 'PNG', 'WEBP'].map((fmt) => (
                    <span key={fmt} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
                      .{fmt.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-amber-50 rounded-lg p-3 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Selecciona una imagen en formato JPG, PNG o WEBP para continuar.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => {
                  setShowFormatError(false);
                  setFormatErrorFile(null);
                }}
                className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
