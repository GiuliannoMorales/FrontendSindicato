import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../EstadoCuenta/EstadoCuenta.css";
import type {
  DetalleMes,
  EstadoCuentaResponse,
  Vehiculo,
  VehiculosResponse,
} from "./EstadoCuentaModelos";

const EstadoCuenta: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [placaSeleccionada, setPlacaSeleccionada] = useState<string>("");
  const [detallesMes, setDetallesMes] = useState<DetalleMes[]>([]);
  const [saldoPendiente, setSaldoPendiente] = useState<number>(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [estado, setEstado] = useState<string>("");
  const [fechaDe, setFechaDe] = useState<string>("");
  const [fechaA, setFechaA] = useState<string>("");

  // Provisional a borrar
  const [inputUsuario, setInputUsuario] = useState<string>("");

  useEffect(() => {
    api.post<VehiculosResponse>(
      `reporte/cliente/vehiculo`,
      { id: inputUsuario },
    )
      .then((res) => {
        if (res.data.status === "error") {
          let msg = res.data.message || "Error al cargar los vehiculos.";
          if (res.data.errors && res.data.errors.length > 0) {
            msg = res.data.errors[0].details || res.data.errors[0].message ||
              msg;
          }
          setError(msg);
          setVehiculos([]);
        } else {
          setVehiculos(res.data.data);
          setError(null);
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          setError(
            error.response.data.errors[0].details ||
              "Error al cargar los vehiculos.",
          );
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError("Error al cargar los vehiculos.");
        }
        setVehiculos([]);
      });
  }, [inputUsuario]);

  useEffect(() => {
    if (!placaSeleccionada) {
      setDetallesMes([]);
      setSaldoPendiente(0);
      setUltimaActualizacion("");
      return;
    }

    api.post<EstadoCuentaResponse>(
      `reporte/cliente-vehiculo/estados-cuenta`,
      { clienteId: inputUsuario, placa: placaSeleccionada },
    )
      .then((res) => {
        if (res.data.status === "error") {
          let msg = res.data.message ||
            "Error al cargar el estado de cuenta del vehiculo.";
          if (res.data.errors && res.data.errors.length > 0) {
            msg = res.data.errors[0].details || res.data.errors[0].message ||
              msg;
          }
          setError(msg);
          setDetallesMes([]);
          setSaldoPendiente(0);
          setUltimaActualizacion("");
        } else if (
          res.data.status === "success" &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          const cuenta = res.data.data[0];
          setDetallesMes(
            Array.isArray(cuenta.detallesMes) ? cuenta.detallesMes : [],
          );
          setSaldoPendiente(cuenta.saldoTotalPendiente);
          setUltimaActualizacion(cuenta.ultimaActualizacion);
          setError(null);
        } else {
          setError(res.data.message || "No se encontraron registros.");
          setDetallesMes([]);
          setSaldoPendiente(0);
          setUltimaActualizacion("");
        }
      })
      .catch((error) => {
        let msg = "Error al cargar el estado de cuenta del vehiculo.";
        if (
          error.response &&
          error.response.data
        ) {
          if (
            error.response.data.errors && error.response.data.errors.length > 0
          ) {
            msg = error.response.data.errors[0].details ||
              error.response.data.errors[0].message || msg;
          } else if (error.response.data.message) {
            msg = error.response.data.message;
          }
        }
        setDetallesMes([]);
        setSaldoPendiente(0);
        setUltimaActualizacion("");
        setError(msg);
      });
  }, [placaSeleccionada]);

  const datosFiltrados = Array.isArray(detallesMes)
    ? detallesMes.filter((d) => {
      const estadoOk = estado === "" ||
        d.estado.toLowerCase() === estado.toLowerCase();
      let fechaOk = true;
      if (d.fechaPago) {
        const fechaPago = new Date(d.fechaPago.split(" ")[0]);
        if (fechaDe && fechaPago < new Date(fechaDe)) fechaOk = false;
        if (fechaA && fechaPago > new Date(fechaA)) fechaOk = false;
      }
      return estadoOk && fechaOk;
    })
    : [];

  return (
    <div className="container">
      <h2>ESTADO DE CUENTA</h2>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label>
          ID Usuario:&nbsp;
          <input
            type="text"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            style={{ width: "260px", marginRight: "1rem" }}
            placeholder="ID de usuario"
          />
        </label>
      </div>
      <div className="controlVehiculo">
        <label>
          Seleccione el vehiculo:
          <select
            className="vehiculo"
            name="vehiculo"
            id="vehiculo"
            value={placaSeleccionada}
            onChange={(e) => {
              setPlacaSeleccionada(e.target.value);
              setError(null);
            }}
          >
            <option value="">Vehiculo...</option>
            {vehiculos.map((v, idx) => (
              <option key={idx} value={`${v.placa}`}>
                {v.tipo} - {v.placa}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="error">{error}</div>

      <section className="info">
        <h3>Estado de Cuenta del Vehiculo Seleccionado</h3>
        <p>Ultima actualizacion: {ultimaActualizacion || "N/A"}</p>
      </section>

      <section className="filtros">
        <div className="filtroSelectores">
          <label className="labelFiltro labelFiltroEstado">
            Filtrar por:
            <select
              className={`${estado === "" ? "defaultFiltro" : ""}`}
              name="filtroEstado"
              id="filtroEstado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Estado</option>
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </label>
          <label className="labelFiltro labelFiltroFecha">
            Rangos fechas pago:
            <input
              type="date"
              name="filtroFechaDe"
              id="filtroFechaDe"
              className={`${fechaDe === "" ? "defaultFiltro" : ""}`}
              value={fechaDe}
              onChange={(e) => setFechaDe(e.target.value)}
            />
            <span>a</span>
            <input
              type="date"
              name="filtroFechaA"
              id="filtroFechaA"
              className={`${fechaA === "" ? "defaultFiltro" : ""}`}
              value={fechaA}
              onChange={(e) => setFechaA(e.target.value)}
            />
          </label>
        </div>
        <div className="filtroBoton">
          <button
            onClick={() => {
              setEstado("");
              setFechaDe("");
              setFechaA("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <div className="contenedorTabla">
        <table className="tablaEstado">
          <thead>
            <tr>
              <th>Mes / Año</th>
              <th>Estado</th>
              <th>Monto</th>
              <th>Fecha Pago</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0
              ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    No hay registros para mostrar.
                  </td>
                </tr>
              )
              : (
                datosFiltrados.map((fila) => (
                  <tr key={fila.periodo}>
                    <td className="colLinea">{fila.periodo}</td>
                    <td className="colLinea">{fila.estado}</td>
                    <td className="center">{fila.monto}</td>
                    <td className="center">{fila.fechaPago}</td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>

      <div className="saldo">
        <strong>Saldo Total Pendiente:</strong> <p>{saldoPendiente} Bs.</p>
      </div>
    </div>
  );
};

export default EstadoCuenta;
