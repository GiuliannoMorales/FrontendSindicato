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
        <section className="vehiculo">
            <h2 className="vehiculo__form-title">REGISTRAR VEHICULO</h2>

            <form className="vehiculo__form-two-columns">
                <div className="vehiculo__form-left">
                    <fieldset>
                        <div className="vehiculo__input-group">
                            <label>Tipo Vehículo: <span className="vehiculo__required">*</span></label>
                            <select required>
                                <option value="">Seleccione</option>
                                <option value="auto">Automóvil</option>
                                <option value="moto">Motocicleta</option>
                            </select>
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Placa: <span className="vehiculo__required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Marca: <span className="vehiculo__required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Modelo: <span className="vehiculo__required">*</span></label>
                            <input type="text" required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Color: <span className="vehiculo__required">*</span></label>
                            <input type="text" required />
                        </div>
                    </fieldset>
                </div>

                <div className="vehiculo__form-right">
                    <div className="vehiculo__input-group">
                        <label>Foto vehículo delantera: <span className="vehiculo__required">*</span></label>
                        <div className="vehiculo__upload-box">
                            {vehiclePhotoPreview ? (
                                <img
                                    src={vehiclePhotoPreview}
                                    alt="Foto de vehiculo"
                                    onClick={handleVehiclePhotoClick}
                                    className="vehiculo__photo-preview"
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

                    <div className="vehiculo__input-group">
                        <label>Foto vehículo trasera: <span className="vehiculo__required">*</span></label>
                        <div className="vehiculo__upload-box">
                            {vehiclePhotoPreview ? (
                                <img
                                    src={vehiclePhotoPreview}
                                    alt="Foto de vehiculo"
                                    onClick={handleVehiclePhotoClick}
                                    className="vehiculo__photo-preview"
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

            <div className="vehiculo__form-actions">
                <button type="button" className="vehiculo__cancel-button">CANCELAR</button>
                <button type="submit" className="vehiculo__submit-button">REGISTRAR</button>
            </div>
        </section>
    );
};

export default RegistrarVehiculo;
