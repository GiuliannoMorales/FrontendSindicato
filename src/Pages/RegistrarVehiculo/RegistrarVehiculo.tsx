import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarVehiculo.css";
import { guardarVehiculo } from "../../bd/vehiculosBD";

const RegistrarVehiculo = () => {
    const [formData, setFormData] = useState({
        tipo: "",
        placa: "",
        marca: "",
        modelo: "",
        color: "",
    });

    const [delanteraPreview, setDelanteraPreview] = useState<string | null>(null);
    const [traseraPreview, setTraseraPreview] = useState<string | null>(null);

    const delanteraRef = useRef<HTMLInputElement>(null);
    const traseraRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (
            !formData.tipo ||
            !formData.placa ||
            !formData.marca ||
            !formData.modelo ||
            !formData.color ||
            !delanteraPreview ||
            !traseraPreview
        ) {
            alert("Por favor complete todos los campos y suba ambas imágenes.");
            return;
        }

        const data = {
            ...formData,
            fotoDelantera: delanteraPreview,
            fotoTrasera: traseraPreview,
        };

        try {
            await guardarVehiculo(data);
            alert("Vehículo guardado exitosamente en VehiculosDB");
            navigate("/registrar/usuario");
        } catch (error) {
            alert("Error al guardar el vehículo");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="vehiculo">
            <h2 className="vehiculo__form-title">REGISTRAR VEHICULO</h2>

            <form className="vehiculo__form-two-columns">
                <div className="vehiculo__form-left">
                    <fieldset>
                        <div className="vehiculo__input-group">
                            <label>Tipo Vehículo: <span className="vehiculo__required">*</span></label>
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                                <option value="">Seleccione</option>
                                <option value="Automóvil">Automóvil</option>
                                <option value="Motocicleta">Motocicleta</option>
                            </select>
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Placa: <span className="vehiculo__required">*</span></label>
                            <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} maxLength={10}
                                title="La placa no debe superar los 10 caracteres" required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Marca: <span className="vehiculo__required">*</span></label>
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Modelo: <span className="vehiculo__required">*</span></label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required />
                        </div>
                        <div className="vehiculo__input-group">
                            <label>Color: <span className="vehiculo__required">*</span></label>
                            <input type="text" name="color" value={formData.color} onChange={handleInputChange} required />
                        </div>
                    </fieldset>
                </div>

                <div className="vehiculo__form-right">
                    <div className="vehiculo__input-group">
                        <label>Foto vehículo delantera: <span className="vehiculo__required">*</span></label>
                        <div className="vehiculo__upload-box">
                            {delanteraPreview ? (
                                <img
                                    src={delanteraPreview}
                                    alt="Foto delantera"
                                    onClick={() => delanteraRef.current?.click()}
                                    className="vehiculo__photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={() => delanteraRef.current?.click()}>Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={delanteraRef}
                                onChange={(e) => handleImageChange(e, setDelanteraPreview)}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="vehiculo__input-group">
                        <label>Foto vehículo trasera: <span className="vehiculo__required">*</span></label>
                        <div className="vehiculo__upload-box">
                            {traseraPreview ? (
                                <img
                                    src={traseraPreview}
                                    alt="Foto trasera"
                                    onClick={() => traseraRef.current?.click()}
                                    className="vehiculo__photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={() => traseraRef.current?.click()}>Subir Foto</button>
                            )}
                            <input
                                type="file"
                                ref={traseraRef}
                                onChange={(e) => handleImageChange(e, setTraseraPreview)}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="vehiculo__form-actions">
                <button type="button" className="vehiculo__cancel-button" onClick={() => navigate("/registrar/usuario")}>CANCELAR</button>
                <button type="button" className="vehiculo__submit-button" onClick={handleSave}>GUARDAR</button>
            </div>
        </section>
    );
};

export default RegistrarVehiculo;
