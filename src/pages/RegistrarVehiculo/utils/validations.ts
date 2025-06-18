interface FieldErrors {
    [key: string]: string;
}

interface FormData {
    tipo: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
}

export const validateField = (name: string, value: string): string => {
    let error = "";
    const trimmedValue = value.trim();

    switch (name) {
        case "placa":
            if (trimmedValue === "") {
                error = "Este campo es requerido.";
            } else if (!/^\d{3,4}[A-Z]{3}$/.test(trimmedValue)) {
                error = "Formato inválido. Ej: 123ABC o 1234ABC";
            }
            break;
        case "marca":
        case "color":
            if (trimmedValue === "") {
                error = "Este campo es requerido.";
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(trimmedValue)) {
                error = "Formato inválido. Solo letras y espacios.";
            }
            break;
        case "modelo":
            if (trimmedValue === "") {
                error = "Este campo es requerido.";
            }
            break;
        default:
            if (trimmedValue === "") {
                error = "Este campo es requerido.";
            }
            break;
    }
    return error;
};

export const validateVehicleForm = (formData: FormData, delanteraPreview: string | null, traseraPreview: string | null): FieldErrors => {
    let errors: FieldErrors = {};

    for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
            const value = formData[key as keyof FormData];

            if (key === "tipo") {
                if (value === "") {
                    errors.tipo = "Debe seleccionar un tipo de vehículo.";
                }
            } else {
                const fieldError = validateField(key, value);
                if (fieldError) {
                    errors[key] = fieldError;
                }
            }
        }
    }

    if (!delanteraPreview) {
        errors.fotoDelantera = "Se requiere la foto delantera.";
    }
    if (!traseraPreview) {
        errors.fotoTrasera = "Se requiere la foto trasera.";
    }

    return errors; 
};