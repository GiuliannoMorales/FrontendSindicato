import React, { useState, useEffect } from "react";
import type { Tarifa } from "../TarifasHistoPage/TarifasModel";
import "./FilterTarifas.css";

interface FiltrosTarifasProps {
  data: Array<Tarifa>;
  onFilter: (filteredData: Array<Tarifa>) => void;
}

const FilterTarifas = ({ data, onFilter }: FiltrosTarifasProps) => {
  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    vehiculo: "",
    usuario: "",
    fechaDesde: "",
    fechaHasta: "",
    tarifaMin: "",
    tarifaMax: "",
    modificadoPor: "",
  });

  // Obtener valores únicos para los selects
  const vehiculosUnicos = Array.from(
    new Set(data.map((item) => item.vehiculo))
  );
  const usuariosUnicos = Array.from(new Set(data.map((item) => item.usuario)));
  const modificadoresUnicos = Array.from(
    new Set(data.map((item) => item.modificadoPor))
  );

  // Aplicar filtros
  useEffect(() => {
    const filteredData = data.filter((item) => {
      const fechaItem = new Date(
        item.fechaModificado.split(" - ")[1].split("/").reverse().join("-")
      );
      const fechaDesde = filtros.fechaDesde
        ? new Date(filtros.fechaDesde)
        : null;
      const fechaHasta = filtros.fechaHasta
        ? new Date(filtros.fechaHasta)
        : null;

      const tarifaNum = parseFloat(item.tarifa.replace(",", "."));
      const tarifaMin = filtros.tarifaMin
        ? parseFloat(filtros.tarifaMin)
        : null;
      const tarifaMax = filtros.tarifaMax
        ? parseFloat(filtros.tarifaMax)
        : null;

      return (
        (filtros.vehiculo === "" || item.vehiculo === filtros.vehiculo) &&
        (filtros.usuario === "" || item.usuario.includes(filtros.usuario)) &&
        (!fechaDesde || fechaItem >= fechaDesde) &&
        (!fechaHasta || fechaItem <= fechaHasta) &&
        (!tarifaMin || tarifaNum >= tarifaMin) &&
        (!tarifaMax || tarifaNum <= tarifaMax) &&
        (filtros.modificadoPor === "" ||
          item.modificadoPor.includes(filtros.modificadoPor))
      );
    });

    onFilter(filteredData);
  }, [filtros, data, onFilter]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      vehiculo: "",
      usuario: "",
      fechaDesde: "",
      fechaHasta: "",
      tarifaMin: "",
      tarifaMax: "",
      modificadoPor: "",
    });
  };

  return (
    <div className="filtros-tarifas">
      <h4 className="filtros-tarifas__titulo">Filtrar por:</h4>
      <div className="filtros-tarifas__grupo">
        <select
          name="vehiculo"
          value={filtros.vehiculo}
          onChange={handleChange}
          className="filtros-tarifas__select"
        >
          <option value="" defaultValue={""}>
            Tipo de Vehículo
          </option>
          {vehiculosUnicos.map((vehiculo, index) => (
            <option key={index} value={vehiculo}>
              {vehiculo}
            </option>
          ))}
        </select>
        <select
          name="usuario"
          value={filtros.usuario}
          onChange={handleChange}
          className="filtros-tarifas__select"
        >
          <option value="" defaultValue={""}>
            Tipo de Usuario
          </option>
          {usuariosUnicos.map((usuario, index) => (
            <option key={index} value={usuario}>
              {usuario}
            </option>
          ))}
        </select>
        <select
          name="modificadoPor"
          value={filtros.modificadoPor}
          onChange={handleChange}
          className="filtros-tarifas__select"
        >
          <option value="">Modificado por</option>
          {modificadoresUnicos.map((modificador, index) => (
            <option key={index} value={modificador}>
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
            name="fechaDesde"
            value={filtros.fechaDesde}
            onChange={handleChange}
            className="filtros-tarifas__input"
          />
          <span className="filtros-tarifas__separador">a</span>
          <input
            type="date"
            name="fechaHasta"
            value={filtros.fechaHasta}
            onChange={handleChange}
            className="filtros-tarifas__input"
          />
        </div>
        <label className="filtros-tarifas__label">Rango de Tarifas (Bs):</label>
        <div className="filtros-tarifas__rango">
          <input
            type="number"
            name="tarifaMin"
            placeholder="Mínimo"
            value={filtros.tarifaMin}
            onChange={handleChange}
            className="filtros-tarifas__input"
            step="0.01"
            min="0"
          />
          <span className="filtros-tarifas__separador">a</span>
          <input
            type="number"
            name="tarifaMax"
            placeholder="Máximo"
            value={filtros.tarifaMax}
            onChange={handleChange}
            className="filtros-tarifas__input"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="filtros-tarifas__boton-container">
        <button
          onClick={limpiarFiltros}
          className="filtros-tarifas__boton filtros-tarifas__boton--limpiar"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterTarifas;
