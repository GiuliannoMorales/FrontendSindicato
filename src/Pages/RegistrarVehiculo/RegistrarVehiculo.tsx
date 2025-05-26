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
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64WithoutPrefix = base64String.split(",")[1] || "";
                setPreview(base64WithoutPrefix);
            };
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
            console.log("Vehículo guardado exitosamente en VehiculosDB");
            navigate("/registrar/usuario");
        } catch (error) {
            console.log("Error al guardar el vehículo");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="registrarVehiculo">
            <h2 className="registrarVehiculo__title">REGISTRAR VEHICULO</h2>

            <form className="registrarVehiculo__form">
                <div className="registrarVehiculo__form-left">
                    <fieldset>
                        <div className="registrarVehiculo__input-group">
                            <label>Tipo Vehículo: <span className="registrarVehiculo__required">*</span></label>
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                                <option value="">Seleccione</option>
                                <option value="Auto">Automóvil</option>
                                <option value="Moto">Motocicleta</option>
                            </select>
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Placa: <span className="registrarVehiculo__required">*</span></label>
                            <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} maxLength={10}
                                title="La placa no debe superar los 10 caracteres" required />
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Marca: <span className="registrarVehiculo__required">*</span></label>
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required />
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Modelo: <span className="registrarVehiculo__required">*</span></label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required />
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Color: <span className="registrarVehiculo__required">*</span></label>
                            <input type="text" name="color" value={formData.color} onChange={handleInputChange} required />
                        </div>
                    </fieldset>
                </div>

                <div className="registrarVehiculo__form-right">
                    <div className="registrarVehiculo__input-group">
                        <label>Foto vehículo delantera: <span className="registrarVehiculo__required">*</span></label>
                        <div className="registrarVehiculo__upload-box">
                            {delanteraPreview ? (
                                <img
                                    src={`data:image/jpeg;base64,${delanteraPreview}`}
                                    alt="Foto delantera"
                                    onClick={() => delanteraRef.current?.click()}
                                    className="registrarVehiculo__photo-preview"
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

                    <div className="registrarVehiculo__input-group">
                        <label>Foto vehículo trasera: <span className="registrarVehiculo__required">*</span></label>
                        <div className="registrarVehiculo__upload-box">
                            {traseraPreview ? (
                                <img
                                    src={`data:image/jpeg;base64,${traseraPreview}`}
                                    alt="Foto trasera"
                                    onClick={() => traseraRef.current?.click()}
                                    className="registrarVehiculo__photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={() => traseraRef.current?.click()} className="registrarVehiculo__upload-button">Subir Foto</button>
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

            <div className="registrarVehiculo__actions">
                <button type="button" className="registrarVehiculo__cancel-button" onClick={() => navigate("/registrar/usuario")}>CANCELAR</button>
                <button type="button" className="registrarVehiculo__submit-button" onClick={handleSave}>GUARDAR</button>
            </div>
        </section>
    );
};

export default RegistrarVehiculo;
