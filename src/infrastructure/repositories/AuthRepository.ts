import { publicApiClient, axiosClient } from '../api/axios-client';
import { AUTH_ENDPOINTS, ENDPOINTS } from '../api/endpoints';
import { IAuthRepository } from '@/core/domain/repositories';
import { User, AuthResponse, RegisterData } from '@/core/domain/entities';

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Usamos publicApiClient para login porque axiosClient tiene un interceptor
      // que bloquea la petición si hay un token expirado en localStorage
      const response = await publicApiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (error.code === 'ERR_NETWORK') {
        throw new Error('No se puede conectar con el servidor. Verifica tu conexión a internet o intenta más tarde.');
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('El servidor no está disponible en este momento. Por favor, intenta más tarde.');
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor no responde. Tiempo de espera agotado. Intenta nuevamente.');
      }

      if (error.code === 'ERR_BAD_RESPONSE' || error.message?.includes('5xx')) {
        throw new Error('Error interno del servidor. Estamos trabajando para solucionarlo.');
      }
      
      if (status === 401) {
        if (data?.message?.toLowerCase().includes('contraseña') || data?.message?.toLowerCase().includes('password')) {
          throw new Error('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        } else if (data?.message?.toLowerCase().includes('correo') || data?.message?.toLowerCase().includes('email')) {
          throw new Error('El correo electrónico no está registrado.');
        } else {
          throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      }
      
      if (status === 403) {
        throw new Error('Tu cuenta está suspendida. Contacta con soporte.');
      }
      
      if (status === 429) {
        throw new Error('Demasiados intentos. Espera un momento y vuelve a intentar.');
      }
      
      if (!status) {
        throw new Error('Error de conexión. El servidor no está disponible, intenta más tarde.');
      }
      
      throw new Error(data?.message || 'Error al iniciar sesión. Inténtalo nuevamente.');
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // Usamos publicApiClient para registro (sin token JWT) igual que en login
      // axiosClient tiene un interceptor que puede bloquear si hay un token expirado en localStorage
      const response = await publicApiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.REGISTER,
        registerData
      );
      return response.data;
    } catch (error: any) {
      // Extraer mensaje y código del backend
      const data = error.response?.data;
      const status = error.response?.status;

      // Manejar error 409 - Conflictos de datos duplicados
      if (status === 409) {
        // Intentar extraer el mensaje del backend (viene en data.message)
        if (data?.message) {
          // Agregar contexto amigable según el código de error
          const code = data?.code || '';
          let friendlyMessage = data.message;
          
          if (code === 'EMAIL_ALREADY_EXISTS') {
            friendlyMessage = 'Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?';
          } else if (code === 'PHONE_ALREADY_EXISTS') {
            friendlyMessage = 'Este número de teléfono ya está registrado en otra cuenta.';
          } else if (code === 'DNI_ALREADY_EXISTS') {
            friendlyMessage = 'Este DNI ya está registrado en otra cuenta.';
          } else if (code === 'RUC_ALREADY_EXISTS') {
            friendlyMessage = 'Este RUC ya está registrado en otra cuenta.';
          }
          
          throw new Error(friendlyMessage);
        }
        throw new Error('Estos datos ya están registrados. Verifica tus datos o inicia sesión.');
      }

      // Manejar error 400 - Validación
      if (status === 400) {
        if (data?.message) {
          throw new Error(data.message);
        }
        throw new Error('Datos inválidos. Revisa todos los campos.');
      }

      // Manejar diferentes tipos de respuesta del backend
      if (data) {
        if (typeof data === 'string') throw new Error(data);
        if (data.message) throw new Error(data.message);
        if (data.error) throw new Error(data.error);
        if (Array.isArray(data)) throw new Error(data.join(', '));
      }

      // Error de red
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor no responde. Intenta nuevamente.');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Error de conexión. Verifica tu internet.');
      }
      
      throw new Error('Error al registrar. Intenta nuevamente.');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axiosClient.put<User>(AUTH_ENDPOINTS.UPDATE_PROFILE, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  }

  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await axiosClient.get<User>(AUTH_ENDPOINTS.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  }

  async checkGoogleEmailExists(email: string): Promise<{ exists: boolean }> {
    try {
      const response = await axiosClient.post<{ exists: boolean }>(AUTH_ENDPOINTS.GOOGLE_CHECK_EMAIL, { email });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 404) {
        return { exists: false };
      }
      throw new Error('Error al verificar email con Google');
    }
  }

  async getAdminProfile(): Promise<{ adminRoleType: string; permissions: string[]; departments: string[]; isActive: boolean }> {
    try {
      const response = await axiosClient.get(ENDPOINTS.AUTH.ADMIN_PROFILE);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching admin profile:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener perfil de administrador');
    }
  }

  async loginWithGoogle(email: string, firstName: string, lastName: string, uid: string): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post<AuthResponse>(AUTH_ENDPOINTS.GOOGLE_LOGIN, {
        email,
        firstName,
        lastName,
        uid,
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      
      if (status === 401) {
        throw new Error(data?.message || 'No se pudo autenticar con Google. Por favor, usa tu correo y contraseña o regístrate.');
      }
      
      if (status === 404) {
        throw new Error(data?.message || 'Usuario no encontrado. Por favor, usa tu correo y contraseña o regístrate.');
      }
      
      throw new Error(data?.message || 'Error al iniciar sesión con Google');
    }
  }
}
