export const validators = {
  validateCI: (ci: string): string | null => {
    if (!/^\d+$/.test(ci)) return "El CI debe contener solo números";
    if (ci.length < 7) return "El CI debe tener al menos 7 dígitos";
    return null;
  },

  validateNombre: (nombre: string): string | null => {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "Formato inválido: solo letras";
    return null;
  },

  validateApellido: (apellido: string): string | null => {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) return "Formato inválido: solo letras";
    return null;
  },

  validateCorreo: (correo: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) return "Correo no válido";
    return null;
  },

  validateTelefono: (telefono: string): string | null => {
    // Validación para formato internacional: + seguido de 7-15 dígitos
    if (!/^\+\d{7,15}$/.test(telefono)) return "Teléfono inválido (formato: +123456789)";
    return null;
  },

  validatePassword: (password: string, isEditMode: boolean): string | null => {
    if (isEditMode) return null;
    if (password.length < 8) return "Debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayúscula";
    if (!/\d/.test(password)) return "Debe tener al menos un número";
    return null;
  },
};
