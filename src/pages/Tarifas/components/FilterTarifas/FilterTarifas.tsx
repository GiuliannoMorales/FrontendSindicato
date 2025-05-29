import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  filtrarTarifas,
  type FiltroTarifas,
} from "../../services/tarifas.service";
import type { Tarifa } from "../../models/TarifasModel";
import "./FilterTarifas.css";
import TarifasTable from "../TarifasTable/TarifasTable";

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
  const { register, handleSubmit, reset } = useForm<FiltrosForm>({
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
  const [error, setError] = useState<string | null>(null);

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
    setIsLoading(true);
    setError(null);

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
      setError("Error al aplicar los filtros. Por favor intente nuevamente.");
      setFilteredData(initialData);
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarFiltros = () => {
    reset();
    setFilteredData(initialData);
    setError(null);
  };

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
              {...register("fechaInicio")}
              className="filtros-tarifas__input"
            />
            <span className="filtros-tarifas__separador">a</span>
            <input
              type="date"
              {...register("fechaFin")}
              className="filtros-tarifas__input"
            />
          </div>

          <label className="filtros-tarifas__label">
            Rango de Tarifas (Bs):
          </label>
          <div className="filtros-tarifas__rango">
            <input
              type="number"
              {...register("montoMin")}
              placeholder="Mínimo"
              className="filtros-tarifas__input"
              step="0.01"
              min="0"
            />
            <span className="filtros-tarifas__separador">a</span>
            <input
              type="number"
              {...register("montoMax")}
              placeholder="Máximo"
              className="filtros-tarifas__input"
              step="0.01"
              min="0"
            />
          </div>
        </div>

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
            disabled={isLoading}
          >
            {isLoading ? "Filtrando..." : "Filtrar"}
          </button>
        </div>
      </form>

      {error && <div className="filtros-tarifas__error">{error}</div>}

      <TarifasTable data={filteredData} fullView={true} />
    </div>
  );
};

export default FilterTarifas;
