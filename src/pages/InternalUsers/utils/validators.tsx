// Validadores individuales
export const validators = {
  validateCI: (ci: string): string | null => {
    if (!ci.trim()) return "El CI es obligatorio";
    if (!/^\d+$/.test(ci)) return "El CI debe contener solo números";
    if (ci.length < 7) return "El CI debe tener al menos 7 dígitos";
    return null;
  },

  validateNombre: (nombre: string): string | null => {
    if (!nombre.trim()) return "El nombre es obligatorio";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return "Formato inválido: solo letras";
    return null;
  },

  validateApellido: (apellido: string): string | null => {
    if (!apellido.trim()) return "El apellido es obligatorio";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) return "Formato inválido: solo letras";
    return null;
  },

  validateCorreo: (correo: string): string | null => {
    if (!correo.trim()) return "El correo es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) return "Correo no válido";
    return null;
  },

  validateTelefono: (telefono: string): string | null => {
    if (!telefono.trim()) return "El número de celular es obligatorio";
    if (!/^[67]\d{7}$/.test(telefono)) {
      return "Debe ingresar un número de celular boliviano válido (8 dígitos que comienzan en 6 o 7)";
    }
    return null;
  },

  validatePassword: (password: string, isEditMode: boolean): string | null => {
    if (isEditMode) return null;
    if (!password.trim()) return "La contraseña es obligatoria";
    if (password.length < 8) return "Debe tener al menos 8 caracteres";
    if (!/[A-Z]/.test(password)) return "Debe tener al menos una mayúscula";
    if (!/\d/.test(password)) return "Debe tener al menos un número";
    return null;
  },

  validateUserPhoto: (file: File | null): string | null => {
    if (!file) return "Debe seleccionar una imagen.";
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten imágenes en formato JPG o PNG.";
    }

    if (file.size > maxSize) {
      return "La imagen no debe superar los 5MB.";
    }

    return null;
  }
};

// Tipo de datos esperados
interface FormData {
  ci: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  password: string;
  userType: string;
  userPhoto: string | null;
  isEditMode: boolean;
}

// Función para validar todo el formulario
export const validateFormData = (data: FormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  const {
    ci,
    nombre,
    apellido,
    correo,
    telefono,
    password,
    userType,
    userPhoto,
    isEditMode,
  } = data;

  const ciError = validators.validateCI(ci);
  if (ciError) errors.ci = ciError;

  const nombreError = validators.validateNombre(nombre);
  if (nombreError) errors.nombre = nombreError;

  const apellidoError = validators.validateApellido(apellido);
  if (apellidoError) errors.apellido = apellidoError;

  const correoError = validators.validateCorreo(correo);
  if (correoError) errors.correo = correoError;

  const telefonoError = validators.validateTelefono(telefono);
  if (telefonoError) errors.telefono = telefonoError;

  const passwordError = validators.validatePassword(password, isEditMode);
  if (passwordError) errors.password = passwordError;

  if (!userType.trim()) errors.userType = "Debe seleccionar un tipo de usuario";

  if (!isEditMode && !userPhoto) errors.userPhoto = "Debe subir una foto del usuario";

  return errors;
};
