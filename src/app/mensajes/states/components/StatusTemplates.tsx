// ═══════════════════════════════════════════════════════════════
// 8 PLANTILLAS PREMIUM PARA ESTADOS — basadas en FORMAS protagonistas
// El texto del usuario vive DENTRO de una silueta/composición distinta.
// Stack: React + Next.js + Tailwind. CSS puro, sin librerías pesadas.
// ═══════════════════════════════════════════════════════════════

export const STATUS_TEMPLATES = [
  { key: 'template-1', name: 'Nube suave', previewBg: 'linear-gradient(160deg, #fef9c3, #bfdbfe)' },
  { key: 'template-2', name: 'Burbuja premium', previewBg: 'linear-gradient(160deg, #0f172a, #334155)' },
  { key: 'template-3', name: 'Halo circular', previewBg: 'linear-gradient(160deg, #1e1b4b, #4c1d95)' },
  { key: 'template-4', name: 'Marco editorial', previewBg: 'linear-gradient(160deg, #fafaf9, #e7e5e4)' },
  { key: 'template-5', name: 'Cinta flotante', previewBg: 'linear-gradient(160deg, #fdf2f8, #fce7f3)' },
  { key: 'template-6', name: 'Cristal elegante', previewBg: 'linear-gradient(160deg, #ecfeff, #ccfbf1)' },
  { key: 'template-7', name: 'Sticker premium', previewBg: 'linear-gradient(160deg, #18181b, #3f3f46)' },
  { key: 'template-8', name: 'Flor abstracta', previewBg: 'linear-gradient(160deg, #ffe4e6, #fecdd3)' },
] as const;

type TemplateRenderProps = {
  templateKey?: string | null;
  content: string;
  textStyle?: string;
  location?: string;
  propertyType?: string;
  compact?: boolean;
};

/** Clases de tipografía: el texto SIEMPRE es el protagonista, máx. 2 pesos. */
function getTextClasses(content: string, textStyle?: string, compact = false) {
  const size = compact
    ? 'text-[11px]'
    : content.length < 30
      ? 'text-3xl sm:text-4xl'
      : content.length < 80
        ? 'text-2xl sm:text-3xl'
        : content.length < 150
          ? 'text-xl sm:text-2xl'
          : 'text-base sm:text-lg';
  const weight = textStyle === 'BOLD' ? 'font-extrabold' : 'font-semibold';
  const extra = textStyle === 'ITALIC' ? ' italic' : textStyle === 'CODE' ? ' font-mono' : '';
  const highlight = textStyle === 'HIGHLIGHT' ? ' bg-white/20 px-2 py-1 rounded-lg' : '';
  return `${size} ${weight}${extra}${highlight}`;
}

function Meta({ location, propertyType, dark = true }: { location?: string; propertyType?: string; dark?: boolean }) {
  if (!location && !propertyType) return null;
  const cls = dark
    ? 'bg-black/10 text-white backdrop-blur-sm'
    : 'bg-white/70 text-slate-700 shadow-sm';
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {location && <span className={`text-xs px-3 py-1.5 rounded-full ${cls}`}>📍 {location}</span>}
      {propertyType && <span className={`text-xs px-3 py-1.5 rounded-full ${cls}`}>🏠 {propertyType}</span>}
    </div>
  );
}

export function StatusTemplateView({ templateKey, content, textStyle, location, propertyType, compact = false }: TemplateRenderProps) {
  const template = STATUS_TEMPLATES.find(t => t.key === templateKey);
  if (!template) return null;

  const tc = getTextClasses(content, textStyle, compact);
  const meta = <Meta location={location} propertyType={propertyType} />;

  switch (template.key) {
    // 1 ── NUBE SUAVE ─────────────────────────────────────────────
    // Concepto: el texto vive dentro de una nube blanca que flota sobre un cielo pastel.
    case 'template-1':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'linear-gradient(170deg, #fef9c3 0%, #bfdbfe 100%)' }}>
          {/* Sol de fondo */}
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-yellow-200 opacity-70 blur-sm" />
          {/* Nube protagonista (forma principal) */}
          <div className="relative w-[92%] max-w-sm px-6 py-8 rounded-[2.5rem] bg-white shadow-[0_20px_50px_-12px_rgba(59,130,246,0.35)]">
            {/* Pompón superior */}
            <div className="absolute -top-6 left-8 w-16 h-16 rounded-full bg-white" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-14 rounded-full bg-white" />
            <div className="absolute -top-4 right-8 w-12 h-12 rounded-full bg-white/95" />
            <div className="relative text-center">
              <div className={`text-slate-800 leading-relaxed ${tc}`}>{content}</div>
              {meta}
            </div>
          </div>
        </div>
      );

    // 2 ── BURBUJA PREMIUM ────────────────────────────────────────
    // Concepto: el texto flota dentro de una esfera glassmorphism sobre fondo oscuro.
    case 'template-2':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 25% 20%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 40%), linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}>
          {/* Esferas de fondo */}
          <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10" />
          <div className="absolute bottom-10 right-8 w-14 h-14 rounded-full bg-white/5 border border-white/10" />
          {/* Burbuja protagonista */}
          <div className="relative w-[88%] max-w-sm rounded-full aspect-square flex items-center justify-center p-8"
            style={{ background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.22)', boxShadow: 'inset 0 0 40px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)' }}>
            {/* Reflejo superior */}
            <div className="absolute top-5 left-8 w-12 h-6 rounded-full bg-white/30 blur-md" />
            <div className="relative text-center">
              <div className={`text-white leading-relaxed ${tc}`}>{content}</div>
              {meta}
            </div>
          </div>
        </div>
      );

    // 3 ── HALO CIRCULAR ──────────────────────────────────────────
    // Concepto: anillos concéntricos con glow; el texto flota en el centro.
    case 'template-3':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 50% 50%, #4c1d95 0%, #1e1b4b 70%, #0f0a23 100%)' }}>
          {/* Halos concéntricos */}
          <div className="absolute w-[92%] max-w-sm aspect-square rounded-full border border-purple-300/25"
            style={{ boxShadow: '0 0 80px 10px rgba(139,92,246,0.25), inset 0 0 60px rgba(139,92,246,0.1)' }} />
          <div className="absolute w-[72%] max-w-[280px] aspect-square rounded-full border border-fuchsia-300/40"
            style={{ boxShadow: '0 0 60px 8px rgba(217,70,239,0.25), inset 0 0 40px rgba(217,70,239,0.12)' }} />
          <div className="absolute w-[50%] max-w-[200px] aspect-square rounded-full border-2 border-white/20" />
          {/* Sparkles */}
          {['left-[8%] top-[15%]', 'left-[85%] top-[20%]', 'left-[12%] bottom-[18%]', 'left-[80%] bottom-[22%]'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-white/60 text-lg`}>{i % 2 === 0 ? '✦' : '·'}</div>
          ))}
          <div className="relative z-10 max-w-[70%] text-center">
            <div className={`text-white leading-relaxed ${tc}`}>{content}</div>
            {meta}
          </div>
        </div>
      );

    // 4 ── MARCO EDITORIAL ────────────────────────────────────────
    // Concepto: tarjeta editorial con marco fino y numeración, texto alineado elegante.
    case 'template-4':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #fafaf9 0%, #e7e5e4 100%)' }}>
          {/* Marco doble fino */}
          <div className="relative w-[88%] max-w-sm border border-slate-400/50" style={{ padding: '18px' }}>
            <div className="border border-slate-300 px-6 py-8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] tracking-[0.25em] uppercase text-slate-400">TIYUY · ESTADO</div>
              <div className="text-center">
                <div className={`text-slate-900 leading-relaxed ${tc}`}>{content}</div>
                {meta}
              </div>
            </div>
            {/* Esquinas decorativas */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-slate-500" />
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-slate-500" />
          </div>
        </div>
      );

    // 5 ── CINTA FLOTANTE ─────────────────────────────────────────
    // Concepto: una cinta/tarjeta recortada flota; el texto se apoya en ella.
    case 'template-5':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 80% 15%, #fbcfe8 0%, transparent 45%), linear-gradient(165deg, #fdf2f8 0%, #fce7f3 60%, #fbcfe8 100%)' }}>
          {/* Pétalos decorativos */}
          <div className="absolute top-6 left-6 text-2xl opacity-40">🌸</div>
          <div className="absolute bottom-8 right-6 text-xl opacity-30">✨</div>
          {/* Cinta protagonista (forma tipo "post-it" con cola) */}
          <div className="relative w-[86%] max-w-sm">
            <div className="bg-white px-6 py-6 rounded-l-2xl shadow-[0_14px_40px_-8px_rgba(219,39,119,0.3)] relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)' }}>
              <div className="absolute -right-9 bottom-0 w-9 h-9 bg-white"
                style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
              <div className="text-center">
                <div className={`text-slate-800 leading-relaxed ${tc}`}>{content}</div>
                {meta}
              </div>
            </div>
          </div>
        </div>
      );

    // 6 ── CRISTAL ELEGANTE ───────────────────────────────────────
    // Concepto: panel de cristal con reflejos diagonales sobre fondo suave.
    case 'template-6':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #ecfeff 0%, #ccfbf1 60%, #a5f3fc 100%)' }}>
          {/* Rayos de luz */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(115deg, transparent 45%, rgba(255,255,255,0.7) 50%, transparent 55%)' }} />
          {/* Panel de cristal protagonista */}
          <div className="relative w-[88%] max-w-sm rounded-2xl px-6 py-10"
            style={{
              background: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 16px 40px -8px rgba(20,184,166,0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
            }}>
            {/* Reflejo superior */}
            <div className="absolute -top-2 left-6 w-24 h-3 bg-white/60 blur-[2px] rotate-[-4deg]" />
            <div className="text-center">
              <div className={`text-teal-900 leading-relaxed ${tc}`}>{content}</div>
              {meta}
            </div>
          </div>
        </div>
      );

    // 7 ── STICKER PREMIUM ────────────────────────────────────────
    // Concepto: etiqueta tipo sticker con borde blanco grueso y sombra sobre fondo oscuro.
    case 'template-7':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 40%), radial-gradient(circle at 85% 20%, #ec4899 0%, transparent 35%), linear-gradient(160deg, #18181b 0%, #3f3f46 100%)' }}>
          {/* Sticker protagonista (forma de píldora con recorte) */}
          <div className="relative w-[88%] max-w-sm rounded-[2rem] px-7 py-9"
            style={{
              background: 'linear-gradient(150deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)',
              border: '4px solid #ffffff',
              boxShadow: '0 18px 45px -6px rgba(245,158,11,0.5), 0 0 0 1px rgba(0,0,0,0.12)',
            }}>
            {/* Brillo */}
            <div className="absolute top-3 left-5 w-16 h-5 bg-white/40 rounded-full blur-[3px] rotate-[-8deg]" />
            <div className="text-center">
              <div className={`text-white leading-relaxed drop-shadow-sm ${tc}`}>{content}</div>
              {meta}
            </div>
          </div>
          {/* Sparkles */}
          <div className="absolute top-8 left-8 text-white/70 text-xl">✦</div>
          <div className="absolute bottom-10 right-8 text-white/50 text-lg">✦</div>
        </div>
      );

    // 8 ── FLOR ABSTRACTA ─────────────────────────────────────────
    // Concepto: el texto vive dentro de una flor de pétalos suaves dibujada con CSS.
    case 'template-8':
      return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-6 overflow-hidden"
          style={{ background: 'radial-gradient(circle at 75% 20%, #fda4af 0%, transparent 40%), linear-gradient(160deg, #ffe4e6 0%, #fecdd3 100%)' }}>
          {/* Flor protagonista: pétalos con CSS */}
          <div className="relative w-[86%] max-w-sm aspect-square">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot, i) => (
              <div key={i}
                className="absolute left-1/2 top-1/2 w-[55%] h-[32%] rounded-[100%_0_100%_0]"
                style={{
                  background: i % 2 === 0 ? 'rgba(219,39,119,0.5)' : 'rgba(244,114,182,0.45)',
                  transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(-52%)`,
                  border: '1px solid rgba(255,255,255,0.5)',
                }} />
            ))}
            {/* Centro de la flor = el texto */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] rounded-full bg-white/85 py-8 px-4 text-center shadow-[0_10px_30px_rgba(219,39,119,0.3)]"
              style={{ backdropFilter: 'blur(6px)' }}>
              <div className={`text-rose-900 leading-relaxed ${tc}`}>{content}</div>
              {meta}
            </div>
          </div>
          {/* Hojas decorativas */}
          <div className="absolute bottom-8 left-6 text-xl opacity-40">🌿</div>
          <div className="absolute top-6 right-6 text-xl opacity-40">🌸</div>
        </div>
      );

    default:
      return null;
  }
}