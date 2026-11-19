import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Missing or invalid query parameter' },
      { status: 400 }
    );
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=pe&limit=5&addressdetails=1&accept-language=es`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Tiyuy-Frontend',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const predictions = data.map((item: any) => ({
      place_id: `${item.lat},${item.lon}`,
      description: item.display_name,
      structured_formatting: {
        main_text: item.address?.suburb || item.address?.city || item.address?.town || item.name || query,
        secondary_text: [item.address?.district, item.address?.city, item.address?.state, item.address?.country].filter(Boolean).join(', ') || item.display_name,
      },
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      address: item.address,
    }));
    
    return NextResponse.json({ predictions, status: 'OK' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error in Nominatim proxy:', error);
    
    return NextResponse.json({ predictions: [], status: 'OK' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
