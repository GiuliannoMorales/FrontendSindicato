import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './VistaUsuario.css';

const VistaUsuario = () => {
  const location = useLocation();
  const cliente = location.state?.cliente;

  const [vehiculos, setVehiculos] = useState([]);
  const [tarifa, setTarifa] = useState(0);
  const [fechaInicioPago, setFechaInicioPago] = useState('');
  const [meses, setMeses] = useState(0);
  const [anios, setAnios] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Validación: si no hay cliente, no continuar
  if (!cliente) {
    return <div>No se recibió información del cliente. Por favor vuelva a buscar el CI.</div>;
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener vehículos del cliente
        const resVehiculos = await fetch(`https://backendproyectoparqueoumss.onrender.com/api/vehiculo/activos`);
        const dataVehiculos = await resVehiculos.json();
        const vehiculosCliente = dataVehiculos.data.filter((v: any) => v.idCliente === cliente.idCliente);
        setVehiculos(vehiculosCliente);

        // Obtener tarifa vigente
        const resTarifa = await fetch(`https://backendproyectoparqueoumss.onrender.com/api/tarifa/vigente`);
        const dataTarifa = await resTarifa.json();
        const tarifaFiltrada = dataTarifa.data.find(
          (t: any) =>
            t.tipoCliente.toLowerCase() === cliente.tipo.toLowerCase() &&
            t.tipoVehiculo.toLowerCase() === vehiculosCliente[0]?.tipo.toLowerCase()
        );
        setTarifa(tarifaFiltrada?.monto || 0);

        // Obtener fecha de inicio de pago
        const resFecha = await fetch(`https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo/fecha-correspondiente-pago-parqueo`);
        const dataFecha = await resFecha.json();
        setFechaInicioPago(dataFecha.data?.fecha || '');

      } catch (error) {
        console.error('Error al obtener datos del backend:', error);
      }
    };

    obtenerDatos();
  }, [cliente]);

  const cambiarValor = (tipo: 'meses' | 'anios', delta: number) => {
    if (tipo === 'meses') {
      setMeses(prev => Math.max(0, prev + delta));
    } else {
      setAnios(prev => Math.max(0, prev + delta));
    }
  };

  const confirmarCobro = () => {
    setMostrarModal(false);
    alert('Cobro procesado exitosamente');
  };

  const pagos = Array.from({ length: meses + anios * 12 }, (_, i) => ({
    vehiculo: `${vehiculos[0]?.tipo} - ${vehiculos[0]?.placa}`,
    mes: `Mes ${i + 1}`,
    tarifa: `${tarifa} Bs.`
  }));

  const montoTotal = pagos.length * tarifa;

  return (
    <div>
      <div>
        <h1>REALIZAR COBRO</h1>
      </div>

      <div>
        <div className="info-container">
          <ul className="info-list">
            <li><span className="info-label">Nombre:</span> {cliente.nombre} {cliente.apellido}</li>
            <li><span className="info-label">Tipo de Usuario:</span> {cliente.tipo}</li>
          </ul>

          <ul className="info-list">
            <li><span className="info-label">Tipo de Vehículo:</span> {vehiculos[0]?.tipo || 'Sin vehículo'}</li>
          </ul>
        </div>

        <h3 className='res'>1. Cantidad de meses o años a pagar</h3>
        <p>
          Meses:
          <button onClick={() => cambiarValor('meses', -1)} className='bot'>-</button>
          <input type="number" value={meses} readOnly />
          <button onClick={() => cambiarValor('meses', 1)} className='bot'>+</button>
        </p>

        <p>
          Años:
          <button onClick={() => cambiarValor('anios', -1)} className='bot'>-</button>
          <input type="number" value={anios} readOnly />
          <button onClick={() => cambiarValor('anios', 1)} className='bot'>+</button>
        </p>

        <h3 className='res'>2. Detalles del Pago</h3>

        <div className="contenedor-pago">
          <table>
            <thead>
              <tr className="titul">
                <th>Vehículo</th>
                <th>Mes</th>
                <th>Tarifa</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.vehiculo}</td>
                  <td>{pago.mes}</td>
                  <td>{pago.tarifa}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="info-pago">
            <p><strong>Monto Total:</strong> {montoTotal} Bs.</p>
            <p><strong>Fecha de Inicio del Pago:</strong> {fechaInicioPago}</p>
            <button className="boton" onClick={() => setMostrarModal(true)}>
              CONFIRMAR COBRO
            </button>
          </div>
        </div>
      </div>

      <Modal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCobro}
      />
    </div>
  );
};

export default VistaUsuario;
