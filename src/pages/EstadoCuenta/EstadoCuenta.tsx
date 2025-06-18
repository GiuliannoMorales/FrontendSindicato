import React, { useEffect, useState } from "react";
import "./EstadoCuenta.css";
import type { DetalleMes, EstadoCuentaResponse } from "./EstadoCuentaModelos";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const EstadoCuenta: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();

  const [detallesMes, setDetallesMes] = useState<DetalleMes[]>([]);
  const [saldoPendiente, setSaldoPendiente] = useState<number>(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorFiltro, setErrorFiltro] = useState<string>("");

  const [estado, setEstado] = useState<string>("");
  const [fechaDe, setFechaDe] = useState<string>("");
  const [fechaA, setFechaA] = useState<string>("");

  useEffect(() => {
    axiosPrivate
      .get<EstadoCuentaResponse>(`reporte/cliente-vehiculo/estados-cuenta`)
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
        if (error.response && error.response.data) {
          if (
            error.response.data.errors &&
            error.response.data.errors.length > 0
          ) {
            msg = error.response.data.errors[0].details ||
              error.response.data.errors[0].message ||
              msg;
          } else if (error.response.data.message) {
            msg = error.response.data.message;
          }
        }
        setDetallesMes([]);
        setSaldoPendiente(0);
        setUltimaActualizacion("");
        setError(msg);
      });
  }, []);

  useEffect(() => {
    if (fechaDe && fechaA) {
      if (new Date(fechaA) < new Date(fechaDe)) {
        setErrorFiltro(
          "La fecha final no puede ser anterior a la fecha inicial.",
        );
      } else {
        setErrorFiltro("");
      }
    } else {
      setErrorFiltro("");
    }
  }, [fechaDe, fechaA]);

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
      <section className="info">
        <h3>Estado de Cuenta del Vehículo</h3>
        <p>
          <strong>Última actualización:</strong> {ultimaActualizacion || "N/A"}
        </p>
      </section>

      <div className="error">{error}</div>

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
              className={`${
                fechaDe === "" ? "defaultFiltro" : ""
              } estado-cuenta__input`}
              value={fechaDe}
              onChange={(e) => setFechaDe(e.target.value)}
            />
            <span>a</span>
            <input
              type="date"
              name="filtroFechaA"
              id="filtroFechaA"
              className={`${
                fechaA === "" ? "defaultFiltro" : ""
              } estado-cuenta__input`}
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
      {errorFiltro && <div className="error">{errorFiltro}</div>}

      <div className="contenedorTabla">
        <table className="tablaEstado">
          <thead>
            <tr>
              <th>Mes / Año</th>
              <th>Estado</th>
              <th>Monto</th>
              <th title="Fecha Pago (Año-mes-dia)">Fecha Pago</th>
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
                    <td
                      className={`colLinea ${
                        fila.estado === "Pagado"
                          ? "estado-pagado"
                          : fila.estado === "Pendiente"
                          ? "estado-pendiente"
                          : ""
                      }`}
                    >
                      {fila.estado}
                    </td>
                    <td className="center">{fila.monto}</td>
                    <td
                      className={`center ${
                        !fila.fechaPago || fila.fechaPago.trim() === ""
                          ? "fecha-vacia"
                          : ""
                      }`}
                    >
                      {fila.fechaPago && fila.fechaPago.trim() !== ""
                        ? fila.fechaPago.split(" ")[0]
                        : "Sin pago"}
                    </td>
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
