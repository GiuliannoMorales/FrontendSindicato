import { useState, useRef } from "react";
import "./InternalUserPage.css"
import EyeIcon from "../../assets/icons/EyeIcon";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";

const InternalUser = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const userPhotoRef = useRef<HTMLInputElement | null>(null);

    const onUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64WithoutPrefix = base64String.split(",")[1] || "";
            handleUserPhotoChange(base64WithoutPrefix);
        };
        reader.readAsDataURL(file);
    };
    
    const handleUserPhotoClick = () => userPhotoRef.current?.click();
    const handleUserPhotoChange = (base64: string) => {
        const base64WithoutPrefix = base64.replace(
            /^data:image\/[a-zA-Z]+;base64,/,
            "",
        );
        setUserPhoto(base64WithoutPrefix);
    };

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
                    <div className="internal-user__photo">
                        <label className="internal-user__label">
                            Foto Usuario: <span className="required">*</span>
                        </label>
                        <div className="user__upload-box">
                            {userPhoto ? (
                                <img
                                    src={`data:image/jpeg;base64,${userPhoto}`}
                                    alt="Foto de usuario"
                                    onClick={handleUserPhotoClick}
                                    className="internal-user__photo-preview"
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleUserPhotoClick}
                                    className="internal-user__upload-button"
                                >
                                    Subir Foto
                                </button>
                            )}
                            <input
                                type="file"
                                ref={userPhotoRef}
                                onChange={onUserPhotoChange}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                        </div>
                    </div>

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