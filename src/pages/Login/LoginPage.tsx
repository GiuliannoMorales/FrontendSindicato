import { useForm } from "react-hook-form";
import './LoginPage.css'

const LoginPage = () => {
  // const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // dispatch(login(data));
    console.log("login", data);
  };
  return (
    <div className="login__container">
      <form onSubmit={handleSubmit(onSubmit)} className="login__form">
        <h1 className="login__title">Iniciar Sesión</h1>
        <input {...register("username")} placeholder="Username" />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
        />
        <button type="submit" className="login__button">Iniciar</button>
      </form>
    </div>
  );
};

export default LoginPage;
