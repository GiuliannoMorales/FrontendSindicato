import { useForm, type FieldError } from "react-hook-form";
import "./LoginPage.css";
import { useAppDispatch } from "../../app/hooks";
import { useState } from "react";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";
import EyeIcon from "../../assets/icons/EyeIcon";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authThunks";
import LoginImage from "../../assets/images/Customer.png";
import { selectCurrentToken } from "../../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [errorMsgBack, setErrorMsgBack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onTogglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = async (data: any) => {
    try {
      const resultAction = await dispatch(login(data)).unwrap();
      if (login.fulfilled.match(resultAction)) {
        reset();
        console.log('currentToken guardado', selectCurrentToken)
        navigate("/");
      } else {
        setErrorMsgBack("Credenciales inválidas");
      }
    } catch (error: any) {
      console.error("LoginError", error);
      setErrorMsgBack(error.data.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login__container">
      <form onSubmit={handleSubmit(onSubmit)} className="login__form">
        <h1 className="login__title">Iniciar Sesión</h1>
        <img src={LoginImage} alt="" width={124} />
        <div className="login__field">
          <input
            {...register("username", {
              required: "Ingresa tu nombre de usuario",
            })}
            placeholder="Username"
            type="text"
            className="login__input"
          />
        </div>
        {errors.username && (
          <span className="login__error">
            {(errors.username as FieldError).message}
          </span>
        )}
        <div className="login__field">
          <input
            {...register("password", { required: "Ingresa tu contraseña" })}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="login__input"
          />
          <i
            className="login__toggle-password"
            onClick={onTogglePasswordVisibility}
            aria-label="Mostrar/Ocultar contraseña"
          >
            {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </i>
        </div>

        {errors.password && (
          <span className="login__error">
            {(errors.password as FieldError).message}
          </span>
        )}
        {errorMsgBack && <div className="login__error">{errorMsgBack}</div>}
        <button type="submit" className="login__button" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
