# ADMIN MODULE CODE REVIEW - DUPLICATE LOGIC ANALYSIS

## ESTRUCTURA DEL MÓDULO ADMIN

### Páginas Analizadas (22 archivos)
1. **Admin Core**: layout.tsx, page.tsx
2. **User Management**: users/, developers/, agents/, admins/
3. **Property Management**: properties/, projects/
4. **Finance**: finance/, plans/, pricing-preview/
5. **Marketing**: campaigns/, discounts/, real-estate-discounts/
6. **Analytics**: analytics/, audit/, reports/
7. **Communications**: communications/, notifications/
8. **Groups**: groups/
9. **Agencies**: agencies/

## PATRONES DE CÓDIGO ENCONTRADOS

### 1. IMPORTS DUPLICADOS - ALTO RIESGO

#### Pattern Repetitivo: Modal Management
```typescript
// ESTE PATRÓN SE REPITE EN 15+ ARCHIVOS:
import { Modal } from '@/presentation/components/ui/Modal';

// ESTE PATRÓN DE ESTADO SE REPITE EN 15+ ARCHIVOS:
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
```

#### Pattern Repetitivo: useAdmin Hooks
```typescript
// ESTE PATRÓN SE REPITE EN 12+ ARCHIVOS:
import { useUsers, useToggleUserStatus } from '@/presentation/hooks/useAdmin';
import { useDiscountCodes, useCreateDiscountCode } from '@/presentation/hooks/useAdmin';
import { useCampaigns, useCreateCampaign } from '@/presentation/hooks/useAdmin';
```

#### Pattern Repetitivo: Component Imports
```typescript
// ESTE PATRÓN SE REPITE EN 18+ ARCHIVOS:
import { Card, CardHeader, CardTitle, CardContent } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { AdminTable } from '@/presentation/components/admin/AdminTable/AdminTable';
import { AdminFilters } from '@/presentation/components/admin/AdminFilters';
```

### 2. LÓGICA DUPLICADA - ALTO RIESGO

#### Modal State Management Logic
```typescript
// SE REPITE EN 15+ ARCHIVOS CON VARIACIONES MÍNIMAS:
const handleView = (item) => {
  setSelectedItem(item);
  setIsViewModalOpen(true);
};

const handleEdit = (item) => {
  setSelectedItem(item);
  setIsEditModalOpen(true);
};

const handleCreate = () => {
  setSelectedItem(null);
  setIsCreateModalOpen(true);
};
```

#### Permission Checking Logic
```typescript
// SE REPITE EN 18+ ARCHIVOS:
const { hasPermission } = usePermissions();
const canManage = hasPermission('PERMISSION_NAME');
```

#### Pagination Logic
```typescript
// SE REPITE EN 12+ ARCHIVOS:
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const params = { page: currentPage - 1, size: pageSize };
```

#### Search and Filter Logic
```typescript
// SE REPITE EN 10+ ARCHIVOS:
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
```

### 3. COMPONENTS DUPLICADOS - MEDIO RIESGO

#### Modal Components
- **Modal patterns**: Cada página tiene sus propios modales
- **Modal content**: Estructura similar pero duplicada
- **Modal handlers**: Lógica repetida para abrir/cerrar

#### Table Components
- **AdminTable**: Reutilizado correctamente
- **Table columns**: Definidos individualmente por página
- **Table actions**: Patrones similares duplicados

#### Filter Components
- **AdminFilters**: Reutilizado correctamente
- **Filter options**: Definidos individualmente
- **Filter handlers**: Lógica similar duplicada

## PROBLEMAS ESPECÍFICOS IDENTIFICADOS

### 1. AGENCIES PAGE - LÓGICA INDEPENDIENTE
```typescript
// agencies/page.tsx - NO USA useAdmin hooks
const fetchAgents = async (): Promise<Agent[]> => {
  const response = await axiosClient.get('/admin/agents');
  return response.data;
};

// USA useQuery en lugar de hooks estandarizados
const { data, isLoading } = useQuery({
  queryKey: ['agents'],
  queryFn: fetchAgents
});
```

### 2. REPORTS PAGE - PROTECTEDROUTE DUPLICADO
```typescript
// reports/page.tsx - USA ProtectedRoute en lugar de AdminGuard
return (
  <ProtectedRoute requiredRole="ADMIN">
    {/* Content */}
  </ProtectedRoute>
);
```

### 3. PRICING-PREVIEW PAGE - IMPORTS DUPLICADOS
```typescript
// pricing-preview/page.tsx - IMPORTS SEPARADOS
import { useDiscountCodes } from '@/presentation/hooks/useAdmin';
import { useSubscriptionPlans } from '@/presentation/hooks/useAdmin';

// PODRÍA SER UN SOLO IMPORT:
import { useDiscountCodes, useSubscriptionPlans } from '@/presentation/hooks/useAdmin';
```

## RECOMENDACIONES DE REFACTORING

### 1. CREAR CUSTOM HOOK PARA MODAL MANAGEMENT
```typescript
// Nuevo hook: useModalManagement.ts
export function useModalManagement() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openViewModal = (item) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedItem(null);
  };

  return {
    isViewModalOpen,
    isEditModalOpen,
    isCreateModalOpen,
    selectedItem,
    openViewModal,
    openEditModal,
    openCreateModal,
    closeAllModals
  };
}
```

### 2. CREAR CUSTOM HOOK PARA ADMIN CRUD
```typescript
// Nuevo hook: useAdminCrud.ts
export function useAdminCrud<T>(apiEndpoints: {
  list: string;
  create: string;
  update: string;
  delete: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async (params?: any) => {
    // Lógica genérica de fetch
  };

  const createItem = async (data: any) => {
    // Lógica genérica de create
  };

  const updateItem = async (id: number, data: any) => {
    // Lógica genérica de update
  };

  const deleteItem = async (id: number) => {
    // Lógica genérica de delete
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
}
```

### 3. CREAR COMPONENTE GENÉRICO PARA MODALS
```typescript
// Nuevo componente: AdminModal.tsx
interface AdminModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  item?: T;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
}

export function AdminModal<T>({ isOpen, onClose, title, item, onSubmit, children }: AdminModalProps<T>) {
  // Lógica genérica de modal
}
```

### 4. UNIFICAR HOOKS DE ADMIN
```typescript
// Consolidar imports en useAdmin.ts
export * from './useUserManagement';
export * from './usePropertyManagement';
export * from './useFinanceManagement';
export * from './useMarketingManagement';
export * from './useAnalyticsManagement';
```

### 5. CREAR HOOK PARA PAGINACIÓN
```typescript
// Nuevo hook: usePagination.ts
export function usePagination(initialPageSize = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const params = {
    page: currentPage - 1,
    size: pageSize
  };

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    params
  };
}
```

## ARCHIVOS QUE NECESITAN REFACTORING URGENTE

### 1. agencies/page.tsx
- **Problema**: No usa hooks estandarizados
- **Solución**: Migrar a useAdmin hooks

### 2. reports/page.tsx
- **Problema**: Usa ProtectedRoute en lugar de AdminGuard
- **Solución**: Usar AdminShell consistente

### 3. pricing-preview/page.tsx
- **Problema**: Imports separados
- **Solución**: Consolidar imports

### 4. Todas las páginas con modals
- **Problema**: Lógica de modal duplicada
- **Solución**: Usar useModalManagement hook

### 5. Todas las páginas con CRUD
- **Problema**: Lógica CRUD duplicada
- **Solución**: Usar useAdminCrud hook

## IMPACTO EN MANTENIMIENTO

### Antes (Actual)
- **22 páginas** con lógica duplicada
- **15+ modal patterns** repetidos
- **12+ pagination patterns** repetidos
- **18+ permission checks** repetidos

### Después (Refactored)
- **22 páginas** con hooks reutilizables
- **1 modal hook** para todas las páginas
- **1 pagination hook** para todas las páginas
- **1 permission hook** centralizado

## BENEFICIOS DEL REFACTORING

### 1. Reducción de Código
- **~40% menos código** duplicado
- **~15 hooks** reutilizables
- **~5 componentes** genéricos

### 2. Mantenimiento Mejorado
- **Cambios en un solo lugar** afectan a todas las páginas
- **Consistencia** en patrones
- **Testing más fácil** con hooks centralizados

### 3. Performance Mejorado
- **Menos re-renders** con hooks optimizados
- **Bundle size reducido** con código compartido
- **Memoria optimizada** con componentes reutilizables

## ACCIONES RECOMENDADAS

### 1. Inmediato (Alta Prioridad)
1. Crear `useModalManagement` hook
2. Crear `usePagination` hook
3. Migrar `agencies/page.tsx` a hooks estandarizados
4. Unificar imports en `pricing-preview/page.tsx`

### 2. Corto Plazo (Media Prioridad)
1. Crear `useAdminCrud` hook genérico
2. Crear `AdminModal` componente genérico
3. Migrar `reports/page.tsx` a AdminShell

### 3. Largo Plazo (Baja Prioridad)
1. Refactor todas las páginas para usar nuevos hooks
2. Optimizar performance con memoización
3. Agregar testing unitario para hooks genéricos

## CONCLUSIÓN

El módulo admin tiene **significativa duplicación de lógica** que afecta el mantenimiento y la consistencia. Se recomienda implementar los hooks y componentes genéricos sugeridos para reducir el código duplicado en ~40% y mejorar drásticamente el mantenimiento a largo plazo.
