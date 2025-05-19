import { useForm } from "react-hook-form";
import TarifasTable from "../components/TarifasTable/TarifasTable";
import "./TarifasConfigPage.css";
import toast, { Toaster } from "react-hot-toast";

const vehiclesTypes = ["Automovil", "Motocicleta"];

const clientsTypes = ["Administrativo", "Docente"];

const tarifasData = [
  {
    usuario: "Administrat.",
    vehiculo: "Automóvil",
    tarifa: "3,50",
    fechaModificado: "14:50:14 - 04/05/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Administrat.",
    vehiculo: "Motocicleta",
    tarifa: "2,50",
    fechaModificado: "11:21:54 - 02/05/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Docente T. H.",
    vehiculo: "Motocicleta",
    tarifa: "3,00",
    fechaModificado: "08:24:19 - 24/04/2025",
    modificadoPor: "Julieta",
  },
  {
    usuario: "Docente D. E.",
    vehiculo: "Automóvil",
    tarifa: "3.00",
    modificadoPor: "Julieta",
    fechaModificado: "15:16:03 - 15/04/2025",
  },
];

const TarifasPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Datos del formulario:", data);
    // Aquí puedes llamar a una API o actualizar el estado
    reset()
    toast.success('Successfully created!');
  };

  return (
    <section className="tarifas">
      <h2 className="tarifas__title">CONFIGURACIÓN DE TARIFAS</h2>
      <div className="tarifas__configContainer">
        <div className="tarifas__configCol">
          <h3 className="tarifas__subtitle">Modificar Tarifa</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="tarifas__form">
            <div className="tarifas__formRow">
              <label htmlFor="clients">
                Tipo Cliente: <span style={{ color: "red" }}>*</span>
              </label>
              <select
                {...register("clientType", { required: true })}
                className="tarifas__input"
              >
                {clientsTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
              {errors.clientType && (
                <span className="error">Este campo es obligatorio</span>
              )}
            </div>
            <div className="tarifas__formRow">
              <label htmlFor="vehicles">
                Tipo Vehículo: <span style={{ color: "red" }}>*</span>
              </label>
              <select
                {...register("vehicleType", { required: true })}
                className="tarifas__input"
              >
                {vehiclesTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
              {errors.vehicleType && (
                <span className="error">Este campo es obligatorio</span>
              )}
            </div>
            <div className="tarifas__formRow">
              <label htmlFor="newTarifa">
                Nueva Tarifa (Bs.): <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register("tarifa", { required: true, min: 0 })}
                className="tarifas__input"
              />
              {errors.tarifa && (
                <span className="error">Introduce una tarifa válida</span>
              )}
            </div>
          </form>
        </div>
        <div className="tarifas__tableCol">
          <h3 className="tarifas__subtitle">Tarifas Registradas</h3>
          {/* <table className="tarifas__table">
            <thead>
              <tr>
                <th className="borde-derecho">Usuario</th>
                <th className="borde-derecho">Vehículo</th>
                <th className="borde-derecho">Tarifa (Bs)</th>
                <th>Modificado en...</th>
              </tr>
            </thead>
            <tbody>
              {tarifasData.map((fila, index) => (
                <tr key={index}>
                  <td className="borde-derecho">{fila.usuario}</td>
                  <td className="borde-derecho">{fila.vehiculo}</td>
                  <td className="borde-derecho">{fila.tarifa}</td>
                  <td>{fila.modificado}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <TarifasTable data={tarifasData} fullView={false} />
          <div>
            <button className="tarifas__button">Ver historial completo</button>
          </div>
        </div>
      </div>
      <div className="tarifas__buttonsContainer">
        <button className="btn-secondary">CANCELAR</button>
        <button type="submit" className="btn-primary" onClick={handleSubmit(onSubmit)}>
          GUARDAR
        </button>
      </div>
      <Toaster/>
    </section>
  );
};

export default TarifasPage;
