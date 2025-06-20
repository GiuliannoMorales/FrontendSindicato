import { useEffect, useRef, useState } from "react";
import "./User.css";
import {
  clearVehiculos,
  deleteVehiculoById,
  getAllVehiculos,
} from "./services/vehiculosService";
import UserFormLeft from "./components/UserFormLeft/UserFormLeft";
import UserFormRight from "./components/UserFormRight/UserFormRight";
import { useNavigate } from "react-router-dom";
import {
  CancelModal,
  ErrorModal,
  GeneralErrorModal,
  SuccessModal,
} from "./components/Modal/Modal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { validateFormData } from "./utils/validations";

const User = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [userType, setUserType] = useState("");
  const [assignedSpace, setAssignedSpace] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showGeneralErrorModal, setShowGeneralErrorModal] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const userPhotoRef = useRef<HTMLInputElement | null>(null);
  const vehicleEditRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  const clearFieldError = (field: string) => {
  setFormErrors((prev) => ({ ...prev, [field]: "" }));
};

  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    correo: "",
    nroCelular: "",
    tipo: "",
    password: "",
  });
  // Restaura datos guardados al montar el componente
  useEffect(() => {
    const savedFormData = sessionStorage.getItem("formData");
    const savedUserPhoto = sessionStorage.getItem("userPhoto");
    const savedUserType = sessionStorage.getItem("userType");
    const savedAssignedSpace = sessionStorage.getItem("assignedSpace");

    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedUserPhoto) setUserPhoto(savedUserPhoto || null);
    if (savedUserType) setUserType(savedUserType);
    if (savedAssignedSpace) setAssignedSpace(savedAssignedSpace || null);
  }, []);

  // Guardar datos al cambiar el estado del formulario
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    sessionStorage.setItem("formData", JSON.stringify(formData));
    sessionStorage.setItem("userPhoto", userPhoto || "");
    sessionStorage.setItem("userType", userType);
    sessionStorage.setItem("assignedSpace", assignedSpace || "");
  }, [formData, userPhoto, userType, assignedSpace]);

  const handleAssignedSpaceChange = (space: string | null) => {
    setAssignedSpace(space);
  };

  useEffect(() => {
    const limpiarVehiculos = async () => {
      if (!sessionStorage.getItem("vehiculosDBIniciada")) {
        await clearVehiculos();
        sessionStorage.setItem("vehiculosDBIniciada", "true");
      }
    };
    limpiarVehiculos();
  }, []);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const resultados = await getAllVehiculos();
        setVehiculos(resultados);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearVehiculos();
      sessionStorage.removeItem("vehiculosDBIniciada");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const resetForm = async () => {
    setFormData({
      ci: "",
      nombre: "",
      apellido: "",
      correo: "",
      nroCelular: "",
      tipo: "",
      password: "",
    });
    setUserPhoto(null);
    setUserType("");
    setVehiculos([]);
    setAssignedSpace(null);
    setFormErrors({});

    try {
      await clearVehiculos();
    } catch (error) {
      console.error("Error al limpiar vehículos:", error);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await deleteVehiculoById(id);
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    const updatedForm = { ...formData, [field]: value };

    setFormData(updatedForm);

    const updatedErrors = validateFormData({
      ...updatedForm,
      tipo: userType,
      userPhoto,
      assignedSpace,
      vehiculos,
    });

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: updatedErrors[field] || "",
    }));
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const handleUserPhotoClick = () => userPhotoRef.current?.click();

  const handleUserPhotoChange = (base64: string) => {
    const base64WithoutPrefix = base64.replace(
      /^data:image\/[a-zA-Z]+;base64,/,
      ""
    );
    setUserPhoto(base64WithoutPrefix);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setShowCancelModal(false);
    await resetForm();
    navigate("/");
  };

  const closeModal = () => {
    setShowCancelModal(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateFormData({
      ...formData,
      tipo: userType,
      userPhoto,
      assignedSpace,
      vehiculos
    });

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setGeneralError("Por favor, corrija los errores del formulario.");
      setShowGeneralErrorModal(true);
      return;
    }
    const vehiculosSinId = vehiculos.map(({ id, ...rest }) => rest);
    const newUser = {
      cliente: {
        ...formData,
        tipo: userType,
        foto: userPhoto,
      },
      vehiculos: vehiculosSinId,
      parqueo:
        userType === "Docente a tiempo horario"
          ? null
          : assignedSpace
            ? { nroEspacio: Number(assignedSpace) }
            : null,
    };
    console.log("Datos que se enviarán al backend:", newUser);
    try {
      const response = await axiosPrivate.post("/clientes/registrar", newUser);
      console.log("Usuario registrado:", response.data);
      await clearVehiculos();
      await resetForm();
      setShowSuccessModal(true);
    } catch (error: any) {
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);

        if (error.response.data.errors) {
          const errors: { [key: string]: string } = {};
          error.response.data.errors.forEach((err: any) => {
            const field = err.field
              ? err.field.replace("cliente.", "")
              : "unknown";
            errors[field] = err.message || "Error desconocido";
            if (!err.field) {
              setGeneralError(err.message || "Error desconocido");
              setShowGeneralErrorModal(true);
            }
            console.error(`Campo: ${err.field}, Mensaje: ${err.message}`);
          });
          setFormErrors(errors);
        } else {
          setShowErrorModal(true);
        }
      } else {
        console.error("Error:", error.message);
        setShowErrorModal(true);
      }
    }
  };

const handleUserTypeChange = (newType: string) => {
  setUserType(newType);

  setFormErrors((prevErrors) => {
    if (!newType) return prevErrors;
    const { tipo, ...others } = prevErrors;
    return others;
  });
};

  return (
    <section className="user">
      <h2 className="user__title">REGISTRAR USUARIO</h2>
      <form className="user__form">
        <div className="user__form-left">
          <UserFormLeft
            ci={formData.ci}
            nombre={formData.nombre}
            apellido={formData.apellido}
            correo={formData.correo}
            nroCelular={formData.nroCelular}
            onChange={handleFormChange}
            userType={userType}
            onUserTypeChange={handleUserTypeChange}
            passwordVisible={passwordVisible}
            password={formData.password}
            onPasswordChange={(value) => handleFormChange("password", value)}
            onTogglePasswordVisibility={togglePasswordVisibility}
            errors={formErrors}
          />
        </div>

        <div className="user__form-right">
          <UserFormRight
            userPhotoPreview={userPhoto}
            userPhotoRef={userPhotoRef}
            handleUserPhotoClick={handleUserPhotoClick}
            handleUserPhotoChange={handleUserPhotoChange}
            vehiculos={vehiculos}
            vehicleEditRef={vehicleEditRef}
            handleDeleteVehicle={handleDeleteVehicle}
            userType={userType}
            assignedSpace={assignedSpace}
            onAssignedSpaceChange={handleAssignedSpaceChange}
            errors={formErrors}
            clearFieldError={clearFieldError}
          />
        </div>
      </form>

      <div className="user__form-actions">
        <button
          type="button"
          className="user__cancel-button"
          onClick={handleCancelClick}
        >
          CANCELAR
        </button>
        <button
          type="submit"
          className="user__submit-button"
          onClick={handleRegister}
        >
          REGISTRAR
        </button>
      </div>

      {showCancelModal && (
        <CancelModal onClose={closeModal} onConfirm={confirmCancel} />
      )}

      {showErrorModal && (
        <ErrorModal onClose={() => setShowErrorModal(false)} />
      )}

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      {showGeneralErrorModal && generalError && (
        <GeneralErrorModal
          message={generalError}
          onClose={() => setShowGeneralErrorModal(false)}
        />
      )}
    </section>
  );
};

export default User;
