'use client';

import { usePropertyById } from '@/presentation/hooks/useProperties';
import { PropertyDetailEditable } from '@/presentation/components/property/PropertyDetail/PropertyDetailEditable';
import { ProtectedRoute } from '@/presentation/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function EditPropertyClient({ id }: { id: number }) {
  const { data: property, isLoading } = usePropertyById(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Propiedad no encontrada</h2>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <PropertyDetailEditable property={property} onSave={handleSave} />
    </ProtectedRoute>
  );
}
