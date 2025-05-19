import { useRef, useState } from "react";
import "./User.css";
import Layout from "../../components/Layout";

const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
    const [vehiclePhotos, setVehiclePhotos] = useState<File[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const userPhotoRef = useRef<HTMLInputElement>(null);
    const vehiclePhotoRef = useRef<HTMLInputElement>(null);
    const vehicleEditRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const handleUserPhotoClick = () => userPhotoRef.current?.click();
    const handleVehiclePhotoClick = () => vehiclePhotoRef.current?.click();

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

    const handleDeleteVehicleClick = (index:number) => {
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
        <Layout>
            <h2 className="form-title">REGISTRAR USUARIO</h2>

            <form className="form-two-columns">
                <div className="form-left">
                    <legend>• Datos Personales:</legend>
                    <fieldset>
                        <div className="input-group ci-group">
                            <label>CI: <span className="required">*</span></label>
                            <input
                                type="text"
                                value={ci}
                                onChange={handleCiChange}
                                required
                            />
                            {!/^\d+$/.test(ci) && ci !== "" && (
                                <p className="error-message">Formato inválido.</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Nombre(s): <span className="required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="input-group">
                            <label>Apellido(s): <span className="required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="input-group">
                            <label>Correo Electrónico: <span className="required">*</span></label>
                            <input type="email" required />
                        </div>
                        <div className="input-group">
                            <label>Teléfono: <span className="required">*</span></label>
                            <input type="tel" required />
                        </div>
                    </fieldset>

                    <legend>• Datos Cuenta:</legend>
                    <fieldset>
                        <div className="input-group">
                            <label>Tipo Usuario: <span className="required">*</span></label>
                            <select required>
                                <option value="">Seleccione</option>
                                <option value="admin">Administrativo</option>
                                <option value="docentE">Docente a dedicación exclusiva</option>
                                <option value="docentH">Docente horario</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Contraseña: <span className="required">*</span></label>
                            <div className="password-wrapper">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    required
                                    placeholder="Ingrese su contraseña"
                                />
                                <button
                                    type="button"
                                    className="toggle-eye"
                                    onClick={togglePasswordVisibility}
                                    aria-label="Mostrar/Ocultar contraseña"
                                >
                                    <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="form-right">
                    <div className="input-group2">
                        <label>Foto Usuario: <span className="required">*</span></label>
                        <div className="upload-box">
                            {userPhotoPreview ? (
                                <img
                                    src={userPhotoPreview}
                                    alt="Foto de usuario"
                                    onClick={handleUserPhotoClick}
                                    className="user-photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={handleUserPhotoClick}>Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={userPhotoRef}
                                onChange={handleUserPhotoChange}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="input-group2">
                        <label>Vehículo(s): <span className="required">*</span></label>

                        {/* Lista de imágenes seleccionadas */}
                        <div className="vehicle-photo-list">
                            {vehiclePhotos.map((file, index) => (
                                <div key={index} className="vehicle-photo-item">
                                    <span className="vehicle-photo-name">{file.name}</span>

                                    <div className="vehicle-photo-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEditVehicleClick(index)}
                                            className="vehicle-edit-button"
                                            title="Cambiar imagen"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVehicleClick(index)}
                                            className="vehicle-delete-button"
                                            title="Eliminar imagen"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button type="button" className="add-vehicle" onClick={handleVehiclePhotoClick}>
                                + Añadir vehículo
                            </button>
                        </div>

                        {/* Selectores de archivos ocultos */}
                        <input
                            type="file"
                            ref={vehiclePhotoRef}
                            onChange={handleVehiclePhotoChange}
                            style={{ display: "none" }}
                            accept="image/*"
                            multiple
                        />
                        <input
                            type="file"
                            ref={vehicleEditRef}
                            onChange={handleReplaceVehiclePhoto}
                            style={{ display: "none" }}
                            accept="image/*"
                        />
                    </div>
                </div>
            </form>

            <div className="form-actions">
                <button type="button" className="cancel-button">CANCELAR</button>
                <button type="submit" className="submit-button">REGISTRAR</button>
            </div>
        </Layout>
    );
};

export default User;
