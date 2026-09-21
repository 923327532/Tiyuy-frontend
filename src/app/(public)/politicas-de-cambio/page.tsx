import Link from 'next/link';

export default function PoliticasCambioPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]">
            ← Volver a inicio
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Políticas de Cambio o Devoluciones</h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-10">
          Última actualización: 17 de julio de 2026.
        </p>

        <p className="text-[var(--text-secondary)] leading-relaxed mb-10">
          tiyuy ofrece planes de suscripción y servicios digitales para publicación y promoción de propiedades, con modalidades de facturación mensual, trimestral o anual, según el plan elegido. Estas políticas regulan los cambios, cancelaciones y devoluciones aplicables a los servicios contratados en la plataforma.
        </p>

        <div className="space-y-8">
          <Section num={1} title="Derecho de retracto">
            <p>El usuario podrá solicitar la devolución total del monto pagado dentro de los 7 días calendario posteriores a la contratación de un plan pagado, siempre que no haya hecho uso efectivo del servicio. Se entiende por uso efectivo, entre otros supuestos, la publicación de una o más propiedades, la activación de beneficios del plan, el consumo de cupos o la aplicación de destacados.</p>
          </Section>

          <Section num={2} title="Servicio ya consumido">
            <p>Si el usuario ya utilizó el plan contratado, total o parcialmente, tiyuy podrá denegar la devolución correspondiente al período o beneficio ya consumido. En especial, si el usuario publicó propiedades o activó funcionalidades del plan, el servicio se considerará prestado en la parte utilizada.</p>
          </Section>

          <Section num={3} title="Cancelación de la renovación">
            <p>El usuario puede cancelar la renovación automática de su suscripción en cualquier momento desde su cuenta o escribiendo a soporte, para evitar cargos futuros. Esta cancelación no genera devolución del período ya iniciado ni del tiempo restante del plan en curso.</p>
          </Section>

          <Section num={4} title="Cambio de plan">
            <p className="mb-3">tiyuy no realiza cambios de plan a mitad de período, salvo que exista una habilitación expresa dentro de la plataforma o una aprobación especial del equipo de soporte. Cada plan es independiente y se activa por la duración contratada o por el volumen de beneficios incluidos.</p>
            <p>El usuario podrá contratar un nuevo plan cuando el anterior haya vencido o se haya agotado en su totalidad. No corresponden devoluciones por el tiempo restante mientras el plan vigente se encuentre activo o en uso.</p>
          </Section>

          <Section num={5} title="Planes empresariales o por proyecto">
            <p>Cuando un servicio se contrata por proyecto, campaña o paquete empresarial, la devolución no aplica una vez que el proyecto haya sido publicado, activado o puesto visible en la plataforma, salvo error atribuible a tiyuy. Si existiera una falla comprobable imputable a la plataforma, se evaluará el reembolso total o parcial según corresponda.</p>
          </Section>

          <Section num={6} title="Errores de cobro">
            <p>En caso de cobro duplicado, monto incorrecto o falla técnica atribuible a tiyuy, la devolución será procesada sin condiciones dentro de un plazo máximo de 10 días hábiles, contado desde la validación del caso.</p>
          </Section>

          <Section num={7} title="Promociones y descuentos">
            <p>Los descuentos aplicados mediante códigos promocionales, campañas o beneficios comerciales no son reembolsables ni transferibles a otros planes o períodos. Si se aprueba una devolución, esta se calculará sobre el monto efectivamente pagado por el usuario, descontando beneficios, cupones o promociones aplicadas.</p>
          </Section>

          <Section num={8} title="Medio de devolución">
            <p>Toda devolución se realizará por el mismo método de pago utilizado en la compra original, salvo imposibilidad técnica. En ese caso, tiyuy podrá coordinar un medio alternativo con el usuario.</p>
          </Section>

          <Section num={9} title="Plazo de atención">
            <p>tiyuy atenderá las solicitudes de cambio, cancelación o devolución a través de su correo de soporte y de su Libro de Reclamaciones, cuando corresponda. La respuesta dependerá de la verificación del caso y de la documentación o información que el usuario entregue.</p>
          </Section>

          <Section num={10} title="Contacto">
            <p className="mb-4">Para solicitar cambios, cancelaciones o devoluciones, escríbenos a:</p>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 space-y-2 text-sm">
              <p><span className="font-semibold text-[var(--text-primary)]">📧</span> tiyuy@saberoconsulting.com</p>
              <p><span className="font-semibold text-[var(--text-primary)]">📞</span> +51 923 327 532</p>
            </div>
            <p className="mt-4 text-[var(--text-secondary)]">Si tu solicitud no es atendida satisfactoriamente, puedes registrar tu reclamo en nuestro Libro de Reclamaciones.</p>
            <div className="mt-3">
              <Link href="/libro-de-reclamaciones" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] bg-[var(--brand-primary-light)] hover:bg-[var(--brand-primary-light-hover)] px-4 py-2 rounded-lg transition-colors">
                Ir al Libro de Reclamaciones →
              </Link>
            </div>
          </Section>
        </div>

        {/* Versión resumida */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="bg-[var(--brand-primary-light)] border border-[var(--brand-primary)]/20 rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--brand-primary)] mb-2">En resumen</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Los planes de tiyuy no son reembolsables una vez utilizados. El usuario puede solicitar devolución total dentro de los 7 días calendario posteriores a la contratación, siempre que no haya usado el servicio. No aplican devoluciones por planes ya consumidos, salvo error de cobro o falla técnica atribuible a tiyuy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)] flex items-center justify-center text-sm font-bold shrink-0">
          {num}
        </span>
        {title}
      </h2>
      <div className="text-[var(--text-secondary)] leading-relaxed ml-9 space-y-3">
        {children}
      </div>
    </div>
  );
}
