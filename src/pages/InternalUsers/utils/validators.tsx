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
    if (!/^[67]\d{7}$/.test(telefono)) {
      return "Debe ingresar un número de celular boliviano válido (8 dígitos que comienzan en 6 o 7)";
    }
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
