//import { useState } from "react";
import { validators } from "./validators";

export const useFormHandlers = (
  isEditMode: boolean,
  setCi: React.Dispatch<React.SetStateAction<string>>,
  setNombre: React.Dispatch<React.SetStateAction<string>>,
  setApellido: React.Dispatch<React.SetStateAction<string>>,
  setCorreo: React.Dispatch<React.SetStateAction<string>>,
  setTelefono: React.Dispatch<React.SetStateAction<string>>,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string | null>>>,
  setPhotoError?: React.Dispatch<React.SetStateAction<string | null>>

) => {
  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "ci":
        setCi(value);
        setErrors(prev => ({ ...prev, ci: validators.validateCI(value) }));
        break;
      case "nombre":
        setNombre(value);
        setErrors(prev => ({ ...prev, nombre: validators.validateNombre(value) }));
        break;
      case "apellido":
        setApellido(value);
        setErrors(prev => ({ ...prev, apellido: validators.validateApellido(value) }));
        break;
      case "correo":
        setCorreo(value);
        setErrors(prev => ({ ...prev, correo: validators.validateCorreo(value) }));
        break;
      case "telefono":
        setTelefono(value);
        setErrors(prev => ({ ...prev, telefono: validators.validateTelefono(value) }));
        break;
      case "password":
        setPassword(value);
        setErrors(prev => ({ ...prev, password: validators.validatePassword(value, isEditMode) }));
        break;
    }
  };

  const handlePhotoChange = (file: File | null, onSuccess: (base64: string) => void) => {
    const error = validators.validateUserPhoto(file);

    if (setPhotoError) {
      setPhotoError(error);
    }

    if (error || !file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64WithoutPrefix = base64String.split(",")[1] || "";
      onSuccess(base64WithoutPrefix);
    };
    reader.readAsDataURL(file);
  };

  return { handleInputChange, handlePhotoChange };
};
