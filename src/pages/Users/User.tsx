import { useEffect, useRef, useState } from "react";
import "./User.css";
import {
    clearVehiculos,
    deleteVehiculoById,
    getAllVehiculos,
} from "./services/vehiculosService";
import UserFormLeft from "./components/UserFormLeft/UserFormLeft";
import UserFormRight from "./components/UserFormRight/UserFormRight";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [userType, setUserType] = useState("");
    const [assignedSpace, setAssignedSpace] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    const userPhotoRef = useRef<HTMLInputElement | null>(null);
    const vehicleEditRef = useRef<HTMLInputElement>(null);

    const handleAssignedSpaceChange = (space: string | null) => {
        setAssignedSpace(space);
    };

    useEffect(() => {
        const limpiarVehiculos = async () => {
            if (!sessionStorage.getItem("vehiculosDBIniciada")) {
                await clearVehiculos();
                sessionStorage.setItem("vehiculosDBIniciada", "true");
            }
        };
        limpiarVehiculos();
    }, []);

    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const resultados = await getAllVehiculos();
                setVehiculos(resultados);
            } catch (error) {
                console.error("Error al obtener vehículos:", error);
            }
        };

        fetchVehiculos();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            clearVehiculos();
            sessionStorage.removeItem("vehiculosDBIniciada");
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const resetForm = async () => {
        setFormData({
            ci: "",
            nombre: "",
            apellido: "",
            correo: "",
            nroCelular: "",
            tipo: "",
            password: "",
        });
        setUserPhoto(null);
        setVehiculos([]);
        setAssignedSpace(null);

        try {
            await clearVehiculos();
        } catch (error) {
            console.error("Error al limpiar vehículos:", error);
        }
    };

    const handleDeleteVehicle = async (id: number) => {
        try {
            await deleteVehiculoById(id);
            setVehiculos((prev) => prev.filter((v) => v.id !== id));
        } catch (error) {
            console.error("Error al eliminar vehículo:", error);
        }
    };

    const [formData, setFormData] = useState({
        ci: "",
        nombre: "",
        apellido: "",
        correo: "",
        nroCelular: "",
        tipo: "",
        password: "",
    });

    const handleFormChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const handleUserPhotoClick = () => userPhotoRef.current?.click();

    const handleUserPhotoChange = (base64: string) => {
        const base64WithoutPrefix = base64.replace(
            /^data:image\/[a-zA-Z]+;base64,/,
            "",
        );
        setUserPhoto(base64WithoutPrefix);
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        setShowCancelModal(false);
        await resetForm();
        navigate("/");
    };

    const closeModal = () => {
        setShowCancelModal(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const { ci, nombre, apellido, correo, nroCelular, password } = formData;
        const tipo = userType;

        if (
            !ci.trim() ||
            !nombre.trim() ||
            !apellido.trim() ||
            !correo.trim() ||
            !nroCelular.trim() ||
            !tipo.trim() ||
            !password.trim() ||
            (userType !== "Docente a tiempo horario" && !assignedSpace) ||
            vehiculos.length === 0
        ) {
            alert(
                "Por favor, complete todos los campos requeridos y agregue al menos un vehículo.",
            );
            return;
        }
        const vehiculosSinId = vehiculos.map(({ id, ...rest }) => rest);
        const newUser = {
            cliente: {
                ...formData,
                tipo: userType,
                foto: userPhoto,
            },
            vehiculos: vehiculosSinId,
            parqueo: userType === "Docente a tiempo horario"
                ? null
                : assignedSpace
                    ? { nroEspacio: Number(assignedSpace) }
                    : null,
        };
        console.log("Datos que se enviarán al backend:", newUser);
        try {
            const response = await api.post("/clientes/registrar", newUser);
            console.log("Usuario registrado:", response.data);
            await clearVehiculos();
            await resetForm();

        } catch (error: any) {
            if (error.response) {
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);

                if (error.response.data.errors) {
                    const errors: { [key: string]: string } = {};
                    error.response.data.errors.forEach((err: any) => {
                        const field = err.field ? err.field.replace("cliente.", "") : "unknown";
                        errors[field] = err.message || "Error desconocido";
                        console.error(`Campo: ${err.field}, Mensaje: ${err.message}`);
                    });
                    setFormErrors(errors);
                }else {
                    setShowErrorModal(true);
                }
            } else {
                console.error("Error:", error.message);
                setShowErrorModal(true);
            }
        }
    };

    return (
        <section className="user">
            <h2 className="user__title">REGISTRAR USUARIO</h2>
            <form className="user__form">
                <div className="user__form-left">
                    <UserFormLeft
                        ci={formData.ci}
                        nombre={formData.nombre}
                        apellido={formData.apellido}
                        correo={formData.correo}
                        nroCelular={formData.nroCelular}
                        onChange={handleFormChange}
                        userType={userType}
                        onUserTypeChange={setUserType}
                        passwordVisible={passwordVisible}
                        password={formData.password}
                        onPasswordChange={(value) =>
                            handleFormChange("password", value)}
                        onTogglePasswordVisibility={togglePasswordVisibility}
                        errors={formErrors}
                    />
                </div>

                <div className="user__form-right">
                    <UserFormRight
                        userPhotoPreview={userPhoto}
                        userPhotoRef={userPhotoRef}
                        handleUserPhotoClick={handleUserPhotoClick}
                        handleUserPhotoChange={handleUserPhotoChange}
                        vehiculos={vehiculos}
                        vehicleEditRef={vehicleEditRef}
                        handleDeleteVehicle={handleDeleteVehicle}
                        userType={userType}
                        assignedSpace={assignedSpace}
                        onAssignedSpaceChange={handleAssignedSpaceChange}
                    />
                </div>
            </form>

            <div className="user__form-actions">
                <button
                    type="button"
                    className="user__cancel-button"
                    onClick={handleCancelClick}
                >
                    CANCELAR
                </button>
                <button
                    type="submit"
                    className="user__submit-button"
                    onClick={handleRegister}
                >
                    REGISTRAR
                </button>
            </div>

            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>¿Estás seguro de cancelar?</p>
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="cancel">
                                No
                            </button>
                            <button onClick={confirmCancel} className="confirm">
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>
                            Ocurrió un error al guardar los datos. Por favor,
                            intente nuevamente.
                        </p>
                        <div className="modal-buttons">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="confirm"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default User;
