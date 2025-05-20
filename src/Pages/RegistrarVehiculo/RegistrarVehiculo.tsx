import { useRef, useState } from "react";
import "./RegistrarVehiculo.css";

const RegistrarVehiculo = () => {
    const [vehiclePhotoPreview, setVehiclePhotoPreview] = useState<string | null>(null);
    const vehiclePhotoRef = useRef<HTMLInputElement>(null);

    const handleVehiclePhotoClick = () => vehiclePhotoRef.current?.click();

    const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setVehiclePhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="vehiculo-container">
            <h2 className="vehiculo-form-title">REGISTRAR VEHICULO</h2>

            <form className="vehiculo-form-two-columns">
                <div className="vehiculo-form-left">
                    <fieldset>
                        <div className="vehiculo-input-group">
                            <label>Tipo Vehículo: <span className="vehiculo-required">*</span></label>
                            <select required>
                                <option value="">Seleccione</option>
                                <option value="auto">Automóvil</option>
                                <option value="moto">Motocicleta</option>
                            </select>
                        </div>
                        <div className="vehiculo-input-group">
                            <label>Placa: <span className="vehiculo-required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo-input-group">
                            <label>Marca: <span className="vehiculo-required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo-input-group">
                            <label>Modelo: <span className="vehiculo-required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo-input-group">
                            <label>Color: <span className="vehiculo-required">*</span></label>
                            <input type="text" required />
                        </div>
                    </fieldset>
                </div>

                <div className="vehiculo-form-right">
                    <div className="vehiculo-input-group2">
                        <label>Foto vehículo delantera: <span className="vehiculo-required">*</span></label>
                        <div className="vehiculo-upload-box">
                            {vehiclePhotoPreview ? (
                                <img
                                    src={vehiclePhotoPreview}
                                    alt="Foto de vehiculo"
                                    onClick={handleVehiclePhotoClick}
                                    className="vehiculo-photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={handleVehiclePhotoClick}>Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={vehiclePhotoRef}
                                onChange={handleVehiclePhotoChange}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="vehiculo-input-group2">
                        <label>Foto vehículo trasera: <span className="vehiculo-required">*</span></label>
                        <div className="vehiculo-upload-box">
                            {vehiclePhotoPreview ? (
                                <img
                                    src={vehiclePhotoPreview}
                                    alt="Foto de vehiculo"
                                    onClick={handleVehiclePhotoClick}
                                    className="vehiculo-photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={handleVehiclePhotoClick}>Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={vehiclePhotoRef}
                                onChange={handleVehiclePhotoChange}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="vehiculo-form-actions">
                <button type="button" className="vehiculo-cancel-button">CANCELAR</button>
                <button type="submit" className="vehiculo-submit-button">REGISTRAR</button>
            </div>
        </section>
    );
};

export default RegistrarVehiculo;
