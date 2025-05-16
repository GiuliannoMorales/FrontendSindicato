import { useState } from "react";
import "./User.css"
import Layout from "../../components/Layout";

const User = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <Layout>
            <h2 className="form-title">REGISTRAR USUARIO</h2>

            <form className="form-two-columns">
                <div className="form-left">
                    <legend>• Datos Personales:</legend>
                    <fieldset>
                        <div className="input-group">
                            <label>Nombre(s): <span className="required">*</span></label>
                            <input type="text" required />
                        </div>

                        <div className="input-group">
                            <label>Apellido(s): <span className="required">*</span></label>
                            <input type="text" required />
                        </div>

                        <div className="input-group">
                            <label>Teléfono: <span className="required">*</span></label>
                            <input type="tel" required />
                        </div>

                        <div className="input-group">
                            <label>Correo Electrónico: <span className="required">*</span></label>
                            <input type="email" required />
                        </div>
                    </fieldset>

                    <legend>• Datos Cuenta:</legend>
                    <fieldset>
                        <div className="input-group">
                            <label>Tipo Usuario: <span className="required">*</span></label>
                            <select required>
                                <option value="">Seleccione</option>
                                <option value="admin">Administrativo</option>
                                <option value="user">Usuario</option>
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
                    <div className="input-group">
                        <label>Foto Usuario: <span className="required">*</span></label>
                        <div className="upload-box">
                            <button type="button">Subir Foto</button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Vehículo(s): <span className="required">*</span></label>
                        <button type="button" className="add-vehicle">+ Añadir vehículo</button>
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