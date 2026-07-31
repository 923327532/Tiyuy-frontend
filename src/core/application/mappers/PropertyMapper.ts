import { Property, PropertySummary } from '@/core/domain/entities/Property';
import { PropertyResponseDTO } from '../dtos/PropertyDTO';

export class PropertyMapper {
  static toDomain(dto: PropertyResponseDTO): Property {
    const anyDto = dto as any;

    const safeLocation = anyDto.location || {
      fullAddress: '',
      district: anyDto.district || '',
      province: anyDto.province || '',
      region: anyDto.region || 'Lima',
      latitude: anyDto.latitude,
      longitude: anyDto.longitude,
    };

    // Owner viene como campos planos desde el backend
    const ownerName = 
      `${anyDto.ownerFirstName || ''} ${anyDto.ownerLastName || ''}`.trim() || 
      anyDto.ownerEmail || 
      'Usuario';

    const safeMedia = Array.isArray(anyDto.media)
      ? anyDto.media
      : Array.isArray(anyDto.images)
        ? anyDto.images
        : [];

    const slug = String(anyDto.slug || anyDto.seo?.slug || '').trim();
    const createdAtRaw = anyDto.createdAt || anyDto.updatedAt;
    const createdAt = createdAtRaw ? new Date(createdAtRaw) : undefined;

    return {
      id: dto.id,
      title: anyDto.title,
      type: (anyDto.type || 'APARTMENT') as any,
      transactionType: (anyDto.transactionType || 'SALE') as any,
      status: (anyDto.status || 'DRAFT') as any,
      price: Number(anyDto.price || 0),
      currency: (anyDto.currency || 'PEN') as any,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      totalArea: dto.totalArea,
      description: anyDto.description,

      location: {
        fullAddress: safeLocation.fullAddress || '',
        district: safeLocation.district || '',
        province: safeLocation.province || '',
        region: safeLocation.region || 'Lima',
        latitude: safeLocation.latitude,
        longitude: safeLocation.longitude,
        showExactAddress: Boolean(safeLocation.showExactAddress ?? true),
      },

      media: safeMedia.map((m: any, index: number) => ({
        id: m.id ?? index,
        url: m.url,
        webpUrl: m.webpUrl,
        type: (m.type || m.mediaType || 'IMAGE') as any,
        isCover: Boolean(m.isCover),
        order: m.order ?? m.displayOrder ?? index,
      })),

      coverPhotoUrl: anyDto.coverPhotoUrl || undefined,

      owner: {
        id: Number(anyDto.ownerId || 0),
        name: ownerName,
        email: String(anyDto.ownerEmail || ''),
        phone: '',
        role: anyDto.ownerRole || 'USER',
      },

      seo: {
        slug,
        seoTitle: anyDto.seoTitle || anyDto.title || '',
        seoDescription: anyDto.seoDescription || anyDto.description || '',
        seoKeywords: [],
        canonicalUrl: anyDto.canonicalUrl || `https://tiyuy.com/propiedad/${slug}`,
      },

      viewsCount: Number(anyDto.viewsCount || 0),
      favoritesCount: Number(anyDto.favoritesCount || 0),
      contactsCount: Number(anyDto.contactsCount || 0),
      isFeatured: Boolean(anyDto.isFeatured),
      isVerified: Boolean(anyDto.isVerified),

      createdAt: (createdAt ?? undefined) as Date,
      updatedAt: anyDto.updatedAt ? new Date(anyDto.updatedAt) : (createdAt as Date | undefined),
      publishedAt: anyDto.publishedAt
        ? new Date(anyDto.publishedAt)
        : (createdAt ?? undefined),

      isNegotiable: false,
      parkingSpots: Number(anyDto.parkingSpots || 0),

      // Lifecycle fields
      lifecycleStatus: anyDto.lifecycleStatus || 'ACTIVE',
      remainingGraceDays: anyDto.remainingGraceDays,
      gracePeriodEnd: anyDto.gracePeriodEnd ? new Date(anyDto.gracePeriodEnd) : undefined,
      canReactivate: anyDto.canReactivate,
    };
  }

  static toSummary(dto: PropertyResponseDTO): PropertySummary {
    const anyDto = dto as any;
    const district = dto.location?.district ?? anyDto.district ?? '';
    const province = dto.location?.province ?? anyDto.province ?? '';

    return {
      id: dto.id,
      slug: dto.slug,
      title: (dto as any).title || '',
      type: dto.type as any,
      transactionType: dto.transactionType as any,
      status: ((anyDto.status || 'DRAFT') as any),
      price: dto.price,
      currency: dto.currency as any,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      totalArea: dto.totalArea,
      district,
      province,
      coverPhotoUrl: dto.coverPhotoUrl || undefined,
      isFeatured: dto.isFeatured,
      isVerified: false,
      viewsCount: dto.viewsCount,
      publishedAt: (anyDto as any).publishedAt
        ? new Date((anyDto as any).publishedAt)
        : (anyDto as any).createdAt
          ? new Date((anyDto as any).createdAt)
          : undefined,

      // Lifecycle fields
      lifecycleStatus: (anyDto as any).lifecycleStatus || 'ACTIVE',
      remainingGraceDays: (anyDto as any).remainingGraceDays,
    };
  }
}
