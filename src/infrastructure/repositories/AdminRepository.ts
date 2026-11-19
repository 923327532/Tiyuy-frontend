/**
 * Admin Repository Implementation
 * HTTP adapter for admin module backend endpoints
 */

import { IAdminRepository } from '@/core/domain/repositories/IAdminRepository';
import { SupportSection } from './admin/SupportSection';

export class AdminRepository extends SupportSection implements IAdminRepository {}

// Export singleton instance
export const adminRepository = new AdminRepository();
