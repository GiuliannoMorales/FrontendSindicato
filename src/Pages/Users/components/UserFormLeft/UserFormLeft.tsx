import "./UserFormLeft.css";

interface UserFormLeftProps {
    ci: string;
    onChange: (field: string, value: string) => void;
    userType: string;
    onUserTypeChange: (value: string) => void;
    passwordVisible: boolean;
    password: string;
    onPasswordChange: (value: string) => void;
    onTogglePasswordVisibility: () => void;
}

const UserFormLeft = ({
    ci,
    onChange,
    userType,
    onUserTypeChange,
    passwordVisible,
    password,
    onPasswordChange,
    onTogglePasswordVisibility
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
                    {!/^\d+$/.test(ci) && ci !== "" && (
                        <p className="user__error-message">Formato inválido.</p>
                    )}
                </div>
                <div className="user__input-group">
                    <label className="user__label">Nombre(s): <span className="user__required">*</span></label>
                    <input type="text" required className="user__input" onChange={(e) => onChange("nombre", e.target.value)} />
                </div>
                <div className="user__input-group">
                    <label className="user__label">Apellido(s): <span className="user__required">*</span></label>
                    <input type="text" required className="user__input" onChange={(e) => onChange("apellido", e.target.value)} />
                </div>
                <div className="user__input-group">
                    <label className="user__label">Correo Electrónico: <span className="user__required">*</span></label>
                    <input type="email" required className="user__input" onChange={(e) => onChange("correo", e.target.value)} />
                </div>
                <div className="user__input-group">
                    <label className="user__label">Teléfono: <span className="user__required">*</span></label>
                    <input type="tel" required className="user__input" onChange={(e) => onChange("nroCelular", e.target.value)} />
                </div>
            </fieldset>

            <legend className="user__legend">• Datos Cuenta:</legend>
            <fieldset className="user__fieldset">
                <div className="user__input-group">
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
                </div>
                <div className="user__input-group">
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
                            <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                    </div>
                </div>
            </fieldset>
        </>
    );
};

export default UserFormLeft;
