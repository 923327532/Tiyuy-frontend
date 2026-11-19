import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('place_id');

  if (!placeId) {
    return NextResponse.json(
      { error: 'Missing place_id parameter' },
      { status: 400 }
    );
  }

  try {
    const [lat, lon] = placeId.split(',');
    
    if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      throw new Error('Invalid coordinates');
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=es`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Tiyuy-Frontend',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const result = {
      place_id: `${lat},${lon}`,
      name: data.name || data.address?.suburb || data.address?.city || data.address?.town || '',
      formatted_address: data.display_name || '',
      geometry: {
        location: {
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        },
      },
      address_components: data.address ? [
        {
          long_name: data.address.suburb || data.address.city_district || data.address.city || data.address.town || '',
          short_name: data.address.suburb || data.address.city_district || data.address.city || data.address.town || '',
          types: ['locality', 'sublocality'],
        },
        {
          long_name: data.address.city || data.address.town || data.address.county || '',
          short_name: data.address.city || data.address.town || data.address.county || '',
          types: ['administrative_area_level_2'],
        },
        {
          long_name: data.address.state || '',
          short_name: data.address.state || '',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: data.address.country || '',
          short_name: data.address.country_code || '',
          types: ['country', 'political'],
        },
      ].filter(c => c.long_name) : [],
    };
    
    return NextResponse.json({ status: 'OK', result }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error in Nominatim reverse geocoding:', error);
    
    return NextResponse.json({
      status: 'OK',
      result: {
        place_id: placeId,
        name: 'Ubicación',
        formatted_address: 'Perú',
        geometry: {
          location: {
            lat: parseFloat(placeId.split(',')[0] || '-12.0464'),
            lng: parseFloat(placeId.split(',')[1] || '-77.0428'),
          },
        },
        address_components: [],
      },
    }, {
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
