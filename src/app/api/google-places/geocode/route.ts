import { NextRequest, NextResponse } from 'next/server';

// Convierte una dirección escrita (calle, número, distrito...) en coordenadas con
// Google Geocoding API. Se llama desde el servidor para no exponer parámetros ni depender
// de restricciones de referrer. Limitado a Perú.

const GOOGLE_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  const address = new URL(request.url).searchParams.get('address');

  if (!address || address.trim().length < 3) {
    return NextResponse.json({ error: 'Missing or invalid address parameter' }, { status: 400 });
  }
  if (!GOOGLE_KEY) {
    return NextResponse.json({ status: 'NO_API_KEY' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      address,
      key: GOOGLE_KEY,
      components: 'country:PE',
      language: 'es',
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
      { cache: 'no-store' }
    );
    if (!response.ok) throw new Error(`Google Geocoding HTTP ${response.status}`);

    const data = await response.json();

    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ status: 'ZERO_RESULTS' });
    }
    if (data.status !== 'OK' || !data.results?.length) {
      throw new Error(`Google Geocoding ${data.status}: ${data.error_message || ''}`);
    }

    const best = data.results[0];
    return NextResponse.json({
      status: 'OK',
      lat: best.geometry.location.lat,
      lng: best.geometry.location.lng,
      formatted_address: best.formatted_address,
      // ROOFTOP / RANGE_INTERPOLATED = exacta; GEOMETRIC_CENTER / APPROXIMATE = aproximada.
      location_type: best.geometry.location_type,
    });
  } catch (error) {
    console.error('[google-places/geocode]', error);
    return NextResponse.json({ status: 'UNKNOWN_ERROR' }, { status: 502 });
  }
}
