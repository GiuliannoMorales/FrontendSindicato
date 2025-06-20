import { useState, useRef, useEffect } from "react";
import "./InternalUserPage.css"
import TextInput from "./components/TextInput";
import SelectInput from "./components/SelectInput";
import PasswordInput from "./components/PasswordInput";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useFormHandlers } from "./utils/useFormHandlers";
import { CancelModal, SuccessModal, ErrorModal, GeneralErrorModal } from "../Users/components/Modal/Modal";
import { validateFormData } from "./utils/validators";

const InternalUser = () => {
    const [ci, setCi] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");
    //const [observations, setObservations] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const userPhotoRef = useRef<HTMLInputElement | null>(null);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const axiosPrivate = useAxiosPrivate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showGeneralErrorModal, setShowGeneralErrorModal] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [showUserFoundModal, setShowUserFoundModal] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const { handleInputChange, handlePhotoChange } = useFormHandlers(
        isEditMode,
        setCi,
        setNombre,
        setApellido,
        setCorreo,
        setTelefono,
        setPassword,
        setErrors,
        setPhotoError
    );

    const clearFields = () => {
        setCi("");
        setNombre("");
        setApellido("");
        setCorreo("");
        setTelefono("");
        setUserType("");
        setPassword("");
        setUserPhoto(null);
        setIsEditMode(false);
        setErrors({});
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        clearFields();
        setShowCancelModal(false);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (ci.trim().length < 7) return;

            try {

                const response = await axiosPrivate.get(`/usuario/check-ci/${ci}`);
                console.log("Respuesta API:", response);

                const data = response.data;

                if (data.status === "success" && data.data?.exists === false) {
                    setIsEditMode(false);
                    setShowUserFoundModal(false);
                } else if (data.status === "success" && data.data) {
                    const user = data.data;

                    setNombre(user.nombre);
                    setApellido(user.apellido);
                    setCorreo(user.correo);
                    setTelefono(user.telefono);
                    setUserPhoto(user.foto);
                    setPassword("")
                    setIsEditMode(true);
                    setShowUserFoundModal(true);
                }
            } catch (error) {
                console.error("Error al buscar CI:", error);
                setNombre("");
                setApellido("");
                setCorreo("");
                setTelefono("");
                setUserPhoto(null);
            }
        };

        fetchUserData();
    }, [ci]);

    const onUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handlePhotoChange(file, handleUserPhotoChange);
    };

    const handleUserPhotoClick = () => userPhotoRef.current?.click();
    const handleUserPhotoChange = (base64: string) => {
        const base64WithoutPrefix = base64.replace(
            /^data:image\/[a-zA-Z]+;base64,/,
            "",
        );
        setUserPhoto(base64WithoutPrefix);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            ci,
            nombre,
            apellido,
            correo,
            telefono,
            password,
            userType,
            userPhoto,
            isEditMode,
        };

        const validationErrors = validateFormData(formData);
        setErrors(validationErrors);
        setPhotoError(validationErrors.userPhoto || null);

        if (Object.keys(validationErrors).length > 0) {
            setGeneralError("Por favor, corrija los errores del formulario.");
            setShowGeneralErrorModal(true);
            return;
        }

        try {
            const formData = isEditMode
                ? {
                    usuario: { ci },
                    rol: userType.toUpperCase(),
                }
                : {
                    usuario: {
                        ci,
                        nombre,
                        apellido,
                        correo,
                        nroCelular: telefono,
                        password,
                        foto: userPhoto,
                    },
                    rol: userType.toUpperCase(),
                };

            await axiosPrivate.post("/admin/registrar", formData);
            setShowSuccessModal(true);
            clearFields();

        } catch (error: any) {
            console.error("Error al registrar usuario:", error);

            const responseData = error?.response?.data;

            let backendMessage =
                responseData?.message ||
                responseData?.error ||
                null;

            if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
                backendMessage = responseData.errors.map((e: any) => e.message).join("\n");
            }

            if (backendMessage) {
                setGeneralError(backendMessage);
                setShowGeneralErrorModal(true);
            } else {
                setShowErrorModal(true);
            }
        }
    };

    return (
        <section className="internal-user">
            <h2 className="internal-user__title">REGISTRAR USUARIO INTERNO</h2>
            <form className="internal-user__form">
                <div className="internal-user__form-left">
                    <fieldset className="internal-user__fieldset">
                        <legend className="internal-user__legend">• Datos Personales:</legend>
                        <TextInput label="C.I.:" value={ci} onChange={(e) => handleInputChange("ci", e.target.value)} disabled={isEditMode} required />
                        {errors.ci && <p className="error-message">{errors.ci}</p>}
                        <TextInput label="Nombre(s):" value={nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} disabled={isEditMode} required />
                        {errors.nombre && <p className="error-message">{errors.nombre}</p>}
                        <TextInput label="Apellido(s):" value={apellido} onChange={(e) => handleInputChange("apellido", e.target.value)} disabled={isEditMode} required />
                        {errors.apellido && <p className="error-message">{errors.apellido}</p>}
                        <TextInput label="Correo Electrónico:" value={correo} onChange={(e) => handleInputChange("correo", e.target.value)} disabled={isEditMode} required />
                        {errors.correo && <p className="error-message">{errors.correo}</p>}
                        <TextInput label="Teléfono:" value={telefono} onChange={(e) => handleInputChange("telefono", e.target.value)} disabled={isEditMode} required />
                        {errors.telefono && <p className="error-message">{errors.telefono}</p>}
                    </fieldset>

                    <fieldset className="internal-user__fieldset">
                        <legend className="internal-user__legend">• Datos Cuenta:</legend>
                        <SelectInput
                            label="Tipo Usuario:"
                            value={userType}
                            onChange={(e) => {const value = e.target.value;
                                setUserType(value);
                                if (value.trim()) {
                                    setErrors((prev) => ({ ...prev, userType: null }));
                                }
                            }}
                            options={["Administrador", "Cajero"]}
                            required
                        />
                        {errors.userType && <p className="error-message">{errors.userType}</p>}
                        <PasswordInput
                            value={password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            visible={passwordVisible}
                            toggleVisible={togglePasswordVisibility}
                            disabled={isEditMode}
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </fieldset>
                </div>

                <div className="internal-user__form-right">
                    <div className="internal-user__photo">
                        <label className="internal-user__label">Foto Usuario: <span className="required">*</span></label>
                        <div className="user__upload-box">
                            {userPhoto ? (
                                <img
                                    src={`data:image/jpeg;base64,${userPhoto}`}
                                    alt="Foto de usuario"
                                    onClick={handleUserPhotoClick}
                                    className="internal-user__photo-preview"
                                />
                            ) : (
                                <button type="button" onClick={handleUserPhotoClick} className="internal-user__upload-button">
                                    Subir Foto
                                </button>
                            )}
                            <input
                                type="file"
                                ref={userPhotoRef}
                                onChange={onUserPhotoChange}
                                style={{ display: "none" }}
                                accept="image/png, image/jpeg"
                                disabled={isEditMode}
                                required
                            />
                        </div>
                    </div>
                    {photoError && <p className="error-message">{photoError}</p>}
                    {/* <div className="internal-user__field">
                        <label className="internal-user__label">Observaciones: <span className="required">*</span></label>
                        <textarea
                            className="internal-user__textarea"
                            value={observations}
                            onChange={(e) => setObservations(e.target.value)}
                            required
                        ></textarea>
                    </div> */}
                </div>
                <div className="internal-user__form-actions">
                    <button type="button" className="internal-user__cancel-button" onClick={handleCancelClick}>CANCELAR</button>
                    <button type="submit" className="internal-user__submit-button" onClick={handleRegister} >REGISTRAR</button>
                </div>
            </form>

            {showCancelModal && (
                <CancelModal onClose={closeCancelModal} onConfirm={confirmCancel} />
            )}

            {showSuccessModal && (
                <SuccessModal onClose={() => setShowSuccessModal(false)} />
            )}

            {showErrorModal && (
                <ErrorModal onClose={() => setShowErrorModal(false)} />
            )}

            {showGeneralErrorModal && generalError && (
                <GeneralErrorModal
                    message={generalError}
                    onClose={() => setShowGeneralErrorModal(false)}
                />
            )}

            {showUserFoundModal && (
                <GeneralErrorModal
                    message="Usuario encontrado. Se añadirán permisos administrativos a su cuenta actual."
                    onClose={() => setShowUserFoundModal(false)}
                />
            )}
        </section>
    );
}

export default InternalUser;