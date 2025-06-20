export interface FormData {
    ci: string;
    nombre: string;
    apellido: string;
    correo: string;
    nroCelular: string;
    password: string;
    tipo: string;
    userPhoto: string | null;
    assignedSpace: string | null;
    vehiculos: any[];
}

export function validateFormData(data: FormData): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // Validaciones de campos básicos
    if (!data.ci.trim()) {
        errors.ci = "El campo CI es obligatorio.";
    } else if (!/^\d+$/.test(data.ci)) {
        errors.ci = "El CI debe contener solo números.";
    }

    if (!data.nombre.trim()) {
        errors.nombre = "El nombre es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.nombre)) {
        errors.nombre = "El nombre solo puede contener letras.";
    }

    if (!data.apellido.trim()) {
        errors.apellido = "El apellido es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.apellido)) {
        errors.apellido = "El apellido solo puede contener letras.";
    }

    if (!data.correo.trim()) {
        errors.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
        errors.correo = "Correo inválido.";
    }

    if (!data.nroCelular.trim()) {
        errors.nroCelular = "El número de teléfono es obligatorio.";
    } else if (!/^[67]\d{7}$/.test(data.nroCelular)) {
        errors.nroCelular = "Debe ingresar un número de celular boliviano válido (8 dígitos que comienzan en 6 o 7).";
    }

    if (!data.password.trim()) {
        errors.password = "La contraseña es obligatoria.";
    } else if (!/^(?=.*[A-Z]).{6,}$/.test(data.password)) {
        errors.password = "Debe tener al menos 6 caracteres y una mayúscula.";
    }

    // Validaciones de negocio
    if (!data.tipo.trim()) {
        errors.tipo = "Debe seleccionar un tipo de usuario.";
    }

    if (!data.userPhoto) {
        errors.foto = "Debe subir una foto del usuario.";
    }

    if (data.tipo !== "Docente a tiempo horario" && !data.assignedSpace) {
        errors.parqueo = "Debe asignar un espacio de parqueo.";
    }

    if (data.vehiculos.length === 0) {
        errors.vehiculos = "Debe agregar al menos un vehículo.";
    }

    return errors;
}
