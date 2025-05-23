import React, { useEffect, type RefObject } from "react";
import { EditIcon } from "../../../../assets/icons/EditIcon";
import { TrashIcon } from "../../../../assets/icons/TrashIcon";
import { useNavigate } from "react-router-dom";
import "./UserFormRight.css";

interface UserFormRightProps {
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
}

const UserFormRight: React.FC<UserFormRightProps> = ({
    userPhotoPreview,
    userPhotoRef,
    handleUserPhotoClick,
    handleUserPhotoChange,
    vehiculos,
    vehicleEditRef,
    handleDeleteVehicle,
    userType,
    assignedSpace,
    onAssignedSpaceChange,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (userType !== "ADMINISTRATIVO" && userType !== "DOCENTE_EXCLUSIVA") {
            onAssignedSpaceChange(null);
        }
    }, [userType]);

    const handleAssignedSpaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onAssignedSpaceChange(e.target.value || null);
    };

    const onUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleUserPhotoChange(base64String);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <div className="user__input-group user__input-group--photo">
                <label className="user__label">
                    Foto Usuario: <span className="user__required">*</span>
                </label>
                <div className="user__upload-box">
                    {userPhotoPreview ? (
                        <img
                            src={userPhotoPreview}
                            alt="Foto de usuario"
                            onClick={handleUserPhotoClick}
                            className="user__photo-preview"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={handleUserPhotoClick}
                            className="user__upload-button"
                        >
                            Subir Foto
                        </button>
                    )}
                    <input
                        type="file"
                        ref={userPhotoRef}
                        onChange={onUserPhotoChange}
                        style={{ display: "none" }}
                        accept="image/*"
                        className="user__file-input"
                    />
                </div>
            </div>

            <div className="user__input-group user__input-group--vehicles">
                <label className="user__label">
                    Vehículo: <span className="user__required">*</span>
                </label>
                <div className="user__vehicle-photo-list">
                    {vehiculos.length > 0 &&
                        vehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id}
                                className="user__vehicle-photo-item"
                            >
                                <span className="user__vehicle-photo-name">
                                    {vehiculo.tipo} - {vehiculo.placa}
                                </span>
                                <div className="user__vehicle-photo-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            vehicleEditRef.current?.click()
                                        }
                                        className="user__vehicle-edit-button"
                                        title="Cambiar imagen"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteVehicle(vehiculo.id)
                                        }
                                        className="user__vehicle-delete-button"
                                        title="Eliminar vehículo"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}

                    <button
                        type="button"
                        className="user__add-vehicle"
                        onClick={() => navigate("/registrar/vehiculo")}
                        disabled={vehiculos.length >= 5}
                        title={
                            vehiculos.length >= 5
                                ? "Máximo 5 vehículos permitidos"
                                : ""
                        }
                    >
                        + Añadir vehículo
                    </button>
                </div>
                <input
                    type="file"
                    ref={vehicleEditRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    className="user__file-input"
                />
            </div>

            {(userType === "ADMINISTRATIVO" || userType === "DOCENTE_EXCLUSIVA") && (
                <div className="user__input-group user__input-group--space">
                    <label className="user__label">
                        Asignar espacio: <span className="user__required">*</span>
                    </label>
                    <select required className="user__select" value={assignedSpace || ""} onChange={handleAssignedSpaceChange}>
                        <option value="">Seleccione un espacio</option>
                        <option value="espacio1">Espacio 1</option>
                        <option value="espacio43">Espacio 43</option>
                        <option value="espacio72">Espacio 72</option>
                        <option value="espacio100">Espacio 100</option>
                    </select>
                </div>
            )}
        </>
    );
};

export default UserFormRight;
