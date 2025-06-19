import "../InternalUserPage.css"
import EyeIcon from "../../../assets/icons/EyeIcon";
import EyeSlashIcon from "../../../assets/icons/EyeSlashIcon";

const PasswordInput = ({ value, onChange, visible, toggleVisible, disabled = false }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    visible: boolean;
    toggleVisible: () => void;
    disabled?: boolean;
}) => (
    <div className="internal-user__field">
        <label className="internal-user__label">Contraseña:</label>
        <div className="internal-user__password">
            <input
                type={visible ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                className="internal-user__input"
                value={value}
                onChange={onChange}
                disabled={disabled}
                required
            />
            <button
                type="button"
                className="internal-user__toggle-eye"
                onClick={toggleVisible}
                aria-label="Mostrar/Ocultar contraseña"
            >
                {visible ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
        </div>
    </div>
);
export default PasswordInput;
