import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  filtrarTarifas,
  type FiltroTarifas,
} from "../../services/tarifas.service";
import type { Tarifa } from "../../models/TarifasModel";
import "./FilterTarifas.css";
import TarifasTable from "../TarifasTable/TarifasTable";
import { getCurrentDate } from "../../../../utils/formatDate";

interface FilterTarifasProps {
  initialData: Tarifa[];
}

// Interfaz para el formulario, ajustada a los nombres del servicio
interface FiltrosForm {
  tipoVehiculo: string;
  tipoCliente: string;
  montoMin: string;
  montoMax: string;
  fechaInicio: string;
  fechaFin: string;
  modificadoPor: string;
}

const FilterTarifas = ({ initialData }: FilterTarifasProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors },
    control,
  } = useForm<FiltrosForm>({
    defaultValues: {
      tipoVehiculo: "",
      tipoCliente: "",
      montoMin: "",
      montoMax: "",
      fechaInicio: "",
      fechaFin: "",
      modificadoPor: "",
    },
  });

  const [filteredData, setFilteredData] = useState<Tarifa[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const montoMin = watch("montoMin");
  const montoMax = watch("montoMax");
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  // Obtener valores únicos de los datos iniciales
  const vehiculosUnicos = Array.from(
    new Set(initialData.map((item) => item.tipoVehiculo))
  ).filter(Boolean);

  const usuariosUnicos = Array.from(
    new Set(initialData.map((item) => item.tipoCliente))
  ).filter(Boolean);

  const modificadoresUnicos = Array.from(
    new Set(initialData.map((item) => item.nombreCompleto))
  ).filter(Boolean);

  const onSubmit = async (formData: FiltrosForm) => {
    if (
      formData.montoMin &&
      formData.montoMax &&
      parseFloat(formData.montoMax) < parseFloat(formData.montoMin)
    ) {
      return;
    }

    setIsLoading(true);
    setErrorApi(null);

    try {
      const filtros: FiltroTarifas = {
        tipoVehiculo: formData.tipoVehiculo || undefined,
        tipoCliente: formData.tipoCliente || undefined,
        montoMin: formData.montoMin ? parseFloat(formData.montoMin) : undefined,
        montoMax: formData.montoMax ? parseFloat(formData.montoMax) : undefined,
        fechaInicio: formData.fechaInicio
          ? `${formData.fechaInicio}T00:00:00`
          : undefined,
        fechaFin: formData.fechaFin
          ? `${formData.fechaFin}T23:59:59`
          : undefined,
        modificadoPor: formData.modificadoPor || undefined,
      };

      const response = await filtrarTarifas(filtros);

      if (response.data) {
        setFilteredData(response.data);
      }
    } catch (err) {
      console.error("Error filtering data:", err);
      setErrorApi(
        "Error al aplicar los filtros. Por favor intente nuevamente."
      );
      setFilteredData(initialData);
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarFiltros = () => {
    reset();
    setFilteredData(initialData);
    setErrorApi(null);
  };

  useEffect(() => {
    // Validación de montos
    if (montoMin && montoMax && parseFloat(montoMax) < parseFloat(montoMin)) {
      setFormError("montoMax", {
        type: "manual",
        message: "El monto máximo no puede ser menor al mínimo",
      });
    } else {
      clearErrors("montoMax");
    }

    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      setFormError("fechaFin", {
        type: "manual",
        message: "La fecha final no puede ser anterior a la inicial",
      });
    } else {
      clearErrors("fechaFin");
    }
  }, [montoMin, montoMax, fechaInicio, fechaFin, setFormError, clearErrors]);

  return (
    <div className="filtros-tarifas-container">
      <form onSubmit={handleSubmit(onSubmit)} className="filtros-tarifas">
        <h4 className="filtros-tarifas__titulo">Filtrar por:</h4>

        <div className="filtros-tarifas__grupo">
          <select
            {...register("tipoVehiculo")}
            className="filtros-tarifas__select"
          >
            <option value="">Tipo de Vehículo</option>
            {vehiculosUnicos.map((vehiculo, index) => (
              <option key={`vehiculo-${index}`} value={vehiculo}>
                {vehiculo}
              </option>
            ))}
          </select>

          <select
            {...register("tipoCliente")}
            className="filtros-tarifas__select"
          >
            <option value="">Tipo de Usuario</option>
            {usuariosUnicos.map((usuario, index) => (
              <option key={`usuario-${index}`} value={usuario}>
                {usuario}
              </option>
            ))}
          </select>

          <select
            {...register("modificadoPor")}
            className="filtros-tarifas__select"
          >
            <option value="">Modificado por</option>
            {modificadoresUnicos.map((modificador, index) => (
              <option key={`modificador-${index}`} value={modificador}>
                {modificador}
              </option>
            ))}
          </select>
        </div>

        <div className="filtros-tarifas__grupo">
          <label className="filtros-tarifas__label">Rango de Fechas:</label>
          <div className="filtros-tarifas__rango">
            <input
              type="date"
              {...register("fechaInicio", {
                validate: (value) => {
                  if (
                    fechaFin &&
                    value &&
                    new Date(fechaFin) < new Date(value)
                  ) {
                    return "La fecha inicial no puede ser posterior a la final";
                  }
                  return true;
                },
              })}
              className={`filtros-tarifas__input ${
                errors.fechaInicio ? "input-error" : ""
              }`}
              max={fechaFin || undefined || getCurrentDate()}
            />
            <span className="filtros-tarifas__separador">a</span>
            <input
              type="date"
              {...register("fechaFin", {
                validate: (value) => {
                  if (
                    fechaInicio &&
                    value &&
                    new Date(value) < new Date(fechaInicio)
                  ) {
                    return "La fecha final no puede ser anterior a la inicial";
                  }
                  return true;
                },
              })}
              className={`filtros-tarifas__input ${
                errors.fechaFin ? "input-error" : ""
              }`}
              min={fechaInicio || undefined}
              max={getCurrentDate()}
            />
          </div>

          <label className="filtros-tarifas__label">
            Rango de Tarifas (Bs):
          </label>
          <div className="filtros-tarifas__rango">
            <input
              type="number"
              {...register("montoMin", {
                min: {
                  value: 0,
                  message: "El monto mínimo no puede ser negativo",
                },
                valueAsNumber: true,
              })}
              placeholder="Mínimo"
              className={`filtros-tarifas__input ${
                errors.montoMax ? "input-error" : ""
              }`}
              step="0.01"
              min="0"
              onKeyDown={(e) => {
                // Previene la entrada de caracteres no numéricos
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <span className="filtros-tarifas__separador">a</span>
            <input
              type="number"
              {...register("montoMax", {
                min: {
                  value: 0,
                  message: "El monto máximo no puede ser negativo",
                },
                validate: (value) => {
                  if (
                    montoMin &&
                    value &&
                    parseFloat(value) < parseFloat(montoMin)
                  ) {
                    return "El monto máximo no puede ser menor al mínimo";
                  }
                  return true;
                },
                valueAsNumber: true,
              })}
              placeholder="Máximo"
              className={`filtros-tarifas__input ${
                errors.montoMax ? "input-error" : ""
              }`}
              step="0.01"
              min="0"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
        {(errors.fechaInicio || errors.fechaFin) && (
          <span className="errorFilter-message">
            {errors.fechaInicio?.message || errors.fechaFin?.message}
          </span>
        )}
        {(errors.montoMin || errors.montoMax) && (
          <span className="errorFilter-message">
            {errors.montoMin?.message || errors.montoMax?.message}
          </span>
        )}

        <div className="filtros-tarifas__boton-container">
          <button
            type="button"
            onClick={limpiarFiltros}
            className="filtros-tarifas__boton filtros-tarifas__boton--limpiar"
            disabled={isLoading}
          >
            Limpiar Filtros
          </button>
          <button
            type="submit"
            className="filtros-tarifas__boton"
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            {isLoading ? "Filtrando..." : "Filtrar"}
          </button>
        </div>
      </form>

      {errorApi && <div className="filtros-tarifas__error">{errorApi}</div>}

      <TarifasTable data={filteredData} fullView={true} />
    </div>
  );
};

export default FilterTarifas;
