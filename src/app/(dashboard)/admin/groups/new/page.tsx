'use client';

import { toast } from 'sonner';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  FileText,
  Globe,
  MapPin,
  Settings2,
  User,
} from 'lucide-react';

import { axiosClient } from '@/infrastructure/api/axios-client';
import { Input, Textarea } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import {
  PremiumFormSection,
  PremiumFormView,
} from '@/presentation/components/ui/PremiumForm';

interface GroupFormData {
  name: string;
  description: string;
  adminName: string;
  adminEmail: string;
  city: string;
  isActive: boolean;
}

const INITIAL_FORM_DATA: GroupFormData = {
  name: '',
  description: '',
  adminName: '',
  adminEmail: '',
  city: '',
  isActive: true,
};

export default function NewGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<GroupFormData>(INITIAL_FORM_DATA);

  const createGroupMutation = useMutation({
    mutationFn: async (payload: GroupFormData) => {
      const response = await axiosClient.post('/admin/groups', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Grupo creado exitosamente');
      router.push('/admin/groups');
    },
    onError: (error: Error) => {
      toast.error('Error al crear grupo: ' + error.message);
    },
  });

  const updateField = <K extends keyof GroupFormData>(key: K, value: GroupFormData[K]) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.adminEmail.trim()) {
      toast.warning('Completa el nombre del grupo y el email del administrador.');
      return;
    }

    createGroupMutation.mutate({
      ...formData,
      name: formData.name.trim(),
      adminEmail: formData.adminEmail.trim(),
      adminName: formData.adminName.trim(),
      city: formData.city.trim(),
    });
  };

  return (
    <div className="admin-page space-y-4 sm:space-y-6">
      <PremiumFormView
        eyebrow="GestiÃƒÂ³n de grupos y canales"
        title="Crear grupo"
        description="Registra un nuevo grupo de la red social con su informaciÃƒÂ³n bÃƒÂ¡sica, administrador y estado inicial."
        backHref="/admin/groups"
        onSubmit={handleSubmit}
        submitLabel="Crear grupo"
        cancelHref="/admin/groups"
        isSubmitting={createGroupMutation.isPending}
        asideTitle="Checklist rÃƒÂ¡pido"
        asideDescription="Esta vista es reutilizable para los formularios del panel. El estilo se puede ajustar en un solo lugar."
        asideItems={[
          'El nombre debe ser fÃƒÂ¡cil de identificar para los miembros.',
          'El administrador serÃƒÂ¡ el responsable del grupo.',
          'Puedes cambiar el estado desde el listado de grupos.',
        ]}
      >
        <PremiumFormSection
          icon={<FileText className="h-5 w-5" />}
          title="InformaciÃƒÂ³n bÃƒÂ¡sica"
          description="Datos principales que identifican al grupo dentro de la comunidad."
          columns={2}
        >
          <Input
            label="Nombre del grupo *"
            value={formData.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ej. Grupo Tiyuy Lima"
            leftIcon={<FileText className="h-4 w-4" />}
          />
          <Input
            label="Ciudad"
            value={formData.city}
            onChange={(event) => updateField('city', event.target.value)}
            placeholder="Ej. Lima"
            leftIcon={<MapPin className="h-4 w-4" />}
          />
          <div className="premium-form__span-all">
            <Textarea
              label="DescripciÃƒÂ³n"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Describe el propÃƒÂ³sito y las actividades del grupo..."
              rows={4}
            />
          </div>
        </PremiumFormSection>

        <PremiumFormSection
          icon={<User className="h-5 w-5" />}
          title="Administrador"
          description="Persona responsable de gestionar el grupo y sus miembros."
          columns={2}
        >
          <Input
            label="Nombre del administrador"
            value={formData.adminName}
            onChange={(event) => updateField('adminName', event.target.value)}
            placeholder="Nombre completo"
            leftIcon={<User className="h-4 w-4" />}
          />
          <Input
            label="Email del administrador *"
            type="email"
            value={formData.adminEmail}
            onChange={(event) => updateField('adminEmail', event.target.value)}
            placeholder="admin@ejemplo.com"
            leftIcon={<Globe className="h-4 w-4" />}
          />
        </PremiumFormSection>

        <PremiumFormSection
          icon={<Settings2 className="h-5 w-5" />}
          title="Estado inicial"
          description="Define si el grupo estarÃƒÂ¡ disponible desde el momento de su creaciÃƒÂ³n."
        >
          <Select
            label="Estado"
            value={formData.isActive ? 'active' : 'inactive'}
            onChange={(value) => updateField('isActive', value === 'active')}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
          />
        </PremiumFormSection>
      </PremiumFormView>
    </div>
  );
}
