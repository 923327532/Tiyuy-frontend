# 🏠 Tiyuy - Plataforma Inmobiliaria Peruana

**Tiyuy** es una plataforma inmobiliaria peruana construida con **Next.js 16** (App Router) que conecta compradores, vendedores, arrendatarios y profesionales del sector inmobiliario. Sigue una **Arquitectura Hexagonal** (Clean Architecture) con separación clara entre las capas de dominio, aplicación, infraestructura y presentación.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Módulos del Sistema](#-módulos-del-sistema)
  - [1. Autenticación y Cuentas](#1-autenticación-y-cuentas)
  - [2. Propiedades](#2-propiedades)
  - [3. Proyectos Inmobiliarios](#3-proyectos-inmobiliarios)
  - [4. Búsqueda y Filtros](#4-búsqueda-y-filtros)
  - [5. Mapas Interactivos](#5-mapas-interactivos)
  - [6. Perfiles de Usuario](#6-perfiles-de-usuario)
  - [7. Favoritos](#7-favoritos)
  - [8. Mensajería y Contactos](#8-mensajería-y-contactos)
  - [9. Planes y Suscripciones](#9-planes-y-suscripciones)
  - [10. Pagos y Finanzas](#10-pagos-y-finanzas)
  - [11. KYC / Verificación de Identidad](#11-kyc--verificación-de-identidad)
  - [12. CRM de Clientes](#12-crm-de-clientes)
  - [13. Blog y Contenido](#13-blog-y-contenido)
  - [14. Notificaciones](#14-notificaciones)
  - [15. Onboarding](#15-onboarding)
  - [16. Agencias y Corredores](#16-agencias-y-corredores)
  - [17. Market Radar / Analytics](#17-market-radar--analytics)
  - [18. Libro de Reclamaciones](#18-libro-de-reclamaciones)
  - [19. Páginas Institucionales](#19-páginas-institucionales)
  - [20. Campañas de Marketing](#20-campañas-de-marketing)
  - [21. Servicios Complementarios](#21-servicios-complementarios)
  - [22. Moderación y Reportes](#22-moderación-y-reportes)
  - [23. Soporte y Contacto](#23-soporte-y-contacto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Guía de Inicio Rápido](#-guía-de-inicio-rápido)

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.1.6 | Framework principal (App Router) |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | ^5 | Tipado estático |
| **Tailwind CSS** | 3.4.19 | Estilos utilitarios |
| **Zustand** | ^5.0.11 | Estado global |
| **TanStack React Query** | ^5.90.20 | Data fetching y caché |
| **Zod** | ^4.3.6 | Validación de esquemas |
| **Axios** | ^1.13.4 | HTTP Client |
| **Firebase** | ^12.12.1 | Autenticación y notificaciones push |
| **Leaflet** | ^1.9.4 | Mapas interactivos |
| **Recharts / Chart.js** | - | Gráficos y analytics |
| **React Hot Toast / Sonner** | - | Notificaciones toast |
| **Lucide React / Iconify** | - | Iconografía |
| **next-themes** | ^0.4.6 | Modo oscuro/claro |
| **date-fns** | ^4.1.0 | Manejo de fechas |
| **jsPDF** | ^4.2.0 | Generación de PDFs |

---

## 📦 Módulos del Sistema

### 1. Autenticación y Cuentas

Módulo completo de gestión de usuarios con registro, inicio de sesión, recuperación de contraseña y selector de perfiles.

**Rutas:**
- `/login` — Inicio de sesión
- `/register` — Registro de nuevos usuarios
- `/recover-password` — Recuperación de contraseña
- `/reset-password` — Restablecimiento de contraseña
- `/profile-selector` — Selección de perfil (comprador, vendedor, agente, etc.)

**Componentes:**
- `LoginForm/` — Formulario de inicio de sesión con soporte para Google Auth
- `RegisterForm/` — Formulario de registro con validación
- `ForgotPasswordForm/` — Formulario de recuperación
- `ResetPasswordForm/` — Formulario de restablecimiento
- `ProfileSelector/` — Selector de tipo de perfil
- `ProtectedRoute/` — Guard de rutas protegidas

**Hooks:** `useAuth`, `useGoogleAuth`, `useForgotPassword`

**Entidades:** `User.ts` — Roles: `buyer`, `seller`, `agent`, `developer`, `real_estate`

---

### 2. Propiedades

Módulo principal para la gestión y visualización de propiedades inmobiliarias (venta y alquiler).

**Rutas:**
- `/properties` — Listado de propiedades en venta
- `/property/[slug]` — Detalle de propiedad
- `/rent` — Listado de propiedades en alquiler
- `/sale` — Listado de propiedades en venta
- `/my-properties` — Gestión de propiedades propias (dashboard)

**Componentes:**
- `PropertyCard/` — Tarjeta de propiedad para listados
- `PropertyDetail/` — Vista detallada de propiedad con galería, mapa, contacto
- `PropertyFilters/` — Filtros avanzados (precio, tipo, ubicación, área, etc.)
- `PropertyForm/` — Formulario de creación/edición de propiedades
- `PropertyGallery/` — Galería de imágenes
- `PropertyImages/` — Gestor de imágenes
- `PropertyGrid/` — Grid de propiedades
- `FeaturedProperties/` — Propiedades destacadas
- `FilteredProperties/` — Resultados de búsqueda filtrados
- `SEOContent/` — Contenido SEO para páginas de propiedades
- `SimilarProperties/` — Propiedades similares
- `PersonalizedRecommendations/` — Recomendaciones personalizadas
- `TrackPropertyView/` — Seguimiento de vistas

**Tipos de propiedad:** `Departamento`, `Casa`, `Terreno`, `Oficina`, `Local Comercial`, `Habitación`

**Tipos de transacción:** `Venta`, `Alquiler`

**Monedas:** `Soles (PEN)`, `Dólares (USD)`

**Hooks:** `useProperties`, `useFilteredProperties`, `useFeaturedProperties`, `usePropertyMap`

---

### 3. Proyectos Inmobiliarios

Módulo para la gestión de proyectos de construcción y desarrollo inmobiliario.

**Rutas:**
- `/projects` — Listado de proyectos
- `/my-projects` — Gestión de proyectos propios (dashboard)

**Componentes:**
- `ProjectCard/` — Tarjeta de proyecto
- `ProjectDetail/` — Vista detallada con unidades, multimedia, planos
- `ProjectFilters/` — Filtros por fase, tipo, ubicación
- `FeaturedProjects/` — Proyectos destacados
- `ProjectComments/` — Sección de comentarios
- `ProjectMultimediaStep/` — Gestión multimedia del proyecto
- `SimilarProjects/` — Proyectos similares

**Fases del proyecto:** `Preventa`, `En Construcción`, `Acabados`, `Listo para Entrega`, `Entregado`, `Agotado`, `Banco de Terrenos`, `Pre-Lotización`, `Habilitación Urbana`, `Lotización`, `Registro de Propiedad`, `Completado`

**Tipos de proyecto:** `Industrial`, `Comercial`, `Uso Mixto`, `Residencial`, `Lotización`, `Subdivisión de Terrenos`

**Tipos de unidad:** `Departamento`, `Dúplex`, `Penthouse`, `Oficina`, `Local Comercial`, `Almacén`

**Hooks:** `useProjects`, `useFeaturedProjects`, `useProjectMap`

---

### 4. Búsqueda y Filtros

Sistema de búsqueda avanzada con filtros dinámicos y autocompletado de ubicaciones.

**Componentes:**
- `LocationSearch/` — Búsqueda por ubicación con Google Places
- `PropertyFilters/` — Filtros combinados de propiedades
- `ProjectFilters/` — Filtros combinados de proyectos
- `FilterDropdown/` — Dropdown genérico para filtros

**Hooks:** `useLocationSearch`, `useGooglePlaces`, `useFilteredProperties`

**Servicios:** Google Places API para autocompletado de direcciones

---

### 5. Mapas Interactivos

Visualización geográfica de propiedades y proyectos con clustering de marcadores.

**Componentes:**
- `Map/` — Componente base de mapa (Leaflet)
- `PropertyMapView/` — Mapa de propiedades con clustering
- `PropertyMapCard/` — Card informativa en el mapa
- `PropertyMapModal/` — Modal de detalle en mapa
- `PropertyMapSidebar/` — Sidebar con listado en vista mapa
- `ProjectMapView/` — Mapa de proyectos
- `ProjectMapCard/` — Card de proyecto en mapa
- `ProjectMapModal/` — Modal de proyecto en mapa
- `ProjectMapSidebar/` — Sidebar con listado en vista mapa

**Stores:** `propertyMapStore`, `projectMapStore`, `mapViewStore`

**Hooks:** `useMapView`, `usePropertyMap`, `useProjectMap`

**Librerías:** `Leaflet`, `react-leaflet`, `react-leaflet-cluster`, `leaflet.markercluster`

---

### 6. Perfiles de Usuario

Gestión de perfiles personales y profesionales según el rol del usuario.

**Rutas:**
- `/dashboard` — Panel principal del usuario
- `/dashboard/agent` — Panel de agente inmobiliario
- `/dashboard/real-estate` — Panel de inmobiliaria
- `/dashboard/preferences` — Preferencias del usuario

**Componentes:**
- `ProfileHeader/` — Cabecera del perfil con foto, nombre, badge
- `ProfileTabs/` — Tabs de navegación del perfil
- `PersonalInfoTab/` — Información personal
- `SecurityTab/` — Configuración de seguridad
- `FavoritesTab/` — Favoritos guardados
- `HistoryTab/` — Historial de actividad
- `PlansTab/` — Plan de suscripción actual
- `MyAgencySection/` — Sección de agencia
- `SearchAgencyModal/` — Búsqueda de agencias
- `ProfileMenu/` — Menú desplegable del perfil

**Hooks:** `useProfile`, `useAgent`, `useDeveloper`

**Entidades:** `Profile.ts`, `User.ts`

---

### 7. Favoritos

Sistema de marcado de propiedades y proyectos favoritos con notas personalizadas.

**Componentes:**
- `FavoriteButton/` — Botón de favorito (corazón)

**Store:** `favoriteStore`

**Hooks:** `useFavorites`

**Entidades:** `Favorite.ts`

**Límite:** 500 caracteres por nota de favorito

---

### 8. Mensajería y Contactos

Sistema de mensajería en tiempo real con canales, grupos, estados y búsqueda de contactos.

**Rutas:**
- `/mensajes` — Centro de mensajería
- `/mensajes/channels` — Canales de mensajería
- `/mensajes/chats` — Chats individuales
- `/mensajes/contactos` — Gestión de contactos
- `/mensajes/groups` — Grupos de mensajería
- `/mensajes/states` — Estados/Historias

**Componentes:**
- `DirectChatSearch/` — Búsqueda directa de chats
- `MessageInput/` — Input de mensajes con emojis
- `EmojiSelector/` — Selector de emojis
- `StatusInput/` — Input para estados
- `StatusPostsWithContact/` — Publicaciones de estado con contacto
- `PropertySearchAndContact/` — Búsqueda de propiedades y contacto
- `MessageLifetimeSelector/` — Selector de tiempo de vida de mensajes
- `TextStyleSelector/` — Selector de estilos de texto

**Hooks:** `useChannels`, `useGroups`, `useContacts`, `useTiyuyContacts`, `useDirectChatSearch`, `useChatReactions`, `useMessageLifetimes`, `useTextStyles`, `useWebSocket`

**Entidades:** `Channel.ts`, `Group.ts`, `GroupPost.ts`, `Contact.ts`

---

### 9. Planes y Suscripciones

Gestión de planes de suscripción con diferentes niveles de funcionalidades.

**Rutas:**
- `/dashboard/plans` — Planes disponibles
- `/dashboard/trial-expired` — Período de prueba expirado

**Planes disponibles:**

| Plan | Precio | Publicaciones | Características |
|---|---|---|---|
| **Básico** | Gratis | Hasta 3 | Búsqueda básica, contacto directo, soporte email |
| **Profesional** | $99/mes | Hasta 15 | Búsqueda avanzada, destacado, estadísticas, badge verificado, soporte prioritario |
| **Empresarial** | $299/mes | Ilimitadas | Búsqueda premium, analytics completo, API access, soporte 24/7, marca personalizada, multi-usuario |

**Componentes:**
- `PlanCard/` — Tarjeta de plan con características
- `PlanBadge/` — Badge indicador de plan
- `UpgradePlanModal/` — Modal de upgrade
- `PlanExpiredModal/` — Modal de plan expirado
- `ActiveSubscriptionModal/` — Modal de suscripción activa
- `InvalidUpgradeModal/` — Modal de upgrade inválido

**Hooks:** `usePermissions`

**Entidades:** `Wallet.ts`

---

### 10. Pagos y Finanzas

Módulo de procesamiento de pagos y gestión de billetera virtual.

**Rutas:**
- `/dashboard/payments` — Historial de pagos
- `/dashboard/wallet` — Billetera virtual

**Componentes:**
- `PaymentForm/` — Formulario de pago
- `PaymentSuccess/` — Confirmación de pago exitoso

**Hooks:** `usePayments`, `useFinance`

**Entidades:** `Wallet.ts`

**Use Cases:**
- `GetWalletBalance` — Consultar saldo
- `GetWalletTransactions` — Historial de transacciones
- `SubscribeToPlan` — Suscripción a plan

---

### 11. KYC / Verificación de Identidad

Proceso de verificación de identidad (Know Your Customer) con validación de DNI y RUC.

**Componentes:**
- `DniInput/` — Validación de DNI
- `RucInput/` — Validación de RUC

**Hooks:** `useKyc`, `useIdentity`, `useUserValidation`

**Store:** `kycStore`, `identityStore`

**Entidades:** `KycVerification.ts`, `ValidateDni.ts`

**Use Cases:**
- `CompleteKyc` — Completar verificación
- `UpgradeToDeveloper` — Upgrade a perfil desarrollador
- `ValidateDni` — Validar DNI

---

### 12. CRM de Clientes

Sistema de gestión de relaciones con clientes para agentes e inmobiliarias.

**Hooks:** `useCRM`, `useCRMInteraction`, `useAgentCRM`, `useClientCRM`, `useLeads`, `useAgentClients`

**Entidades:** `CRM.ts`, `Client.ts`

**Use Cases:**
- `CreateLead` — Crear lead
- `CreateRating` — Calificar interacción
- `GetMyLeads` — Obtener mis leads

---

### 13. Blog y Contenido

Módulo de publicación de contenido editorial y noticias del sector inmobiliario.

**Rutas:**
- `/blog` — Listado de artículos del blog
- `/noticias` — Noticias del sector inmobiliario
- `/tips-decoracion` — Tips de decoración
- `/guia-alquiler` — Guía de alquiler

**Componentes:**
- `BlogPosts/` — Listado y tarjetas de artículos

---

### 14. Notificaciones

Sistema de notificaciones en tiempo real con soporte para notificaciones push.

**Componentes:**
- `UnifiedNotificationsPanel/` — Panel unificado de notificaciones
- `EventNotificationsPanel/` — Panel de notificaciones de eventos
- `NotificationList/` — Lista de notificaciones
- `NotificationPreferences/` — Preferencias de notificación
- `PushNotificationToggle/` — Toggle de notificaciones push

**Hooks:** `useNotifications`, `useUnifiedNotifications`, `useEventNotifications`

**Entidades:** `Notification.ts`

---

### 15. Onboarding

Flujo guiado de incorporación para nuevos usuarios.

**Componentes:**
- `OnboardingStepper/` — Stepper de progreso
- `WelcomeScreen/` — Pantalla de bienvenida
- `ConfigScreen/` — Configuración inicial
- `KycScreen/` — Verificación de identidad

**Store:** `onboardingStore`

**Hooks:** `useOnboarding`

---

### 16. Agencias y Corredores

Directorio de agencias inmobiliarias y corredores con perfiles públicos.

**Rutas:**
- `/agencies` — Listado de agencias
- `/agencies/[slug]` — Detalle de agencia
- `/agents` — Listado de agentes/corredores
- `/agents/[slug]` — Perfil público de agente
- `/inmobiliarias` — Sección de inmobiliarias
- `/corredores` — Sección de corredores

**Hooks:** `useAgent`

**Entidades:** `Agent.ts`, `AgentDiscount.ts`

---

### 17. Market Radar / Analytics

Panel de análisis de mercado inmobiliario con datos y estadísticas.

**Rutas:**
- `/market-radar` — Radar de mercado
- `/price-per-m2` — Precio por metro cuadrado

**Componentes:**
- `PropertyChart/` — Gráficos de propiedades
- `StatsCard/` — Tarjetas de estadísticas

**Hooks:** `useAnalytics`

**Entidades:** `Analytics.ts`

---

### 18. Libro de Reclamaciones

Módulo de libro de reclamaciones (INDECOPI - Perú) para cumplimiento normativo.

**Ruta:** `/libro-de-reclamaciones`

**Tipos de reclamo:** `Reclamo`, `Queja`

**Tipos de bien:** `Producto`, `Servicio`

**Estados:** `Pendiente`, `En Revisión`, `Respondido`, `Cerrado`

---

### 19. Páginas Institucionales

Páginas informativas y legales de la plataforma.

**Rutas:**
- `/about-tiyuy` — Acerca de Tiyuy
- `/terms` — Términos y condiciones
- `/privacy` — Política de privacidad
- `/seguridad` — Seguridad
- `/cancelacion` — Política de cancelación
- `/antidiscriminacion` — Política antidiscriminación
- `/discapacidad` — Información sobre discapacidad
- `/impacto-comunitario` — Impacto comunitario
- `/inversores` — Información para inversores
- `/trabaja-con-nosotros` — Trabaja con nosotros

---

### 20. Campañas de Marketing

Módulo de campañas publicitarias y banners promocionales.

**Rutas:**
- `/campaigns` — Campañas de marketing

**Componentes:**
- `BannerCard/` — Tarjeta de banner publicitario
- `CampaignCard/` — Tarjeta de campaña
- `FeaturedCampaigns/` — Campañas destacadas
- `MarketingKpiCard/` — KPIs de marketing
- `MarketingModals/` — Modales de marketing
- `MarketingAccessGuard/` — Guard de acceso a marketing

**Hooks:** `useMarketingAccess`, `usePublicBanners`

---

### 21. Servicios Complementarios

Módulo de servicios adicionales para profesionales del sector inmobiliario.

**Rutas:**
- `/servics` — Servicios disponibles

**Componentes:**
- `CompleteServices/` — Servicios completos
- `LegalServices/` — Servicios legales
- `ServiceLinks/` — Enlaces a servicios
- `SunatInfo/` — Consulta SUNAT

---

### 22. Moderación y Reportes

Sistema de reportes de contenido inapropiado para mantener la calidad de la plataforma.

**Componentes:**
- `ReportModal/` — Modal de reporte de contenido

**Hooks:** `useModeration`

**Entidades:** `Moderation.ts`

---

### 23. Soporte y Contacto

Canales de soporte y formularios de contacto.

**Rutas:**
- `/contact` — Formulario de contacto
- `/soporte` — Centro de soporte

**Componentes:**
- `FormContact.tsx` — Formulario de contacto
- `HeroContact.tsx` — Hero de la página de contacto
- `SupportModal.tsx` — Modal de soporte
- `ContactForm/` — Formulario de contacto reutilizable

---

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Páginas y rutas (Next.js App Router)
│   ├── (auth)/                   #   Rutas de autenticación
│   ├── (dashboard)/              #   Rutas del dashboard (usuario)
│   ├── (public)/                 #   Rutas públicas
│   ├── api/                      #   API Routes
│   ├── libro-de-reclamaciones/   #   Libro de reclamaciones
│   ├── mensajes/                 #   Centro de mensajería
│   └── public/                   #   Vistas públicas
│
├── core/                         # Capa de dominio y aplicación
│   ├── domain/
│   │   ├── entities/             #   Entidades del dominio
│   │   ├── repositories/         #   Interfaces de repositorios
│   │   ├── use-cases/            #   Casos de uso
│   │   └── adapters/             #   Adaptadores
│   ├── application/
│   │   ├── dtos/                 #   Data Transfer Objects
│   │   └── mappers/              #   Mapeadores
│   └── config/                   #   Configuración del dominio (planes)
│
├── presentation/                 # Capa de presentación
│   ├── components/               #   Componentes UI
│   │   ├── auth/                 #     Componentes de autenticación
│   │   ├── blog/                 #     Componentes del blog
│   │   ├── contact/              #     Componentes de contacto
│   │   ├── contacts/             #     Componentes de contactos/mensajería
│   │   ├── dashboard/            #     Componentes del dashboard
│   │   ├── finance/              #     Componentes financieros
│   │   ├── forms/                #     Formularios
│   │   ├── guards/               #     Guards de protección
│   │   ├── kyc/                  #     Componentes KYC
│   │   ├── layout/               #     Layout (Header, Footer)
│   │   ├── marketing/            #     Componentes de marketing
│   │   ├── modals/               #     Modales globales
│   │   ├── moderation/           #     Componentes de moderación
│   │   ├── notifications/        #     Componentes de notificaciones
│   │   ├── onboarding/           #     Componentes de onboarding
│   │   ├── payments/             #     Componentes de pagos
│   │   ├── profile/              #     Componentes de perfil
│   │   ├── project/              #     Componentes de proyectos
│   │   ├── projects/             #     Componentes de mapa de proyectos
│   │   ├── properties/           #     Componentes de mapa de propiedades
│   │   ├── property/             #     Componentes de propiedades
│   │   ├── searchTracking/       #     Seguimiento de búsquedas
│   │   ├── services/             #     Componentes de servicios
│   │   ├── shared/               #     Componentes compartidos
│   │   ├── support/              #     Componentes de soporte
│   │   └── ui/                   #     Componentes base de UI
│   ├── features/                 #   Features específicas
│   ├── hooks/                    #   Custom hooks
│   └── store/                    #   Zustand stores
│
├── infrastructure/               # Capa de infraestructura
│   ├── api/                      #   Cliente HTTP y endpoints
│   ├── repositories/             #   Implementaciones de repositorios
│   └── storage/                  #   Almacenamiento local
│
├── services/                     # Servicios externos
│   ├── brevoService.ts           #   Servicio de email (Brevo/Sendinblue)
│   ├── emailService.ts           #   Servicio de correo
│   └── emailTemplates.ts         #   Plantillas de email
│
├── config/                       # Configuración global
│   ├── constants.ts              #   Constantes del sistema
│   ├── env.ts                    #   Variables de entorno
│   ├── firebase.ts               #   Configuración de Firebase
│   └── routes.ts                 #   Rutas del sistema
│
├── types/                        # Tipos globales
├── utils/                        # Utilidades
└── styles/                       # Estilos globales
```

---

## 🏗 Arquitectura

El proyecto sigue una **Arquitectura Hexagonal** (también conocida como Puertos y Adaptadores o Clean Architecture):

```
┌─────────────────────────────────────────────────┐
│                  PRESENTACIÓN                    │
│        (Components, Hooks, Store, Pages)         │
├─────────────────────────────────────────────────┤
│                   APLICACIÓN                     │
│           (DTOs, Mappers, Use Cases)             │
├─────────────────────────────────────────────────┤
│                    DOMINIO                       │
│      (Entities, Repository Interfaces)           │
├─────────────────────────────────────────────────┤
│               INFRAESTRUCTURA                    │
│   (API Client, Repository Impl, Storage)         │
└─────────────────────────────────────────────────┘
```

**Principios:**
- **Dominio puro**: Las entidades y casos de uso no dependen de frameworks externos
- **Inversión de dependencias**: Las capas externas dependen de abstracciones internas
- **Separación de responsabilidades**: Cada capa tiene un propósito específico y bien definido

---

## 🚀 Guía de Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Lint
npm run lint
```

Abrir [http://localhost:3000](http://localhost:3000) para ver la aplicación.

---

## 🌐 Variables de Entorno

Configurar en `.env.local`:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=
```

---

## 📄 Licencia

Proyecto privado - Tiyuy © 2026
