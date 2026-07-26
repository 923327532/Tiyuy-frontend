'use client';

import { useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { ArrowRight, Check, ChevronLeft, ChevronRight, ClipboardList, DollarSign, Download, ExternalLink, Eye, FileText, Home, Info, Key, Link2, Share2, Shield, ShoppingCart, Sun, TriangleAlert } from 'lucide-react';

interface Role {
  id: 'comprador' | 'vendedor' | 'arrendador' | 'inquilino';
  title: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  description: string;
  howToKnow: string[];
  steps: {
    title: string;
    description: string;
    actions: {
      title: string;
      description: string;
      link: string;
      steps: string[];
    }[];
    why?: string[];
    shows?: string[];
    documents?: string[];
    tips?: string[];
    important?: string;
    conditions?: string[];
  }[];
}

const roles: Role[] = [
  {
    id: 'comprador',
    title: 'COMPRADOR',
    color: 'text-[#4A9A3E]',
    bgColor: 'bg-[#4A9A3E]/10',
    icon: <ShoppingCart className="w-5 h-5 md:w-8 md:h-8 text-[#4A9A3E]" />,
    description: 'Persona que quiere comprar una propiedad (casa, departamento, terreno, local).',
    howToKnow: [
      'Estás buscando una propiedad para comprar',
      'No eres dueño del inmueble',
      'Quieres ver opciones y contactar vendedores'
    ],
    steps: [
      {
        title: 'Verificar que el vendedor sea realmente el dueño',
        description: 'Debes ingresar a SUNARP y consultar la propiedad',
        actions: [
          {
            title: 'SUNARP – Consulta de Propiedad',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Selecciona "Publicidad Registral en Línea"',
              'Dale a "Búsqueda por nombre del titular"',
              'Escribe el nombre completo de la persona que dice ser dueña',
              'Revisa si aparece como propietario'
            ]
          }
        ],
        why: ['Para evitar estafas', 'Para saber si la propiedad está inscrita legalmente']
      },
      {
        title: 'Ver la Partida Registral de la propiedad',
        description: 'En la misma web de SUNARP obtén el documento oficial',
        actions: [
          {
            title: 'SUNARP – Publicidad Registral en Línea',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Entra a "Publicidad Registral en Línea"',
              'Elige "Búsqueda por número de partida" o "Búsqueda por dirección"',
              'Descarga la Partida Registral PDF'
            ]
          }
        ],
        shows: ['Nombre del dueño', 'Medidas reales', 'Cargas o denuncias', 'Hipotecas', 'Embargos']
      },
      {
        title: 'Revisar si la propiedad tiene deudas de impuestos',
        description: 'Si la propiedad está en Lima, verifica en SAT',
        actions: [
          {
            title: 'SAT Lima – Consulta de Predial y Arbitrios',
            description: 'https://www.sat.gob.pe',
            link: 'https://www.sat.gob.pe',
            steps: [
              'En el menú, selecciona "Consulta de tributos"',
              'Elige "Predial y Arbitrios"',
              'Ingresa la dirección o número de contribuyente',
              'Revisa si hay pagos pendientes'
            ]
          }
        ]
      },
      {
        title: 'Validar la identidad del vendedor',
        description: 'Debes pedirle documentos que confirmen su identidad',
        actions: [],
        documents: ['Foto de DNI', 'Selfie sosteniendo el DNI', 'Número de celular activo', 'Confirmar nombre en RENIEC (si la app lo permite)']
      }
    ]
  },
  {
    id: 'vendedor',
    title: 'VENDEDOR',
    color: 'text-[#4A9A3E]',
    bgColor: 'bg-[#4A9A3E]/10',
    icon: <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-[#4A9A3E]" />,
    description: 'Eres la persona dueña del inmueble y quieres venderlo.',
    howToKnow: [
      'La propiedad está a tu nombre',
      'Quieres crear una publicación para vender',
      'Quieres recibir mensajes de compradores'
    ],
    steps: [
      {
        title: 'Obtener la Partida Registral actualizada',
        description: 'Debes ingresar a SUNARP para obtener el documento oficial',
        actions: [
          {
            title: 'SUNARP – Publicidad Registral en Línea',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Selecciona "Búsqueda por número de partida"',
              'Descarga la Partida Registral (PDF)'
            ]
          }
        ],
        why: ['Para demostrar que eres el dueño', 'Para subirla a la app', 'Para evitar que compradores desconfíen']
      },
      {
        title: 'Verificar si tienes deudas pendientes',
        description: 'Si la propiedad está en Lima, revisa en SAT',
        actions: [
          {
            title: 'SAT – Pagos de Predial y Arbitrios',
            description: 'https://www.sat.gob.pe',
            link: 'https://www.sat.gob.pe',
            steps: [
              'Selecciona "Predial y Arbitrios"',
              'Ingresa dirección o código del contribuyente',
              'Verifica si debes algo'
            ]
          }
        ],
        important: 'Los compradores revisan esto antes de decidir.'
      },
      {
        title: 'Registrar un precio correcto',
        description: 'Como vendedor, debes investigar el mercado',
        actions: [],
        tips: [
          'Revisar precios de mercado',
          'Comparar propiedades similares',
          'Usar una tasación si deseas más precisión'
        ]
      },
      {
        title: 'Reunir documentos básicos',
        description: 'Debes tener listos estos documentos',
        actions: [],
        documents: ['DNI', 'Partida Registral', 'Información de medidas', 'Planos (si los tienes)', 'Declaración de predios (opcional)']
      }
    ]
  },
  {
    id: 'arrendador',
    title: 'ARRENDADOR (Dueño que alquila)',
    color: 'text-[#4A9A3E]',
    bgColor: 'bg-[#4A9A3E]/10',
    icon: <Home className="w-5 h-5 md:w-8 md:h-8 text-[#4A9A3E]" />,
    description: 'Persona que es dueña de una propiedad y desea alquilarla.',
    howToKnow: [
      'Tienes una propiedad a tu nombre',
      'No deseas venderla',
      'Quieres recibir inquilinos'
    ],
    steps: [
      {
        title: 'Verificar tu propiedad en SUNARP',
        description: 'Para evitar suplantaciones en contratos',
        actions: [
          {
            title: 'SUNARP – Publicidad Registral en Línea',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Selecciona "Búsqueda por número de partida"',
              'Descarga el archivo en PDF',
              'Guarda el documento para subirlo a la app'
            ]
          }
        ]
      },
      {
        title: 'Registrar tu contrato de alquiler (opcional pero recomendado)',
        description: 'En Perú, puedes registrar el contrato para que sea más seguro',
        actions: [
          {
            title: 'SUNARP – Registro de Contrato de Arrendamiento',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Elige "Presentar título"',
              'Selecciona "Contrato de arrendamiento"',
              'Rellena los datos',
              'Sube el contrato',
              'Paga la tasa (aprox. 30–40 soles)'
            ]
          }
        ]
      },
      {
        title: 'Si emitirás recibos, debes usar SUNAT',
        description: 'Si quieres declarar ingresos por alquiler',
        actions: [
          {
            title: 'SUNAT – Clave SOL / Rentas',
            description: 'https://www.sunat.gob.pe',
            link: 'https://www.sunat.gob.pe',
            steps: [
              'Entra en "Trámites y consultas"',
              'Inicia sesión con tu Clave SOL',
              'Selecciona "Renta – Primera categoría"',
              'Declara el monto mensual del alquiler'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'inquilino',
    title: 'INQUILINO',
    color: 'text-[#4A9A3E]',
    bgColor: 'bg-[#4A9A3E]/10',
    icon: <Key className="w-5 h-5 md:w-8 md:h-8 text-[#4A9A3E]" />,
    description: 'Persona que busca alquilar una propiedad.',
    howToKnow: [
      'No tienes propiedad',
      'Buscas un lugar para vivir o trabajar',
      'Necesitas contactar a dueños'
    ],
    steps: [
      {
        title: 'Verificar que el dueño sea real',
        description: 'Ir a SUNARP y consulta la titularidad',
        actions: [
          {
            title: 'SUNARP – Consulta de titularidad',
            description: 'https://www.sunarp.gob.pe/servicios-en-linea',
            link: 'https://www.sunarp.gob.pe/servicios-en-linea',
            steps: [
              'Selecciona "Búsqueda por nombre del titular"',
              'Escribe el nombre del arrendador',
              'Confirma que aparece como propietario'
            ]
          }
        ]
      },
      {
        title: 'Revisar condiciones del alquiler antes de firmar',
        description: 'El dueño debe darte esta información',
        actions: [],
        conditions: [
          'Precio mensual',
          'Monto de garantía',
          'Reglas del inmueble',
          'Tiempo mínimo de contrato'
        ]
      },
      {
        title: 'Revisar si el inmueble tiene deudas de arbitrios o predial',
        description: 'Si estás en Lima, verifica en SAT',
        actions: [
          {
            title: 'SAT Lima – Consulta de arbitrios',
            description: 'https://www.sat.gob.pe',
            link: 'https://www.sat.gob.pe',
            steps: [
              'Elige "Predial y Arbitrios"',
              'Ingresa dirección',
              'Revisa si hay deudas importantes'
            ]
          }
        ]
      },
      {
        title: 'Revisar identidad del arrendador',
        description: 'Pide estos documentos para verificar',
        actions: [],
        documents: ['Foto del DNI', 'Selfie con DNI', 'Número celular', 'Partida Registral del inmueble']
      }
    ]
  }
];

export default function GuiaAlquilarPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<string>('');

  const downloadGuide = (role: Role) => {
    // Crear nuevo documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Configurar fuentes y colores
    const primaryColor: [number, number, number] = [93, 174, 76]; // [#4A9A3E]
    const secondaryColor: [number, number, number] = [74, 154, 62]; // [#4A9A3E]
    const textColor: [number, number, number] = [31, 41, 55]; // gray-800
    
    // Página 1: Título y descripción
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('GUIA PARA ALQUILAR', 105, 20, { align: 'center' } as any);
    
    doc.setFontSize(16);
    doc.text(role.title.toUpperCase(), 105, 30, { align: 'center' } as any);
    
    // Contenido principal
    let yPosition = 60;
    
    // ¿Quién eres?
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('¿QUIEN ERES?', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const descriptionLines = doc.splitTextToSize(role.description, 170);
    doc.text(descriptionLines, 20, yPosition);
    yPosition += descriptionLines.length * 7 + 10;
    
    // ¿Cómo saber si este es tu perfil?
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('¿COMO SABER SI ESTE ES TU PERFIL?', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    role.howToKnow.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`✔ ${item}`, 25, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
    
    // Pasos a seguir
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PASOS QUE DEBES SEGUIR', 20, yPosition);
    yPosition += 15;
    
    role.steps.forEach((step, index) => {
      // Nueva página si es necesario
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Título del paso
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setFillColor(...primaryColor);
      doc.rect(15, yPosition - 8, 180, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(`${index + 1}. ${step.title.toUpperCase()}`, 20, yPosition);
      
      yPosition += 15;
      
      // Descripción
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const stepDescriptionLines = doc.splitTextToSize(step.description, 170);
      doc.text(stepDescriptionLines, 20, yPosition);
      yPosition += stepDescriptionLines.length * 6 + 8;
      
      // Acciones
      if (step.actions.length > 0) {
        step.actions.forEach((action, actionIndex) => {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(`🔗 ${action.title}`, 25, yPosition);
          yPosition += 7;
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(...primaryColor);
          doc.text(action.description, 30, yPosition);
          yPosition += 6;
          
          doc.setTextColor(...textColor);
          doc.text('Pasos a seguir:', 30, yPosition);
          yPosition += 6;
          
          action.steps.forEach((stepText, stepIndex) => {
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`   ${stepIndex + 1}) ${stepText}`, 35, yPosition);
            yPosition += 6;
          });
          
          yPosition += 8;
        });
      }
      
      // Secciones adicionales
      if (step.why) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('¿Por qué debes hacerlo?', 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        step.why.forEach(reason => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`→ ${reason}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      }
      
      if (step.shows) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Esto te mostrará:', 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        step.shows.forEach(item => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${item}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      }
      
      if (step.documents) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Debes tener:', 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        step.documents.forEach(docItem => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${docItem}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      }
      
      if (step.tips) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Recomendaciones:', 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        step.tips.forEach(tip => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${tip}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      }
      
      if (step.important) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(220, 38, 38); // red-600
        doc.text(`⚠ Importante: ${step.important}`, 25, yPosition);
        yPosition += 15;
        doc.setTextColor(...textColor);
      }
      
      if (step.conditions) {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Condiciones a revisar:', 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        step.conditions.forEach(condition => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`• ${condition}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      }
      
      yPosition += 10;
    });
    
    // Pie de página en la última página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer
      doc.setFillColor(...secondaryColor);
      doc.rect(0, 280, 210, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(`Generado por TIYUY - ${new Date().toLocaleDateString('es-PE')}`, 105, 285, { align: 'center' } as any);
      doc.text('https://tiyuy.com', 105, 292, { align: 'center' } as any);
      
      // Número de página
      doc.text(`Página ${i} de ${pageCount}`, 105, 298, { align: 'center' } as any);
    }
    
    // Guardar el PDF
    doc.save(`guia-alquilar-${role.id}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    // Mostrar mensaje de éxito
    setShowSuccessMessage(`¡Guía para ${role.title} descargada en PDF!`);
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const shareGuide = (role: Role) => {
    const text = `Guía para alquilar - ${role.title}\n\n${role.description}\n\nVer la guía completa en: https://tiyuy.com/guia-alquilar`;
    
    if (navigator.share) {
      navigator.share({
        title: `Guía para alquilar - ${role.title}`,
        text: text,
        url: window.location.href
      }).then(() => {
        setShowSuccessMessage('¡Guía compartida exitosamente!');
        setTimeout(() => setShowSuccessMessage(''), 3000);
      }).catch(() => {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(text);
        setShowSuccessMessage('¡Enlace copiado al portapapeles!');
        setTimeout(() => setShowSuccessMessage(''), 3000);
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(text);
      setShowSuccessMessage('¡Enlace copiado al portapapeles!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-secondary)]">
      {/* Mensaje de éxito flotante */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-brand to-brand text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold">{showSuccessMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-[var(--bg-card)] border-b border-gray-100 dark:border-[var(--border-color)]">
        <div className="w-full px-8 xl:px-16">
          <div className="max-w-[1920px] mx-auto py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 dark:text-[var(--text-secondary)] hover:text-brand transition-colors font-medium flex items-center gap-1">
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-[var(--text-muted)]" />
              <span className="text-brand font-semibold bg-brand-light px-3 py-1 rounded-full">Guía para alquilar</span>
            </nav>
          </div>
        </div>
      </div>

{/* Selector de Roles - Fondo normal */}
      {!selectedRole && (
        <div className="w-full px-8 xl:px-16 py-12 bg-gray-50 dark:bg-[var(--bg-secondary)]">
            <div className="max-w-[1920px] mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block relative">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-[var(--text-primary)] mb-4">
                    ¿Quién eres?
                  </h2>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-brand rounded-full"></div>
                </div>
                <p className="text-lg text-gray-600 dark:text-[var(--text-secondary)] mt-6 max-w-xl mx-auto">
                  Selecciona tu perfil para obtener la guía personalizada con pasos detallados
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role, index) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className="group bg-white dark:bg-[var(--bg-card)] rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-brand hover:-translate-y-1 text-left relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-light-hover transition-colors"></div>
                    
                    <div className="relative">
                      <div className={`w-10 h-10 md:w-14 md:h-14 ${role.bgColor} rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {role.icon}
                      </div>
                      
                      <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-[var(--text-primary)] mb-2 group-hover:text-brand transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-gray-500 dark:text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed mb-4 line-clamp-2">
                      {role.description}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-[var(--border-color)]">
                      <div className="flex items-center gap-2 text-brand font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>Comenzar guía</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
        </div>
      )}

      {selectedRole && (
        <div className="bg-white dark:bg-[var(--bg-card)] border-b border-gray-100 dark:border-[var(--border-color)]">
            <div className="w-full px-8 xl:px-16 py-12">
              <div className="max-w-[1920px] mx-auto">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-2 text-gray-600 dark:text-[var(--text-secondary)] hover:text-brand font-medium transition-colors bg-white dark:bg-[var(--bg-card)] px-4 py-2 rounded-lg mb-8 shadow-sm hover:shadow-md border border-gray-200 dark:border-[var(--border-color)] hover:border-brand"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Volver a perfiles
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Shield className="w-5 h-5" />
                    <span>GUÍA OFICIAL TIYUY</span>
                  </div>
                  <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-[var(--text-primary)] mb-4">
                    {selectedRole.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-[var(--text-secondary)] max-w-2xl mx-auto">
                    {selectedRole.description}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => shareGuide(selectedRole)}
                    className="flex items-center justify-center gap-2 bg-white dark:bg-[var(--bg-card)] text-brand w-48 md:w-auto px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-brand-light transition-all shadow-md hover:shadow-lg border-2 border-brand cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    Compartir
                  </button>
                  
                  <button
                    onClick={() => downloadGuide(selectedRole)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-brand text-white w-48 md:w-auto px-4 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:from-brand-hover hover:to-brand-hover transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}

      {selectedRole && (
        <div className="w-full px-8 xl:px-16 py-12">
          <div className="max-w-[1920px] mx-auto">
            <div className="bg-white dark:bg-[var(--bg-card)] rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-[var(--border-color)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand to-brand"></div>
                <div className="flex items-start gap-4 md:gap-6 mb-6">
                  <div className="w-14 h-14 md:w-24 md:h-24 bg-brand-light rounded-2xl flex items-center justify-center text-3xl md:text-5xl shadow-lg flex-shrink-0">
                    {selectedRole.icon}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-[var(--text-primary)] mb-1 md:mb-2">
                      {selectedRole.title}
                    </h1>
                    <p className="text-gray-600 dark:text-[var(--text-secondary)] text-sm md:text-lg">
                      {selectedRole.description}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-brand-light to-brand-light-hover rounded-xl p-6 border border-brand/20">
                  <h3 className="font-bold text-brand mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    ¿Cómo saber si este es tu perfil?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRole.howToKnow.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white/60 dark:bg-[var(--bg-tertiary)] rounded-lg p-3">
                        <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-[var(--text-primary)] text-sm">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <ClipboardList className="w-5 h-5" />
                  <span>PASOS OBLIGATORIOS</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[var(--text-primary)]">
                  Si eres <span className="text-brand">{selectedRole.title}</span>, haz esto:
                </h2>
              </div>

              {selectedRole.steps.map((step, index) => (
                <div key={index} className="bg-white dark:bg-[var(--bg-card)] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-[var(--border-color)] overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="md:w-16 bg-gradient-to-br from-brand to-brand flex flex-row md:flex-col items-center justify-center gap-2 md:gap-0 py-2 md:py-8 px-4 md:px-0 text-white">
                      <span className="text-xl md:text-3xl font-bold">{index + 1}</span>
                      <span className="text-xs uppercase opacity-80">Paso</span>
                    </div>
                    <div className="flex-1 p-4 md:p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-[var(--text-primary)] mb-2 group-hover:text-brand transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-[var(--text-secondary)] mb-4">
                        {step.description}
                      </p>

                      {step.actions.length > 0 && (
                        <div className="space-y-4 mt-4">
                          {step.actions.map((action, actionIndex) => (
                            <div key={actionIndex} className="bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-xl p-5 border border-gray-100 dark:border-[var(--border-color)] hover:border-brand/30 hover:shadow-md transition-all">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Link2 className="w-5 h-5 text-brand" />
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-[var(--text-primary)]">
                                  {action.title}
                                </h4>
                              </div>
                              
                              <a
                                href={action.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-start gap-2 ${selectedRole.color} font-medium mb-4 hover:underline break-all`}
                              >
                                <span className="break-all">{action.description}</span>
                                <ExternalLink className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                              </a>

                              <div className="space-y-2">
                                <p className="font-semibold text-gray-700 dark:text-[var(--text-secondary)]">Pasos:</p>
                                {action.steps.map((stepText, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-gray-200 dark:bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-[var(--text-muted)] flex-shrink-0 mt-0.5">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-gray-600 dark:text-[var(--text-secondary)] text-sm">
                                      {stepText}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.why && (
                        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/30">
                          <p className="font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            ¿Por qué debes hacerlo?
                          </p>
                          <div className="space-y-2">
                            {step.why.map((reason, whyIndex) => (
                              <p key={whyIndex} className="text-amber-700 dark:text-amber-300 text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span>{reason}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.shows && (
                        <div className="mt-4 p-4 bg-brand-light dark:bg-brand-primary-light rounded-xl border border-brand/20">
                          <p className="font-bold text-brand mb-3 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Esto te mostrará:
                          </p>
                          <div className="space-y-2">
                            {step.shows.map((item, showIndex) => (
                              <p key={showIndex} className="text-gray-700 dark:text-[var(--text-secondary)] text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0"></span>
                                {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.documents && (
                        <div className="mt-4 p-4 bg-brand-light dark:bg-brand-primary-light rounded-xl border border-brand/20">
                          <p className="font-bold text-brand mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Debes tener:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.documents.map((doc, docIndex) => (
                              <p key={docIndex} className="text-gray-700 dark:text-[var(--text-secondary)] text-sm flex items-center gap-2 bg-white/60 dark:bg-[var(--bg-tertiary)] rounded-lg px-3 py-2">
                                <span className="w-5 h-5 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-brand" />
                                </span>
                                {doc}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.tips && (
                        <div className="mt-4 p-4 bg-brand-light dark:bg-brand-primary-light rounded-xl border border-brand/20">
                          <p className="font-bold text-brand mb-3 flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Recomendaciones:
                          </p>
                          <div className="space-y-2">
                            {step.tips.map((tip, tipIndex) => (
                              <p key={tipIndex} className="text-gray-700 dark:text-[var(--text-secondary)] text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 flex-shrink-0"></span>
                                {tip}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.conditions && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-[var(--bg-tertiary)] rounded-xl border border-gray-200 dark:border-[var(--border-color)]">
                          <p className="font-bold text-gray-800 dark:text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Condiciones a revisar:
                          </p>
                          <div className="space-y-2">
                            {step.conditions.map((condition, condIndex) => (
                              <p key={condIndex} className="text-gray-600 dark:text-[var(--text-secondary)] text-sm flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                {condition}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.important && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/30">
                          <p className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2">
                            <TriangleAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                            Importante: {step.important}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
