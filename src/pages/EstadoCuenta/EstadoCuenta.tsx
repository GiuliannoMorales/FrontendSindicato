import React, { useState, useEffect } from "react";
import api from "../../api/axios"
import '../EstadoCuenta/EstadoCuenta.css';
import type { VehiculoActivo, VehiculosActivosResponse, EstadoCuentaResponse, DetalleMes } from "./EstadoCuentaModelos";
// import mockVehiculos from "./mock/vehiculos-activos.json";
// import mockEstadoCuenta from "./mock/estado-cuenta.json";

const idUsuario = import.meta.env.VITE_ID_USUARIO;

const EstadoCuenta: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<VehiculoActivo[]>([]);
  const [placaSeleccionada, setPlacaSeleccionada] = useState<string>('');
  const [detallesMes, setDetallesMes] = useState<DetalleMes[]>([]);
  const [saldoPendiente, setSaldoPendiente] = useState<number>(0);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [estado, setEstado] = useState<string>('');
  const [fechaDe, setFechaDe] = useState<string>('');
  const [fechaA, setFechaA] = useState<string>('');

  useEffect(() => {
    /*
    Prueba
    setVehiculos(mockVehiculos.data)
    */
    api.get<VehiculosActivosResponse>(`reporte/cliente/${idUsuario}/vehiculos-activos`)
    .then(res => {
      setVehiculos(res.data.data)
    })
    .catch(() => {
      setError("Error al cargar los vehiculos.")
    });
  }, []);

  useEffect(() => {
    if (!placaSeleccionada) {
      setDetallesMes([]);
      setSaldoPendiente(0);
      setUltimaActualizacion('');
      return
    }
    /*
    Prueba
    setDetallesMes(mockEstadoCuenta.data.detallesMes);
    setSaldoPendiente(mockEstadoCuenta.data.saldoTotalPendiente);
    setUltimaActualizacion(mockEstadoCuenta.data.ultimaActualizacion);
    */

    api.get<EstadoCuentaResponse>(`reporte/cliente/${idUsuario}/vehiculo/${placaSeleccionada}/estado-cuenta`)
      .then(res => {
        setDetallesMes(res.data.data.detallesMes);
        setSaldoPendiente(res.data.data.saldoTotalPendiente);
        setUltimaActualizacion(res.data.data.ultimaActualizacion);
      })
      .catch(() => {
        setDetallesMes([]);
        setSaldoPendiente(0);
        setUltimaActualizacion('');
        setError("Error al cargar el estado de cuenta del vehiculo.");
      });
  }, [placaSeleccionada]);

  const datosFiltrados = detallesMes.filter(d => {
    const estadoOk = estado === '' || d.estado === estado;
    let fechaOk = true;
    if (d.fechaPago !== undefined){
      if (fechaDe && d.fechaPago < fechaDe) fechaOk = false;
      if (fechaA && d.fechaPago > fechaA) fechaOk = false;
    }
    return estadoOk && fechaOk;
  });


  return(
    <div className="container">
      <h2>ESTADO DE CUENTA</h2>
      <div className="controlVehiculo">
        <label>
          Seleccione el vehiculo:
          <select
            className="vehiculo"
            name="vehiculo"
            id="vehiculo"
            value={placaSeleccionada}
            onChange={e => setPlacaSeleccionada(e.target.value)}
          >
            <option value="">Vehiculo...</option>
            {vehiculos.map((v, idx) => (
              <option key={idx} value={`${v.placa}`}>{v.tipoVehiculo} - {v.placa}</option>
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
            <select className={`${estado === '' ? 'defaultFiltro' : ''}`} name="filtroEstado" id="filtroEstado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="" selected>Estado</option>
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
              className={`${fechaDe === '' ? 'defaultFiltro' : ''}`}
              value={fechaDe}
              onChange={e => setFechaDe(e.target.value)} 
            />
            a
            <input
              type="date"
              name="filtroFechaA"
              id="filtroFechaA"
              className={`${fechaA === '' ? 'defaultFiltro' : ''}`}
              value={fechaA}
              onChange={e => setFechaA(e.target.value)}
            />
          </label>
        </div>
        <div className="filtroBoton">
          <button
            onClick={() => {
              setEstado('');
              setFechaDe('');
              setFechaA('');
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
              <th>Mes / Ano</th>
              <th>Estado</th>
              <th>Monto</th>
              <th>Fecha Pago</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((fila, i) => (
              <tr key={i}>
                <td className="colLinea">{fila.periodo}</td>
                <td className="colLinea">{fila.estado}</td>
                <td className="center">{fila.monto}</td>
                <td className="center">{fila.fechaPago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="saldo">
        <strong>Saldo Total Pendiente: </strong> <p>{saldoPendiente.toFixed(1)} Bs.</p>
      </div>
    </div>
  )
}

export default EstadoCuenta;