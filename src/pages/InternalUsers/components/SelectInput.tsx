import "../InternalUserPage.css"

const SelectInput = ({ label, value, onChange, options, required = false }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
}) => (
    <div className="internal-user__field">
        <label className="internal-user__label">
            {label} {required && <span className="required">*</span>}
        </label>
        <select className="internal-user__select" value={value} onChange={onChange} required={required}>
            <option value="">Seleccione</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);
export default SelectInput;
