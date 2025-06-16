import { useForm, type FieldError } from "react-hook-form";
import TarifasTable from "../components/TarifasTable/TarifasTable";
import "./TarifasConfigPage.css";
import toast, { Toaster } from "react-hot-toast";
import { createTarifa, getLastTarifas } from "../services/tarifas.service";
import { useEffect, useState } from "react";
import type { Tarifa } from "../models/TarifasModel";
import { NavLink, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const MONTO_MAX_TARIFA = 200;

const vehiclesTypes = ["Auto", "Moto"];

const clientsTypes = [
  "Administrativo",
  "Docente a dedicación exclusiva",
  "Docente a tiempo horario",
];

// const tarifasData = [
//   {
//     tipoCliente: "Administrat.",
//     tipoVehiculo: "Automóvil",
//     monto: "3,50",
//     fechaModificado: "14:50:14 - 04/05/2025",
//     modificadoPor: "Julieta",
//   },
//   {
//     tipoCliente: "Administrat.",
//     tipoVehiculo: "Motocicleta",
//     monto: "2,50",
//     fechaModificado: "11:21:54 - 02/05/2025",
//     modificadoPor: "Julieta",
//   },
//   {
//     tipoCliente: "Docente T. H.",
//     tipoVehiculo: "Motocicleta",
//     monto: "3,00",
//     fechaModificado: "08:24:19 - 24/04/2025",
//     modificadoPor: "Julieta",
//   },
//   {
//     tipoCliente: "Docente D. E.",
//     tipoVehiculo: "Automóvil",
//     monto: "3.00",
//     modificadoPor: "Julieta",
//     fechaModificado: "15:16:03 - 15/04/2025",
//   },
// ];

const TarifasPage = () => {
  const [tarifas, setTarifas] = useState<Array<Tarifa>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async (data: any) => {
    try {
      const nuevaTarifa = await createTarifa(axiosPrivate, {
        ...data,
        idAdministrador: "11111111-1111-1111-1111-111111111111",
      });

      setTarifas((prev) => [
        {
          tipoCliente: nuevaTarifa.tipoCliente,
          tipoVehiculo: nuevaTarifa.tipoVehiculo,
          monto: nuevaTarifa.monto,
          fechaInicio: nuevaTarifa.fechaInicio,
          nombreCompleto: nuevaTarifa.nombreCompleto,
        },
        ...prev,
      ]);

      reset();
      toast.success("Tarifa creada correctamente.");
    } catch (error) {
      console.error("Error al crear tarifa:", error);

      // Mostrar mensaje de error específico
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error desconocido al crear tarifa");
      }
    }
  };

  const handleCancel = () => {
    reset();
    navigate("/");
  };

  const fetchTarifas = async () => {
    try {
      const response = await getLastTarifas(axiosPrivate);
      setTarifas(response.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchTarifas();
  }, []);

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
                {...register("tipoCliente", { required: true })}
                className="tarifas__input"
              >
                {clientsTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
              {errors.tipoCliente && (
                <span className="error">Este campo es obligatorio</span>
              )}
            </div>
            <div className="tarifas__formRow">
              <label htmlFor="vehicles">
                Tipo Vehículo: <span style={{ color: "red" }}>*</span>
              </label>
              <select
                {...register("tipoVehiculo", { required: true })}
                className="tarifas__input"
              >
                {vehiclesTypes.map((vehicle, index) => (
                  <option value={vehicle} key={index}>
                    {vehicle}
                  </option>
                ))}
              </select>
              {errors.tipoVehiculo && (
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
                {...register("monto", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "La tarifa no puede ser negativa",
                  },
                  max: {
                    value: MONTO_MAX_TARIFA,
                    message: `La tarifa no puede ser mayor a ${MONTO_MAX_TARIFA} Bs`,
                  },
                  validate: (value) =>
                    value > 0 || "La tarifa debe ser mayor que cero",
                })}
                className="tarifas__input"
              />
            </div>
            {errors.monto && (
              <span className="error">
                {(errors.monto as FieldError).message}
              </span>
            )}
          </form>
        </div>
        <div className="tarifas__tableCol">
          <h3 className="tarifas__subtitle">Tarifas Registradas</h3>
          <TarifasTable data={tarifas} fullView={false} />
          <div>
            <NavLink
              to={"/tarifas/historial"}
              className="tarifas__button tarifas__button-link"
            >
              Ver historial completo
            </NavLink>
          </div>
        </div>
      </div>
      <div className="tarifas__buttonsContainer">
        <button className="btn-secondary" onClick={handleCancel}>
          CANCELAR
        </button>
        <button
          type="submit"
          className="btn-primary"
          onClick={handleSubmit(onSubmit)}
        >
          GUARDAR
        </button>
      </div>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#E7F6E6",
            },
          },
          error: {
            style: {
              background: "#FDB3BC",
            },
          },
        }}
      />
    </section>
  );
};

export default TarifasPage;
