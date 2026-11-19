 'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { AuthRepository } from '@/infrastructure/repositories';
import { LoginUseCase } from '@/core/domain/use-cases/auth/Login';
import { RegisterUseCase } from '@/core/domain/use-cases/auth/Register';
import { authStorage } from '@/infrastructure/storage';
import { User, AuthResponse, RegisterData } from '@/core/domain/entities';
import { emailService } from '@/services/emailService';

const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, logout: logoutStore, setLoading, setError, clearError } = useAuthStore();
  const { user, token, isAuthenticated, isLoading: storeLoading, error: storeError } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();

      const response: AuthResponse = await loginUseCase.execute(email, password);

      // Crear User desde AuthResponse del backend
      const userData: User = {
        id: response.userId,
        email: response.email,
        phone: '',
        firstName: response.firstName,
        lastName: response.lastName,
        dni: '',
        role: response.role,
        emailVerified: false,
        phoneVerified: false,
        publishedPropertiesCount: 0,
        createdAt: new Date(),
        documentType: response.documentType,
        verificationStatus: response.verificationStatus,
      };

      // Extract admin data if present
      const adminData = response.adminRoleType ? {
        adminRoleType: response.adminRoleType,
        permissions: response.permissions,
        departments: response.departments,
        isActive: response.isActive,
      } : undefined;

      authStorage.setToken(response.token);
      authStorage.setUser(userData);
      setAuth(response.token, userData, adminData);

      // Determine target route but DO NOT navigate here; let the caller handle navigation.
      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
      const isAdminUser = response.adminRoleType !== undefined || adminRoles.includes(response.role);
      const targetRoute = isAdminUser ? '/admin' : '/';

      return { success: true, targetRoute } as const;
    } catch (err: any) {
      const message = err?.message || 'Error al iniciar sesion';
      setError(message);
      return { success: false, message } as const;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      setLoading(true);
      clearError();

      const response: AuthResponse = await authRepository.register(registerData);

      // Crear User desde AuthResponse
      const userData: User = {
        id: response.userId,
        email: response.email,
        phone: registerData.phone || '',
        firstName: response.firstName,
        lastName: response.lastName,
        dni: registerData.dni ?? '',
        role: response.role,
        emailVerified: false,
        phoneVerified: false,
        publishedPropertiesCount: 0,
        createdAt: new Date(),
        documentType: response.documentType,
        verificationStatus: response.verificationStatus,
      };

      authStorage.setToken(response.token);
      authStorage.setUser(userData);
      setAuth(response.token, userData);

      // Enviar email de bienvenida
      try {
        await emailService.sendWelcomeEmail({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          role: response.role
        });
      } catch (emailError) {
        // No fallamos el registro si el email no se envía
      }

      // Redirigir a la pantalla principal después del registro
      const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'];
      const targetRoute = adminRoles.includes(response.role) ? '/admin' : '/';
      // Un usuario internacional primero sube su documento + selfie para revisión
      if (registerData.documentType === 'INTERNATIONAL') {
        router.push('/kyc-internacional');
        return;
      }
      router.push(targetRoute);
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      // No relanzamos el error para evitar que burbujee y cause crash
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      clearError();

      const updatedUser: User = await authRepository.updateProfile(userData);
      
      // Actualizar el usuario en el store y localStorage
      setAuth(token!, updatedUser);
      authStorage.setUser(updatedUser);

      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authStorage.clear();
    logoutStore();
    router.push('/login');
  };

  const checkAuth = async () => {
    const savedToken = authStorage.getToken();
    const savedUser = authStorage.getUser();

    if (savedToken && savedUser) {
      setAuth(savedToken, savedUser as User);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login,
    register,
    updateProfile,
    logout,
    checkAuth,
    clearError,
  };
};
