import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarVehiculo.css";
import { guardarVehiculo } from "../../bd/vehiculosBD";
import { VehicleModal } from "../Users/components/Modal/Modal";
import { validateField, validateVehicleForm } from "../../pages/RegistrarVehiculo/utils/validations";

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<{
        tipo?: string;
        placa?: string;
        marca?: string;
        modelo?: string;
        color?: string;
        fotoDelantera?: string;
        fotoTrasera?: string;
    }>({});

    const delanteraRef = useRef<HTMLInputElement>(null);
    const traseraRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>,
        fieldName: string
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64WithoutPrefix = base64String.split(",")[1] || "";
                setPreview(base64WithoutPrefix);
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    [fieldName]: "",
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setFieldErrors(prevErrors => ({
                ...prevErrors,
                [fieldName]: "Se requiere una imagen.",
            }));
        }
    };

    const handleSave = async () => {
        const currentFieldErrors = validateVehicleForm(formData, delanteraPreview, traseraPreview);
        setFieldErrors(currentFieldErrors);

        const hasErrors = Object.values(currentFieldErrors).some(error => error !== "");

        if (hasErrors) {
            setErrorMessage("Por favor, corrija los errores en el formulario antes de guardar.");
            return;
        }

        if (delanteraPreview === null || traseraPreview === null) {
            setErrorMessage("Las imágenes delantera y trasera son requeridas.");
            return;
        }

        const data = {
            ...formData,
            fotoDelantera: delanteraPreview as string,
            fotoTrasera: traseraPreview as string,
        };

        try {
            await guardarVehiculo(data);
            console.log("Vehículo guardado exitosamente en VehiculosDB");
            navigate("/registrar/usuario");
        } catch (error) {
            const errorStr = String(error);
            setErrorMessage(errorStr);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const error = validateField(name, value);
        setFieldErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    return (
        <section className="registrarVehiculo">
            <h2 className="registrarVehiculo__title">REGISTRAR VEHICULO</h2>

            <form className="registrarVehiculo__form">
                <div className="registrarVehiculo__form-left">
                    <fieldset>
                        <div className="registrarVehiculo__input-group">
                            <label>Tipo Vehículo:</label>
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                                <option value="">Seleccione</option>
                                <option value="Auto">Automóvil</option>
                                <option value="Moto">Motocicleta</option>
                            </select>
                            {fieldErrors.tipo && <p className="vehicle__error-message">{fieldErrors.tipo}</p>}
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Placa:</label>
                            <input type="text" name="placa" value={formData.placa} onChange={handleInputChange} maxLength={10} required />
                            {fieldErrors.placa && <p className="vehicle__error-message">{fieldErrors.placa}</p>}
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Marca:</label>
                            <input type="text" name="marca" value={formData.marca} onChange={handleInputChange} required />
                            {fieldErrors.marca && <p className="vehicle__error-message">{fieldErrors.marca}</p>}
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Modelo:</label>
                            <input type="text" name="modelo" value={formData.modelo} onChange={handleInputChange} required />
                            {fieldErrors.modelo && <p className="vehicle__error-message">{fieldErrors.modelo}</p>}
                        </div>
                        <div className="registrarVehiculo__input-group">
                            <label>Color:</label>
                            <input type="text" name="color" value={formData.color} onChange={handleInputChange} required />
                            {fieldErrors.color && <p className="vehicle__error-message">{fieldErrors.color}</p>}
                        </div>
                    </fieldset>
                </div>

                <div className="registrarVehiculo__form-right">
                    <div className="registrarVehiculo__input-group">
                        <label>Foto vehículo delantera:</label>
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
                                onChange={(e) => handleImageChange(e, setDelanteraPreview, "fotoDelantera")}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                            {fieldErrors.fotoDelantera && <p className="vehicle__error-message">{fieldErrors.fotoDelantera}</p>}
                        </div>
                    </div>

                    <div className="registrarVehiculo__input-group">
                        <label>Foto vehículo trasera:</label>
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
                                onChange={(e) => handleImageChange(e, setTraseraPreview, "fotoTrasera")}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                            {fieldErrors.fotoTrasera && <p className="vehicle__error-message">{fieldErrors.fotoTrasera}</p>}
                        </div>
                    </div>
                </div>
            </form>

            <div className="registrarVehiculo__actions">
                <button type="button" className="registrarVehiculo__cancel-button" onClick={() => navigate("/registrar/usuario")}>CANCELAR</button>
                <button type="button" className="registrarVehiculo__submit-button" onClick={handleSave}>GUARDAR</button>
            </div>

            {errorMessage && (
                <VehicleModal message={errorMessage} onClose={() => setErrorMessage(null)} />
            )}
        </section>
    );
};

export default RegistrarVehiculo;