import { type RefObject } from "react";

export interface UserFormRightProps {
    userPhotoPreview: string | null;
    userPhotoRef: RefObject<HTMLInputElement | null>;
    handleUserPhotoClick: () => void;
    handleUserPhotoChange: (base64: string) => void;
    vehiculos: any[];
    vehicleEditRef: RefObject<HTMLInputElement | null>;
    handleDeleteVehicle: (id: number) => void;
    userType: string;
    assignedSpace: string | null;
    onAssignedSpaceChange: (space: string | null) => void;
    errors: { [key: string]: string };
    clearFieldError: (field: string) => void;
}

export interface UserFormLeftProps {
    ci: string;
    nombre: string;
    apellido: string;
    correo: string;
    nroCelular: string;
    onChange: (field: string, value: string) => void;
    userType: string;
    onUserTypeChange: (value: string) => void;
    passwordVisible: boolean;
    password: string;
    onPasswordChange: (value: string) => void;
    onTogglePasswordVisibility: () => void;
    errors: { [key: string]: string };
}