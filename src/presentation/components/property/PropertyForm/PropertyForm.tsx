'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProperty, useUpdateProperty } from '@/presentation/hooks/useProperties';
import { useProjects } from '@/presentation/hooks/useProjects';
import { useActiveSubscription } from '@/presentation/hooks/useFinance';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { Property } from '@/core/domain/entities/Property';
import { Project } from '@/core/domain/entities/Project';
import { BasicInfoStep } from './BasicInfoStep';
import { LocationStep } from './LocationStep';
import { CharacteristicsStep } from './CharacteristicsStep';
import { PhotosStep } from './PhotosStep';
import { ProjectMultimediaStep } from './ProjectMultimediaStep';
import { ProjectMultimediaStep as ProjectMediaStep } from '@/presentation/components/project/ProjectMultimediaStep';
import { ProjectInfoStep } from './ProjectInfoStep';
import { ProjectUnitsStep } from './ProjectUnitsStep';
import { ProjectTimelineStep } from './ProjectTimelineStep';
import { UpgradePlanModal } from '@/presentation/components/modals/UpgradePlanModal';
import { PlanExpiredModal } from '@/presentation/components/modals/PlanExpiredModal';
import { useMyProperties } from '@/presentation/hooks/useProperties';
import { useAuth } from '@/presentation/hooks/useAuth';
import { authStorage } from '@/infrastructure/storage/auth-storage';
import { toast } from 'sonner';
import { Check, ChevronLeft, ChevronRight, FileText, Loader } from 'lucide-react';

interface PropertyFormProps {
  property?: Property | Project;
  mode: 'create' | 'edit';
  onStepChange?: (step: number) => void;
  formType?: 'property' | 'project';
}

const STEPS = [
  { number: 1, title: 'Información básica', description: 'Tipo y precio' },
  { number: 2, title: 'Ubicación', description: 'Dirección exacta' },
  { number: 3, title: 'Características', description: 'Detalles del inmueble' },
  { number: 4, title: 'Fotos', description: 'Imágenes del inmueble' },
];

const PROJECT_STEPS = [
  { number: 1, title: 'Información del Proyecto', description: 'Tipo y fase' },
  { number: 2, title: 'Ubicación', description: 'Dirección exacta' },
  { number: 3, title: 'Unidades', description: 'Departamentos disponibles' },
  { number: 4, title: 'Timeline', description: 'Fechas de entrega' },
  { number: 5, title: 'Multimedia', description: 'Planos y renders' },
];

const PropertyStepComponents: Record<number, React.ComponentType<any>> = {
  1: BasicInfoStep,
  2: LocationStep,
  3: CharacteristicsStep,
  4: PhotosStep,
};

const ProjectStepComponents: Record<number, React.ComponentType<any>> = {
  1: ProjectInfoStep,
  2: LocationStep,
  3: ProjectUnitsStep,
  4: ProjectTimelineStep,
  5: ProjectMediaStep,
};

export function PropertyForm({ property, mode, onStepChange, formType = 'property' }: PropertyFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdPropertyId, setCreatedPropertyId] = useState<number | undefined>(property?.id);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPlanExpiredModal, setShowPlanExpiredModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data: myPropertiesData } = useMyProperties();
  const { data: activeSubscription } = useActiveSubscription();
  const myProjectsQuery = useProjects().myProjects?.() ?? { data: null };

  const publishedPropertiesCount =
    myPropertiesData?.properties?.filter((p: any) => p.status === 'PUBLISHED').length || 0;

  const publishedProjectsCount =
    myProjectsQuery.data?.content?.filter((p: any) => p.status === 'PUBLISHED').length || 0;

  const canPublish = useMemo(() => {
    if (activeSubscription) return activeSubscription.remainingPublications > 0;
    // Without subscription: 1 free publication between properties + projects
    return (publishedPropertiesCount + publishedProjectsCount) < 1;
  }, [activeSubscription, publishedPropertiesCount, publishedProjectsCount]);

  const [formData, setFormData] = useState<any>({
    // Existing properties (only if property form)
    type: property?.type || 'APARTMENT',
    transactionType: (property && 'transactionType' in property) ? property.transactionType : 'SALE',
    // FIX: Add state for unit files
    unitBlueprintFiles: {},
    groupBlueprintFiles: {},
    price: (property && 'price' in property) ? property.price : 0,
    currency: (property && 'currency' in property) ? property.currency : 'PEN',
    bedrooms: (property && 'bedrooms' in property) ? property.bedrooms : 1,
    bathrooms: (property && 'bathrooms' in property) ? property.bathrooms : 1,
    parking: (property && 'parkingSpots' in property) ? property.parkingSpots : 0,
    totalArea: (property && 'totalArea' in property) ? property.totalArea : 0,
    builtArea: (property && 'builtArea' in property) ? property.builtArea : 0,
    floor: (property && 'floor' in property) ? property.floor : 1,
    age: (property && 'age' in property) ? property.age : 0,
    maintenanceFee: (property && 'maintenanceFee' in property) ? property.maintenanceFee : 0,
    description: property?.description || '',
    fullAddress: (property && 'location' in property) ? property.location?.fullAddress : '',
    region: (property && 'location' in property) ? property.location?.region : 'Lima',
    province: (property && 'location' in property) ? property.location?.province : 'Lima',
    district: (property && 'location' in property) ? property.location?.district : '',
    urbanization: (property && 'location' in property) ? property.location?.urbanization : '',
    street: (property && 'location' in property) ? property.location?.street : '',
    streetNumber: (property && 'location' in property) ? property.location?.streetNumber : '',
    apartmentNumber: (property && 'location' in property) ? property.location?.apartmentNumber : '',
    latitude: (property && 'location' in property) ? property.location?.latitude : 0,
    longitude: (property && 'location' in property) ? property.location?.longitude : 0,
    showExactAddress: (property && 'location' in property) ? property.location?.showExactAddress : true,
    
    // Fields for projects (only if project form)
    ...(formType === 'project' ? {
      name: (property && 'name' in property) ? property.name : '',
      phase: (property && 'phase' in property) ? property.phase : 'PRE_SALE',
      projectType: (property && 'type' in property) ? property.type : 'RESIDENTIAL',
      totalUnits: (property && 'totalUnits' in property) ? property.totalUnits : 0,
      availableUnits: (property && 'availableUnits' in property) ? property.availableUnits : 0,
      priceFrom: (property && 'priceFrom' in property) ? property.priceFrom : '',
      priceTo: (property && 'priceTo' in property) ? property.priceTo : '',
      startDate: (property && 'startDate' in property) ? property.startDate : (property && 'constructionStart' in property ? (property as any).constructionStart : ''),
      estimatedDelivery: (property && 'estimatedDelivery' in property) ? property.estimatedDelivery : '',
      areaFrom: (property && 'areaFrom' in property) ? property.areaFrom : 0,
      areaTo: (property && 'areaTo' in property) ? property.areaTo : 0,
      floors: (property && 'floors' in property) ? property.floors : 0,
      address: (property && 'address' in property) ? property.address : ((property && 'location' in property) ? `${property.location?.district || ''}, ${property.location?.province || ''}, ${property.location?.region || ''}` : ''),
      units: (property && 'units' in property) ? property.units : [],
      timeline: (property && 'timeline' in property) ? property.timeline : [],
      // Amenities: convertir de objetos {name} a strings planos para checkboxes
      amenities: (property && 'amenities' in property) 
        ? ((property as any).amenities || []).map((a: any) => typeof a === 'string' ? a : a?.name || '').filter(Boolean)
        : [],
      images: (property && 'images' in property) ? property.images : [],
      blueprints: (property && 'blueprints' in property) ? property.blueprints : [],
      renders: (property && 'renders' in property) ? property.renders : [],
      coverImageUrl: (property && 'coverImageUrl' in property) ? (property as any).coverImageUrl : '',

      // Lotización fields
      ruc: (property && 'ruc' in property) ? (property as any).ruc : '',
      socialReason: (property && 'socialReason' in property) ? (property as any).socialReason : '',
      initialFee: (property && 'initialFee' in property) ? (property as any).initialFee : '',
      monthlyPayment: (property && 'monthlyPayment' in property) ? (property as any).monthlyPayment : '',
      financingInfo: (property && 'financingInfo' in property) ? (property as any).financingInfo : '',
      totalBlocks: (property && 'totalBlocks' in property) ? (property as any).totalBlocks : '',
      // Checkboxes: detectar desde amenities guardadas o desde campos directos
      hasUrbanization: (property && 'hasUrbanization' in property) ? (property as any).hasUrbanization 
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name)?.toLowerCase().includes('habilitación'))) || false,
      hasPropertyTitle: (property && 'hasPropertyTitle' in property) ? (property as any).hasPropertyTitle
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name)?.toLowerCase().includes('título'))) || false,
      hasWater: (property && 'hasWater' in property) ? (property as any).hasWater
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name) === 'Agua')) || false,
      hasElectricity: (property && 'hasElectricity' in property) ? (property as any).hasElectricity
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name) === 'Electricidad')) || false,
      hasSewerage: (property && 'hasSewerage' in property) ? (property as any).hasSewerage
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name) === 'Desagüe')) || false,
      hasPavedRoads: (property && 'hasPavedRoads' in property) ? (property as any).hasPavedRoads
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name) === 'Pistas')) || false,
      hasStreetLighting: (property && 'hasStreetLighting' in property) ? (property as any).hasStreetLighting
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name)?.includes('Alumbrado'))) || false,
      hasGasNetwork: (property && 'hasGasNetwork' in property) ? (property as any).hasGasNetwork
        : (property && 'amenities' in property && (property as any).amenities?.some((a: any) => (typeof a === 'string' ? a : a.name)?.toLowerCase().includes('gas'))) || false,
      urbanizationName: (property && 'urbanizationName' in property) ? (property as any).urbanizationName : '',
      registryNumber: (property && 'registryNumber' in property) ? (property as any).registryNumber : '',

      // Social media — parsear socialMediaUrl a campos individuales
      ...(() => {
        const socialRaw = (property as any)?.socialMediaUrl || '';
        const parts = socialRaw.split('|').filter(Boolean);
        const socialObj: any = { socialInstagram: '', socialFacebook: '', socialTiktok: '', socialWeb: '' };
        parts.forEach((url: string) => {
          const lower = url.toLowerCase();
          if (lower.includes('instagram')) socialObj.socialInstagram = url;
          else if (lower.includes('facebook')) socialObj.socialFacebook = url;
          else if (lower.includes('tiktok')) socialObj.socialTiktok = url;
          else socialObj.socialWeb = url;
        });
        return socialObj;
      })(),
    } : {})
  });

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const createProjectMutation = useProjects().createProject(); // ← Hook para proyectos
  const updateProjectMutation = useProjects().updateProject(); // ← Hook para actualizar proyectos

  // Determine steps and components according to type
  const currentSteps = formType === 'project' ? PROJECT_STEPS : STEPS;
  const currentStepComponents = formType === 'project' ? ProjectStepComponents : PropertyStepComponents;
  const totalSteps = currentSteps.length;

  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (mode === 'edit') return errors;

    if (formType === 'project') {
      if (step === 1) {
        const priceFrom = formData.priceFrom !== '' && formData.priceFrom !== null ? Number(formData.priceFrom) : null;
        const priceTo = formData.priceTo !== '' && formData.priceTo !== null ? Number(formData.priceTo) : null;

        if (priceFrom === null || priceFrom <= 0) {
          errors.priceFrom = 'Ingresa un precio desde válido mayor a 0';
        }
        if (priceTo === null || priceTo <= 0) {
          errors.priceTo = 'Ingresa un precio hasta válido mayor a 0';
        }
        if (priceFrom !== null && priceTo !== null && priceTo < priceFrom) {
          errors.priceTo = 'El precio máximo debe ser mayor o igual al mínimo';
        }
        if (!formData.name || !formData.name.trim()) {
          errors.name = 'El nombre del proyecto es obligatorio';
        }
        if (!formData.description || formData.description.trim().length < 30) {
          errors.description = 'La descripción debe tener al menos 30 caracteres';
        }
        if (!formData.phase) {
          errors.phase = 'Selecciona la fase del proyecto';
        }
        if (!formData.projectType) {
          errors.projectType = 'Selecciona el tipo de proyecto';
        }
        if (!formData.amenities || formData.amenities.length === 0) {
          errors.amenities = 'Selecciona al menos una amenidad';
        }
    }

      if (step === 2) {
        if (formData.manualCoordinates) {
          // Modo coordenadas manuales: solo validar coordenadas y ubicación básica
          if (!formData.latitude || isNaN(Number(formData.latitude))) {
            errors.latitude = 'Ingresa una latitud válida';
          }
          if (!formData.longitude || isNaN(Number(formData.longitude))) {
            errors.longitude = 'Ingresa una longitud válida';
          }
          if (!formData.district || !formData.district.trim()) {
            errors.district = 'Ingresa el distrito';
          }
          if (!formData.province || !formData.province.trim()) {
            errors.province = 'Ingresa la provincia';
          }
          if (!formData.region || !formData.region.trim()) {
            errors.region = 'Ingresa la región';
          }
        } else {
          if (!formData.address || !formData.address.trim()) {
            errors.address = 'La dirección es obligatoria';
          }
          if (!formData.district || !formData.district.trim()) {
            errors.district = 'Selecciona el distrito';
          }
          if (!formData.province || !formData.province.trim()) {
            errors.province = 'Selecciona la provincia';
          }
          if (!formData.region || !formData.region.trim()) {
            errors.region = 'Selecciona la región';
          }
          if (!formData.street || !formData.street.trim()) {
            errors.street = 'El nombre de la calle es obligatorio';
          }
          if (!formData.streetNumber || !formData.streetNumber.trim()) {
            errors.streetNumber = 'El número de la calle es obligatorio';
          }
        }
      }

      if (step === 3) {
        const fd = formData as any;
        const hasUnits = (fd.units?.length || 0) > 0 || (fd.unitGroups?.length || 0) > 0;
        if (!hasUnits) {
          errors.units = 'Agrega al menos una unidad o grupo de unidades';
        }
      }

      if (step === 4) {
        if (!formData.startDate) {
          errors.startDate = 'Ingresa la fecha de inicio';
        }
        if (!formData.estimatedDelivery) {
          errors.estimatedDelivery = 'Ingresa la fecha de entrega estimada';
        }
        if (formData.priceFrom && formData.priceTo && Number(formData.priceTo) < Number(formData.priceFrom)) {
          errors.priceTo = 'El precio máximo debe ser igual o mayor que el mínimo';
        }
      }
    } else {
      // Property validation
      if (step === 1) {
        if (!formData.transactionType) {
          errors.transactionType = 'Selecciona si deseas vender o alquilar';
        }
        if (!formData.type) {
          errors.type = 'Selecciona el tipo de propiedad';
        }
        if (!formData.price || Number(formData.price) <= 0) {
          errors.price = 'Ingresa un precio válido mayor a 0';
        }
        if (!formData.description || formData.description.trim().length < 30) {
          errors.description = 'La descripción debe tener al menos 30 caracteres';
        }
      }

      if (step === 2) {
        if (!formData.district || !formData.district.trim()) {
          errors.district = 'Selecciona el distrito';
        }
        if (!formData.province || !formData.province.trim()) {
          errors.province = 'Selecciona la provincia';
        }
        if (!formData.region || !formData.region.trim()) {
          errors.region = 'Selecciona la región';
        }
        if (!formData.street || !formData.street.trim()) {
          errors.street = 'La calle es obligatoria';
        }
        if (!formData.streetNumber || !formData.streetNumber.trim()) {
          errors.streetNumber = 'El número es obligatorio';
        }
      }

      if (step === 3) {
        // Validaciones específicas según tipo
        if (formData.type === 'ROOM') {
          if (!formData.roomArea || Number(formData.roomArea) <= 0) {
            errors.roomArea = 'Ingresa el área de la habitación';
          }
        } else if (formData.type === 'LAND') {
          if (!formData.totalArea || Number(formData.totalArea) <= 0) {
            errors.totalArea = 'Ingresa el área total del terreno';
          }
        } else {
          if (!formData.totalArea || Number(formData.totalArea) <= 0) {
            errors.totalArea = 'Ingresa el área total';
          }
          if (!formData.builtArea || Number(formData.builtArea) <= 0) {
            errors.builtArea = 'Ingresa el área construida';
          }
        }
      }
    }

    return errors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      toast.error('Revisa los campos marcados para continuar');
      return;
    }
    setValidationErrors({});
    // Create project when reaching step 5 (before showing component)
    if (formType === 'project' && currentStep === 4 && !createdPropertyId && mode === 'create') {
      // PREVIOUS VALIDATION of required fields
      const allAreas = [
        ...(formData.units || []).map((u: any) => u.area),
        ...(formData.unitGroups || []).map((g: any) => g.area)
      ];
      const calculatedTotalUnits = (formData.units?.length || 0) + (formData.unitGroups || []).reduce((s: number, g: any) => s + (g.quantity || 0), 0);
      
      const addressValue = formData.fullAddress || 
        (formData.manualCoordinates && formData.latitude && formData.longitude 
          ? `${formData.latitude}, ${formData.longitude}` 
          : formData.address || '');

      const requiredFields = {
        name: formData.name,
        description: formData.description,
        phase: formData.phase,
        type: formData.type,
        totalUnits: calculatedTotalUnits > 0 ? calculatedTotalUnits : formData.totalUnits,
        areaFrom: allAreas.length > 0 ? Math.min(...allAreas) : formData.areaFrom,
        areaTo: allAreas.length > 0 ? Math.max(...allAreas) : formData.areaTo,
        address: addressValue,
        district: formData.district,
        province: formData.province,
        region: formData.region
      };

      console.log('🔍 Validando campos obligatorios:', requiredFields);

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => {
          // For numeric fields, 0 is a valid value
          if (typeof value === 'number') {
            return isNaN(value);
          }
          // For string fields, check if empty or just whitespace
          return !value || (typeof value === 'string' && value.trim() === '');
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.error('❌ Campos obligatorios faltantes:', missingFields);
        console.error('❌ Valores actuales:', requiredFields);
        toast.error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        return;
      }

      console.log('✅ Todos los campos obligatorios están presentes');
      
      // Create project when passing from step 4 to 5
      const projectData = prepareProjectData(formData);
      console.log(' Creando proyecto como DRAFT con todos los datos:', projectData);
      
      createProjectMutation.mutate(projectData, {
        onSuccess: (result: any) => { 
          console.log('🔍 Type of result:', typeof result);
          
          let projectId = undefined;
          
          if (typeof result === 'string') {
            // Extraer el ID con regex del JSON truncado
            const idMatch = result.match(/"id":(\d+)/);
            if (idMatch) {
              projectId = parseInt(idMatch[1], 10);
              console.log('🔍 Extracted ID with regex:', projectId);
            } else {
              console.error('❌ Could not find ID in result string');
            }
          } else if (result && typeof result === 'object') {
            projectId = result.id;
            console.log('🔍 Direct ID access:', projectId);
          }
          
          console.log('🔧 Final projectId found:', projectId);
          
          // Validate that projectId exists before saving
          if (projectId) {
            console.log('🔧 Saving project ID:', projectId);
            // ✅ Fix 1: Guardar en estado y localStorage con key correcta
            setCreatedPropertyId(projectId);
            localStorage.setItem('lastCreatedProjectId', String(projectId)); // ✅ Key correcta
            console.log('✅ Project ID guardado en localStorage:', projectId);
            
            // Go to step 5 after creating project
            goToStep(5);
            
            // Show success toast and allow uploading images
            toast.success('Proyecto guardado, ahora sube las imágenes');
          } else {
            console.error('Error: projectId is undefined after creating project');;
            toast.error('Error al guardar el proyecto - ID no encontrado');
          }
        },
        onError: (error: any) => {
          console.error(' Error al crear proyecto:', error);
          
          // Handle validation error specifically
          if (error.isValidationError) {
            toast.error(error.message, {
              duration: 5000,
              style: {
                background: '#ef4444',
                color: 'white',
              }
            });
            return;
          }
          
          // Handle subscription error specifically
          if (error.isSubscriptionError || error.message?.includes('ENTERPRISE') || error.message?.includes('subscription')) {
            const errorMessage = 'You need an ENTERPRISE subscription to create projects.';
            
            toast.error(errorMessage, {
              duration: 5000,
              action: {
                label: 'View Plans',
                onClick: () => {
                  console.log(' Toast: Navigating to /plans...');
                  console.log(' URL actual:', window.location.href);
                  router.push('/plans');
                }
              }
            });
            
            // Redirect after some time
            setTimeout(() => {
              console.log(' Timeout: Navigating to /plans...');
              router.push('/plans');
            }, 3000);
          } else {
            toast.error('Error creating the project');
          }
        },
      });
      return;
    }
    
    if (mode === 'create' && formType === 'property' && currentStep === 3 && !createdPropertyId) {
      // Create property in step 3 to upload photos in step 4
      const createData = prepareCreateData(formData);
      
      createMutation.mutate(createData, {
        onSuccess: (result) => { 
          setCreatedPropertyId(result.id); 
          goToStep(4); 
        },
        onError: (error: any) => {
          toast.error('Error creating the property');
        },
      });
      return;
    }
    goToStep(Math.min(currentStep + 1, totalSteps));
  };

  // Function to prepare data according to property type
  const prepareCreateData = (data: any) => {
    const baseData = {
      type: data.type,
      transactionType: data.transactionType,
      price: Number(data.price),
      currency: data.currency,
      description: data.description,
      fullAddress: data.fullAddress,
      region: data.region,
      province: data.province,
      district: data.district,
      latitude: Number(data.latitude) || undefined,
      longitude: Number(data.longitude) || undefined,
      showExactAddress: Boolean(data.showExactAddress),
    };

    // Add fields according to property type
    switch (data.type) {
      case 'ROOM':
        return {
          ...baseData,
          totalArea: Number(data.roomArea) || undefined,
          // Para habitaciones se envía roomDetails (baño propio/compartido y capacidad)
          roomDetails: {
            hasPrivateBathroom: data.bathroomType === 'PRIVATE',
            totalCapacity: Number(data.maxCapacity) || undefined,
          },
        };
      
      case 'LAND':
        return {
          ...baseData,
          totalArea: Number(data.totalArea) || undefined,
          // For land, no bedrooms or bathrooms
        };
      
      case 'OFFICE':
        return {
          ...baseData,
          totalArea: Number(data.totalArea) || undefined,
          builtArea: Number(data.usableArea) || undefined,
          bathrooms: Number(data.bathrooms) || undefined,
          parkingSpots: Number(data.parking) || undefined,
        };
      
      default: // APARTMENT, HOUSE
        return {
          ...baseData,
          bedrooms: Number(data.bedrooms) || undefined,
          bathrooms: Number(data.bathrooms) || undefined,
          parkingSpots: Number(data.parking) || undefined,
          totalArea: Number(data.totalArea) || undefined,
          builtArea: Number(data.builtArea) || undefined,
        };
    }
  };

  // Function to prepare data for projects according to backend
  const prepareProjectData = (data: any) => {
    console.log(' prepareProjectData - All form data:', data);
    console.log('🔍 DEBUG - coverImageUrl in form data:', data.coverImageUrl);
    console.log('🔍 DEBUG - images count:', data.images?.length);
    
    const projectData = {
      // Step 1: Basic Information
      name: data.name || data.projectName || '',
      description: data.description || '',
      phase: data.phase || 'PRE_SALE',
      type: data.projectType || 'RESIDENTIAL',
      
      // Step 2: Location
      address: data.fullAddress || (data.manualCoordinates && data.latitude && data.longitude 
        ? `${data.latitude}, ${data.longitude}` 
        : ''),
      district: data.district || '',
      province: data.province || '',
      region: data.region || '',
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      urbanization: data.urbanization || '',
      street: data.street || '',
      streetNumber: data.streetNumber || '',
      fullAddress: data.fullAddress || '',
      showExactAddress: data.showExactAddress !== undefined ? data.showExactAddress : true,
      
      // Step 3: Commercial information
      totalUnits: Number(data.totalUnits) > 0 ? Number(data.totalUnits) : 1,
      availableUnits: Number(data.availableUnits) || Number(data.totalUnits) || 0,
      priceFrom: Number(data.priceFrom) || 0,
      priceTo: Number(data.priceTo) || 0,
      currency: data.currency || 'PEN',
      areaFrom: Number(data.areaFrom) || 60,
      areaTo: Number(data.areaTo) || 60,
      startDate: data.startDate || data.constructionStart || undefined,
      estimatedDelivery: data.estimatedDelivery || undefined,
      floors: data.floors ? Number(data.floors) : undefined,
      
      // NEW: Units (from step 3) - WITH IMAGES
      units: (data.units || []).map((unit: any) => ({
        unitNumber: unit.unitNumber ?? '',
        type: unit.type ?? 'APARTMENT',
        floor: unit.floor ?? 1,
        area: unit.area ?? 60,
        bedrooms: unit.bedrooms ?? 1,
        bathrooms: unit.bathrooms ?? 1,
        parkingSpots: unit.parkingSpots ?? 0,
        price: unit.price ?? 150000,
        status: unit.status ?? 'AVAILABLE',
        view: unit.view ?? '',
        image: unit.image ?? '',
        blueprintImage: unit.blueprintImage ?? ''
      })),
      
      // FIX: Add missing fields from step 3
      certifications: data.certifications || [],
      timeline: data.timeline || [],

      // Lotización services (se guardan como amenities)
      ...(data.projectType === 'LOTIZATION' ? {
        mainAmenities: [
          ...(data.mainAmenities || []),
          ...(data.amenities || []).map((a: any) => typeof a === 'string' ? a : a.name || '').filter(Boolean),
          ...(data.hasUrbanization ? ['Habilitación Urbana'] : []),
          ...(data.hasPropertyTitle ? ['Título de Propiedad'] : []),
          ...(data.hasWater ? ['Agua'] : []),
          ...(data.hasElectricity ? ['Electricidad'] : []),
          ...(data.hasSewerage ? ['Desagüe'] : []),
          ...(data.hasPavedRoads ? ['Pistas'] : []),
          ...(data.hasStreetLighting ? ['Alumbrado Público'] : []),
          ...(data.hasGasNetwork ? ['Gas Natural'] : []),
          ...(data.urbanizationName ? [`Urbanización: ${data.urbanizationName}`] : []),
          ...(data.registryNumber ? [`Partida Registral: ${data.registryNumber}`] : []),
        ]
      } : {}),
      
      // Social media (convertir campos sueltos a JSON string)
      socialMediaUrl: [data.socialInstagram, data.socialFacebook, data.socialTiktok, data.socialWeb]
        .filter(Boolean)
        .join('|'),
      
      // Step 5: Multimedia -  FIX PORTADA: No sobrescribir coverImageUrl si ya existe
      coverImageUrl: data.coverImageUrl || (data.images && data.images.length > 0 ? data.images[0] : ''),
      
      // NEW: Unit groups (from step 3)
      unitGroups: (data.unitGroups || []).map((group: any) => ({
        groupName: group.groupName || '',
        unitType: group.unitType || 'APARTMENT',
        floorStart: group.floorStart || 1,
        floorEnd: group.floorEnd || 1,
        area: group.area || 60,
        bedrooms: group.bedrooms || 1,
        bathrooms: group.bathrooms || 1,
        parkingSpots: group.parkingSpots || 1,
        price: group.price || 150000,
        status: group.status || 'AVAILABLE',
        view: group.view || '',
        quantity: group.quantity || 1,
        image: group.image || '',
        blueprintImage: group.blueprintImage || ''
      })),
      
      // NEW: Detailed amenities (from step 3)
      amenities: (data.amenities || []).map((amenity: any) => ({
        name: amenity.name || '',
        description: amenity.description || '',
        icon: amenity.icon || ''
      }))
    };
    
    console.log(' Final data to send:', projectData);
    console.log(' DEBUG - Final coverImageUrl:', projectData.coverImageUrl);
    return projectData;
  };

  const handlePrev = () => goToStep(Math.max(currentStep - 1, 1));

  // Función para verificar que todos los datos se guardaron correctamente
  const verifyProjectData = async (projectId: number) => {
    try {
      console.log(' Verifying project data for ID:', projectId);
      
      // Use the repository directly instead of hooks
      const projectRepository = new ProjectRepository();
      const project = await projectRepository.getById(projectId);
      
      console.log(' Verification of saved data:', {
          id: project.id,
          name: project.name,
          description: project.description,
          phase: project.phase,
          type: project.type,
          totalUnits: project.totalUnits,
          availableUnits: project.availableUnits,
          priceFrom: project.priceFrom,
          priceTo: project.priceTo,
          currency: project.currency,
          areaFrom: project.areaFrom,
          areaTo: project.areaTo,
          startDate: project.startDate,
          estimatedDelivery: project.estimatedDelivery,
          floors: project.floors,
          address: project.address,
          district: project.district,
          province: project.province,
          region: project.region,
          latitude: project.latitude,
          longitude: project.longitude,
          amenities: project.amenities,
          certifications: project.certifications,
          timeline: project.timeline,
          images: project.images,
          blueprints: project.blueprints,
          renders: project.renders
        });
        
        // Verificar arrays
        console.log(' Verification of arrays:', {
          amenities: project.amenities?.length || 0,
          certifications: project.certifications?.length || 0,
          timeline: project.timeline?.length || 0,
          images: project.images?.length || 0,
          blueprints: project.blueprints?.length || 0,
          renders: project.renders?.length || 0
        });
      
    } catch (error) {
      console.error(' Error in verification:', error);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'create' && formType === 'project' && createdPropertyId) {
      
      // Siempre guardar como borrador primero (sin importar el plan)
      try {
        // Primero actualizar el proyecto con los datos multimedia
        const token = authStorage.getToken() || localStorage.getItem('tiyuy-auth-token') || localStorage.getItem('token');
        
        const updateData = {
          ...prepareProjectData(formData),
          images: formData.images || [],
          blueprints: formData.blueprints || [],
          renders: formData.renders || [],
          // 🔍 FIX: Si no hay coverImageUrl pero hay imágenes, usar la primera como portada
          coverImageUrl: formData.coverImageUrl || (formData.images && formData.images.length > 0 ? formData.images[0] : '')
        };
        
        console.log('📤 Actualizando proyecto con multimedia y portada:', {
          id: createdPropertyId,
          coverImage: updateData.coverImageUrl,
          imagesCount: updateData.images?.length
        });
        
        // Usar rutas relativas - Vercel actúa como puente
        const updateUrl = `/api/projects/${createdPropertyId}`;
        const publishUrl = `/api/projects/${createdPropertyId}/publish`;
    

        // 1. Primero actualizar multimedia
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });

        if (updateResponse.ok) {
          console.log(' Proyecto actualizado correctamente');
          
          // 2. Si puede publicar, publicar también
          if (canPublish) {
            try {
              const publishResponse = await fetch(publishUrl, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
              });
              
              if (publishResponse.ok) {
                toast.success('¡Proyecto publicado! 🎉');
                router.push('/my-projects');
                return;
              } else {
                const publishError = await publishResponse.json();
                console.warn('No se pudo publicar automáticamente:', publishError);
              }
            } catch (publishError) {
              console.warn('Error al publicar:', publishError);
            }
          }
          
          // Si llegó aquí: se guardó como borrador (no se pudo o no se debía publicar)
          if (!canPublish) {
            // Mostrar modal de plan expirado y redirigir a lista de proyectos
            setShowPlanExpiredModal(true);
            router.push('/my-projects');
          } else {
            toast.success('¡Proyecto guardado como borrador! 📝');
            router.push('/my-projects');
          }

        } else {
          const error = await updateResponse.json();
          toast.error(error.message || 'Error al guardar el proyecto');
        }
      } catch (error) {
        toast.error('Error al guardar el proyecto');
      }
    } else if (mode === 'create' && formType === 'project' && !createdPropertyId) {
      // Crear proyecto y redirigir (se creó como DRAFT en handleNext)
      toast.success('Proyecto guardado como BORRADOR');
      router.push('/my-projects'); //  Redirigir a mis-proyectos
    } else if (mode === 'create' && formType !== 'project') {
      // Para propiedades, redirigir al historial
      if (createdPropertyId) {
        router.push('/my-properties');
      } else {
        const createData = prepareCreateData(formData);
        createMutation.mutate(createData, {
          onSuccess: () => router.push('/my-properties'),
          onError: (error: any) => {
            toast.error('Error al guardar la propiedad');
          },
        });
      }
    } else if (property) {
      if (formType === 'project') {
        const projectData = prepareProjectData(formData);
        try {
          await updateProjectMutation.mutateAsync({
            projectId: property.id,
            projectData,
          });
          router.push('/my-projects');
        } catch {
          toast.error('Error al guardar el proyecto');
        }
      } else {
        // Actualizar propiedad existente
        updateMutation.mutate(
          {
            id: property.id,
            data: {
              userId: user!.id,
              price: formData.price,
              description: formData.description,
              bedrooms: formData.bedrooms,
              bathrooms: formData.bathrooms,
              parkingSpots: formData.parking,
              totalArea: formData.totalArea,
              maintenanceFee: formData.maintenanceFee,
            },
          },
          {
            onSuccess: () => router.push('/my-properties'),
            onError: () => toast.error('Error al guardar la propiedad'),
          }
        );
      }
    }
  };

  const ActiveComponent = currentStepComponents[currentStep];
  const isLoading = createMutation.isPending || updateMutation.isPending || createProjectMutation.isPending || updateProjectMutation.isPending;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      <UpgradePlanModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <PlanExpiredModal isOpen={showPlanExpiredModal} onClose={() => setShowPlanExpiredModal(false)} />


      {/* ── STEP HEADER ── */}
      <div className="mb-8">
        <p style={{ color: 'var(--brand-primary)' }} className="text-xs font-bold uppercase tracking-widest mb-1">
          Paso {currentStep} de {totalSteps}
        </p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          {currentSteps[currentStep - 1].title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          {currentStep === 3 && currentSteps[2].description === 'Departamentos disponibles' && formData.projectType === 'LOTIZATION'
            ? 'Lotes disponibles'
            : currentSteps[currentStep - 1].description}
        </p>
        {/* Mostrar errores solo al lado de cada campo; no resumir globalmente aquí */}
      </div>

      {/* ── STEP CONTENT (con contenedor robusto) ── */}
      <div className="min-h-[400px] w-full">
        <div className="bg-[var(--bg-card)] rounded-lg p-4 sm:p-6">
          <ActiveComponent
            formData={formData}
            onChange={handleChange}
            propertyId={createdPropertyId}
            projectId={createdPropertyId}
            groupBlueprintFiles={formData.groupBlueprintFiles}
            validationErrors={validationErrors}
            projectType={formData.projectType}
          />
        </div>
      </div>

       <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 pt-6 border-t border-[var(--border-color)]">

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)]"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            
            {/* Botón de Guardar Borrador visible para proyectos */}
            {formType === 'project' && !createdPropertyId && currentStep === 5 && (
              <button
                onClick={async () => {
                  console.log('DEBUG - Datos actuales del formulario:', formData);
                  
                  try {
                    // FIX: Primero subir planos de unidades si existen
                    if (formData.unitBlueprintFiles || formData.groupBlueprintFiles) {
                      console.log('Subiendo planos de unidades antes de guardar...');
                      
                      // Obtener referencia al componente ProjectMultimediaStep
                      const multimediaStepRef = document.querySelector('[data-multimedia-step]') as any;
                      if (multimediaStepRef && multimediaStepRef.uploadUnitBlueprints) {
                        const uploadedBlueprints = await multimediaStepRef.uploadUnitBlueprints();
                        console.log('Planos subidos:', uploadedBlueprints);
                        
                        // FIX: Actualizar las unidades y grupos con las URLs subidas
                        const updatedUnits = Array.isArray(formData.units) ? formData.units.map((unit: any) => {
                          if (uploadedBlueprints[unit.id]) {
                            return { ...unit, blueprintImage: uploadedBlueprints[unit.id] };
                          }
                          return unit;
                        }) : [];
                        
                        const updatedGroups = Array.isArray((formData as any).groups) ? (formData as any).groups.map((group: any) => {
                          if (uploadedBlueprints[group.id]) {
                            return { ...group, blueprintImage: uploadedBlueprints[group.id] };
                          }
                          return group;
                        }) : [];
                        
                        // Actualizar formData con las URLs
                        const updatedFormData = {
                          ...formData,
                          units: updatedUnits,
                          groups: updatedGroups
                        };
                        
                        console.log('Guardando proyecto con planos actualizados:', updatedFormData);
                        
                        const projectData = prepareProjectData(updatedFormData);
                        createProjectMutation.mutate(projectData, {
                          onSuccess: (result: any) => { 
                            console.log('Proyecto guardado como BORRADOR:', result);
                            toast.success('Proyecto guardado como BORRADOR');
                            router.push('/my-projects'); // Redirigir a borradores
                          },
                          onError: (error: any) => {
                            console.error('Error guardando borrador:', error);
                            toast.error('Error al guardar el borrador');
                          }
                        });
                      } else {
                        console.warn('No se encontro la funcion uploadUnitBlueprints');
                        // Guardar sin planos si no se encuentra la función
                        const projectData = prepareProjectData(formData);
                        createProjectMutation.mutate(projectData, {
                          onSuccess: (result: any) => { 
                            console.log('Proyecto guardado como BORRADOR:', result);
                            toast.success('Proyecto guardado como BORRADOR');
                            router.push('/my-projects'); // Redirigir a borradores
                          },
                          onError: (error: any) => {
                            console.error('Error guardando borrador:', error);
                            toast.error('Error al guardar el borrador');
                          }
                        });
                      }
                    } else {
                      // Guardar normalmente si no hay planos
                      const projectData = prepareProjectData(formData);
                      createProjectMutation.mutate(projectData, {
                        onSuccess: (result: any) => { 
                          console.log('Proyecto guardado como BORRADOR:', result);
                          toast.success('Proyecto guardado como BORRADOR');
                          router.push('/my-projects'); // Redirigir a borradores
                        },
                        onError: (error: any) => {
                          console.error('Error guardando borrador:', error);
                          toast.error('Error al guardar el borrador');
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Error en el proceso de guardado:', error);
                    toast.error('Error al guardar el proyecto');
                  }
                }}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"

              >
                <FileText className="w-4 h-4" />
                Guardar Borrador
              </button>
            )}
          </div>

           <button
             onClick={isLastStep ? handleSubmit : handleNext}
             disabled={isLoading}
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : isLastStep ? (
              <>
                {mode === 'create' ? (
                  formType === 'project' 
                    ? (canPublish ? ' Publicar Proyecto' : ' Guardar Borrador')
                    : 'Finalizar'
                ) : 'Guardar cambios'}
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
    </>
  );
}