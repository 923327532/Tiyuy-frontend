import { NextRequest, NextResponse } from 'next/server';

// Autocomplete de direcciones con Google Places (API clásica).
// La key se lee en el servidor; nunca se expone al navegador desde esta ruta.
// Si Google falla o no hay key, se usa Nominatim (OpenStreetMap) como respaldo.

const GOOGLE_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

async function searchGoogle(query: string) {
  if (!GOOGLE_KEY) return null;

  const params = new URLSearchParams({
    input: query,
    key: GOOGLE_KEY,
    components: 'country:pe',
    language: 'es',
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
    { cache: 'no-store' }
  );
  if (!response.ok) throw new Error(`Google Places HTTP ${response.status}`);

  const data = await response.json();

  if (data.status === 'ZERO_RESULTS') return [];
  if (data.status !== 'OK') {
    throw new Error(`Google Places ${data.status}: ${data.error_message || ''}`);
  }

  return (data.predictions || []).map((p: any) => ({
    place_id: p.place_id,
    description: p.description,
    structured_formatting: {
      main_text: p.structured_formatting?.main_text || p.description,
      secondary_text: p.structured_formatting?.secondary_text || '',
    },
  }));
}

async function searchNominatim(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pe&limit=5&addressdetails=1&accept-language=es`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Tiyuy-Frontend' } });
  if (!response.ok) throw new Error(`Nominatim HTTP ${response.status}`);

  const data = await response.json();
  return data.map((item: any) => ({
    // Formato "lat,lon": la ruta details lo reconoce y usa reverse geocoding.
    place_id: `${item.lat},${item.lon}`,
    description: item.display_name,
    structured_formatting: {
      main_text:
        item.address?.suburb || item.address?.city || item.address?.town || item.name || query,
      secondary_text:
        [item.address?.district, item.address?.city, item.address?.state, item.address?.country]
          .filter(Boolean)
          .join(', ') || item.display_name,
    },
  }));
}

export async function GET(request: NextRequest) {
  const query = new URL(request.url).searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Missing or invalid query parameter' }, { status: 400 });
  }

  try {
    const predictions = await searchGoogle(query);
    if (predictions) return NextResponse.json({ predictions, status: 'OK', source: 'google' });
  } catch (error) {
    console.error('[google-places/autocomplete] Google falló, usando Nominatim:', error);
  }

  try {
    const predictions = await searchNominatim(query);
    return NextResponse.json({ predictions, status: 'OK', source: 'nominatim' });
  } catch (error) {
    console.error('[google-places/autocomplete] Nominatim falló:', error);
    return NextResponse.json({ predictions: [], status: 'OK', source: 'none' });
  }
}
