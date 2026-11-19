'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { VerifiedMark } from './VerifiedMark';

interface UserContactInfoProps {
  user: {
    email: string;
    emailVerified: boolean;
    phone?: string | null;
    phoneVerified: boolean;
    district?: string | null;
    city?: string | null;
    country?: string | null;
  };
}

export function UserContactInfo({ user }: UserContactInfoProps) {
  const location = [
    user.district,
    user.city,
    user.country,
  ].filter(Boolean).join(', ') || 'Ubicación no disponible';

  return (
    <dl className="mt-3 space-y-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <dt className="sr-only">Correo electrónico</dt>
        <dd className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate text-xs text-slate-600" title={user.email}>
            {user.email}
          </span>
          <VerifiedMark verified={Boolean(user.emailVerified)} />
        </dd>
      </div>

      <div className="flex min-w-0 items-center gap-2.5">
        <Phone className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <dt className="sr-only">Teléfono</dt>
        <dd className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate text-xs text-slate-600">
            {user.phone || 'Sin teléfono'}
          </span>
          {user.phone && <VerifiedMark verified={Boolean(user.phoneVerified)} />}
        </dd>
      </div>

      {location && (
        <div className="flex min-w-0 items-center gap-2.5">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <dt className="sr-only">Ubicación</dt>
          <dd className="truncate text-xs text-slate-600" title={location}>
            {location}
          </dd>
        </div>
      )}
    </dl>
  );
}
