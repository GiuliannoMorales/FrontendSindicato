import React, { useState } from "react";
import '../EstadoCuenta/EstadoCuenta.css';

// La fecha aca esta en formato yyyy/mm/dd
const datos = [
  { mes: 'Mayo / 2025', estado: 'PENDIENTE', monto: '50.0 Bs', fechaPago: '-' },
  { mes: 'Abril / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '2025-05-04' },
  { mes: 'Marzo / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '2025-04-04' },
  { mes: 'Febrero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '2025-03-04' },
  { mes: 'Enero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '2025-02-04' },
];

const EstadoCuenta: React.FC = () => {
  const [estado, setFiltro] = useState('');
  const [fechaDe, setFechaDe] = useState('');
  const [fechaA, setFechaA] = useState('');

  const datosFiltrados = datos.filter(d => {
    const estadoOk = estado === '' || d.estado === estado.toUpperCase();
    let fechaOk = true;
    if (d.fechaPago !== '-'){
      if (fechaDe && d.fechaPago < fechaDe) fechaOk = false;
      if (fechaA && d.fechaPago > fechaA) fechaOk = false;
    }
    return estadoOk && fechaOk;
  });

  const saldoPendiente = datosFiltrados
    .filter(d => d.estado === 'PENDIENTE')
    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  return(
    <div className="container">
      <h2>ESTADO DE CUENTA</h2>
      <div className="controlVehiculo">
        <label>
          Seleccione el vehiculo:
          <select className="vehiculo" name="vehiculo" id="vehiculo" defaultValue="Automovil - 5818JIU">
            <option value="Automovil - 5818JIU">Automovil - 5818JIU</option>
          </select>
        </label>
      </div>

      <section className="info">
        <h3>Estado de Cuenta del Vehiculo Seleccionado</h3>
        <p>Ultima actualizacion: 04/05/2025 10:00 AM</p>
      </section>

      <section className="filtros">
        <div className="filtroSelectores">
          <label className="labelFiltro labelFiltroEstado">
            Filtrar por:
            <select className={`${estado === '' ? 'defaultFiltro' : ''}`} name="filtroEstado" id="filtroEstado" value={estado} onChange={(e) => setFiltro(e.target.value)}>
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
              setFiltro('');
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
                <td className="colLinea">{fila.mes}</td>
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