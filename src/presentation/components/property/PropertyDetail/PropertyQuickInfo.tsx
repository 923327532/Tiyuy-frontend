import { Property } from '@/core/domain/entities/Property';
import { Icon } from '@iconify/react';
import { Bath, Building2, CalendarDays, Move } from 'lucide-react';

interface PropertyQuickInfoProps {
  property: Property;
}

export function PropertyQuickInfo({ property }: PropertyQuickInfoProps) {
  const currentYear = new Date().getFullYear();
  const buildYear = property.constructionYear ?? (property.age ? currentYear - property.age : null);
  const age = buildYear ? `${buildYear} años` : '—';

  const stats: { icon: React.ReactNode; value: string }[] = [];

  const isRoom = property.type === 'ROOM';
  // roomDetails SOLO viene del backend (RoomDetails): hasPrivateBathroom y totalCapacity.
  // Si el backend no lo devuelve, NO mostramos datos falsos por defecto.
  const roomDetails = (property as any).roomDetails;
  const hasPrivateBathroom = roomDetails ? Boolean(roomDetails.hasPrivateBathroom) : undefined;
  const roomArea = (property as any).roomArea;
  const totalCapacity = roomDetails ? roomDetails.totalCapacity : undefined;

  // Área: para habitaciones se usa roomArea; para el resto totalArea
  const areaValue = isRoom ? (roomArea ?? property.totalArea) : property.totalArea;
  if (areaValue) {
    stats.push({
      icon: (
        <Move className="w-5 h-5" />
      ),
      value: `${areaValue.toLocaleString('es-PE')} m² tot.`,
    });
  }

  if (property.builtArea) {
    stats.push({
      icon: (
        <Building2 className="w-5 h-5" />
      ),
      value: `${property.builtArea.toLocaleString('es-PE')} m² cub.`,
    });
  }

  // Baños: para habitaciones mostrar tipo de baño SOLO si el backend lo devuelve
  if (isRoom && hasPrivateBathroom !== undefined) {
    stats.push({
      icon: (
        <Bath className="w-5 h-5" />
      ),
      value: hasPrivateBathroom ? 'Baño propio' : 'Baño compartido',
    });
  } else if (!isRoom && property.bathrooms != null) {
    stats.push({
      icon: (
        <Bath className="w-5 h-5" />
      ),
      value: `${property.bathrooms} baño${property.bathrooms !== 1 ? 's' : ''}`,
    });
  }

  // Dormitorios: no aplica para habitaciones
  if (!isRoom && property.bedrooms != null) {
    stats.push({
      icon: (
        <CalendarDays className="w-5 h-5" />
      ),
      value: `${property.bedrooms} dorm.`,
    });
  }

  if (property.parkingSpots != null && property.parkingSpots > 0) {
    stats.push({
      icon: (
        <Icon icon="mdi:parking" className="w-5 h-5" />
      ),
      value: `${property.parkingSpots} estac.`,
    });
  }

  // Edad: para habitaciones no aplica; se muestra capacidad máxima en su lugar
  if (isRoom && totalCapacity) {
    stats.push({
      icon: (
        <CalendarDays className="w-5 h-5" />
      ),
      value: `Capacidad ${totalCapacity} pers.`,
    });
  } else {
    stats.push({
      icon: (
        <CalendarDays className="w-5 h-5" />
      ),
      value: age,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-2 text-[var(--text-primary)]">
          <span className="text-[var(--text-secondary)] w-5 h-5 flex items-center justify-center">{stat.icon}</span>
          <span className="text-sm font-semibold">{stat.value}</span>
        </div>
      ))}
    </div>
  );
}