import { useForm } from "react-hook-form";
import "./LoginPage.css";
import { useAppDispatch } from "../../app/hooks";
import { useState } from "react";
import EyeSlashIcon from "../../assets/icons/EyeSlashIcon";
import EyeIcon from "../../assets/icons/EyeIcon";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit } = useForm();

  const onTogglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = (data: any) => {
    // dispatch(login(data));
    console.log("login", data);
  };
  return (
    <div className="login__container">
      <form onSubmit={handleSubmit(onSubmit)} className="login__form">
        <h1 className="login__title">Iniciar Sesión</h1>
        <input {...register("correo")} placeholder="Correo" type="email" />
        <div className="password-input-container">
          <input
            {...register("password")}
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
        <button type="submit" className="login__button">
          Iniciar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
