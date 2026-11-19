import React from 'react';
import {
  Home, Building2, Building, LandPlot, Store, Warehouse, Factory,
  TrendingUp, BadgeDollarSign,
  Newspaper, CalendarDays, Tag, Flame, 
  HardHat, Palette,
  Scale, FileText, CreditCard, Landmark, ShieldCheck,
  Truck, Wrench, Sprout,
  MapPin, Compass, Mountain, Trees, Waves, 
  Castle, Umbrella, Snowflake,
  Star, Sparkles, Target, Trophy,
  Globe, Sun, Moon, Cloud,
  type LucideIcon,
} from 'lucide-react';

interface IconEntry {
  icon: LucideIcon;
  keywords: string[];
}

const ENTITY_ICONS: IconEntry[] = [
  { icon: Home, keywords: ['alquiler', 'renta', 'rent', 'casa', 'hogar', 'residencial'] },
  { icon: BadgeDollarSign, keywords: ['vendo', 'vender', 'venta', 'sale', 'comprar'] },
  { icon: LandPlot, keywords: ['terreno', 'lote', 'parcela'] },
  { icon: TrendingUp, keywords: ['inversion', 'inversión', 'invertir', 'plusvalía'] },
  { icon: Building2, keywords: ['lima'] },
  { icon: Mountain, keywords: ['arequipa'] },
  { icon: Castle, keywords: ['cusco'] },
  { icon: Building, keywords: ['trujillo'] },
  { icon: Umbrella, keywords: ['piura'] },
  { icon: Trees, keywords: ['chiclayo'] },
  { icon: Sun, keywords: ['ica'] },
  { icon: Snowflake, keywords: ['huaraz', 'puno', 'cajamarca'] },
  { icon: Waves, keywords: ['tarapoto'] },
  { icon: Compass, keywords: ['huancayo'] },
  { icon: Newspaper, keywords: ['noticia', 'noticias', 'blog', 'novedad'] },
  { icon: CalendarDays, keywords: ['evento', 'eventos', 'calendario'] },
  { icon: Tag, keywords: ['promocion', 'promoción', 'promociones', 'descuento'] },
  { icon: Flame, keywords: ['oferta', 'ofertas', 'hot'] },
  { icon: HardHat, keywords: ['construccion', 'construcción', 'obra', 'edificio'] },
  { icon: Palette, keywords: ['diseno', 'diseño', 'decoracion', 'decoración', 'interior'] },
  { icon: Scale, keywords: ['legal', 'abogado', 'contrato', 'notaria'] },
  { icon: FileText, keywords: ['tramite', 'trámite', 'tramites', 'documento'] },
  { icon: CreditCard, keywords: ['financiamiento', 'credito', 'préstamo'] },
  { icon: Landmark, keywords: ['hipoteca', 'banco', 'bancario'] },
  { icon: ShieldCheck, keywords: ['seguro', 'seguros', 'proteccion'] },
  { icon: Truck, keywords: ['mudanza', 'flete', 'transporte'] },
  { icon: Sparkles, keywords: ['limpieza'] },
  { icon: Wrench, keywords: ['mantenimiento', 'reparacion', 'reparación', 'técnico'] },
  { icon: Sprout, keywords: ['jardineria', 'jardinería', 'jardin'] },
  { icon: Building, keywords: ['oficina', 'comercial', 'local', 'corporativo'] },
  { icon: Warehouse, keywords: ['almacen', 'depósito', 'galpón'] },
  { icon: Factory, keywords: ['industrial', 'fabrica'] },
  { icon: Store, keywords: ['tienda', 'retail', 'comercio'] },
  { icon: MapPin, keywords: ['ubicación', 'ubicacion', 'zona', 'sector', 'distrito'] },
  { icon: Globe, keywords: ['nacional', 'perú', 'peru', 'país'] },
  { icon: Building2, keywords: ['ciudad', 'metropolitano'] },
  { icon: Star, keywords: ['destacado', 'popular', 'top'] },
  { icon: Sparkles, keywords: ['nuevo', 'nueva', 'estreno', 'reciente'] },
  { icon: Target, keywords: ['meta', 'objetivo', 'proyecto'] },
];

const FALLBACK_ICONS = [
  Building2, Building, Home, LandPlot, Store, Warehouse, Factory,
  MapPin, Compass, Star, Sparkles, Target, Trophy,
  Globe, Sun, Moon, Cloud,
];

export function getEntityIcon(name: string): LucideIcon {
  if (!name) return Building;

  const lower = name.toLowerCase();

  for (const entry of ENTITY_ICONS) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return entry.icon;
      }
    }
  }

  // Deterministic fallback based on name hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_ICONS[hash % FALLBACK_ICONS.length];
}

export function EntityIcon({ name, className = 'w-8 h-8 text-white' }: { name: string; className?: string }) {
  const Icon = getEntityIcon(name);
  return <Icon className={className} />;
}
