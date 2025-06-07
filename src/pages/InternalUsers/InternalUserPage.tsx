import { useState } from "react";
import "./InternalUserPage.css"
import EyeIcon from "../../assets/icons/EyeIcon";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";

const InternalUser = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    return (
        <section className="internal-user">
            <h2 className="internal-user__title">REGISTRAR USUARIO INTERNO</h2>
            <form className="internal-user__form">
                <div className="internal-user__form-left">
                    <fieldset className="internal-user__fieldset">
                        <legend className="internal-user__legend">• Datos Personales:</legend>
                        <div className="internal-user__field">
                            <label className="internal-user__label">C.I.:
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Nombre(s):
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Apellido(s):
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Correo Electrónico:
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Teléfono:
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" required />
                        </div>
                    </fieldset>

                    <fieldset className="internal-user__fieldset">
                        <legend className="internal-user__legend">• Datos Cuenta:</legend>
                        <div className="internal-user__field">
                            <label className="internal-user__label">
                                Tipo Usuario: <span className="required">*</span>
                            </label>
                            <select
                                required
                                className="internal-user__select"
                            >
                                <option value="">Seleccione</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Cajero">Cajero</option>
                            </select>
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">
                                Contraseña: <span className="required">*</span>
                            </label>
                            <div className="internal-user__password">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    required
                                    placeholder="Ingrese su contraseña"
                                    className="internal-user__input"
                                />
                                <button
                                    type="button"
                                    className="internal-user__toggle-eye"
                                    onClick={togglePasswordVisibility}
                                    aria-label="Mostrar/Ocultar contraseña"
                                >
                                    {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="internal-user__form-right">

                </div>
            </form>

            <div className="internal-user__form-actions">
                <button
                    type="button"
                    className="internal-user__cancel-button"
                //onClick={handleCancelClick}
                >
                    CANCELAR
                </button>
                <button
                    type="submit"
                    className="internal-user__submit-button"
                // onClick={handleRegister}
                >
                    REGISTRAR
                </button>
            </div>
        </section>
    );
}

export default InternalUser;