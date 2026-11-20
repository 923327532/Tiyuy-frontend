import { NextRequest, NextResponse } from 'next/server';

// Detalle de un lugar con Google Places: coordenadas exactas + distrito/provincia/región.
// Responde en el mismo formato que espera useGooglePlaces (address_components con
// tipos locality / administrative_area_level_2 / administrative_area_level_1).
// Si el place_id viene como "lat,lon" (sugerencia de respaldo Nominatim) o Google falla,
// se usa reverse geocoding de Nominatim.

const GOOGLE_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

const COORDS_RE = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

const cleanProvince = (s: string) => s.replace(/^(Provincia|Province) (de|of) /i, '').trim();
const cleanRegion = (s: string) =>
  s.replace(/^(Departamento|Región|Region|Provincia|Province) (de|of) /i, '').replace(/ (Region|Department)$/i, '').trim();

function findComponent(components: any[], ...types: string[]) {
  for (const type of types) {
    const c = components.find((x) => (x.types || []).includes(type));
    if (c) return c;
  }
  return null;
}

async function detailsGoogle(placeId: string) {
  if (!GOOGLE_KEY) return null;

  const params = new URLSearchParams({
    place_id: placeId,
    key: GOOGLE_KEY,
    language: 'es',
    fields: 'place_id,name,formatted_address,geometry/location,address_component',
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
    { cache: 'no-store' }
  );
  if (!response.ok) throw new Error(`Google Places HTTP ${response.status}`);

  const data = await response.json();
  if (data.status !== 'OK' || !data.result) {
    throw new Error(`Google Places ${data.status}: ${data.error_message || ''}`);
  }

  const r = data.result;
  const comps: any[] = r.address_components || [];

  // En Perú: distrito = locality (o sublocality), provincia = admin_level_2, región = admin_level_1.
  const district = findComponent(comps, 'locality', 'sublocality_level_1', 'administrative_area_level_3');
  const province = findComponent(comps, 'administrative_area_level_2');
  const region = findComponent(comps, 'administrative_area_level_1');
  const country = findComponent(comps, 'country');

  const address_components = [
    district && {
      long_name: district.long_name,
      short_name: district.short_name,
      types: ['locality', 'sublocality'],
    },
    province && {
      long_name: cleanProvince(province.long_name),
      short_name: cleanProvince(province.short_name),
      types: ['administrative_area_level_2'],
    },
    region && {
      long_name: cleanRegion(region.long_name),
      short_name: cleanRegion(region.short_name),
      types: ['administrative_area_level_1', 'political'],
    },
    country && {
      long_name: country.long_name,
      short_name: country.short_name,
      types: ['country', 'political'],
    },
  ].filter(Boolean);

  return {
    place_id: r.place_id || placeId,
    name: r.name || '',
    formatted_address: r.formatted_address || '',
    geometry: { location: { lat: r.geometry.location.lat, lng: r.geometry.location.lng } },
    address_components,
  };
}

async function detailsNominatim(placeId: string) {
  const [lat, lon] = placeId.split(',');
  if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
    throw new Error('Invalid coordinates');
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=es`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Tiyuy-Frontend' } });
  if (!response.ok) throw new Error(`Nominatim HTTP ${response.status}`);

  const data = await response.json();
  const a = data.address || {};
  const district = a.suburb || a.city_district || a.city || a.town || '';
  const province = a.city || a.town || a.county || '';

  return {
    place_id: `${lat},${lon}`,
    name: data.name || district,
    formatted_address: data.display_name || '',
    geometry: { location: { lat: parseFloat(lat), lng: parseFloat(lon) } },
    address_components: [
      { long_name: district, short_name: district, types: ['locality', 'sublocality'] },
      { long_name: province, short_name: province, types: ['administrative_area_level_2'] },
      { long_name: a.state || '', short_name: a.state || '', types: ['administrative_area_level_1', 'political'] },
      { long_name: a.country || '', short_name: a.country_code || '', types: ['country', 'political'] },
    ].filter((c) => c.long_name),
  };
}

export async function GET(request: NextRequest) {
  const placeId = new URL(request.url).searchParams.get('place_id');

  if (!placeId) {
    return NextResponse.json({ error: 'Missing place_id parameter' }, { status: 400 });
  }

  // Sugerencia de respaldo (coordenadas): no es un place_id de Google.
  if (!COORDS_RE.test(placeId)) {
    try {
      const result = await detailsGoogle(placeId);
      if (result) return NextResponse.json({ status: 'OK', result, source: 'google' });
    } catch (error) {
      console.error('[google-places/details] Google falló:', error);
    }
    return NextResponse.json({ status: 'UNKNOWN_ERROR' }, { status: 502 });
  }

  try {
    const result = await detailsNominatim(placeId);
    return NextResponse.json({ status: 'OK', result, source: 'nominatim' });
  } catch (error) {
    console.error('[google-places/details] Nominatim falló:', error);
    return NextResponse.json({ status: 'UNKNOWN_ERROR' }, { status: 502 });
  }
}
