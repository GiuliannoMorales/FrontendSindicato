import "../InternalUserPage.css"

const TextInput = ({ label, value, onChange, disabled = false, required = false }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
}) => (
    <div className="internal-user__field">
        <label className="internal-user__label">
            {label} {required && <span className="required">*</span>}
        </label>
        <input
            type="text"
            className="internal-user__input"
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
        />
    </div>
);
export default TextInput;
