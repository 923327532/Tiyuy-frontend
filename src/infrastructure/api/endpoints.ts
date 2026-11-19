export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/update-profile',
    GOOGLE_CHECK_EMAIL: '/auth/google-check-email',
    GOOGLE_LOGIN: '/auth/google-login',
    ADMIN_PROFILE: '/admin/admins/me/profile',
  },
  
  KYC: {  // ← Cambiado de KYC_ENDPOINTS a KYC (nested)
    VALIDATE_DNI: '/identity/validate-dni',
    VALIDATE_RUC: '/identity/validate-ruc',
    COMPLETE_KYC: '/identity/complete-kyc',
    UPGRADE_DEVELOPER: '/identity/upgrade-to-developer',
  },

  PROPERTIES: {
    BASE: '/properties',
    SEARCH: '/properties/search',
    BY_SLUG: (slug: string) => `/properties/slug/${slug}`,
    MY_PROPERTIES: '/properties/my-properties',
    PUBLISH: (id: number) => `/properties/${id}/publish`,
    UNPUBLISH: (id: number) => `/properties/${id}/unpublish`,
    FEATURE: (id: number) => `/properties/${id}/feature`,
    PHOTOS: (propertyId: number) => `/properties/${propertyId}/photos`,
    DELETE_PHOTO: (mediaId: number) => `/properties/photos/${mediaId}`,
  },

  PROJECTS: {
    BASE: '/projects',
    FULL: (id: number) => `/projects/${id}/full`,
    SEARCH: '/projects/search',
  },

  FAVORITES: {
    BASE: '/favorites',
    TOGGLE: (propertyId: number) => `/favorites/properties/${propertyId}`,
    CHECK: (propertyId: number) => `/favorites/check/${propertyId}`,
    CHECK_MULTIPLE: '/favorites/check-multiple',
    COUNT: '/favorites/count',
  },

  FINANCE: {
    WALLET: '/finance/wallet',
    TRANSACTIONS: '/finance/wallet/transactions',
    SUBSCRIPTIONS: {
      PLANS: '/finance/subscriptions/plans',
      ACTIVE: '/finance/subscriptions/active',
      FREE_PLAN_USED: '/finance/subscriptions/free-plan-used',
      SUBSCRIBE: '/finance/subscriptions/subscribe',
      ACTIVATE_AFTER_PAYMENT: '/finance/subscriptions/activate-after-payment',
      MERCADOPAGO_PREFERENCE: '/finance/mercadopago/create-preference',
      HISTORY: '/finance/subscriptions/history',
    },
    ADD_CREDITS: '/finance/wallet/add-credits',
  },

  ANALYTICS: {
    TRACK: (propertyId: number) => `/analytics/track/properties/${propertyId}`,
    PROPERTY_STATS: (propertyId: number) => `/analytics/properties/${propertyId}/stats`,
  },

  CONTACTS: {
    CONTACT_PROPERTY: (propertyId: number) => `/contacts/properties/${propertyId}`,
    RECEIVED: '/contacts/received',
    SENT: '/contacts/sent',
    UNREAD_COUNT: '/contacts/unread-count',
    MARK_READ: (contactId: number) => `/contacts/${contactId}/read`,
  },

  PAYMENTS: {
    MERCADOPAGO: '/payments/mercadopago',
    MY_PAYMENTS: '/payments/my-payments',
    TOTAL_PAID: '/payments/stats/total-paid',
    BY_ID: (paymentId: number) => `/payments/${paymentId}`,
    HEALTH: '/payments/health',
  },
} as const;

// Helpers para compatibilidad
export const AUTH_ENDPOINTS = ENDPOINTS.AUTH;
export const KYC_ENDPOINTS = ENDPOINTS.KYC;
