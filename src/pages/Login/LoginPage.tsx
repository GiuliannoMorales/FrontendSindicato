import { type FieldError, useForm } from "react-hook-form";
import "./LoginPage.css";
import { useAppDispatch } from "../../app/hooks";
import { useEffect, useState } from "react";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";
import EyeIcon from "../../assets/icons/EyeIcon";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authThunks";
import LoginImage from "../../assets/images/Customer.png";
import Header from "../../components/Header";

type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>();
  const [errorMsgBack, setErrorMsgBack] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onTogglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await dispatch(login(data)).unwrap();
      reset();
      navigate("/");
    } catch (error: any) {
      console.error("LoginError", error);
      setErrorMsgBack(error.errors[0].details);
    } finally {
      setIsLoading(false);
    }
  };

  const username = watch("username");
  const password = watch("password");

  useEffect(() => {
    if (errorMsgBack) {
      setErrorMsgBack("");
    }
  }, [username, password]);

  return (
    <>
      <div
        className="top"
        style={{
          height: "16vh",
          display: "flex",
        }}
      >
        <Header onMenuClick={() => {}} sidebarOpen={false} />
      </div>
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
    </>
  );
};

export default LoginPage;
