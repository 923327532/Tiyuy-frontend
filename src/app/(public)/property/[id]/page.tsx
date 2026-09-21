// src/app/(public)/property/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PropertyRepository } from '@/infrastructure/repositories/PropertyRepository';
import { PropertyDetail } from '@/presentation/components/property/PropertyDetail';
import { TrackPropertyView } from '@/presentation/components/property/TrackPropertyView';
import Script from 'next/script';

interface Props {
  params: Promise<{ id: string }>;
}

const propertyRepo = new PropertyRepository();

// Generar metadata SEO dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const property = await propertyRepo.getBySlug(id);

    if (!property) {
      return {
        title: 'Propiedad no encontrada | TIYUY',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiyuy.com';
    const propertyUrl = `${siteUrl}/property/${id}`;

    return {
      title: `${property.title} | TIYUY`,
      description: property.description || `Propiedad en ${property.location?.district || 'Perú'}`,
      keywords: [
        property.type,
        property.transactionType,
        property.location?.district,
        property.location?.province,
        'inmobiliaria',
        'perú',
        'tiyuy'
      ].filter(Boolean),
      openGraph: {
        url: propertyUrl,
        title: property.title,
        description: property.description || `Propiedad en ${property.location?.district || 'Perú'}`,
        images: property.coverPhotoUrl ? [{
          url: property.coverPhotoUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        }] : [{
          url: '/tiyuy.svg',
          width: 443,
          height: 433,
          alt: 'TIYUY',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: property.title,
        description: property.description || `Propiedad en ${property.location?.district || 'Perú'}`,
        images: property.coverPhotoUrl ? [{
          url: property.coverPhotoUrl,
          alt: property.title,
        }] : ['/tiyuy.svg'],
      },
      alternates: {
        canonical: propertyUrl,
      },
    };
  } catch (error) {
    return {
      title: 'Propiedad no encontrada | TIYUY',
    };
  }
}

export default async function PropertyPage({ params }: Props) {
  let property;

  try {
    const { id } = await params;

    // Lógica dual: ID numérico o slug string
    const numId = Number(id);

    if (!Number.isNaN(numId)) {
      property = await propertyRepo.getById(numId);  // ID numérico
    } else {
      property = await propertyRepo.getBySlug(id);  // Slug string
    }

  } catch (error) {
    notFound();
  }

  // Si no se encontró la propiedad, mostrar 404
  if (!property) {
    notFound();
  }

  // Generar JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: property.coverPhotoUrl,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location?.district,
      addressRegion: property.location?.province,
      addressCountry: 'PE',
    },
  };

  return (
    <>
      <Script
        id="property-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TrackPropertyView propertyId={property.id} />

      <div className="w-full">
        <PropertyDetail property={property} />
      </div>
    </>
  );
}
