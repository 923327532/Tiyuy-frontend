'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { axiosClient } from '@/infrastructure/api/axios-client';
import { useAuthStore } from '@/presentation/store/authStore';
import { AlertCircle, CheckCircle, Loader2, LogIn, X } from 'lucide-react';

interface FormData {
  nombre: string;
  domicilio: string;
  dniCe: string;
  telefono: string;
  correo: string;
  padreMadre: string;
  tipoBien: string;
  montoReclamado: string;
  descripcionBien: string;
  tipoReclamo: string;
  detalleReclamacion: string;
  pedidoConsumidor: string;
}

interface ComplaintResult {
  codigoReclamo: string;
  fechaRegistro: string;
  horaRegistro: string;
}

const initialForm: FormData = {
  nombre: '',
  domicilio: '',
  dniCe: '',
  telefono: '',
  correo: '',
  padreMadre: '',
  tipoBien: 'SERVICIO',
  montoReclamado: '',
  descripcionBien: '',
  tipoReclamo: 'RECLAMO',
  detalleReclamacion: '',
  pedidoConsumidor: '',
};

export default function LibroReclamacionesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComplaintResult | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Esperar a que el store de auth se hidrate (persist de zustand)
  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Si no está autenticado, mostrar el modal de login
    if (hydrated && !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    await submitComplaint();
  };

  const submitComplaint = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        montoReclamado: form.montoReclamado ? parseFloat(form.montoReclamado) : null,
      };

      const response = await axiosClient.post('/v1/public/complaints', payload);
      setResult(response.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error al enviar el reclamo. Intente nuevamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Manejar redirección después de login exitoso
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    // Al volver del login autenticado, el usuario solo tendrá que hacer clic en "Enviar" nuevamente
    router.push('/login?redirect=/libro-de-reclamaciones');
  };

  const handleRegisterRedirect = () => {
    setShowLoginModal(false);
    router.push('/profile-selector');
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Reclamo Registrado!</h1>
          <p className="text-gray-600 mb-6">
            Tu reclamo ha sido registrado exitosamente en nuestro Libro de Reclamaciones.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700 mb-1">Código de Reclamo</p>
            <p className="text-2xl font-bold text-blue-600">{result.codigoReclamo}</p>
          </div>
          <div className="text-sm text-gray-500 mb-6">
            <p>Fecha: {new Date(result.fechaRegistro).toLocaleDateString('es-PE')}</p>
            <p>Hora: {result.horaRegistro}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm text-yellow-800">
            <strong>📌 Importante:</strong> Guarda tu código de reclamo para futuras consultas. 
            Recibirás una respuesta en un plazo máximo de 15 días hábiles.
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-t-lg p-6 text-center relative">
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <img 
              src="/assets/images/logo_s.svg"
              alt="TIYUY" 
              className="h-12 w-auto dark:brightness-110"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            LIBRO DE RECLAMACIONES
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            (Ley N° 29571, Código de Protección y Defensa del Consumidor)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border-x-2 border-b-2 border-gray-300 dark:border-gray-700 rounded-b-lg overflow-hidden">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/50 border-b-2 border-red-200 dark:border-red-900/50 p-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="border-b-2 border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                I. Datos de la Empresa
              </h2>
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">Razón Social</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">LOPEZ SOFTWARE SOLUTIONS E.I.R.L.</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">RUC</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">20615573711</td>
                </tr>
                <tr>
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">Dirección</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">Jr. Lopez Aldana 286, La Victoria, Lima, Perú</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-b-2 border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                II. Identificación del Consumidor
              </h2>
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Nombres y Apellidos <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese sus nombres y apellidos"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Domicilio <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="domicilio"
                      value={form.domicilio}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese su domicilio"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    DNI / CE <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="dniCe"
                      value={form.dniCe}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="N° de DNI o Carné de Extranjería"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Teléfono
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Teléfono de contacto"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="email"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="correo@ejemplo.com"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Padre o Madre <br/><span className="text-xs font-normal text-gray-500 dark:text-gray-400">(si es menor de edad)</span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      name="padreMadre"
                      value={form.padreMadre}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del padre o madre"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-b-2 border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                III. Identificación del Bien Contratado
              </h2>
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Tipo de Bien <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="tipoBien"
                          value="PRODUCTO"
                          checked={form.tipoBien === 'PRODUCTO'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Producto</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="tipoBien"
                          value="SERVICIO"
                          checked={form.tipoBien === 'SERVICIO'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Servicio</span>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Monto Reclamado (S/)
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="montoReclamado"
                      value={form.montoReclamado}
                      onChange={handleChange}
                      className="w-full max-w-xs px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Descripción del Bien <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      name="descripcionBien"
                      value={form.descripcionBien}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describa el producto o servicio contratado"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-b-2 border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                IV. Reclamo o Queja
              </h2>
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr>
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800">
                    Tipo <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="tipoReclamo"
                          value="RECLAMO"
                          checked={form.tipoReclamo === 'RECLAMO'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Reclamo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="tipoReclamo"
                          value="QUEJA"
                          checked={form.tipoReclamo === 'QUEJA'}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Queja</span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border-b-2 border-gray-300 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                V. Detalle
              </h2>
            </div>
            <table className="w-full table-fixed">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800 align-top">
                    Detalle de la Reclamación <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      name="detalleReclamacion"
                      value={form.detalleReclamacion}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describa detalladamente los hechos que motivan su reclamo o queja..."
                    />
                  </td>
                </tr>
                <tr>
                  <td className="w-1/4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 border-r border-gray-200 dark:border-gray-800 align-top">
                    Pedido del Consumidor <span className="text-red-500">*</span>
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      name="pedidoConsumidor"
                      value={form.pedidoConsumidor}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="¿Qué es lo que solicita como solución?"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-300 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wide shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Reclamo'
              )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Al enviar, acepta los términos del Libro de Reclamaciones de TIYUY
            </p>
          </div>
        </form>
      </div>

      {/* Modal de inicio de sesión */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 text-center">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <LogIn className="w-8 h-8 text-red-500" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Inicia sesión para enviar tu reclamo
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Para registrar tu reclamo en nuestro Libro de Reclamaciones, primero debes iniciar sesión o crear una cuenta.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={handleRegisterRedirect}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Crear una Cuenta
                </button>
              </div>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 mt-3 transition-colors"
              >
                Continuar sin iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}