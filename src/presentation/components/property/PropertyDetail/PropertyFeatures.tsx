import { Bed, Bath, Maximize2, Car, Layers, Calendar } from 'lucide-react';
import { Property } from '@/core/domain/entities/Property';

const BedIcon = () => <Bed className="w-5 h-5 text-[var(--text-secondary)]" />;
const BathIcon = () => <Bath className="w-5 h-5 text-[var(--text-secondary)]" />;
const AreaIcon = () => <Maximize2 className="w-5 h-5 text-[var(--text-secondary)]" />;
const CarIcon = () => <Car className="w-5 h-5 text-[var(--text-secondary)]" />;
const FloorIcon = () => <Layers className="w-5 h-5 text-[var(--text-secondary)]" />;
const CalendarIcon = () => <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />;

interface PropertyFeaturesProps {
  property: Property;
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const features = [
    { icon: <BedIcon />, label: 'Dormitorios', value: property.bedrooms },
    { icon: <BathIcon />, label: 'Baños', value: property.bathrooms },
    { icon: <CarIcon />, label: 'Estacionamientos', value: property.parkingSpots },
    { icon: <AreaIcon />, label: 'Área total', value: property.totalArea ? `${property.totalArea} m²` : null },
    { icon: <AreaIcon />, label: 'Área construida', value: property.builtArea ? `${property.builtArea} m²` : null },
    { icon: <FloorIcon />, label: 'Piso', value: property.floor },
    { icon: <CalendarIcon />, label: 'Antigüedad', value: property.age ? `${property.age} años` : null },
  ].filter((f) => f.value);

  return (
    <div className="bg-[var(--bg-card)] rounded-lg shadow-[0_4px_6px_var(--shadow-color)] p-6">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Características</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
            {feature.icon}
            <div>
              <p className="text-xs text-[var(--text-secondary)]">{feature.label}</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{feature.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
