import "./UserFormLeft.css";
import EyeIcon from "../../../../assets/icons/EyeIcon";
import EyeSlashIcon from "../../../../assets/icons/EyeSlashIcon";
import type { UserFormLeftProps } from "../../models/UserModel";

const UserFormLeft = ({
    ci,
    nombre,
    apellido,
    correo,
    nroCelular,
    onChange,
    userType,
    onUserTypeChange,
    passwordVisible,
    password,
    onPasswordChange,
    onTogglePasswordVisibility,
    errors
}: UserFormLeftProps) => {
    return (
        <>
            <legend className="user__legend">• Datos Personales:</legend>
            <fieldset className="user__fieldset">
                <div className="user__input-group user__input-group--ci">
                    <label className="user__label">CI: <span className="user__required">*</span></label>
                    <input
                        type="text"
                        value={ci}
                        onChange={(e) => onChange("ci", e.target.value)}
                        required
                        className="user__input"
                    />
                    {errors.ci && <p className="user__error-message">{errors.ci}</p>}
                </div>
                <div className="user__input-group user__input-group--name">
                    <label className="user__label">Nombre(s): <span className="user__required">*</span></label>
                    <input type="text" required className="user__input" value={nombre} onChange={(e) => onChange("nombre", e.target.value)} />
                    {errors.nombre && <p className="user__error-message">{errors.nombre}</p>}
                </div>
                <div className="user__input-group user__input-group--lastname">
                    <label className="user__label">Apellido(s): <span className="user__required">*</span></label>
                    <input type="text" required className="user__input" value={apellido} onChange={(e) => onChange("apellido", e.target.value)} />
                    {errors.apellido && <p className="user__error-message">{errors.apellido}</p>}
                </div>
                <div className="user__input-group user__input-group--email">
                    <label className="user__label">Correo Electrónico: <span className="user__required">*</span></label>
                    <input type="email" required className="user__input" value={correo} onChange={(e) => onChange("correo", e.target.value)} />
                    {errors.correo && <p className="user__error-message">{errors.correo}</p>}
                </div>
                <div className="user__input-group user__input-group--phone">
                    <label className="user__label">Teléfono: <span className="user__required">*</span></label>
                    <input type="tel" required className="user__input" value={nroCelular} onChange={(e) => onChange("nroCelular", e.target.value)} />
                    {errors.nroCelular && <p className="user__error-message">{errors.nroCelular}</p>}
                </div>
            </fieldset>

            <legend className="user__legend">• Datos Cuenta:</legend>
            <fieldset className="user__fieldset">
                <div className="user__input-group typeuser">
                    <label className="user__label">
                        Tipo Usuario: <span className="user__required">*</span>
                    </label>
                    <select
                        required
                        className="user__select"
                        value={userType}
                        onChange={(e) => onUserTypeChange(e.target.value)}
                    >
                        <option value="">Seleccione</option>
                        <option value="Administrativo">Administrativo</option>
                        <option value="Docente a dedicación exclusiva">Docente a dedicación exclusiva</option>
                        <option value="Docente a tiempo horario">Docente a tiempo horario</option>
                    </select>
                    {errors.tipo && <p className="user__error-message">{errors.tipo}</p>}
                </div>
                <div className="user__input-group user__input-group--password">
                    <label className="user__label">
                        Contraseña: <span className="user__required">*</span>
                    </label>
                    <div className="user__password-wrapper">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            required
                            placeholder="Ingrese su contraseña"
                            className="user__input"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                        />
                        <button
                            type="button"
                            className="user__toggle-eye"
                            onClick={onTogglePasswordVisibility}
                            aria-label="Mostrar/Ocultar contraseña"
                        >
                            {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                    {errors.password && <p className="user__error-message">{errors.password}</p>}
                </div>
            </fieldset>
        </>
    );
};

export default UserFormLeft;
