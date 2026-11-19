'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCRMInteraction } from '@/presentation/hooks/useCRMInteraction';
import { useAuthStore } from '@/presentation/store/authStore';
import { Input } from '@/presentation/components/ui';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/presentation/store/toastStore';

interface ContactFormProps {
  propertyId: number;
  ownerId: number;
}

export function ContactForm({ propertyId, ownerId }: ContactFormProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { trackContactForm, isLoading } = useCRMInteraction();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    contactName: user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : '',
    contactEmail: user?.email || '',
    contactPhone: '',
    message: 'Hola! Me interesa esta propiedad. Esta disponible?',
    preferredContactMethod: 'EMAIL',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  type ContactMethod = 'EMAIL' | 'PHONE' | 'WHATSAPP';

  const contactMethods: { value: ContactMethod; label: string; icon: string }[] = [
    { value: 'EMAIL', label: 'Email', icon: 'material-symbols:mail-outline' },
    { value: 'PHONE', label: 'Teléfono', icon: 'material-symbols:phone-in-talk-outline' },
    { value: 'WHATSAPP', label: 'WhatsApp', icon: 'ic:baseline-whatsapp' },
  ];

  const selectedMethod = contactMethods.find(m => m.value === formData.preferredContactMethod);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactName.trim()) newErrors.contactName = 'El nombre es obligatorio';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'El teléfono es obligatorio';
    } else {
      const digitsOnly = formData.contactPhone.replace(/\D/g, '');
      if (digitsOnly.length !== 9) {
        newErrors.contactPhone = 'El teléfono debe tener exactamente 9 dígitos';
      }
    }
    if (!formData.message.trim()) newErrors.message = 'El mensaje es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Para el telefono: solo permitir numeros y maximo 9 digitos
    if (name === 'contactPhone') {
      const digitsOnly = value.replace(/\D/g, '');
      const limited = digitsOnly.slice(0, 9);
      setFormData({ ...formData, contactPhone: limited });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await trackContactForm.mutateAsync({
        propertyId,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        message: formData.message,
        preferredContactMethod: formData.preferredContactMethod,
      });

      toast.success('Enviado exitosamente');

      setFormData({
        contactName: isAuthenticated && user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : '',
        contactEmail: isAuthenticated && user?.email ? user.email : '',
        contactPhone: '',
        message: 'Hola! Me interesa esta propiedad. Esta disponible?',
        preferredContactMethod: 'EMAIL' as ContactMethod,
      });
      setErrors({});
    } catch (error) {
      console.error('Error enviando formulario:', error);
      toast.error('Error al enviar el mensaje. Intentalo de nuevo.');
    }
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-lg shadow-[0_1px_2px_var(--shadow-color)] border border-[var(--border-color)] p-3">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
        Contactar al propietario
      </h3>

      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        <Input
          id="contactName"
          name="contactName"
          type="text"
          label="Nombre completo"
          value={formData.contactName}
          onChange={handleChange}
          error={errors.contactName}
          placeholder="Juan Pérez"
        />

        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          label="Email"
          value={formData.contactEmail}
          onChange={handleChange}
          error={errors.contactEmail}
          placeholder="juan@example.com"
        />

        <Input
          id="contactPhone"
          name="contactPhone"
          type="tel"
          label="Teléfono"
          value={formData.contactPhone}
          onChange={handleChange}
          error={errors.contactPhone}
          placeholder="+51 999 999 999"
        />

        {/* Método preferido - Dropdown personalizado */}
        <div ref={dropdownRef}>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Prefieres que te contacten por
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--bg-primary)] shadow-[0_1px_2px_var(--shadow-color)] hover:border-[var(--border-color)] transition-all duration-200 text-[var(--text-secondary)] text-sm"
          >
            <span className="flex items-center gap-2">
              {selectedMethod && (
                <Icon icon={selectedMethod.icon} className="w-4 h-4 text-brand" />
              )}
              <span>{selectedMethod?.label}</span>
            </span>
            <Icon
              icon="material-symbols:keyboard-arrow-down"
              className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="relative z-50">
              <div
                className="absolute top-1 left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden"
                style={{ animation: 'fadeIn 0.15s ease-out' }}
              >
                {contactMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, preferredContactMethod: method.value });
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                      formData.preferredContactMethod === method.value
                        ? 'bg-brand/5 text-brand font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <Icon
                      icon={method.icon}
                      className={`w-4 h-4 ${formData.preferredContactMethod === method.value ? 'text-brand' : 'text-[var(--text-tertiary)]'}`}
                    />
                    <span>{method.label}</span>
                    {formData.preferredContactMethod === method.value && (
                      <Icon icon="material-symbols:check" className="w-4 h-4 text-brand ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="message" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] ${
              errors.message
                ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50'
                : 'border-[var(--input-border)] focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--bg-secondary)]'
            }`}
            placeholder="Hola, me interesa esta propiedad..."
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}
