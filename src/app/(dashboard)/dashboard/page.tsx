'use client';

import { useState, useEffect, useRef } from 'react';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useAuthStore } from '@/presentation/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/presentation/store/toastStore';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Sun, Moon, Type, Globe, Lock, User, Camera, CheckCircle, Palette, MessageSquare, Users, Diamond, Home, Flame, Building, FolderGit, PlusCircle, SlidersHorizontal } from 'lucide-react';
import { UserAvatar } from '@/presentation/components/shared/UserAvatar';
import MyAgencySection from '@/presentation/components/profile/MyAgencySection';
import { useDashboardSidebar } from './layout';
import { useTheme } from '@/presentation/components/ThemeProvider';

// Hooks para API
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

function useVerifyIdentity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { documentType: 'DNI' | 'RUC'; documentNumber: string }) => {
      const endpoint = data.documentType === 'DNI' 
        ? '/identity/complete-kyc'
        : '/identity/upgrade-to-developer';
      
      const payload = data.documentType === 'DNI' 
        ? { dni: data.documentNumber }
        : { ruc: data.documentNumber };
      
      const response = await axiosClient.post(endpoint, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      console.error('Identity verification error:', error);
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
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const response = await axiosClient.patch('/auth/me', { email: newEmail });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: (error: any) => {
      console.error('Email update error:', error);
    },
  });
}

// Dropdown personalizado para zona horaria
function StyledTimezoneDropdown({ value, onChange, options }: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || 'Seleccionar...';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex items-center justify-between cursor-pointer transition-all"
      >
        <span>{selectedLabel}</span>
        <svg className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`w-full px-4 py-3 text-sm text-left transition-colors cursor-pointer flex items-center gap-3 ${
                value === opt.value
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-teal-50/50 hover:text-teal-700'
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                value === opt.value
                  ? 'border-teal-500 bg-teal-500'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)]'
              }`}>
                {value === opt.value && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user: authUser } = useAuthStore();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdatePreferences();
  const uploadPhoto = useUploadProfilePhoto();
  const verifyIdentity = useVerifyIdentity();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const user = currentUser || authUser;
  const [crmBackground, setCrmBackground] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [language, setLanguage] = useState<'es' | 'en' | 'pt' | 'fr'>('es');
  const [timezone, setTimezone] = useState('America/Lima');
  const [country, setCountry] = useState('Peru');
  const [city, setCity] = useState('Lima');
  const [documentType, setDocumentType] = useState<'DNI' | 'RUC'>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');

  useEffect(() => {
    if (preferences) {
      setCrmBackground(preferences.crmBackground || '#ffffff');
      setFontSize(preferences.fontSize || 'normal');
      
      const savedLang = localStorage.getItem('tiyuy-language');
      const validLangs: ('es' | 'en' | 'pt' | 'fr')[] = ['es', 'en', 'pt', 'fr'];
      
      if (savedLang && validLangs.includes(savedLang as any)) {
        setLanguage(savedLang as 'es' | 'en' | 'pt' | 'fr');
      } else {
        const backendLang = preferences.language || 'es';
        setLanguage(backendLang);
        localStorage.setItem('tiyuy-language', backendLang);
      }
      
      setTimezone(preferences.timezone || 'America/Lima');
      setCountry(preferences.country || 'Peru');
      setCity(preferences.city || 'Lima');
    }
  }, [preferences]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const userRole = (user?.role || 'USER').toString().toUpperCase().trim();
  const canViewCRM = ['AGENT', 'DEVELOPER', 'ADMIN', 'INMOBILIARIA'].includes(userRole);
  const isDeveloper = userRole === 'DEVELOPER';
  const isAgent = userRole === 'AGENT';

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
  };

  const themeClasses = theme === 'dark' ? 'dark' : '';
  const fontSizeClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';
  const mainContentStyle = theme === 'dark' 
    ? { backgroundColor: crmBackground === '#ffffff' ? '#0f172a' : crmBackground, color: '#f9fafb' }
    : { backgroundColor: crmBackground };

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

  const handleVerifyIdentity = () => {
    if (!documentNumber) {
      toast.error('Ingresa tu numero de documento');
      return;
    }
    verifyIdentity.mutate({ documentType, documentNumber });
  };

  const handleSavePreferences = () => {
    updatePreferences.mutate({
      theme, crmBackground, fontSize, language, timezone, country, city,
    });
  };

  const { sidebarOpen, setSidebarOpen, isMobile } = useDashboardSidebar();

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
      <div className={`${themeClasses} ${fontSizeClass} min-h-full transition-colors duration-300`} style={mainContentStyle}>
        {isLoadingUser && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Cargando...</span>
            </div>
          </div>
        )}
        
        {!isLoadingUser && (
          <div className="p-8 max-w-6xl mx-auto space-y-8 dark:text-white">
            {isMobile && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-3 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    title="Abrir menú"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Opciones del perfil</p>
                    <p className="text-xs text-[var(--text-secondary)]">Abre el menú de navegación desde aquí</p>
                  </div>
                </div>
              </div>
            )}
            {/* Profile Photo and Identity */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"><User className="w-5 h-5" /> Identidad</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {previewPhoto ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
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
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--bg-card)] rounded-full shadow-lg flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors border border-[var(--border-color)] disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload}/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">Foto de Perfil</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">JPG, PNG. Maximo 2MB.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadPhoto.isPending}
                      className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50"
                    >
                      {uploadPhoto.isPending ? 'Subiendo...' : 'Cambiar Foto'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Verificacion
                    {user?.isVerified && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">Verificado</span>
                    )}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-[var(--bg-tertiary)] px-4 py-3 rounded-xl border border-[var(--border-color)]">
                      <label className="block text-xs text-[var(--text-secondary)] mb-1">Numero de Documento</label>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 text-xs font-medium rounded">DNI</span>
                        <span className="font-semibold text-[var(--text-primary)]">{user?.dni || 'No disponible'}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-2">Tu DNI esta vinculado a tu cuenta</p>
                    </div>
                    
                    <p className="text-xs text-[var(--text-secondary)]">La verificacion de identidad mejora la confianza en tu cuenta.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mi Inmobiliaria - SOLO para AGENT */}
            {isAgent && !isDeveloper && (
              <MyAgencySection />
            )}

            {/* Proyectos y Desarrollos - SOLO para DEVELOPER */}
            {isDeveloper && (
              <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6 transition-colors">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                  <FolderGit className="w-5 h-5 text-[var(--text-secondary)]" /> 
                  Proyectos y Desarrollos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tarjeta: Mis Proyectos */}
                  <Link 
                    href="/my-projects" 
                    className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 border border-transparent rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-xl flex items-center justify-center">
                      <FolderGit className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">Mis Proyectos</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Desarrollos activos</p>
                    </div>
                    <span className="ml-auto text-green-600 dark:text-green-400 font-bold">→</span>
                  </Link>

                  {/* Tarjeta: Nuevo Proyecto */}
                  <Link 
                    href="/dashboard/projects/new" 
                    className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 border border-transparent rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/50 rounded-xl flex items-center justify-center">
                      <PlusCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">Nuevo Proyecto</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Crear desarrollo</p>
                    </div>
                    <span className="ml-auto text-purple-600 dark:text-purple-400 font-bold">→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Personalizacion Visual */}
            {canViewCRM && (
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"><Palette className="w-5 h-5" /> Personalizacion Visual</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Tema</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        theme === 'light' ? 'bg-teal-50 dark:bg-teal-900/30 border-2 border-teal-500' : 'bg-[var(--bg-tertiary)] border-2 border-transparent hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-orange-500" />
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)]">Claro</p>
                        <p className="text-xs text-[var(--text-secondary)]">Interfaz clara y luminosa</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        theme === 'dark' ? 'bg-teal-50 dark:bg-teal-900/30 border-2 border-teal-500' : 'bg-[var(--bg-tertiary)] border-2 border-transparent hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-indigo-500" />
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)]">Oscuro</p>
                        <p className="text-xs text-[var(--text-secondary)]">Interfaz oscura para reducir fatiga visual</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Color de Fondo CRM</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {crmColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCrmBackground(color.value)}
                        className={`aspect-square rounded-xl ${color.class} border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                          crmBackground === color.value ? 'border-teal-500 ring-2 ring-teal-200' : 'border-[var(--border-color)] hover:border-[var(--border-color)]'
                        }`}
                      >
                        {crmBackground === color.value && <span className="text-teal-600 text-lg">✓</span>}
                        <span className="text-xs text-[var(--text-secondary)] text-center leading-tight">{color.name}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="color"
                    value={crmBackground}
                    onChange={(e) => setCrmBackground(e.target.value)}
                    className="w-full mt-3 h-10 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Tamaño de Fuente</h3>
                  <div className="space-y-2">
                    {(['small', 'normal', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          fontSize === size ? 'bg-teal-50 dark:bg-teal-900/30 border-2 border-teal-500' : 'bg-[var(--bg-tertiary)] border-2 border-transparent hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        <span className={`${size === 'small' ? 'text-sm' : size === 'normal' ? 'text-base' : 'text-lg'} font-bold text-[var(--text-secondary)]`}>Aa</span>
                      <span className="font-medium text-[var(--text-primary)] capitalize flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        {size === 'small' ? 'Pequeno' : size === 'normal' ? 'Normal' : 'Grande'}
                      </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-3">Ajusta el tamaño del texto para mayor comodidad.</p>
                </div>
              </div>
            </div>
            )}

            {/* Localizacion */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"><Globe className="w-5 h-5" /> Ubicacion</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Zona Horaria</h3>
              <div className="space-y-4">
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] mb-1 block font-medium">Zona Horaria</label>
                      <StyledTimezoneDropdown
                        value={timezone}
                        onChange={setTimezone}
                        options={timezones}
                      />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Se usara para mostrar fechas y horas correctamente.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Ubicacion</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-[var(--text-secondary)] mb-1 block font-medium">Pais</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Ej: Peru"
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-[var(--text-secondary)] mb-1 block font-medium">Ciudad</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ej: Lima"
                          className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Tu ubicacion ayuda a personalizar la experiencia.</p>
                  </div>
                </div>
              </div>
            </div>



            {/* Seguridad */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-color)] p-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"><Lock className="w-5 h-5" /> Seguridad</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Datos de la Cuenta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] mb-1 block">Nombre</label>
                      <input type="text" value={user?.firstName || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"/>
                    </div>
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] mb-1 block">Apellido</label>
                      <input type="text" value={user?.lastName || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"/>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Email</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEditingEmail}
                        className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all ${
                          isEditingEmail 
                            ? 'border-teal-500 ring-2 ring-teal-200 bg-[var(--bg-card)] text-[var(--text-primary)]' 
                            : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        }`}
                      />
                      {isEditingEmail ? (
                        <button
                          onClick={handleUpdateEmail}
                          disabled={updateEmail.isPending}
                          className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                          {updateEmail.isPending ? '...' : 'Guardar'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          Cambiar
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">El email es tu identificador unico en Tiyuy.</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Rol</label>
                    <input type="text" value={user?.role || ''} readOnly className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] capitalize"/>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Cambiar Contrasena</h3>
                  
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Contrasena Actual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Ingresa tu contrasena actual"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Nueva Contrasena</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-1 block">Confirmar Contrasena</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite la nueva contrasena"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changePassword.isPending}
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    {changePassword.isPending ? 'Cargando...' : <><Lock className="w-4 h-4 inline mr-1" /> Cambiar Contrasena</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
