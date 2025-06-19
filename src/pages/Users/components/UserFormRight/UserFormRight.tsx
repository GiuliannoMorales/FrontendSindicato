import React, { useEffect, useState } from "react";
import { EditIcon } from "../../../../assets/icons/EditIcon";
import { TrashIcon } from "../../../../assets/icons/TrashIcon";
import { useNavigate } from "react-router-dom";
import "./UserFormRight.css";
import type { UserFormRightProps } from "../../models/UserModel";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

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
    errors,
    clearFieldError,
}) => {
    const navigate = useNavigate();
    const [espacios, setEspacios] = useState([]);
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        axiosPrivate.get("/parqueo/espacios-disponibles")
            .then((response) => {
                setEspacios(response.data.data);
            })
            .catch((error) => {
                console.error("Error al obtener espacios:", error);
            });
    }, []);

    useEffect(() => {
        if (userType !== "Administrativo" && userType !== "Docente a dedicación exclusiva") {
            onAssignedSpaceChange(null);
        }
    }, [userType, onAssignedSpaceChange]);

    const handleAssignedSpaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value || null;
        onAssignedSpaceChange(selected);
        if (selected) {
            clearFieldError("parqueo");
        }
    };

    const onUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64WithoutPrefix = base64String.split(",")[1] || "";
            handleUserPhotoChange(base64WithoutPrefix);
            clearFieldError("foto");
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <div className="user__input-group user__input-group--photo">
                <label className="user__label">
                    Foto Usuario: <span className="registrarVehiculo__required">*</span>
                </label>
                <div className="user__upload-box">
                    {userPhotoPreview ? (
                        <img
                            src={`data:image/jpeg;base64,${userPhotoPreview}`}
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
                {errors.foto && <span className="user__error">{errors.foto}</span>}
            </div>

            <div className="user__input-group user__input-group--vehicles">
                <label className="user__label">
                    Vehículo: <span className="registrarVehiculo__required">*</span>
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
                {errors.vehiculos && <span className="user__error">{errors.vehiculos}</span>}
                <input
                    type="file"
                    ref={vehicleEditRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    className="user__file-input"
                />
            </div>

            {(userType === "Administrativo" || userType === "Docente a dedicación exclusiva") && (
                <div className="user__input-group user__input-group--space">
                    <label className="user__label">
                        Asignar espacio: <span className="registrarVehiculo__required">*</span>
                    </label>
                    <select required className="select " value={assignedSpace || ""} onChange={handleAssignedSpaceChange}>
                        <option value="">Seleccione un espacio</option>
                        {espacios.map((espacio: number) => (
                            <option key={espacio} value={espacio}>
                                Espacio {espacio}
                            </option>
                        ))}
                    </select>
                    {errors.parqueo && <span className="user__error">{errors.parqueo}</span>}
                </div>
            )}
        </>
    );
};

export default UserFormRight;
