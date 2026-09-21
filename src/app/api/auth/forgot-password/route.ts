import { NextRequest, NextResponse } from 'next/server';
import { serverEnv } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('Forgot password - Email:', email);

    if (!email) {
      return NextResponse.json(
        { message: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Conectar con el backend real
    try {
      const backendUrl = serverEnv.backendUrl;
      // El backend SÍ tiene context-path /api (confirmado en logs)
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });


      console.log(`Backend response: ${response.status}`);

      // ✅ Si el backend responde 200 sin cuerpo (Void), retornar éxito directo
      if (response.ok) {
        return NextResponse.json(
          { message: 'Si el email está registrado, recibirás las instrucciones para recuperar tu contraseña' },
          { status: 200 }
        );
      }

      // Solo intentar parsear JSON si hay error
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Backend no devuelve JSON:', text.substring(0, 100));
        return NextResponse.json(
          { message: 'Error del servidor' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(
        { message: data.message || 'Error al procesar la solicitud' },
        { status: response.status }
      );
    } catch (fetchError) {
      console.error('Error conectando al backend:', fetchError);
      return NextResponse.json(
        { message: 'No se puede conectar con el backend' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error en forgot password:', error);
    return NextResponse.json(
      { message: 'Error del servidor. Inténtalo nuevamente' },
      { status: 500 }
    );
  }
}
