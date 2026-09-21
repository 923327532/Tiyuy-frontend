export type UserRole = 'USER' | 'AGENT' | 'DEVELOPER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';
export type ProfileType = UserRole;

export type AdminRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT';

export interface User {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dni: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  publishedPropertiesCount: number;
  createdAt: Date;
  // Campos del perfil extendido
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  photoUrl?: string;  // Foto de perfil desde el backend
  avatar?: string;  // Avatar URL (opcional)
  // Verificación de identidad
  isVerified?: boolean;
  // Tipo de documento del registro: PERU_DNI | INTERNATIONAL
  documentType?: 'PERU_DNI' | 'INTERNATIONAL';
  // Estado de verificación KYC: PENDING | VERIFIED | REJECTED | MANUAL_REVIEW
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
  // Fotos del KYC internacional (subidas a S3)
  documentImageUrl?: string;
  selfieImageUrl?: string;
}

// No necesitamos UserProfile separado, ya está incluido en User

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dni?: string;
  // Tipo de documento del registro: PERU_DNI (por defecto) | INTERNATIONAL
  documentType?: 'PERU_DNI' | 'INTERNATIONAL';
  // Datos del documento internacional (solo si documentType = 'INTERNATIONAL')
  issuingCountry?: string;
  internationalDocumentType?: 'PASSPORT' | 'NATIONAL_ID' | 'RESIDENCE_PERMIT';
  internationalDocumentNumber?: string;
  ruc?: string;
  fullName?: string;
  city?: string;
  address?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  // Tipo de documento del registro: PERU_DNI | INTERNATIONAL
  documentType?: 'PERU_DNI' | 'INTERNATIONAL';
  // Estado de verificación KYC: PENDING | VERIFIED | REJECTED | MANUAL_REVIEW
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW';
  // Admin specific fields (only present when role is ADMIN)
  adminRoleType?: AdminRoleType;
  permissions?: string[];
  departments?: string[];
  isActive?: boolean;
}

