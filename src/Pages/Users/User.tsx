import { useEffect, useRef, useState } from "react";
import "./User.css";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { useNavigate } from "react-router-dom";
import { openVehiculosDB } from "../../bd/vehiculosBD";

const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [ci, setCi] = useState("");

    const navigate = useNavigate();
    const userPhotoRef = useRef<HTMLInputElement>(null);
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

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const handleUserPhotoClick = () => userPhotoRef.current?.click();
    const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => setCi(e.target.value);

    const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUserPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
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
                    <legend className="user__legend">• Datos Personales:</legend>
                    <fieldset className="user__fieldset">
                        <div className="user__input-group user__input-group--ci">
                            <label className="user__label">CI: <span className="user__required">*</span></label>
                            <input
                                type="text"
                                value={ci}
                                onChange={handleCiChange}
                                required
                                className="user__input"
                            />
                            {!/^\d+$/.test(ci) && ci !== "" && (
                                <p className="user__error-message">Formato inválido.</p>
                            )}
                        </div>
                        <div className="user__input-group">
                            <label className="user__label">Nombre(s): <span className="user__required">*</span></label>
                            <input type="text" required className="user__input" />
                        </div>
                        <div className="user__input-group">
                            <label className="user__label">Apellido(s): <span className="user__required">*</span></label>
                            <input type="text" required className="user__input" />
                        </div>
                        <div className="user__input-group">
                            <label className="user__label">Correo Electrónico: <span className="user__required">*</span></label>
                            <input type="email" required className="user__input" />
                        </div>
                        <div className="user__input-group">
                            <label className="user__label">Teléfono: <span className="user__required">*</span></label>
                            <input type="tel" required className="user__input" />
                        </div>
                    </fieldset>

                    <legend className="user__legend">• Datos Cuenta:</legend>
                    <fieldset className="user__fieldset">
                        <div className="user__input-group">
                            <label className="user__label">Tipo Usuario: <span className="user__required">*</span></label>
                            <select required className="user__select">
                                <option value="">Seleccione</option>
                                <option value="admin">Administrativo</option>
                                <option value="docentE">Docente a dedicación exclusiva</option>
                                <option value="docentH">Docente horario</option>
                            </select>
                        </div>
                        <div className="user__input-group">
                            <label className="user__label">Contraseña: <span className="user__required">*</span></label>
                            <div className="user__password-wrapper">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    required
                                    placeholder="Ingrese su contraseña"
                                    className="user__input"
                                />
                                <button
                                    type="button"
                                    className="user__toggle-eye"
                                    onClick={togglePasswordVisibility}
                                    aria-label="Mostrar/Ocultar contraseña"
                                >
                                    <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="user__form-right">
                    <div className="user__input-group user__input-group--photo">
                        <label className="user__label">Foto Usuario: <span className="user__required">*</span></label>
                        <div className="user__upload-box">
                            {userPhotoPreview ? (
                                <img
                                    src={userPhotoPreview}
                                    alt="Foto de usuario"
                                    onClick={handleUserPhotoClick}
                                    className="user__photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={handleUserPhotoClick} className="user__upload-button">Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={userPhotoRef}
                                onChange={handleUserPhotoChange}
                                style={{ display: "none" }}
                                accept="image/*"
                                className="user__file-input"
                            />
                        </div>
                    </div>

                    <div className="user__input-group user__input-group--vehicles">
                        <label className="user__label">Vehículo: <span className="user__required">*</span></label>
                        <div className="user__vehicle-photo-list">
                            {vehiculos.length > 0 && (
                                vehiculos.map((vehiculo) => (
                                    <div key={vehiculo.id} className="user__vehicle-photo-item">
                                        <span className="user__vehicle-photo-name">
                                            {vehiculo.tipo} - {vehiculo.placa}
                                        </span>
                                        <div className="user__vehicle-photo-actions">
                                            <button
                                                type="button"
                                                onClick={() => vehicleEditRef.current?.click()}
                                                className="user__vehicle-edit-button"
                                                title="Cambiar imagen"
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteVehicle(vehiculo.id)}
                                                className="user__vehicle-delete-button"
                                                title="Eliminar vehículo"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}

                            <button type="button" className="user__add-vehicle" onClick={() => navigate("/registrar/vehiculo")} disabled={vehiculos.length >= 5}
                                title={vehiculos.length >= 5 ? "Máximo 5 vehículos permitidos" : ""}>
                                + Añadir vehículo
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={vehicleEditRef}
                            //onChange={handleReplaceVehiclePhoto}
                            style={{ display: "none" }}
                            accept="image/*"
                            className="user__file-input"
                        />
                    </div>
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
