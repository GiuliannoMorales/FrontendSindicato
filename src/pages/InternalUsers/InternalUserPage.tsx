import { useState, useRef, useEffect } from "react";
import "./InternalUserPage.css"
import EyeIcon from "../../assets/icons/EyeIcon";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const InternalUser = () => {
    const [ci, setCi] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");
    const [observations, setObservations] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const userPhotoRef = useRef<HTMLInputElement | null>(null);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const axiosPrivate = useAxiosPrivate();
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (ci.trim().length < 7) return;

            try {

                const response = await axiosPrivate.get(`/usuario/check-ci/${ci}`);
                console.log("Respuesta API:", response);

                const data = response.data;

                if (data.status === "success" && data.data?.exists === false) {
                    setNombre("");
                    setApellido("");
                    setCorreo("");
                    setTelefono("");
                    setUserType("");
                    setObservations("");
                    setUserPhoto(null);
                    setIsEditMode(false);
                } else if (data.status === "success" && data.data) {
                    const user = data.data;

                    setNombre(user.nombre);
                    setApellido(user.apellido);
                    setCorreo(user.correo);
                    setTelefono(user.telefono);
                    setUserPhoto(user.foto);
                    setPassword("")
                    setIsEditMode(true);
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                const formData = {
                    usuario: {
                        ci,
                    },
                    rol: userType.toUpperCase(),
                };

                console.log("Datos a enviar (usuario existente):", formData);
                await axiosPrivate.post("/admin/registrar", formData);
            } else {

                const formData = {
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

                console.log("Datos a enviar (nuevo usuario):", formData);
                await axiosPrivate.post("/admin/registrar", formData);
            }

            alert("Usuario registrado correctamente.");

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Hubo un error al registrar el usuario.");
        }
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
                            <input type="text" className="internal-user__input" value={ci} onChange={(e) => setCi(e.target.value)} disabled={isEditMode} required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Nombre(s):
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={isEditMode} required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Apellido(s):
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" value={apellido} onChange={(e) => setApellido(e.target.value)} disabled={isEditMode} required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Correo Electrónico:
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" value={correo} onChange={(e) => setCorreo(e.target.value)} disabled={isEditMode} required />
                        </div>

                        <div className="internal-user__field">
                            <label className="internal-user__label">Teléfono:
                                <span className="required">*</span>
                            </label>
                            <input type="text" className="internal-user__input" value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={isEditMode} required />
                        </div>
                    </fieldset>

                    <fieldset className="internal-user__fieldset">
                        <legend className="internal-user__legend">• Datos Cuenta:</legend>
                        <div className="internal-user__field">
                            <label className="internal-user__label">
                                Tipo Usuario: <span className="required">*</span>
                            </label>
                            <select
                                className="internal-user__select" value={userType} onChange={(e) => setUserType(e.target.value)} required
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
                                    placeholder="Ingrese su contraseña"
                                    className="internal-user__input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isEditMode}
                                    required
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
                                disabled={isEditMode}
                                required
                            />
                        </div>
                    </div>

                    <div className="internal-user__field">
                        <label className="internal-user__label">Observaciones:
                            <span className="required">*</span>
                        </label>
                        <textarea className="internal-user__textarea" value={observations} onChange={(e) => setObservations(e.target.value)} required></textarea>
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
                    onClick={handleRegister}
                >
                    REGISTRAR
                </button>
            </div>
        </section>
    );
}

export default InternalUser;