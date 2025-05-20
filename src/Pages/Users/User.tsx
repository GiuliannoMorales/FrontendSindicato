import { useRef, useState } from "react";
import "./User.css";
import { EditIcon } from "../../assets/icons/EditIcon";
import { TrashIcon } from "../../assets/icons/TrashIcon";
import { useNavigate } from "react-router-dom";

const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
    const [vehiclePhotos, setVehiclePhotos] = useState<File[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    const userPhotoRef = useRef<HTMLInputElement>(null);
    const vehiclePhotoRef = useRef<HTMLInputElement>(null);
    const vehicleEditRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const handleUserPhotoClick = () => userPhotoRef.current?.click();
       // const handleVehiclePhotoClick = () => vehiclePhotoRef.current?.click();

    const [ci, setCi] = useState("");

    const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCi(e.target.value);
    };

    const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUserPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setVehiclePhotos(prev => [...prev, ...files]);
    };

    const handleEditVehicleClick = (index: number) => {
        setEditIndex(index);
        vehicleEditRef.current?.click();
    };

    const handleDeleteVehicleClick = (index: number) => {
        const newVehiclePhotos = [...vehiclePhotos];
        newVehiclePhotos.splice(index, 1);
        setVehiclePhotos(newVehiclePhotos);
    };

    const handleReplaceVehiclePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file !== undefined && editIndex !== null) {
            const updated = [...vehiclePhotos];
            updated[editIndex] = file;
            setVehiclePhotos(updated);
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
                        <label className="user__label">Vehículo(s): <span className="user__required">*</span></label>

                        <div className="user__vehicle-photo-list">
                            {vehiclePhotos.map((file, index) => (
                                <div key={index} className="user__vehicle-photo-item">
                                    <span className="user__vehicle-photo-name">{file.name}</span>

                                    <div className="user__vehicle-photo-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEditVehicleClick(index)}
                                            className="user__vehicle-edit-button"
                                            title="Cambiar imagen"
                                        >
                                            <EditIcon />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVehicleClick(index)}
                                            className="user__vehicle-delete-button"
                                            title="Eliminar imagen"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="user__add-vehicle" onClick={() => navigate("/registrar/vehiculo")}>
                                + Añadir vehículo
                            </button>
                        </div>

                        <input
                            type="file"
                            ref={vehiclePhotoRef}
                            onChange={handleVehiclePhotoChange}
                            style={{ display: "none" }}
                            accept="image/*"
                            multiple
                            className="user__file-input"
                        />
                        <input
                            type="file"
                            ref={vehicleEditRef}
                            onChange={handleReplaceVehiclePhoto}
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