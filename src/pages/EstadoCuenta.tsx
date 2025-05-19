import React, { useState } from "react";
import Layout from '../components/Layout';
import './EstadoCuenta.css';

const datos = [
  { mes: 'Mayo / 2025', estado: 'PENDIENTE', monto: '50.0 Bs', fechaPago: '-' },
  { mes: 'Abril / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
  { mes: 'Marzo / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
  { mes: 'Febrero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
  { mes: 'Febrero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
  { mes: 'Febrero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
  { mes: 'Febrero / 2025', estado: 'PAGADO', monto: '50.0 Bs', fechaPago: '04/05/2025' },
];

const EstadoCuenta: React.FC = () => {
  const [filtro, setFiltro] = useState('Todo');

  const datosFiltrados = filtro === 'Todo' ? datos : datos.filter(d => d.estado === filtro.toUpperCase());

  const saldoPendiente = datosFiltrados.filter(d => d.estado === 'PENDIENTE').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  return(
    <Layout>
      <div className="container">
        <h2>ESTADO DE CUENTA</h2>
        <div className="controlVehiculo">
          <label>
            Seleccione el vehiculo:
            <select name="vehiculo" id="vehiculo" defaultValue="Automovil - 5818JIU">
              <option value="Automovil - 5818JIU">Automovil - 5818JIU</option>
            </select>
          </label>
        </div>

        <section className="info">
          <h3>Estado de Cuenta del Vehiculo Seleccionado</h3>
          <p>Ultima actualizacion: 04/05/2025 10:00 AM</p>
        </section>

        <label className="labelFiltro">
          Filtrar por:
          <select name="filtro" id="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="Todo">Todo</option>
            <option value="Pagado">Pagado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </label>

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
    </Layout>
  )
}

export default EstadoCuenta;