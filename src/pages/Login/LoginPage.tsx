import { useForm, type FieldError } from "react-hook-form";
import "./LoginPage.css";
import { useAppDispatch } from "../../app/hooks";
import { useState } from "react";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";
import EyeIcon from "../../assets/icons/EyeIcon";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authThunks";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [errorMsgBack, setErrorMsgBack] = useState('')
  const navigate = useNavigate();

  const onTogglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = (data: any) => {
    try {
      console.log("login", data);
      dispatch(login(data));
      reset();
      navigate("/");
    } catch (error: any) {
      console.error("LoginError", error);
      setErrorMsgBack(error.data.errors[0].message)
    }
  };
  return (
    <div className="login__container">
      <form onSubmit={handleSubmit(onSubmit)} className="login__form">
        <h1 className="login__title">Iniciar Sesión</h1>
        <input
          {...register("username", {
            required: "Ingresa tu nombre de usuario",
          })}
          placeholder="Username"
          type="text"
        />
        {errors.username && (
          <span className="login__error">
            {(errors.username as FieldError).message}
          </span>
        )}
        <div className="password-input-container">
          <input
            {...register("password", { required: "Ingresa tu contraseña" })}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={onTogglePasswordVisibility}
            aria-label="Mostrar/Ocultar contraseña"
          >
            {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <span className="login__error">
            {(errors.password as FieldError).message}
          </span>
        )}
        {errorMsgBack && (
          <div className="login__error">{errorMsgBack}</div>
        )}
        <button type="submit" className="login__button">
          Iniciar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
