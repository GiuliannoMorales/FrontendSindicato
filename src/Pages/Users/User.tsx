import { useEffect, useRef, useState } from "react";
import "./User.css";
import { openVehiculosDB } from "../../bd/vehiculosBD";
import UserFormLeft from "./components/UserFormLeft/UserFormLeft";
import UserFormRight from "./components/UserFormRight/UserFormRight";


const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [userType, setUserType] = useState("");

    const userPhotoRef = useRef<HTMLInputElement | null>(null);
    const vehicleEditRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchVehiculosFromDB = async () => {
            try {
                const db = await openVehiculosDB();
                const transaction = db.transaction("vehiculos", "readonly");
                const store = transaction.objectStore("vehiculos");

                // para obtener todos los vehículos
                const request = store.getAll();

                request.onsuccess = () => {
                    const resultados = request.result;
                    if (resultados.length > 0) {
                        setVehiculos(resultados);

                    } else {
                        setVehiculos([]);

                    }
                };

                request.onerror = () => {
                    console.error("Error al leer vehículos desde VehiculosDB");
                };
            } catch (error) {
                console.error("Error al abrir VehiculosDB", error);
            }
        };

        fetchVehiculosFromDB();
    }, []);

    const [formData, setFormData] = useState({
        ci: "",
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoUsuario: "",
        contrasena: "",
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
        setUserPhoto(base64);
    };

    const handleDeleteVehicle = async (id: number) => {
        try {
            const db = await openVehiculosDB();
            const transaction = db.transaction("vehiculos", "readwrite");
            const store = transaction.objectStore("vehiculos");

            const deleteRequest = store.delete(id);

            deleteRequest.onsuccess = () => {
                // Actualizar el estado local para reflejar el cambio
                setVehiculos((prevVehiculos) => prevVehiculos.filter(v => v.id !== id));
                console.log(`Vehículo con id ${id} eliminado correctamente.`);
            };

            deleteRequest.onerror = () => {
                console.error("Error al eliminar vehículo");
            };
        } catch (error) {
            console.error("Error al acceder a la base de datos", error);
        }
    };

    return (
        <section className="user">
            <h2 className="user__title">REGISTRAR USUARIO</h2>
            <form className="user__form">
                <div className="user__form-left">
                    <UserFormLeft
                        ci={formData.ci}
                        onChange={handleFormChange}
                        userType={userType}
                        onUserTypeChange={setUserType}
                        passwordVisible={passwordVisible}
                        password={formData.contrasena}
                        onPasswordChange={(value) => handleFormChange("contrasena", value)}
                        onTogglePasswordVisibility={togglePasswordVisibility}
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
                    />
                </div>
            </form>

            <div className="user__form-actions">
                <button type="button" className="user__cancel-button">CANCELAR</button>
                <button type="submit" className="user__submit-button">REGISTRAR</button>
            </div>
        </section>
    );
};

export default User;
