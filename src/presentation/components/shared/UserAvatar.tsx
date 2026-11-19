'use client';

import { useState } from 'react';
import { useAuthStore } from '@/presentation/store/authStore';

interface UserAvatarProps {
  user?: {
    photoUrl?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
  '2xl': 'w-32 h-32 text-4xl',
};

export function UserAvatar({ 
  user: propUser, 
  size = 'md', 
  className = '',
  fallback = 'U'
}: UserAvatarProps) {
  const { user: authUser } = useAuthStore();
  const user = propUser || authUser;
  const [imgError, setImgError] = useState(false);
  
  const photoUrl = user?.photoUrl;
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return fallback;
  };

  const baseClasses = `rounded-full flex items-center justify-center font-semibold overflow-hidden bg-[#1e4a57] text-white ${sizeClasses[size]}`;
  
  if (photoUrl && !imgError) {
    return (
      <img 
        src={photoUrl} 
        alt={`${firstName} ${lastName}`}
        className={`${baseClasses} object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {getInitials()}
    </div>
  );
}
