import { env } from '@/config/env';

const SOCIAL_LINKS = [
  {
    href: 'https://www.instagram.com/tiyuyperu/',
    label: 'Instagram',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="url(#ig)"/><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5zm-5 13.5A3.5 3.5 0 1 1 12 9a3.5 3.5 0 0 1 0 7zm4.5-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="white"/><defs><linearGradient id="ig" x1="0" y1="0" x2="24" y2="24"><stop stop-color="#f9ce34"/><stop offset="0.5" stop-color="#ee2a7b"/><stop offset="1" stop-color="#6228d7"/></linearGradient></defs></svg>'
  },
  {
    href: 'https://web.facebook.com/profile.php?id=61592199742048',
    label: 'Facebook',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="#1877F2"/><path d="M16 8.5h-2.5V7c0-.6.4-.5.9-.5h1.5V4h-2.5a3 3 0 0 0-3 3v1.5H9V11h2.5v7h3v-7H16L16 8.5z" fill="white"/></svg>'
  },
  {
    href: 'https://x.com/tiyuy6y',
    label: 'X (Twitter)',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="#000"/><path d="M5 5l5.4 7.2L5 19h1.2l4.8-5.4L15 19h5l-5.7-7.6L19 5h-1.2l-4.4 5L10 5H5z" fill="white"/></svg>'
  },

  {
    href: 'https://www.tiktok.com/@tiyuyperu_oficial',
    label: 'TikTok',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="#000"/><path d="M16 6v1.5a3.5 3.5 0 0 1-3.5-3.5h-1.8v9.8a2.2 2.2 0 1 1-1.5-2.1v-1.8a4 4 0 1 0 3.5 3.9V9.7c.8.5 1.7.8 2.7.8V8.8c-.6 0-1.1-.2-1.6-.5-.3-.3-.5-.7-.5-1.2H14l2 .3V7l-.6-.7L16 6z" fill="white"/></svg>'
  },
  {
    href: 'https://www.youtube.com/@TiyuyTiyuy-r8s',
    label: 'YouTube',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="#FF0000"/><path d="M10 8.5v6l5-3-5-3z" fill="white"/><path d="M3 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" fill="none" stroke="white" stroke-width="1.5"/></svg>'
  },

  {
    href: 'https://www.linkedin.com/company/143109038/admin/dashboard/',
    label: 'LinkedIn',
    svg: '<svg fill="none" viewBox="0 0 24 24" width="20" height="20"><rect width="20" height="20" rx="4" fill="#0077B5"/><path d="M7 9h2.5v8H7V9zm1.2-1.5a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zM12 11.5c0-1.1.9-2 2-2s2 .9 2 2v5.5h2.5v-5.5a4.5 4.5 0 0 0-9 0v5.5H12v-5.5z" fill="white"/></svg>'
  }

];

const SOCIAL_HTML = SOCIAL_LINKS.map(social => `
  <a href="${social.href}" target="_blank" style="display:inline-block;text-decoration:none;margin:0 4px;">
    ${social.svg}
  </a>
`).join('');

const BRAND_GREEN = '#4A9A3E';
const BRAND_BLUE = '#2563eb';

const COMMON_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    margin: 0;
    padding: 0;
    background-color: #f0f2f5;
    -webkit-font-smoothing: antialiased;
  }
  .email-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .email-container {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
  }
  .email-header {
    background: linear-gradient(135deg, ${BRAND_GREEN} 0%, #3d8b35 100%);
    padding: 36px 40px 28px;
    text-align: center;
  }
  .email-header h1 {
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
  }
  .email-header p {
    color: rgba(255,255,255,0.9);
    font-size: 15px;
    margin: 8px 0 0;
  }
  .email-body {
    padding: 36px 40px 28px;
  }
  .email-body p {
    margin: 0 0 16px;
    font-size: 15px;
    color: #374151;
  }
  .email-body strong {
    color: #111827;
  }
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, ${BRAND_GREEN} 0%, #3d8b35 100%);
    color: #ffffff !important;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    text-align: center;
    margin: 8px 0 20px;
    box-shadow: 0 4px 6px -1px rgba(74,154,62,0.2);
  }
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    margin: 28px 0;
  }
  .social-section {
    text-align: center;
    padding: 0 40px 24px;
  }
  .social-section p {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  .email-footer {
    background: #f9fafb;
    padding: 24px 40px;
    text-align: center;
    border-top: 1px solid #f3f4f6;
  }
  .email-footer p {
    margin: 0 0 6px;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }
  .email-footer a {
    color: ${BRAND_GREEN};
    text-decoration: none;
  }
  .email-footer a:hover {
    text-decoration: underline;
  }
  .badge {
    display: inline-block;
    background: ${BRAND_BLUE};
    color: #ffffff;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .info-box {
    background: #f0fdf4;
    border-left: 4px solid ${BRAND_GREEN};
    padding: 18px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
  }
  .info-box p {
    margin: 0 0 4px;
    color: #374151;
  }
  .info-box strong {
    color: ${BRAND_GREEN};
  }
  .warning-box {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 18px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
  }
  .warning-box p {
    margin: 0 0 4px;
    color: #92400e;
  }
  .warning-box strong {
    color: #b45309;
  }
  .link-break {
    word-break: break-all;
    color: ${BRAND_BLUE};
    font-size: 13px;
    background: #f3f4f6;
    padding: 12px 16px;
    border-radius: 6px;
    margin: 12px 0;
    display: block;
  }
  @media screen and (max-width: 480px) {
    .email-header { padding: 28px 24px 20px; }
    .email-body { padding: 28px 24px 20px; }
    .social-section { padding: 0 24px 20px; }
    .email-footer { padding: 20px 24px; }
    .email-header h1 { font-size: 20px; }
  }
`;

function buildLayout(contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>TIYUY</title>
      <style>${COMMON_STYLES}</style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          ${contentHtml}

          <div class="social-section">
            <div class="divider"></div>
            <p>Síguenos en redes sociales</p>
            <div style="margin-top:4px;">
              ${SOCIAL_HTML}
            </div>
          </div>

          <div class="email-footer">
            <p><strong>TIYUY</strong> — Bienes Raíces en Perú</p>
            <p style="font-size:12px;color:#9ca3af;">
              Si tienes preguntas, escríbenos a
              <a href="mailto:soporte@tiyuy.com">soporte@tiyuy.com</a>
            </p>
            <div style="margin-top:12px;font-size:12px;color:#9ca3af;">
              <a href="${env.appUrl}/privacy" style="color:#9ca3af;">Privacidad</a>
              <span style="color:#d1d5db;margin:0 6px;">·</span>
              <a href="${env.appUrl}/terms" style="color:#9ca3af;">Términos</a>
              <span style="color:#d1d5db;margin:0 6px;">·</span>
              <a href="${env.appUrl}" style="color:#9ca3af;">tiyuy.com</a>
            </div>
            <p style="margin-top:12px;font-size:11px;color:#d1d5db;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function buildWelcomeEmail(firstName: string, role: string): string {
  const featureContent = role === 'USER' ? `
    <div class="info-box">
      <p><strong>🏠 Buscar propiedades</strong> — Encuentra el hogar de tus sueños</p>
      <p><strong>❤️ Guardar favoritos</strong> — Guarda las propiedades que te gusten</p>
      <p><strong>📞 Contactar agentes</strong> — Habla directamente con profesionales</p>
    </div>
  ` : role === 'AGENT' ? `
    <div class="info-box">
      <p><strong>📢 Publicar propiedades</strong> — Muestra tus inmuebles a miles de clientes</p>
      <p><strong>📊 Gestionar leads</strong> — Recibe y organiza contactos de clientes</p>
      <p><strong>📈 Analíticas</strong> — Métricas detalladas de tu desempeño</p>
    </div>
  ` : role === 'DEVELOPER' ? `
    <div class="info-box">
      <p><strong>🏗️ Gestionar proyectos</strong> — Administra múltiples desarrollos inmobiliarios</p>
      <p><strong>📋 Publicaciones ilimitadas</strong> — Sin límites de propiedades</p>
      <p><strong>🎯 Marketing avanzado</strong> — Herramientas promocionales premium</p>
    </div>
  ` : '';

  const content = `
    <div class="email-header">
      <h1>¡Bienvenido a TIYUY, ${firstName}!</h1>
      <p>Tu cuenta como <span class="badge">${role}</span> ha sido creada exitosamente</p>
    </div>
    <div class="email-body">
      <p>Estamos muy emocionados de tenerte como parte de <strong>nuestra comunidad de bienes raíces en Perú</strong>. Tu cuenta está lista para que comiences a disfrutar de todos nuestros servicios.</p>

      <p style="font-size:16px;font-weight:600;color:#111827;margin-bottom:8px;">¿Qué puedes hacer ahora?</p>
      ${featureContent}

      <div style="text-align:center;">
        <a href="${env.appUrl}/dashboard" class="cta-button">
          Ir a mi Dashboard
        </a>
      </div>
    </div>
  `;

  return buildLayout(content);
}

export function buildPasswordResetEmail(resetUrl: string): string {
  const content = `
    <div class="email-header">
      <h1>Recupera tu contraseña</h1>
      <p>Hemos recibido una solicitud de restablecimiento</p>
    </div>
    <div class="email-body">
      <p>Hola,</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>TIYUY</strong>.</p>

      <div style="text-align:center;">
        <a href="${resetUrl}" class="cta-button">
          Restablecer Contraseña
        </a>
      </div>

      <div class="warning-box">
        <p><strong>Importante:</strong></p>
        <p>• Este enlace expirará en <strong>1 hora</strong></p>
        <p>• Si no solicitaste este cambio, ignora este correo</p>
        <p>• Nunca compartas este enlace con nadie</p>
      </div>

      <p style="font-size:13px;color:#6b7280;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <span class="link-break">${resetUrl}</span>

      <p style="margin-top:24px;">
        Atentamente,<br>
        <strong>El equipo de TIYUY</strong>
      </p>
    </div>
  `;

  return buildLayout(content);
}
